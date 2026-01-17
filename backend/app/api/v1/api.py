from fastapi import APIRouter
from app.api.v1 import auth, courses, students, finance, hr, analytics

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(finance.router, prefix="/finance", tags=["finance"])
api_router.include_router(hr.router, prefix="/hr", tags=["hr"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
