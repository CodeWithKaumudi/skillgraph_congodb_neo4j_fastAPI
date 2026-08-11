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


def rahul_project_technologies():
    query = """
    MATCH (e:Employee {name: "Rahul Sharma"})
          -[:WORKS_ON]->
          (p:Project)
          -[:USES]->
          (t:Technology)

    RETURN
        e.name AS employee,
        p.name AS project,
        collect(t.name) AS technologies
    """

    with driver.session() as session:
        result = session.run(query)

        for record in result:
            print("Employee:", record["employee"])
            print("Project:", record["project"])
            print("Technologies:", record["technologies"])


def python_postgresql_employees():
    query = """
    MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill)
    MATCH (e)-[:WORKS_ON]->(p:Project)
    MATCH (p)-[:USES]->(t:Technology)

    WHERE s.name = "Python"
      AND t.name = "PostgreSQL"

    RETURN
        e.name AS employee,
        collect(DISTINCT p.name) AS projects
    ORDER BY employee
    """

    with driver.session() as session:
        result = session.run(query)

        for record in result:
            print(
                f"Employee: {record['employee']}"
            )
            print(
                f"Projects: {record['projects']}"
            )
            # print("---")          


if __name__ == "__main__":
    try:
        driver.verify_connectivity()
        # rahul_project_technologies()
        python_postgresql_employees()
    finally:
        driver.close()