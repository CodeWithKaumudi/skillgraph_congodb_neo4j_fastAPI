from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from backend.graph_queries import (
    find_employees_by_skill_or_related,
    find_employees_by_skill_with_projects,
    find_employees_by_skill_and_technology,
    get_employee_profile,
    verify_database_connection,
    find_employees_by_project,
    find_project_technologies,
)


# ============================================================
# RESPONSE MODELS
# ============================================================

class Employee(BaseModel):
    employee_id: str
    employee: str


class ProjectEmployeesResponse(BaseModel):
    project: str
    employees: List[Employee]


class ProjectTechnologiesResponse(BaseModel):
    project: str
    technologies: List[str]


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="SkillGraph API",
    description="Graph-based employee skill discovery API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# 1. ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "SkillGraph API is running"
    }


# ============================================================
# 2. DATABASE HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    try:
        verify_database_connection()

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:

        raise HTTPException(
            status_code=503,
            detail=f"Database connection failed: {str(e)}"
        )


# ============================================================
# 3. EMPLOYEES BY SKILL
# ============================================================

@app.get(
    "/employees/skill/{skill_name}",
    summary="Employees By Skill"
)
def employees_by_skill(skill_name: str):

    results = find_employees_by_skill_or_related(
        skill_name
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No employees found for skill: {skill_name}"
        )

    return {
        "skill": skill_name,
        "results": results
    }


# ============================================================
# 4. EMPLOYEES BY SKILL WITH PROJECTS
# ============================================================

@app.get(
    "/employees/skill/{skill_name}/projects",
    summary="Employees By Skill With Projects"
)
def employees_by_skill_with_projects(skill_name: str):

    results = find_employees_by_skill_with_projects(
        skill_name
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No employees found for skill: {skill_name}"
        )

    return {
        "skill": skill_name,
        "results": results
    }


# ============================================================
# 5. SEARCH BY SKILL + TECHNOLOGY
# ============================================================

@app.get(
    "/employees/search",
    summary="Employees By Skill And Technology"
)
def employees_search(
    skill: str,
    technology: str
):

    results = find_employees_by_skill_and_technology(
        skill,
        technology
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail=(
                f"No employees found with "
                f"skill '{skill}' and "
                f"technology '{technology}'"
            )
        )

    return {
        "skill": skill,
        "technology": technology,
        "results": results
    }


# ============================================================
# 6. SEARCH BY SKILL + TECHNOLOGY USING PATH
# ============================================================

@app.get(
    "/employees/search/{skill_name}/{technology_name}",
    summary="Employees By Skill And Technology"
)
def employees_search_path(
    skill_name: str,
    technology_name: str
):

    results = find_employees_by_skill_and_technology(
        skill_name,
        technology_name
    )

    if not results:
        raise HTTPException(
            status_code=404,
            detail=(
                f"No employees found with "
                f"skill '{skill_name}' and "
                f"technology '{technology_name}'"
            )
        )

    return {
        "skill": skill_name,
        "technology": technology_name,
        "results": results
    }


# ============================================================
# 7. EMPLOYEE PROFILE
# ============================================================

@app.get(
    "/employees/{employee_id}",
    summary="Employee Profile"
)
def employee_profile(employee_id: str):

    result = get_employee_profile(
        employee_id
    )

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Employee not found: {employee_id}"
        )

    return result


# ============================================================
# 8. FIND EMPLOYEES BY PROJECT
# ============================================================

@app.get(
    "/projects/{project_name}/employees",
    response_model=ProjectEmployeesResponse,
    summary="Find Employees By Project"
)
def employees_by_project(project_name: str):

    result = find_employees_by_project(project_name)

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No employees found for project: {project_name}"
        )

    return result


# ============================================================
# 9. FIND TECHNOLOGIES BY PROJECT
# ============================================================

@app.get(
    "/projects/{project_name}/technologies",
    response_model=ProjectTechnologiesResponse,
    summary="Find Technologies By Project"
)
def project_technologies(project_name: str):

    result = find_project_technologies(project_name)

    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No technologies found for project: {project_name}"
        )

    return result