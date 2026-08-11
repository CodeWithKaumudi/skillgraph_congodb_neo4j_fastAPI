"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE_URL = "http://127.0.0.1:8000";

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

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params?.employeeId as string;

  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!employeeId) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/employees/${encodeURIComponent(employeeId)}`
        );

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(
            data?.detail || data?.message || "Failed to load employee profile."
          );
        }

        const data = await response.json();
        setEmployee(data);
      } catch (err: any) {
        setError(err.message || "Failed to load employee profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [employeeId]);

  const projectMap = employee?.project_data.reduce(
    (acc: Record<string, Set<string>>, item) => {
      if (!acc[item.project]) {
        acc[item.project] = new Set();
      }
      acc[item.project].add(item.technology);
      return acc;
    },
    {}
  );

  const projectEntries = projectMap
    ? Object.entries(projectMap).map(([project, technologies]) => ({
        project,
        technologies: Array.from(technologies),
      }))
    : [];

  const technologyCount = new Set(
    employee?.project_data.map((item) => item.technology)
  ).size;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-10 md:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Employee profile</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">Professional skill graph</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Explore the employee's connected skills, project assignments, and technology experience in a polished profile view.
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-200"
          >
            Back to search
          </button>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500" />
            <p className="mt-4 text-slate-500">Loading employee profile…</p>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-red-700 shadow-sm">
            <p className="text-lg font-semibold">Unable to load profile</p>
            <p className="mt-2 text-sm text-red-600">{error}</p>
          </div>
        ) : !employee ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Employee not found</p>
            <p className="mt-2 text-sm text-slate-500">Please return to search and try another employee ID.</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-6 rounded-[1.75rem] bg-slate-50 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-blue-600 text-4xl font-semibold text-white shadow-lg">
                      {employee.employee
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Employee</p>
                      <h2 className="mt-2 text-3xl font-semibold text-slate-950">{employee.employee}</h2>
                      <p className="mt-2 text-sm text-slate-500">ID: <span className="font-semibold text-slate-900">{employee.employee_id}</span></p>
                    </div>
                  </div>
                  <div className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm">
                    Graph profile
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <ProfileCard label="Projects" value={projectEntries.length} icon="📁" />
                  <ProfileCard label="Skills" value={employee.skills.length} icon="🔧" />
                  <ProfileCard label="Technologies" value={technologyCount} icon="⚙️" />
                  <ProfileCard label="Connections" value={projectEntries.length + employee.skills.length} icon="🔗" />
                </div>
              </div>

              <div className="mt-8 rounded-[1.75rem] bg-slate-950 p-8 text-white shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Skill stack</p>
                    <h3 className="mt-3 text-2xl font-semibold">Core capabilities</h3>
                  </div>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-200">{employee.skills.length} tags</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {employee.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-[1.75rem] bg-slate-50 p-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Project history</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">Assigned projects</h3>
                  </div>
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">{projectEntries.length} projects</span>
                </div>
                <div className="mt-6 space-y-4">
                  {projectEntries.map(({ project, technologies }) => (
                    <div key={project} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-950">{project}</h4>
                          <p className="mt-1 text-sm text-slate-500">Technologies used</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                          {technologies.length} techs
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {technologies.map((tech) => (
                          <span key={tech} className="rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-lg">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Profile insights</p>
                <h3 className="mt-3 text-2xl font-semibold">Relationship overview</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  This employee profile surfaces the connected skills, projects and technologies from the SkillGraph backend.
                </p>
              </div>

              <div className="mt-8 grid gap-4">
                <MiniStat label="Total skills" value={employee.skills.length} />
                <MiniStat label="Project nodes" value={projectEntries.length} />
                <MiniStat label="Tech stack" value={technologyCount} />
                <MiniStat label="Profile depth" value={projectEntries.length + employee.skills.length} />
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function ProfileCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-xs uppercase tracking-[0.28em] text-slate-500">Metric</span>
      </div>
      <p className="mt-5 text-4xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm">
      <p className="text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}
