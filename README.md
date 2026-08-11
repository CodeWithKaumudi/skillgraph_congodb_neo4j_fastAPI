# SkillGraph

SkillGraph is a graph-based employee skill discovery system built using
**FastAPI, Next.js, and Neo4j/CognoDB**.

The system models employees, skills, projects, and technologies as a
connected graph and provides APIs and a web interface to discover
employees based on their skills, projects, and technologies.

---

## Problem Statement

Traditional employee skill searching often relies on relational queries
across multiple tables.

SkillGraph uses a graph database to represent relationships between:

- Employees
- Skills
- Projects
- Technologies

This makes it easier to discover connected information such as:

- Employees with a particular skill
- Employees with related skills
- Projects an employee has worked on
- Employees who worked on a particular project
- Technologies used by a project
- Employees matching a skill and technology combination

---

## Solution

SkillGraph represents organizational knowledge as a graph.

Instead of treating employees, skills, projects, and technologies as
isolated records, the system connects them using graph relationships.

Example:

Employee → HAS_SKILL → Skill

Employee → WORKS_ON → Project

Project → USES → Technology

Skill → RELATED_TO → Skill

This allows the system to perform relationship-based searches.

---

## Technology Stack

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- Neo4j Python Driver
- python-dotenv

### Database

- Neo4j / CognoDB
- Cypher

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### API Documentation

- Swagger / OpenAPI

---

## Architecture

```text
                ┌─────────────────────┐
                │      Next.js        │
                │     Frontend        │
                └──────────┬──────────┘
                           │
                           │ REST API
                           ▼
                ┌─────────────────────┐
                │       FastAPI       │
                │      Backend        │
                └──────────┬──────────┘
                           │
                           │ Cypher
                           ▼
                ┌─────────────────────┐
                │   Neo4j / CognoDB   │
                │    Graph Database   │
                └─────────────────────┘

Employee
   |
   | HAS_SKILL
   v
Skill
Employee
   |
   | WORKS_ON
   v
Project
   |
   | USES
   v
Technology  
Skill
   |
   | RELATED_TO
   v
Skill

Amit Kulkarni
      |
      | HAS_SKILL
      v
    Django
      |
      | RELATED_TO
      v
    Python

Amit Kulkarni
      |
      | WORKS_ON
      v
Fraud Detection System
      |
      | USES
      v
 PostgreSQL

 Graph Statistics

Current graph:

Nodes: 36
Relationships: 95

Features
1. Employees By Skill
GET /employees/skill/{skill_name}

Finds employees based on a requested skill and related skills.

The API identifies whether the employee has:

DIRECT skill match
RELATED skill match

For example, searching for Django can identify employees who directly
have Django as well as employees connected through related skills.

2. Employees By Skill With Projects
GET /employees/skill/{skill_name}/projects

Returns employees who have a particular skill along with the projects
they have worked on.

3. Employees By Skill And Technology
GET /employees/search

Example:

GET /employees/search?skill=python&technology=postgresql

Finds employees who have the requested skill and have worked on projects
using the requested technology.

4. Employees By Skill And Technology Using Path Parameters
GET /employees/search/{skill_name}/{technology_name}

Example:

GET /employees/search/python/postgresql

This provides skill and technology search using path parameters.

5. Employee Profile
GET /employees/{employee_id}

Returns an employee's:

Employee ID
Name
Skills
Projects
Technologies used by those projects

Example:

GET /employees/E009
6. Employees By Project
GET /projects/{project_name}/employees

Returns employees who worked on a particular project.

Example:

GET /projects/Fraud%20Detection%20System/employees

Response:

{
  "project": "Fraud Detection System",
  "employees": [
    {
      "employee": "Amit Kulkarni",
      "employee_id": "E003"
    },
    {
      "employee": "Vikas Mehta",
      "employee_id": "E007"
    },
    {
      "employee": "Akash Verma",
      "employee_id": "E009"
    }
  ]
}
7. Project Technologies
GET /projects/{project_name}/technologies

Returns technologies used by a particular project.

Example:

GET /projects/Fraud%20Detection%20System/technologies

Response:

{
  "project": "Fraud Detection System",
  "technologies": [
    "PostgreSQL",
    "Redis",
    "Docker",
    "Celery"
  ]
}
8. Health Check
GET /health

Checks whether the FastAPI application can connect to the Neo4j/CognoDB
database.

Example response:

{
  "status": "healthy",
  "database": "connected"
}
API Endpoints
Method	Endpoint	Description
GET	/	API root
GET	/health	Database health check
GET	/employees/skill/{skill_name}	Employees by skill
GET	/employees/skill/{skill_name}/projects	Employees by skill with projects
GET	/employees/search	Employees by skill and technology
GET	/employees/search/{skill_name}/{technology_name}	Skill + technology using path
GET	/employees/{employee_id}	Employee profile
GET	/projects/{project_name}/employees	Employees by project
GET	/projects/{project_name}/technologies	Technologies by project
Direct vs Related Skill Matching

One of the key features of SkillGraph is the ability to distinguish
between direct and related skill matches.

For example, when searching for:

Django

An employee who has Django directly can be returned as:

Django → DIRECT

Employees connected through the skill graph can be returned as:

Python → RELATED
FastAPI → RELATED
REST API → RELATED
SQL → RELATED

This makes the search more useful than a simple exact keyword search.

Frontend

SkillGraph includes a Next.js frontend for interacting with the APIs.

The interface provides search options for:

Skill
Skill + Technology
Employee
Project Employees
Project Technologies

Employee results display:

Employee name
Employee ID
Skills
Direct skill matches
Related skill matches
Projects
Technologies

The frontend communicates with the FastAPI backend using REST APIs.

Project Structure
skillgraph/
│
├── backend/
│   ├── api.py
│   └── graph_queries.py
│
├── app/
│   └── skillgraph/
│       └── page.tsx
│
├── public/
│
├── .env
├── .gitignore
├── requirements.txt
├── package.json
└── README.md
Environment Configuration

Create a .env file for Neo4j/CognoDB credentials.

Example:

COGNODB_URI=your_neo4j_uri
COGNODB_USERNAME=your_neo4j_username
COGNODB_PASSWORD=your_neo4j_password

Frontend Search Experience

A typical workflow is:

User opens SkillGraph
        |
        v
Selects search type
        |
        v
Enters skill / employee / project
        |
        v
Next.js sends REST request
        |
        v
FastAPI processes request
        |
        v
FastAPI executes parameterized Cypher
        |
        v
CognoDB traverses graph
        |
        v
Matching graph data returned
        |
        v
Next.js displays results
Project Structure
skillgraph/
│
├── backend/
│   ├── api.py
│   ├── graph_queries.py
│   └── ...
│
├── app/
│   └── skillgraph/
│       └── page.tsx
│
├── public/
│
├── docs/
│   └── screenshots/
│       ├── skill-search.png
│       ├── employee-profile.png
│       ├── skill-technology.png
│       └── project-search.png
│
├── .env
├── .gitignore
├── requirements.txt
├── package.json
├── next.config.ts
└── README.md

The exact file structure may vary depending on the local development configuration.

Seed Data

SkillGraph uses realistic sample data to demonstrate employee skill discovery.

The graph contains relationships between:

Employees
Skills
Projects
Technologies

The current graph contains:

36 nodes
95 relationships

The seed script creates the sample graph data in CognoDB.

If the repository contains a seed script, run it from the project root using:

python backend/seed.py

If the seed script has a different filename in the repository, replace the command above with the actual seed script filename.

The seed process should be executed after configuring the CognoDB environment variables.

CognoDB Setup

SkillGraph uses CognoDB as the managed graph database layer.

CognoDB provides an openCypher-compatible graph database that can be accessed through the official Neo4j driver over the Bolt protocol.

1. Create a CognoDB Account

Create an account through the CognoDB Cloud console.

https://console.cognodb.com/signup
2. Create a Free Instance

Create a free C0 database instance and select the required region.

3. Save the Connection Details

CognoDB provides:

Bolt connection URI
Username
Password

The password should be stored securely because database credentials should never be committed to the repository.

4. Configure the Application

Create a .env file in the project root.

Example:

COGNODB_URI=your_cognodb_bolt_uri
COGNODB_USERNAME=your_cognodb_username
COGNODB_PASSWORD=your_cognodb_password
5. Verify the Connection

Start the FastAPI backend:

uvicorn backend.api:app --reload

Then open:

http://127.0.0.1:8000/health

Expected response:

{
  "status": "healthy",
  "database": "connected"
}

Add the following to .gitignore:

.env
venv/
__pycache__/
*.pyc
node_modules/
.next/
Running the Backend
1. Create Virtual Environment

Windows:

python -m venv venv

Activate it:

venv\Scripts\activate
2. Install Dependencies
pip install -r requirements.txt
3. Start FastAPI

From the project root:

uvicorn backend.api:app --reload

The backend will be available at:

http://127.0.0.1:8000
Swagger Documentation

FastAPI provides interactive API documentation.

Open:

http://127.0.0.1:8000/docs

You can use Swagger UI to test all API endpoints.

Alternative documentation:

http://127.0.0.1:8000/redoc
Running the Frontend

Open another terminal and install the frontend dependencies:

npm install

Start the Next.js development server:

npm run dev

The frontend will be available at:

http://localhost:3000
Request Flow

Example: searching for Python employees with PostgreSQL experience.

User
  |
  v
Next.js Frontend
  |
  | GET /employees/search
  v
FastAPI
  |
  | Cypher Query
  v
Neo4j / CognoDB
  |
  | Graph Traversal
  v
Matching Employees
  |
  v
FastAPI JSON Response
  |
  v
Next.js UI
Error Handling

The API handles common failure scenarios.

Employee Not Found
404 Not Found
Skill Not Found
404 Not Found
Project Not Found
404 Not Found
Database Connection Failure
503 Service Unavailable

This allows API consumers and the frontend to distinguish between
missing data and database connectivity problems.

Assignment Deliverables

The project demonstrates:

Neo4j graph database implementation
Employee skill discovery
Related skill discovery
Employee-project relationships
Project-technology relationships
Skill + technology matching
Employee profile exploration
FastAPI REST APIs
Swagger/OpenAPI documentation
Next.js frontend
Direct and related skill visualization
Project Benefits

SkillGraph demonstrates how graph databases can be used for connected
employee skill discovery.

Instead of treating employees, skills, projects, and technologies as
isolated records, the system represents their relationships directly in
the graph.

This enables flexible relationship-based searches and provides a
foundation for:

Employee recommendations
Skill matching
Project staffing
Internal talent discovery
Skill gap analysis
Future Improvements

Possible future enhancements include:

Employee recommendation ranking
Skill similarity scoring
Project staffing recommendations
Skill gap analysis
Employee availability tracking
Advanced graph visualization
Authentication and role-based access
Search filters and pagination
CSV/Excel employee data import
Caching
Automated testing
CI/CD
Production deployment
Technical Highlights
Graph-based data modeling with Neo4j
Cypher relationship queries
FastAPI REST API development
Direct and related skill discovery
Employee-project-technology traversal
Pydantic models
Database health monitoring
Swagger/OpenAPI documentation
Next.js frontend
React
TypeScript
Tailwind CSS
REST-based frontend/backend communication
Environment-based configuration
Conclusion

SkillGraph provides a practical example of using a graph database to
solve employee skill discovery and project intelligence problems.

By connecting employees, skills, projects, and technologies through
relationships, the system can provide more meaningful discovery than
simple keyword-based searching.

The combination of Neo4j, FastAPI, and Next.js provides a complete
end-to-end implementation consisting of a graph database, REST API, and
interactive web interface.

Author

Kaumudi Kalikar

Python Developer

Technologies:

Python
FastAPI
Neo4j
Next.js
React
TypeScript
Tailwind CSS
REST APIs

