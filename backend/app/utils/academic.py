from datetime import datetime, date
from typing import List
from app.models.grade import Grade
from app.models.course import Course
from app.models.tuition_invoice import TuitionInvoice

def calculate_course_total(grades: List[Grade]) -> float:
    """
    Calculate total grade based on ICT University 30/70 split.
    CA (Continuous Assessment) = 30%
    Final Exam = 70%
    If multiple CA entries exist, they are averaged before applying the 30% weight.
    If a Resit exists, it replaces the Final Exam score.
    """
    if not grades:
        return 0.0
        
    ca_scores = [g.score for g in grades if g.assessment_type == "CA"]
    final_score_entries = [g for g in grades if g.assessment_type == "Final"]
    
    # Handle Resit logic: Resit replaces Final Exam if it exists
    resit_entry = next((g for g in final_score_entries if g.is_resit), None)
    if resit_entry:
        final_score = resit_entry.score
    else:
        # Take the most recent final exam if no resit
        final_score = final_score_entries[-1].score if final_score_entries else 0.0
        
    avg_ca = sum(ca_scores) / len(ca_scores) if ca_scores else 0.0
    
    return (avg_ca * 0.3) + (final_score * 0.7)

def get_grade_point(total_score: float) -> float:
    """
    Convert 0-100 score to ICT 4.0 GPA scale.
    """
    if total_score >= 80: return 4.0 # A
    if total_score >= 70: return 3.5 # B+
    if total_score >= 60: return 3.0 # B
    if total_score >= 55: return 2.5 # C+
    if total_score >= 50: return 2.0 # C
    if total_score >= 45: return 1.5 # D+
    if total_score >= 40: return 1.0 # D
    return 0.0 # F

def get_classification(cgpa: float) -> str:
    """
    Return degree classification based on CGPA.
    """
    if cgpa >= 3.60: return "First Class (Summa Cum Laude)"
    if cgpa >= 3.00: return "Upper Second Class (Magna Cum Laude)"
    if cgpa >= 2.50: return "Lower Second Class (Cum Laude)"
    if cgpa >= 2.00: return "Pass"
    return "Fail/Probation"

def has_cleared_prerequisites(student_grades: List[Grade], course: Course) -> bool:
    """
    Rule 1.2: Check if student has passed all prerequisites for a course.
    A prerequisite is passed if the weighted total >= 50.
    """
    if not course.prerequisites:
        return True
        
    # Group grades by course for efficiency
    passed_course_ids = set()
    course_grades = {}
    for g in student_grades:
        if g.course_id not in course_grades:
            course_grades[g.course_id] = []
        course_grades[g.course_id].append(g)
        
    for cid, grades in course_grades.items():
        if calculate_course_total(grades) >= 50:
            passed_course_ids.add(cid)
            
    return all(prereq.id in passed_course_ids for prereq in course.prerequisites)

def calculate_cgpa(student_grades: List[Grade], courses: List[Course]) -> float:
    """
    Calculate CGPA based on ICT University rules.
    CGPA = Sum(GradePoints * Credits) / Sum(Credits)
    """
    course_map = {c.id: c for c in courses}
    course_grades = {}
    
    for g in student_grades:
        if g.course_id not in course_grades:
            course_grades[g.course_id] = []
        course_grades[g.course_id].append(g)
        
    total_point_credits = 0.0
    total_credits = 0.0
    
    for course_id, grades in course_grades.items():
        course = course_map.get(course_id)
        if not course:
            continue
            
        course_total = calculate_course_total(grades)
        grade_point = get_grade_point(course_total)
        
        total_point_credits += grade_point * course.credits
        total_credits += course.credits
        
    if total_credits == 0:
        return 0.0
        
    # Standard Cameroon GPA rounding
    return round(total_point_credits / total_credits, 2)

# --- NEW ICT UNIVERSITY BUSINESS RULES ---

def is_fee_cleared(invoice: TuitionInvoice) -> bool:
    """
    Rule 1.1: 50% "First Installment" fee clearance for Active status.
    """
    if not invoice: return False
    return invoice.amount_paid >= (0.5 * invoice.amount_due)

def is_barred_from_final(grades: List[Grade]) -> bool:
    """
    Rule 2.2: Barred from final if no CA exists.
    """
    if not grades: return True
    return not any(g.assessment_type == "CA" for g in grades)

def check_max_credits(cgpa: float) -> int:
    """
    Rule 5.2: Probation credit limit.
    If CGPA < 2.0, limit to 20 credits, else 30.
    """
    return 20 if cgpa < 2.0 else 30

def check_max_stay(enrollment_date: date) -> bool:
    """
    Rule 4.2: Maximum stay of 7 years for Bachelor's.
    """
    if not enrollment_date: return True
    years_stayed = (datetime.now().date() - enrollment_date).days / 365.25
    return years_stayed <= 7.0
