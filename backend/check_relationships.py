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


def check_relationships():
    query = """
    MATCH (e:Employee)-[r:EMPLOYED_BY]->(c:Company)
    RETURN
        e.name AS employee,
        type(r) AS relationship,
        c.name AS company
    ORDER BY e.id
    """

    with driver.session() as session:
        result = session.run(query)

        for record in result:
            print(
                f"{record['employee']} "
                f"--{record['relationship']}--> "
                f"{record['company']}"
            )


if __name__ == "__main__":
    try:
        driver.verify_connectivity()
        check_relationships()
    finally:
        driver.close()