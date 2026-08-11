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


def check_skills():
    query = """
    MATCH (e:Employee)-[:HAS_SKILL]->(s:Skill)
    RETURN
        e.name AS employee,
        collect(s.name) AS skills
    ORDER BY e.id
    """

    with driver.session() as session:
        result = session.run(query)

        for record in result:
            print(
                f"{record['employee']}: "
                f"{', '.join(record['skills'])}"
            )


if __name__ == "__main__":
    try:
        driver.verify_connectivity()
        check_skills()
    finally:
        driver.close()