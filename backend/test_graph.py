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


def create_test_graph():
    query = """
    CREATE (e:Employee {
        id: $employee_id,
        name: $employee_name
    })

    CREATE (s:Skill {
        id: $skill_id,
        name: $skill_name
    })

    CREATE (e)-[:HAS_SKILL]->(s)

    RETURN e, s
    """

    with driver.session() as session:
        result = session.run(
            query,
            employee_id="E001",
            employee_name="Rahul Sharma",
            skill_id="S001",
            skill_name="Python"
        )

        record = result.single()

        print("Employee:", record["e"])
        print("Skill:", record["s"])

def find_employee_skills():
    query = """
    MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill)
    RETURN e.name AS employee, s.name AS skill
    """

    with driver.session() as session:
        result = session.run(query)

        for record in result:
            print(
                f"{record['employee']} knows {record['skill']}"
            )

if __name__ == "__main__":
    try:
        driver.verify_connectivity()
        print("Connected to CognoDB successfully!")

        find_employee_skills()

    finally:
        driver.close()