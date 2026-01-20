from app.api.v1 import auth, courses, students, finance, hr, analytics, programs, grades, academic_docs

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(programs.router, prefix="/programs", tags=["programs"])
api_router.include_router(grades.router, prefix="/grades", tags=["grades"])
api_router.include_router(finance.router, prefix="/finance", tags=["finance"])
api_router.include_router(hr.router, prefix="/hr", tags=["hr"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(academic_docs.router, prefix="/academic", tags=["academic"])
