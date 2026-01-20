from typing import List
from app.models.grade import Grade
from app.models.course import Course

def calculate_gpa(grades: List[Grade]) -> float:
    """
    Calculate GPA for a set of grades.
    Assumes grades are already filtered/grouped if needed.
    Formula: Sum(Score * Weight) / Sum(Weight)
    Note: For CGPA, this would typically involve credits too.
    """
    if not grades:
        return 0.0
    
    total_weighted_score = sum(g.score * g.weight for g in grades)
    total_weight = sum(g.weight for g in grades)
    
    if total_weight == 0:
        return 0.0
    
    return total_weighted_score / total_weight

def calculate_cgpa(student_grades: List[Grade], courses: List[Course]) -> float:
    """
    Calculate CGPA.
    CGPA = Sum(Course_Grade * Course_Credits) / Sum(Course_Credits)
    This assumes student_grades contains one final grade per course.
    """
    # Map courses by ID for quick lookup
    course_map = {c.id: c for c in courses}
    
    total_point_credits = 0.0
    total_credits = 0.0
    
    # In a real system, we'd only take the 'final' or 'total' grade for the course
    # For now, let's assume if there are multiple grades for one course, we average them
    course_grades = {}
    for g in student_grades:
        if g.course_id not in course_grades:
            course_grades[g.course_id] = []
        course_grades[g.course_id].append(g)
    
    for course_id, grades in course_grades.items():
        course = course_map.get(course_id)
        if not course:
            continue
            
        gpa = calculate_gpa(grades) # Final grade for this course
        # Normalize GPA to some scale if needed, e.g. 4.0
        # For now, let's assume gpa is out of 100
        total_point_credits += (gpa / 25.0) * course.credits # Simplistic 4.0 scale conversion
        total_credits += course.credits
        
    if total_credits == 0:
        return 0.0
        
    return total_point_credits / total_credits
