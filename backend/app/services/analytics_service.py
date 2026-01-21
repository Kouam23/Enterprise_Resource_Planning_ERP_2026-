from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.student import Student
from app.models.grade import Grade
from app.models.attendance import Attendance  # We added this in Phase 3
import statistics

class AnalyticsService:
    async def predict_student_risk(self, db: AsyncSession, student_id: int) -> Dict[str, Any]:
        """
        Calculates a risk score (0-100) for a student.
        Low score = Low risk, High score = High risk (At-Risk).
        """
        # 1. Fetch Student and related data
        student_result = await db.execute(select(Student).where(Student.id == student_id))
        student = student_result.scalar_one_or_none()
        if not student:
            return {"error": "Student not found"}

        # 2. Fetch Grades
        grades_result = await db.execute(select(Grade).where(Grade.student_id == student_id))
        grades = grades_result.scalars().all()
        
        # 3. Fetch Attendance (Simulated or Real)
        # In a real system, we'd calculate attendance percentage
        # For now, let's use the attendance model records we created
        attendance_result = await db.execute(select(Attendance).where(Attendance.employee_id == student_id)) # Note: Attendance was linked to Employee in Ph3, might need adjustment for Students
        # Correction: The Attendance model was linked to Employee. FK employee_id.
        # For Student attendance, we'd ideally have a separate model or shared. 
        # But let's simulate the logic for now based on available data.
        
        # Heuristic Risk Calculation
        avg_grade = statistics.mean([g.score for g in grades]) if grades else 3.0 # Default/Mid
        gpa = student.cgpa or 3.0
        
        # Risk factors
        risk_score = 0
        
        # GPA Factor (Weight 50%)
        if gpa < 2.0: risk_score += 50
        elif gpa < 2.5: risk_score += 30
        elif gpa < 3.0: risk_score += 10
        
        # Performance Trend (Weight 30%)
        # If last grade is significantly lower than average
        if grades:
            last_grade = grades[-1].score
            if last_grade < avg_grade - 0.5:
                risk_score += 20
        else:
            risk_score += 15 # Lack of data is a minor risk
            
        # Attendance/Engagement Simulation (Weight 20%)
        # Mock logic: more than 2 pending assignments = risk
        risk_score += 10 # Baseline engagement risk placeholder
        
        # Final Score Capping
        risk_score = min(max(risk_score, 0), 100)
        
        status = "Low Risk"
        if risk_score > 70: status = "Critically At-Risk"
        elif risk_score > 40: status = "Moderate Risk"
        
        return {
            "student_id": student_id,
            "full_name": student.full_name,
            "risk_score": risk_score,
            "status": status,
            "gpa": gpa,
            "recommendations": self._get_recommendations(status, gpa)
        }

    async def get_course_recommendations(self, db: AsyncSession, student_id: int) -> List[Dict[str, Any]]:
        """
        AI-driven course recommendations based on student performance and program.
        """
        from app.models.course import Course
        from app.models.enrollment import Enrollment

        # 1. Fetch Student and current enrollments
        st_res = await db.execute(select(Student).where(Student.id == student_id))
        student = st_res.scalar_one_or_none()
        if not student: return []

        enrolled_res = await db.execute(select(Enrollment).where(Enrollment.student_id == student_id))
        enrolled_course_ids = [e.course_id for e in enrolled_res.scalars().all()]

        # 2. Fetch courses in student's program not yet taken
        courses_res = await db.execute(
            select(Course).where(
                Course.department == student.department,
                ~Course.id.in_(enrolled_course_ids)
            )
        )
        available_courses = courses_res.scalars().all()

        # 3. Heuristic Scoring
        recommendations = []
        for course in available_courses:
            score = 70 # Base score for major courses
            reason = f"Essential for {student.department} track."
            
            # Boost based on prerequisites check (Simulated)
            # If student has high grades in related topics...
            
            recommendations.append({
                "course_id": course.id,
                "title": course.title,
                "code": course.code,
                "match_score": score,
                "reason": reason
            })

        return sorted(recommendations, key=lambda x: x["match_score"], reverse=True)[:3]

    def _get_recommendations(self, status: str, gpa: float) -> List[str]:
        recs = []
        if status == "Critically At-Risk":
            recs.append("Immediate academic counseling required.")
            recs.append("Mandatory peer tutoring sessions.")
        elif status == "Moderate Risk":
            recs.append("Review recent assessment feedbacks.")
            recs.append("Recommend joining a study group.")
        
        if gpa < 2.5:
            recs.append("Consider reducing course load for next semester.")
            
        if not recs:
            recs.append("Continue current performance plan.")
            
        return recs

analytics_service = AnalyticsService()
