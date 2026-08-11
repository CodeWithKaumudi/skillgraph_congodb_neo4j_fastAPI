import os

from dotenv import load_dotenv
from neo4j import GraphDatabase


load_dotenv()

URI = os.getenv("COGNODB_URI")
USERNAME = os.getenv("COGNODB_USERNAME")
PASSWORD = os.getenv("COGNODB_PASSWORD")


driver = GraphDatabase.driver(
    URI,
    auth=(USERNAME, PASSWORD)
)


def create_companies():
    query = """
    UNWIND $companies AS company

    MERGE (c:Company {
        id: company.id
    })

    SET
        c.name = company.name,
        c.industry = company.industry,
        c.location = company.location
    """

    companies = [
        {
            "id": "C001",
            "name": "TechNova Solutions",
            "industry": "Software",
            "location": "Pune"
        },
        {
            "id": "C002",
            "name": "DataSphere Technologies",
            "industry": "Data Analytics",
            "location": "Mumbai"
        },
        {
            "id": "C003",
            "name": "CloudBridge Systems",
            "industry": "Cloud Computing",
            "location": "Bangalore"
        },
    ]

    with driver.session() as session:
        session.run(
            query,
            companies=companies
        )

    print("Companies created successfully!")


def create_skills():
    query = """
    UNWIND $skills AS skill

    MERGE (s:Skill {
        id: skill.id
    })

    SET
        s.name = skill.name,
        s.category = skill.category
    """

    skills = [
        {
            "id": "S001",
            "name": "Python",
            "category": "Programming"
        },
        {
            "id": "S002",
            "name": "Django",
            "category": "Backend Framework"
        },
        {
            "id": "S003",
            "name": "FastAPI",
            "category": "Backend Framework"
        },
        {
            "id": "S004",
            "name": "JavaScript",
            "category": "Programming"
        },
        {
            "id": "S005",
            "name": "React",
            "category": "Frontend"
        },
        {
            "id": "S006",
            "name": "Next.js",
            "category": "Frontend Framework"
        },
        {
            "id": "S007",
            "name": "REST API",
            "category": "API"
        },
        {
            "id": "S008",
            "name": "Selenium",
            "category": "Automation"
        },
        {
            "id": "S009",
            "name": "Git",
            "category": "Version Control"
        },
        {
            "id": "S010",
            "name": "SQL",
            "category": "Database"
        }
    ]

    with driver.session() as session:
        session.run(
            query,
            skills=skills
        )

    print("Skills created successfully!")


def create_technologies():
    query = """
    UNWIND $technologies AS technology

    MERGE (t:Technology {
        id: technology.id
    })

    SET
        t.name = technology.name,
        t.category = technology.category
    """

    technologies = [
        {
            "id": "T001",
            "name": "PostgreSQL",
            "category": "Database"
        },
        {
            "id": "T002",
            "name": "MongoDB",
            "category": "Database"
        },
        {
            "id": "T003",
            "name": "Redis",
            "category": "Cache"
        },
        {
            "id": "T004",
            "name": "Docker",
            "category": "DevOps"
        },
        {
            "id": "T005",
            "name": "AWS",
            "category": "Cloud"
        },
        {
            "id": "T006",
            "name": "GitHub",
            "category": "Development Tool"
        },
        {
            "id": "T007",
            "name": "Celery",
            "category": "Task Queue"
        },
        {
            "id": "T008",
            "name": "Nginx",
            "category": "Web Server"
        }
    ]

    with driver.session() as session:
        session.run(
            query,
            technologies=technologies
        )

    print("Technologies created successfully!")

def create_projects():
    query = """
    UNWIND $projects AS project

    MERGE (p:Project {
        id: project.id
    })

    SET
        p.name = project.name,
        p.description = project.description,
        p.domain = project.domain
    """

    projects = [
        {
            "id": "P001",
            "name": "Employee Tracking System",
            "description": "Employee monitoring and timesheet management platform",
            "domain": "HR Technology"
        },
        {
            "id": "P002",
            "name": "E-Commerce Analytics Platform",
            "description": "Analytics platform for monitoring sales and customer behavior",
            "domain": "E-Commerce"
        },
        {
            "id": "P003",
            "name": "Fraud Detection System",
            "description": "System for detecting suspicious financial transactions",
            "domain": "FinTech"
        },
        {
            "id": "P004",
            "name": "EV Battery Analytics",
            "description": "Analytics platform for electric vehicle battery performance",
            "domain": "Automotive"
        },
        {
            "id": "P005",
            "name": "Customer Support Automation",
            "description": "Automation platform for customer support workflows",
            "domain": "AI / Automation"
        }
    ]

    with driver.session() as session:
        session.run(
            query,
            projects=projects
        )

    print("Projects created successfully!")

def create_employees():
    query = """
    UNWIND $employees AS employee

    MERGE (e:Employee {
        id: employee.id
    })

    SET
        e.name = employee.name,
        e.email = employee.email,
        e.experience = employee.experience,
        e.location = employee.location,
        e.designation = employee.designation
    """

    employees = [
        {
            "id": "E001",
            "name": "Rahul Sharma",
            "email": "rahul@example.com",
            "experience": 3.5,
            "location": "Pune",
            "designation": "Python Developer"
        },
        {
            "id": "E002",
            "name": "Priya Patil",
            "email": "priya@example.com",
            "experience": 4.0,
            "location": "Mumbai",
            "designation": "Full Stack Developer"
        },
        {
            "id": "E003",
            "name": "Amit Kulkarni",
            "email": "amit@example.com",
            "experience": 2.5,
            "location": "Pune",
            "designation": "Backend Developer"
        },
        {
            "id": "E004",
            "name": "Sneha Joshi",
            "email": "sneha@example.com",
            "experience": 5.0,
            "location": "Bangalore",
            "designation": "Software Engineer"
        },
        {
            "id": "E005",
            "name": "Rohan Deshmukh",
            "email": "rohan@example.com",
            "experience": 3.0,
            "location": "Pune",
            "designation": "Python Developer"
        },
        {
            "id": "E006",
            "name": "Neha Shah",
            "email": "neha@example.com",
            "experience": 4.5,
            "location": "Mumbai",
            "designation": "Frontend Developer"
        },
        {
            "id": "E007",
            "name": "Vikas Mehta",
            "email": "vikas@example.com",
            "experience": 6.0,
            "location": "Bangalore",
            "designation": "Senior Software Engineer"
        },
        {
            "id": "E008",
            "name": "Pooja Nair",
            "email": "pooja@example.com",
            "experience": 2.0,
            "location": "Pune",
            "designation": "Software Developer"
        },
        {
            "id": "E009",
            "name": "Akash Verma",
            "email": "akash@example.com",
            "experience": 3.5,
            "location": "Hyderabad",
            "designation": "Backend Developer"
        },
        {
            "id": "E010",
            "name": "Meera Iyer",
            "email": "meera@example.com",
            "experience": 5.5,
            "location": "Bangalore",
            "designation": "Full Stack Developer"
        }
    ]

    with driver.session() as session:
        session.run(
            query,
            employees=employees
        )

    print("Employees created successfully!")

def create_employee_company_relationships():
    query = """
    UNWIND $relationships AS relationship

    MATCH (e:Employee {
        id: relationship.employee_id
    })

    MATCH (c:Company {
        id: relationship.company_id
    })

    MERGE (e)-[:EMPLOYED_BY]->(c)
    """

    relationships = [
        {
            "employee_id": "E001",
            "company_id": "C001"
        },
        {
            "employee_id": "E002",
            "company_id": "C002"
        },
        {
            "employee_id": "E003",
            "company_id": "C001"
        },
        {
            "employee_id": "E004",
            "company_id": "C003"
        },
        {
            "employee_id": "E005",
            "company_id": "C001"
        },
        {
            "employee_id": "E006",
            "company_id": "C002"
        },
        {
            "employee_id": "E007",
            "company_id": "C003"
        },
        {
            "employee_id": "E008",
            "company_id": "C001"
        },
        {
            "employee_id": "E009",
            "company_id": "C002"
        },
        {
            "employee_id": "E010",
            "company_id": "C003"
        }
    ]

    with driver.session() as session:
        session.run(
            query,
            relationships=relationships
        )

    print("Employee-Company relationships created successfully!")

def create_employee_skill_relationships():
    query = """
    UNWIND $relationships AS relationship

    MATCH (e:Employee {
        id: relationship.employee_id
    })

    MATCH (s:Skill {
        id: relationship.skill_id
    })

    MERGE (e)-[:HAS_SKILL]->(s)
    """

    relationships = [
        # Rahul
        {"employee_id": "E001", "skill_id": "S001"},
        {"employee_id": "E001", "skill_id": "S002"},
        {"employee_id": "E001", "skill_id": "S007"},
        {"employee_id": "E001", "skill_id": "S009"},

        # Priya
        {"employee_id": "E002", "skill_id": "S001"},
        {"employee_id": "E002", "skill_id": "S004"},
        {"employee_id": "E002", "skill_id": "S005"},
        {"employee_id": "E002", "skill_id": "S006"},

        # Amit
        {"employee_id": "E003", "skill_id": "S001"},
        {"employee_id": "E003", "skill_id": "S002"},
        {"employee_id": "E003", "skill_id": "S003"},
        {"employee_id": "E003", "skill_id": "S010"},

        # Sneha
        {"employee_id": "E004", "skill_id": "S001"},
        {"employee_id": "E004", "skill_id": "S005"},
        {"employee_id": "E004", "skill_id": "S009"},
        {"employee_id": "E004", "skill_id": "S010"},

        # Rohan
        {"employee_id": "E005", "skill_id": "S001"},
        {"employee_id": "E005", "skill_id": "S002"},
        {"employee_id": "E005", "skill_id": "S008"},
        {"employee_id": "E005", "skill_id": "S009"},

        # Neha
        {"employee_id": "E006", "skill_id": "S004"},
        {"employee_id": "E006", "skill_id": "S005"},
        {"employee_id": "E006", "skill_id": "S006"},
        {"employee_id": "E006", "skill_id": "S009"},

        # Vikas
        {"employee_id": "E007", "skill_id": "S001"},
        {"employee_id": "E007", "skill_id": "S002"},
        {"employee_id": "E007", "skill_id": "S003"},
        {"employee_id": "E007", "skill_id": "S007"},

        # Pooja
        {"employee_id": "E008", "skill_id": "S001"},
        {"employee_id": "E008", "skill_id": "S004"},
        {"employee_id": "E008", "skill_id": "S008"},
        {"employee_id": "E008", "skill_id": "S009"},

        # Akash
        {"employee_id": "E009", "skill_id": "S001"},
        {"employee_id": "E009", "skill_id": "S003"},
        {"employee_id": "E009", "skill_id": "S007"},
        {"employee_id": "E009", "skill_id": "S010"},

        # Meera
        {"employee_id": "E010", "skill_id": "S001"},
        {"employee_id": "E010", "skill_id": "S004"},
        {"employee_id": "E010", "skill_id": "S005"},
        {"employee_id": "E010", "skill_id": "S006"}
    ]

    with driver.session() as session:
        session.run(
            query,
            relationships=relationships
        )

    print("Employee-Skill relationships created successfully!")

def create_employee_project_relationships():
    query = """
    UNWIND $relationships AS relationship

    MATCH (e:Employee {
        id: relationship.employee_id
    })

    MATCH (p:Project {
        id: relationship.project_id
    })

    MERGE (e)-[:WORKS_ON]->(p)
    """

    relationships = [
        # Employee Tracking System
        {"employee_id": "E001", "project_id": "P001"},
        {"employee_id": "E003", "project_id": "P001"},
        {"employee_id": "E005", "project_id": "P001"},
        {"employee_id": "E008", "project_id": "P001"},

        # E-Commerce Analytics Platform
        {"employee_id": "E002", "project_id": "P002"},
        {"employee_id": "E006", "project_id": "P002"},
        {"employee_id": "E010", "project_id": "P002"},

        # Fraud Detection System
        {"employee_id": "E003", "project_id": "P003"},
        {"employee_id": "E007", "project_id": "P003"},
        {"employee_id": "E009", "project_id": "P003"},

        # EV Battery Analytics
        {"employee_id": "E004", "project_id": "P004"},
        {"employee_id": "E007", "project_id": "P004"},
        {"employee_id": "E010", "project_id": "P004"},

        # Customer Support Automation
        {"employee_id": "E005", "project_id": "P005"},
        {"employee_id": "E008", "project_id": "P005"},
        {"employee_id": "E009", "project_id": "P005"}
    ]

    with driver.session() as session:
        session.run(
            query,
            relationships=relationships
        )

    print("Employee-Project relationships created successfully!")

def create_project_technology_relationships():
    query = """
    UNWIND $relationships AS relationship

    MATCH (p:Project {
        id: relationship.project_id
    })

    MATCH (t:Technology {
        id: relationship.technology_id
    })

    MERGE (p)-[:USES]->(t)
    """

    relationships = [
        # Employee Tracking System
        {"project_id": "P001", "technology_id": "T001"},
        {"project_id": "P001", "technology_id": "T003"},
        {"project_id": "P001", "technology_id": "T004"},
        {"project_id": "P001", "technology_id": "T006"},

        # E-Commerce Analytics Platform
        {"project_id": "P002", "technology_id": "T001"},
        {"project_id": "P002", "technology_id": "T002"},
        {"project_id": "P002", "technology_id": "T005"},
        {"project_id": "P002", "technology_id": "T006"},

        # Fraud Detection System
        {"project_id": "P003", "technology_id": "T001"},
        {"project_id": "P003", "technology_id": "T003"},
        {"project_id": "P003", "technology_id": "T004"},
        {"project_id": "P003", "technology_id": "T007"},

        # EV Battery Analytics
        {"project_id": "P004", "technology_id": "T001"},
        {"project_id": "P004", "technology_id": "T005"},
        {"project_id": "P004", "technology_id": "T004"},

        # Customer Support Automation
        {"project_id": "P005", "technology_id": "T002"},
        {"project_id": "P005", "technology_id": "T003"},
        {"project_id": "P005", "technology_id": "T005"},
        {"project_id": "P005", "technology_id": "T007"},
        {"project_id": "P005", "technology_id": "T008"}
    ]

    with driver.session() as session:
        session.run(
            query,
            relationships=relationships
        )

    print("Project-Technology relationships created successfully!")

def create_skill_relationships():
    query = """
    UNWIND $relationships AS relationship

    MATCH (s1:Skill {
        id: relationship.skill1_id
    })

    MATCH (s2:Skill {
        id: relationship.skill2_id
    })

    MERGE (s1)-[:RELATED_TO]->(s2)
    """

    relationships = [
        {"skill1_id": "S001", "skill2_id": "S002"},  # Python -> Django
        {"skill1_id": "S001", "skill2_id": "S003"},  # Python -> FastAPI
        {"skill1_id": "S004", "skill2_id": "S005"},  # JavaScript -> React
        {"skill1_id": "S005", "skill2_id": "S006"},  # React -> Next.js
        {"skill1_id": "S010", "skill2_id": "S002"},  # SQL -> Django
        {"skill1_id": "S002", "skill2_id": "S007"},  # Django -> REST API
        {"skill1_id": "S003", "skill2_id": "S007"},  # FastAPI -> REST API
        {"skill1_id": "S008", "skill2_id": "S001"},  # Selenium -> Python
        {"skill1_id": "S009", "skill2_id": "S001"}   # Git -> Python
    ]

    with driver.session() as session:
        session.run(
            query,
            relationships=relationships
        )

    print("Skill relationships created successfully!")
if __name__ == "__main__":
    try:
        driver.verify_connectivity()

        create_companies()
        create_skills()
        create_technologies()
        create_projects()
        create_employees()

        create_employee_company_relationships()
        create_employee_skill_relationships()
        create_employee_project_relationships()
        create_project_technology_relationships()
        create_skill_relationships()

        print("Seed data created successfully!")

    finally:
        driver.close()