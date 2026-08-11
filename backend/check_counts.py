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


def check_counts():
    node_query = """
    MATCH (n)
    RETURN count(n) AS nodes
    """

    relationship_query = """
    MATCH ()-[r]->()
    RETURN count(r) AS relationships
    """

    with driver.session() as session:

        node_result = session.run(node_query).single()
        relationship_result = session.run(
            relationship_query
        ).single()

        print("Nodes:", node_result["nodes"])
        print(
            "Relationships:",
            relationship_result["relationships"]
        )


if __name__ == "__main__":
    try:
        driver.verify_connectivity()
        check_counts()
    finally:
        driver.close()