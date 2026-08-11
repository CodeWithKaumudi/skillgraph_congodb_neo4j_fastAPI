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


def clean_database():
    query = """
    MATCH (n)
    DETACH DELETE n
    """

    with driver.session() as session:
        session.run(query)

    print("Database cleaned successfully!")


if __name__ == "__main__":
    try:
        driver.verify_connectivity()
        clean_database()
    finally:
        driver.close()