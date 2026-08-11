"use client";

import Link from "next/link";
import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

/* ============================================================
   TYPES
============================================================ */

type ProjectData = {
  project: string;
  technology: string;
};

type EmployeeProfile = {
  employee_id: string;
  employee: string;
  skills: string[];
  project_data: ProjectData[];
};

type SkillEmployee = {
  employee_id: string;
  employee: string;
  employee_skill?: string;
  skill?: string;
  match_type?: string;
};

type SkillTechnologyEmployee = {
  employee_id: string;
  employee: string;
  skill: string;
  technology: string;
  projects: string[];
};

type ProjectEmployee = {
  employee_id: string;
  employee: string;
};

type ProjectEmployeesResponse = {
  project: string;
  employees: ProjectEmployee[];
};

type ProjectTechnologiesResponse = {
  project: string;
  technologies: string[];
};

type Tab =
  | "skill"
  | "skillTechnology"
  | "employee"
  | "projectEmployees"
  | "projectTechnologies";

/* ============================================================
   MAIN PAGE
============================================================ */

export default function SkillGraphPage() {
  const [activeTab, setActiveTab] = useState<Tab>("employee");

  const [searchValue, setSearchValue] = useState("E009");

  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* ----------------------------------------------------------
     SEARCH
  ---------------------------------------------------------- */

  const performSearch = async () => {
    const value = searchValue.trim();

    if (!value) {
      setError("Please enter a search value.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      let endpoint = "";

      /* =========================
         SKILL
      ========================= */

      if (activeTab === "skill") {
        endpoint = `/employees/skill/${encodeURIComponent(value)}`;
      }

      /* =========================
         SKILL + TECHNOLOGY
      ========================= */

      else if (activeTab === "skillTechnology") {
        const parts = value.split("+");

        if (parts.length < 2) {
          throw new Error(
            "Please enter Skill + Technology. Example: Python + PostgreSQL"
          );
        }

        const skill = parts[0].trim();
        const technology = parts.slice(1).join("+").trim();

        endpoint = `/employees/search/${encodeURIComponent(
          skill
        )}/${encodeURIComponent(technology)}`;
      }

      /* =========================
         EMPLOYEE
      ========================= */

      else if (activeTab === "employee") {
        endpoint = `/employees/${encodeURIComponent(value)}`;
      }

      /* =========================
         PROJECT EMPLOYEES
      ========================= */

      else if (activeTab === "projectEmployees") {
        endpoint = `/projects/${encodeURIComponent(value)}/employees`;
      }

      /* =========================
         PROJECT TECHNOLOGIES
      ========================= */

      else if (activeTab === "projectTechnologies") {
        endpoint = `/projects/${encodeURIComponent(value)}/technologies`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`);

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail ||
          data?.message ||
          "Unable to fetch data from the backend."
        );
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------------------------
     TAB CHANGE
  ---------------------------------------------------------- */

  const changeTab = (tab: Tab) => {
    setActiveTab(tab);

    setResult(null);
    setError("");

    if (tab === "employee") {
      setSearchValue("E009");
    } else if (tab === "skill") {
      setSearchValue("Python");
    } else if (tab === "skillTechnology") {
      setSearchValue("Python + PostgreSQL");
    } else if (tab === "projectEmployees") {
      setSearchValue("Fraud Detection System");
    } else if (tab === "projectTechnologies") {
      setSearchValue("Fraud Detection System");
    }
  };

  /* ----------------------------------------------------------
     QUICK SEARCH
  ---------------------------------------------------------- */

  const quickSearch = (value: string, tab: Tab) => {
    setActiveTab(tab);
    setSearchValue(value);
    setResult(null);
    setError("");
  };

  /* ----------------------------------------------------------
     CLEAR
  ---------------------------------------------------------- */

  const clearResults = () => {
    setResult(null);
    setError("");
    setSearchValue("");
  };

  /* ----------------------------------------------------------
     INPUT LABEL
  ---------------------------------------------------------- */

  const getInputLabel = () => {
    switch (activeTab) {
      case "skill":
        return "Skill";

      case "skillTechnology":
        return "Skill + Technology";

      case "employee":
        return "Employee ID";

      case "projectEmployees":
        return "Project Name";

      case "projectTechnologies":
        return "Project Name";

      default:
        return "Search";
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "skill":
        return "Enter skill e.g. Python";

      case "skillTechnology":
        return "Enter skill + technology e.g. Python + PostgreSQL";

      case "employee":
        return "Enter Employee ID e.g. E009";

      case "projectEmployees":
        return "Enter project name e.g. Fraud Detection System";

      case "projectTechnologies":
        return "Enter project name e.g. Fraud Detection System";

      default:
        return "Search";
    }
  };

  const getOverviewStats = () => {
    if (!result) return null;

    const skillData = result?.results ?? result;

    const employees =
      activeTab === "employee"
        ? 1
        : Array.isArray(skillData)
          ? skillData.length
          : result?.employees?.length ?? 0;

    const skills =
      activeTab === "employee"
        ? (result as EmployeeProfile).skills?.length ?? 0
        : activeTab === "skill"
          ? Array.isArray(skillData)
            ? new Set(skillData.map((item) => item.skill || item.employee_skill)).size
            : 0
          : activeTab === "skillTechnology"
            ? 1
            : 0;

    const projects =
      activeTab === "employee"
        ? new Set(
          (result as EmployeeProfile).project_data?.map(
            (item) => item.project
          )
        ).size
        : activeTab === "projectEmployees"
          ? (result as ProjectEmployeesResponse).employees?.length ?? 0
          : activeTab === "projectTechnologies"
            ? 1
            : 0;

    const technologies =
      activeTab === "employee"
        ? new Set(
          (result as EmployeeProfile).project_data?.map(
            (item) => item.technology
          )
        ).size
        : activeTab === "projectTechnologies"
          ? (result as ProjectTechnologiesResponse).technologies?.length ?? 0
          : activeTab === "skillTechnology"
            ? Array.isArray(skillData)
              ? new Set(skillData.map((item) => item.technology)).size
              : 0
            : 0;

    return {
      employees,
      skills,
      projects,
      technologies,
    };
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="px-8 pt-6 md:px-14">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              SkillGraph
            </h1>

            <p className="mt-1 text-gray-500">
              Graph-based employee skill discovery
            </p>
          </div>

          <div className="rounded-full border bg-white px-5 py-2 text-sm shadow-sm">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" />
            FastAPI + Neo4j
          </div>

        </div>

      </header>

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="px-8 pt-14 md:px-14">

        <h2 className="text-4xl font-medium tracking-tight md:text-5xl">

          Discover the right{" "}

          <span className="text-blue-600">
            people & skills.
          </span>

        </h2>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-500">

          Search employees by skills, technologies, projects and
          explore their complete project experience.

        </p>

      </section>

      {/* ======================================================
          SEARCH PANEL
      ====================================================== */}

      <section className="mx-8 mt-10 rounded-2xl border bg-white p-6 shadow-sm md:mx-14">

        {/* ====================================================
            TABS
        ==================================================== */}

        <div className="flex flex-wrap gap-2">

          <TabButton
            label="Skill"
            active={activeTab === "skill"}
            onClick={() => changeTab("skill")}
          />

          <TabButton
            label="Skill + Technology"
            active={activeTab === "skillTechnology"}
            onClick={() => changeTab("skillTechnology")}
          />

          <TabButton
            label="Employee"
            active={activeTab === "employee"}
            onClick={() => changeTab("employee")}
          />

          <TabButton
            label="Project Employees"
            active={activeTab === "projectEmployees"}
            onClick={() => changeTab("projectEmployees")}
          />

          <TabButton
            label="Project Technologies"
            active={activeTab === "projectTechnologies"}
            onClick={() => changeTab("projectTechnologies")}
          />

        </div>

        {/* ====================================================
            SEARCH INPUT
        ==================================================== */}

        <div className="mt-7">

          <label className="mb-2 block text-sm font-semibold">
            {getInputLabel()}
          </label>

          <div className="flex flex-col gap-4 md:flex-row">

            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  performSearch();
                }
              }}
              placeholder={getPlaceholder()}
              className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              onClick={performSearch}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search"}
            </button>

          </div>

        </div>

        {/* ====================================================
            QUICK SEARCH
        ==================================================== */}

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">

          <span className="mr-2 text-gray-500">
            Try:
          </span>

          <QuickButton
            text="Python"
            onClick={() =>
              quickSearch("Python", "skill")
            }
          />

          <QuickButton
            text="Python + PostgreSQL"
            onClick={() =>
              quickSearch(
                "Python + PostgreSQL",
                "skillTechnology"
              )
            }
          />

          <QuickButton
            text="E009"
            onClick={() =>
              quickSearch("E009", "employee")
            }
          />

          <QuickButton
            text="Fraud Detection System"
            onClick={() =>
              quickSearch(
                "Fraud Detection System",
                "projectEmployees"
              )
            }
          />

        </div>

      </section>

      {result && !loading && !error && (
        <section className="mx-8 mt-8 md:mx-14">
          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
              <div className="flex flex-col gap-3">
                <span className="text-sm uppercase tracking-[0.32em] text-slate-400">
                  Search insights
                </span>
                <h3 className="text-3xl font-semibold text-white">
                  {activeTab === "employee" ? "Employee profile" : "Graph overview"}
                </h3>
                <p className="max-w-2xl text-slate-300">
                  Analyze the relationship between employees, skills, projects and technologies for your selected search.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                <SummaryCard
                  label="Employees"
                  value={getOverviewStats()?.employees ?? 0}
                  icon="👥"
                />
                <SummaryCard
                  label="Skills"
                  value={getOverviewStats()?.skills ?? 0}
                  icon="🔧"
                />
                <SummaryCard
                  label="Projects"
                  value={getOverviewStats()?.projects ?? 0}
                  icon="📁"
                />
                <SummaryCard
                  label="Technologies"
                  value={getOverviewStats()?.technologies ?? 0}
                  icon="⚙️"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Relationships
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                    Graph-style connections
                  </h3>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                  Live view
                </span>
              </div>

              <div className="mt-8">
                <RelationshipGraph />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ======================================================
          RESULTS
      ====================================================== */}

      <section className="mx-8 mt-10 pb-20 md:mx-14">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-3xl font-medium">
            Search Results
          </h2>

          {result && (
            <button
              onClick={clearResults}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm hover:bg-gray-50"
            >
              Clear
            </button>
          )}

        </div>

        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">

            <strong>Error:</strong>{" "}

            {error}

          </div>
        )}

        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />

            <p className="mt-4 text-gray-500">
              Searching employee graph...
            </p>

          </div>
        )}

        {/* ====================================================
            EMPLOYEE RESULT
        ==================================================== */}

        {result &&
          !loading &&
          activeTab === "employee" && (
            <EmployeeResult employee={result} />
          )}

        {/* ====================================================
            SKILL RESULT
        ==================================================== */}

        {result &&
          !loading &&
          activeTab === "skill" && (
            <SkillResult data={result} />
          )}

        {/* ====================================================
            SKILL + TECHNOLOGY RESULT
        ==================================================== */}

        {result &&
          !loading &&
          activeTab === "skillTechnology" && (
            <SkillTechnologyResult data={result} />
          )}

        {/* ====================================================
            PROJECT EMPLOYEES RESULT
        ==================================================== */}

        {result &&
          !loading &&
          activeTab === "projectEmployees" && (
            <ProjectEmployeesResult data={result} />
          )}

        {/* ====================================================
            PROJECT TECHNOLOGIES RESULT
        ==================================================== */}

        {result &&
          !loading &&
          activeTab === "projectTechnologies" && (
            <ProjectTechnologiesResult data={result} />
          )}

        {/* ====================================================
            EMPTY STATE
        ==================================================== */}

        {!result && !loading && !error && (
          <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

            <div className="text-5xl">
              🔎
            </div>

            <h3 className="mt-4 text-xl font-semibold">
              Start exploring the graph
            </h3>

            <p className="mt-2 text-gray-500">
              Search for an employee, skill or project.
            </p>

          </div>
        )}

      </section>

    </main>
  );
}

/* ============================================================
   TAB BUTTON
============================================================ */

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${active
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
    >
      {label}
    </button>
  );
}

/* ============================================================
   QUICK BUTTON
============================================================ */

function QuickButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 transition hover:border-blue-300 hover:bg-blue-50"
    >
      {text}
    </button>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl bg-slate-900/95 p-5 shadow-xl transition hover:-translate-y-1 hover:bg-slate-900">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="rounded-2xl bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-400">
          metric
        </span>
      </div>
      <p className="mt-6 text-4xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-400">{label}</p>
    </div>
  );
}

function RelationshipGraph() {
  return (
    <div className="relative h-64 overflow-hidden rounded-[1.5rem] bg-slate-950 p-6 text-white">
      <div className="absolute left-8 top-10 h-12 w-12 rounded-full bg-blue-500/90 shadow-lg" />
      <div className="absolute right-10 top-16 h-10 w-10 rounded-full bg-violet-500/90 shadow-lg" />
      <div className="absolute left-24 bottom-14 h-14 w-14 rounded-full bg-cyan-500/90 shadow-lg" />
      <div className="absolute right-24 bottom-12 h-10 w-10 rounded-full bg-slate-300/20 shadow-lg" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.15),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(129,140,248,0.16),_transparent_30%)]" />
      <div className="absolute left-14 top-16 h-0.5 w-48 bg-slate-300/20" />
      <div className="absolute left-16 top-16 h-16 w-0.5 bg-slate-300/20" />
      <div className="absolute right-16 top-24 h-0.5 w-32 bg-slate-300/20" />
      <div className="absolute right-16 top-24 h-20 w-0.5 bg-slate-300/20" />
      <div className="absolute left-16 bottom-20 h-0.5 w-40 bg-slate-300/20" />
      <div className="absolute left-44 bottom-20 h-20 w-0.5 bg-slate-300/20" />
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Skill to employee connections
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
            Relationship insights update based on your search criteria. Hover over a node to inspect the employee, skill and project links.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EMPLOYEE RESULT
============================================================ */

function EmployeeResult({
  employee,
}: {
  employee: EmployeeProfile;
}) {
  const projectsMap = employee.project_data.reduce(
    (acc: Record<string, string[]>, item) => {
      if (!acc[item.project]) {
        acc[item.project] = [];
      }
      if (!acc[item.project].includes(item.technology)) {
        acc[item.project].push(item.technology);
      }
      return acc;
    },
    {}
  );

  const projectEntries = Object.entries(projectsMap);
  const technologyCount = new Set(
    employee.project_data.map((item) => item.technology)
  ).size;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_0.95fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-blue-600 text-3xl font-semibold text-white shadow-lg">
              {employee.employee
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
                Employee profile
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-950">
                {employee.employee}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Employee ID: <span className="font-semibold text-slate-900">{employee.employee_id}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/employee/${employee.employee_id}`}
              className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View full profile
            </Link>
            <div className="rounded-3xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              Active skill profile
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ProfileStatCard label="Projects" value={projectEntries.length} icon="📁" />
          <ProfileStatCard label="Skills" value={employee.skills.length} icon="🔧" />
          <ProfileStatCard label="Technologies" value={technologyCount} icon="⚙️" />
          <ProfileStatCard label="Connections" value={projectEntries.length + employee.skills.length} icon="🔗" />
        </div>

        <div className="mt-10 rounded-[1.75rem] bg-slate-50 p-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-slate-900">Skill stack</h4>
            <span className="text-sm font-medium text-slate-500">{employee.skills.length} tags</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {employee.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Project experience</h4>
              <p className="mt-2 text-sm text-slate-500">
                Current projects and technologies the employee has worked with.
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {projectEntries.map(([projectName, technologies]) => (
              <div
                key={projectName}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Project</p>
                    <h5 className="mt-2 text-xl font-semibold text-slate-950">{projectName}</h5>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                    {technologies.length} Techs
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Profile insights</p>
            <h4 className="mt-3 text-2xl font-semibold text-white">Relationship overview</h4>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-200">Live</span>
        </div>
        <p className="mt-5 text-sm leading-7 text-slate-300">
          This profile shows the employee's connected skills, projects, and technologies in the SkillGraph network.
        </p>
        <div className="mt-8 grid gap-4">
          <RelationshipStatCard label="Linked projects" value={projectEntries.length} icon="📁" />
          <RelationshipStatCard label="Skill tags" value={employee.skills.length} icon="🔧" />
          <RelationshipStatCard label="Tech nodes" value={technologyCount} icon="⚙️" />
          <RelationshipStatCard label="Graph edges" value={projectEntries.length * 2} icon="🔗" />
        </div>
      </aside>
    </div>
  );
}

function ProfileStatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Metric</span>
      </div>
      <p className="mt-5 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function RelationshipStatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="rounded-3xl bg-slate-900/90 p-5 shadow-inner">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SKILL RESULT
============================================================ */

function SkillResult({
  data,
}: {
  data: any;
}) {
  type SkillMatch = {
    employee_id: string;
    employee: string;
    employee_skill: string;
    match_type: "DIRECT" | "RELATED" | string;
  };

  type GroupedEmployee = {
    employee_id: string;
    employee: string;
    directSkills: string[];
    relatedSkills: string[];
  };

  // Your API returns:
  // {
  //   skill: "django",
  //   results: [...]
  // }

  const matches: SkillMatch[] = Array.isArray(data)
    ? data
    : data?.results || [];

  const normalizedMatches = matches
    .filter((item) => item && item.employee_id && item.employee_skill)
    .map((item) => ({
      ...item,
      employee_skill: item.employee_skill.trim(),
    }));

  // ------------------------------------------------------------
  // GROUP MATCHES BY EMPLOYEE
  // ------------------------------------------------------------

  const groupedEmployees: Record<string, GroupedEmployee> = {};

  normalizedMatches.forEach((item) => {
    const employeeId = item.employee_id;

    if (!groupedEmployees[employeeId]) {
      groupedEmployees[employeeId] = {
        employee_id: item.employee_id,
        employee: item.employee,
        directSkills: [],
        relatedSkills: [],
      };
    }

    const bucket =
      item.match_type === "DIRECT"
        ? groupedEmployees[employeeId].directSkills
        : groupedEmployees[employeeId].relatedSkills;

    if (!bucket.includes(item.employee_skill)) {
      bucket.push(item.employee_skill);
    }
  });

  // ------------------------------------------------------------
  // CONVERT OBJECT TO ARRAY
  // ------------------------------------------------------------

  const employees = Object.values(groupedEmployees);

  const directMatchCount = employees.filter(
    (employee) => employee.directSkills.length > 0
  ).length;

  const relatedOnlyCount = employees.length - directMatchCount;

  // ------------------------------------------------------------
  // DIRECT MATCHES FIRST
  // ------------------------------------------------------------

  employees.sort((a, b) => {
    const aDirect = a.directSkills.length > 0 ? 1 : 0;
    const bDirect = b.directSkills.length > 0 ? 1 : 0;

    if (bDirect !== aDirect) {
      return bDirect - aDirect;
    }

    if (a.employee < b.employee) return -1;
    if (a.employee > b.employee) return 1;
    return 0;
  });

  // ------------------------------------------------------------
  // EMPTY RESULT
  // ------------------------------------------------------------

  if (employees.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
        <div className="text-5xl">🔎</div>

        <h3 className="mt-4 text-xl font-semibold">
          No employees found
        </h3>

        <p className="mt-2 text-gray-500">
          Try searching for another skill.
        </p>
      </div>
    );
  }

  // ------------------------------------------------------------
  // RESULT HEADER
  // ------------------------------------------------------------

  return (
    <div className="space-y-5">

      {/* SUMMARY */}

      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm font-medium text-gray-500">
              Skill Search
            </p>

            <h3 className="mt-1 text-2xl font-bold text-gray-900">
              {data?.skill || "Skill"}
            </h3>
          </div>

          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {employees.length}{" "}
            {employees.length === 1
              ? "Employee"
              : "Employees"}{" "}
            Found
          </div>

        </div>

        <div className="mt-5 flex flex-wrap gap-4 text-sm">

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>

            <span className="text-gray-600">
              Direct skill
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500"></span>

            <span className="text-gray-600">
              Related skill
            </span>
          </div>

        </div>

      </div>

      {/* EMPLOYEE CARDS */}

      <div className="grid gap-5 md:grid-cols-2">

        {employees.map((employee) => {

          const initials = employee.employee
            .split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          const hasDirect =
            employee.directSkills.length > 0;

          return (
            <div
              key={employee.employee_id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              {/* EMPLOYEE HEADER */}

              <div
                className={`p-6 ${hasDirect
                    ? "bg-gradient-to-r from-green-50 to-white"
                    : "bg-gradient-to-r from-blue-50 to-white"
                  }`}
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-4">

                    {/* AVATAR */}

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white ${hasDirect
                          ? "bg-green-600"
                          : "bg-blue-600"
                        }`}
                    >
                      {initials}
                    </div>

                    {/* NAME */}

                    <div>

                      <h3 className="text-xl font-bold text-gray-900">
                        {employee.employee}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Employee ID:{" "}
                        <span className="font-semibold text-gray-700">
                          {employee.employee_id}
                        </span>
                      </p>

                    </div>

                  </div>

                  {/* MATCH STATUS */}

                  {hasDirect ? (
                    <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
                      DIRECT MATCH
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">
                      RELATED
                    </span>
                  )}

                </div>

              </div>

              {/* SKILLS */}

              <div className="p-6">

                {/* DIRECT SKILLS */}

                {employee.directSkills.length > 0 && (
                  <div>

                    <div className="mb-3 flex items-center gap-2">

                      <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>

                      <h4 className="text-sm font-bold text-gray-800">
                        Direct Skills
                      </h4>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      {employee.directSkills.map(
                        (skill) => (
                          <span
                            key={`direct-${skill}`}
                            className="rounded-lg bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 ring-1 ring-green-200"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}

                {/* RELATED SKILLS */}

                {employee.relatedSkills.length > 0 && (
                  <div
                    className={
                      employee.directSkills.length > 0
                        ? "mt-5 border-t pt-5"
                        : ""
                    }
                  >

                    <div className="mb-3 flex items-center gap-2">

                      <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>

                      <h4 className="text-sm font-bold text-gray-800">
                        Related Skills
                      </h4>

                    </div>

                    <div className="flex flex-wrap gap-2">

                      {employee.relatedSkills.map(
                        (skill) => (
                          <span
                            key={`related-${skill}`}
                            className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 ring-1 ring-blue-200"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
/* ============================================================
   SKILL + TECHNOLOGY RESULT
============================================================ */

function SkillTechnologyResult({
  data,
}: {
  data: any;
}) {
  const employees: SkillTechnologyEmployee[] = Array.isArray(data?.results)
    ? data.results
    : data?.results?.employees || [];

  return (
    <div className="rounded-2xl border bg-white p-7 shadow-sm">

      <div className="mb-6">

        <h3 className="text-2xl font-bold">
          Skill + Technology Results
        </h3>

        <p className="mt-1 text-gray-500">
          Employees matching both the requested skill and technology
        </p>

      </div>

      {employees.length === 0 ? (

        <EmptyResult message="No matching employees found." />

      ) : (

        <div className="grid gap-5 md:grid-cols-2">

          {employees.map((employee, index) => (

            <div
              key={`${employee.employee_id}-${index}`}
              className="rounded-xl border bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                  {employee.employee
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>

                  <h4 className="font-bold">
                    {employee.employee}
                  </h4>

                  <p className="text-sm text-gray-500">
                    Employee ID: {employee.employee_id}
                  </p>

                </div>

              </div>

              <div className="mt-5 flex flex-wrap gap-2">

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {employee.skill}
                </span>

                <span className="rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-700">
                  {employee.technology}
                </span>

              </div>

              {employee.projects?.length > 0 && (

                <div className="mt-5">

                  <p className="mb-2 text-sm font-semibold">
                    Projects
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {employee.projects.map((project) => (

                      <span
                        key={project}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                      >
                        {project}
                      </span>

                    ))}

                  </div>

                </div>

              )}

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

/* ============================================================
   PROJECT EMPLOYEES RESULT
============================================================ */

function ProjectEmployeesResult({
  data,
}: {
  data: ProjectEmployeesResponse;
}) {
  const employees = data?.employees || [];

  return (
    <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Project details
            </p>
            <h3 className="mt-2 text-3xl font-semibold text-slate-950">
              {data?.project || "Project"}
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Explore the employees currently mapped to this project and discover their related skills.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {employees.length} employees
          </span>
        </div>

        {employees.length === 0 ? (
          <EmptyResult message="No employees found for this project." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee, index) => (
              <div
                key={`${employee.employee_id}-${index}`}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-semibold text-white">
                    {employee.employee
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-950">
                      {employee.employee}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">{employee.employee_id}</p>
                  </div>
                </div>
                <div className="mt-5 rounded-3xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                  Project contributor with strong team collaboration and domain knowledge.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-7 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-400">Project insight</p>
            <h4 className="mt-2 text-2xl font-semibold text-white">Team coverage</h4>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm text-slate-200">Graph view</span>
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Assignments are grouped by employee, skill, and technology links. Use the graph summary to quickly compare team capacity.
        </p>
        <div className="mt-8 grid gap-4">
          <RelationshipStatCard label="Employees" value={employees.length} icon="👤" />
          <RelationshipStatCard label="Projects" value={1} icon="📁" />
          <RelationshipStatCard label="Connections" value={employees.length * 2} icon="🔗" />
        </div>
      </aside>
    </div>
  );
}

/* ============================================================
   PROJECT TECHNOLOGIES RESULT
============================================================ */

function ProjectTechnologiesResult({
  data,
}: {
  data: ProjectTechnologiesResponse;
}) {

  const technologies = data?.technologies || [];

  return (
    <div className="rounded-2xl border bg-white p-7 shadow-sm">

      <div className="mb-7">

        <p className="text-sm font-medium text-blue-600">
          Project
        </p>

        <h3 className="mt-1 text-2xl font-bold">
          {data?.project || "Project"}
        </h3>

        <p className="mt-1 text-gray-500">
          Technologies used in this project
        </p>

      </div>

      {technologies.length === 0 ? (

        <EmptyResult message="No technologies found for this project." />

      ) : (

        <div>

          <div className="mb-5 flex items-center justify-between">

            <h4 className="text-lg font-bold">
              Technologies
            </h4>

            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              {technologies.length} Technologies
            </span>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {technologies.map((technology) => (

              <div
                key={technology}
                className="rounded-xl border bg-gray-50 p-5 text-center transition hover:-translate-y-1 hover:bg-blue-50 hover:shadow-md"
              >

                <div className="text-3xl">
                  ⚙️
                </div>

                <p className="mt-3 font-semibold text-gray-800">
                  {technology}
                </p>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

/* ============================================================
   EMPTY RESULT
============================================================ */

function EmptyResult({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-gray-50 p-10 text-center">

      <div className="text-4xl">
        🔎
      </div>

      <p className="mt-3 text-gray-500">
        {message}
      </p>

    </div>
  );
}