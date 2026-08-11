import os

from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

URI = os.getenv("COGNODB_URI")
USERNAME = os.getenv("COGNODB_USERNAME")
PASSWORD = os.getenv("COGNODB_PASSWORD")


driver = GraphDatabase.driver(
    URI,
    auth=(USERNAME, PASSWORD),
    connection_timeout=15,
    max_connection_lifetime=300,
    max_connection_pool_size=10
)


# ============================================================
# 1. FIND EMPLOYEES BY SKILL
#    Direct + Related skills
# ============================================================

def find_employees_by_skill_or_related(skill_name):

    query = """
    MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill)

    OPTIONAL MATCH path =
        (s)-[:RELATED_TO*1..2]->(target:Skill)

    WHERE
        toLower(s.name) = toLower($skill_name)
        OR toLower(target.name) = toLower($skill_name)

    WITH DISTINCT
        e,
        s,
        $skill_name AS requested_skill

    RETURN
        e.id AS employee_id,
        e.name AS employee,
        s.name AS employee_skill,

        CASE
            WHEN toLower(s.name) = toLower(requested_skill)
            THEN "DIRECT"
            ELSE "RELATED"
        END AS match_type

    ORDER BY employee
    """

    with driver.session() as session:

        result = session.run(
            query,
            skill_name=skill_name
        )

        return [
            record.data()
            for record in result
        ]


# ============================================================
# 2. FIND EMPLOYEES BY SKILL WITH PROJECTS
# ============================================================

def find_employees_by_skill_with_projects(skill_name):

    query = """
    MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill)
    MATCH (e)-[:WORKS_ON]->(p:Project)

    WHERE toLower(s.name) = toLower($skill_name)

    RETURN
        e.id AS employee_id,
        e.name AS employee,
        s.name AS skill,
        collect(DISTINCT p.name) AS projects

    ORDER BY employee
    """

    with driver.session() as session:

        result = session.run(
            query,
            skill_name=skill_name
        )

        return [
            record.data()
            for record in result
        ]


# ============================================================
# 3. FIND EMPLOYEES BY SKILL + TECHNOLOGY
# ============================================================

def find_employees_by_skill_and_technology(
    skill_name,
    technology_name
):

    query = """
    MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill)
    MATCH (e)-[:WORKS_ON]->(p:Project)
    MATCH (p)-[:USES]->(t:Technology)

    WHERE
        toLower(s.name) = toLower($skill_name)
        AND
        toLower(t.name) = toLower($technology_name)

    RETURN
        e.id AS employee_id,
        e.name AS employee,
        s.name AS skill,
        t.name AS technology,
        collect(DISTINCT p.name) AS projects

    ORDER BY employee
    """

    with driver.session() as session:

        result = session.run(
            query,
            skill_name=skill_name,
            technology_name=technology_name
        )

        return [
            record.data()
            for record in result
        ]


# ============================================================
# 4. EMPLOYEE PROFILE
# ============================================================

def get_employee_profile(employee_id):

    query = """
    MATCH (e:Employee {id: $employee_id})

    OPTIONAL MATCH (e)-[:HAS_SKILL]->(s:Skill)

    OPTIONAL MATCH (e)-[:WORKS_ON]->(p:Project)
    OPTIONAL MATCH (p)-[:USES]->(t:Technology)

    RETURN
        e.id AS employee_id,
        e.name AS employee,

        collect(DISTINCT s.name) AS skills,

        collect(
            DISTINCT {
                project: p.name,
                technology: t.name
            }
        ) AS project_data
    """

    try:

        with driver.session() as session:

            result = session.run(
                query,
                employee_id=employee_id
            )

            record = result.single()

            if not record:
                return None

            data = record.data()

            # Remove empty project records
            data["project_data"] = [
                item
                for item in data["project_data"]
                if item["project"] is not None
            ]

            return data

    except Exception as e:

        print(f"Neo4j error while fetching employee {employee_id}:")
        print(e)

        raise

def find_employees_by_project(project_name):
    query = """
    MATCH (e:Employee)-[:WORKS_ON]->(p:Project)
    WHERE toLower(p.name) = toLower($project_name)

    RETURN
        p.name AS project,
        collect({
            employee_id: e.id,
            employee: e.name
        }) AS employees

    ORDER BY project
    """

    with driver.session() as session:
        result = session.run(
            query,
            project_name=project_name
        )

        record = result.single()

        if not record:
            return None

        return {
            "project": record["project"],
            "employees": record["employees"]
        }  

def find_project_technologies(project_name):
    query = """
    MATCH (p:Project)-[:USES]->(t:Technology)
    WHERE toLower(p.name) = toLower($project_name)

    RETURN
        p.name AS project,
        collect(DISTINCT t.name) AS technologies
    """

    with driver.session() as session:
        result = session.run(
            query,
            project_name=project_name
        )

        record = result.single()

        if not record:
            return None

        return {
            "project": record["project"],
            "technologies": record["technologies"]
        }  


# ============================================================
# 5. CHECK DATABASE CONNECTION
# ============================================================

def verify_database_connection():

    driver.verify_connectivity()

    return True


# ============================================================
# TEST FILE EXECUTION
# ============================================================

if __name__ == "__main__":

    try:

        print("Checking Neo4j connection...")

        driver.verify_connectivity()

        print("Database connected successfully.")

        print("\n--- Python Employees ---")

        employees = find_employees_by_skill_or_related("Python")

        for employee in employees:
            print(employee)

    except Exception as e:

        print("Database error:")
        print(e)

    finally:

        driver.close()