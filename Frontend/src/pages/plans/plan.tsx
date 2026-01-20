import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Download,
  Share2,
  RefreshCw,
  Target,
  CheckCircle2,
  Zap,
  BookOpen,
  ShieldCheck,
  Layers,
  Users,
  GitBranch,
  Database,
  AlertTriangle,
  ListTodo,
  Terminal,
  Cpu,
} from 'lucide-react';
// Assuming this path exists in your project, otherwise replace with mock or fetch logic
import { firebaseService } from '@/lib/firebase/firebaseService';

/* ---------------- TYPES ---------------- */

interface ProjectData {
  metadata: {
    domain: string;
    platform: string;
    skillLevel: string;
    estimated_effort: string;
    budget_profile: string;
    assumptions: string[];
    risk_assessment: Array<{
      risk: string;
      impact: string;
      mitigation: string;
    }>;
  };
  overview: {
    primary_goal: string;
    summary_points: string[];
    success_criteria: string[];
    user_personas: Array<{
      role: string;
      primary_need: string;
    }>;
  };
  architecture_design: {
    system_pattern: string;
    data_flow_description: string;
    diagram_reference: string;
    key_entities: Array<{
      name: string;
      relationships: string;
      attributes: string[];
    }>;
    infrastructure_and_devops: {
      ci_cd_pipeline: string;
      hosting_provider: string;
      monitoring_strategy: string;
      security_measures: string[];
    };
  };
  tech_stack: Array<{
    layer: string;
    technology: string;
    variant: string;
    usage_area: string;
    pros: string[];
    cons: string[];
    decision_factors: {
      complexity_level: string;
      learning_value: string;
      scalability_ceiling: string;
    };
    why_recommended: string[];
  }>;
  roadmap: Array<{
    phase_id: string;
    title: string;
    intent: string;
    estimated_duration: string;
    milestone_gate: string;
    deliverables: string[];
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    phase_id: string;
    difficulty: string;
    checkable: boolean;
    technical_notes: string;
    verification_step: string;
  }>;
  next_actions: string[];
}

/* ---------------- PAGE ---------------- */

export default function Plan() {
  const { id } = useParams();
  const [plan, setPlan] = useState<ProjectData | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      // Replace with your actual data fetching logic if different
      const result = await firebaseService.getProjectDocument(id as string);
      if (result?.plan) {
        setPlan(result.plan);
      }
    };
    fetchPlan();
  }, [id]);

  if (!plan) {
    return (
      <div className="flex justify-center items-center bg-[#0a0c10] min-h-screen text-gray-500">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="text-blue-500 animate-spin" size={32} />
          <span className="text-xl">Loading Blueprint...</span>
        </div>
      </div>
    );
  }

  return <ProjectPlanner data={plan} />;
}

/* ---------------- MAIN PLANNER COMPONENT ---------------- */

const ProjectPlanner: React.FC<{ data: ProjectData }> = ({ data }) => {
  return (
    <div className="bg-[#0a0c10] selection:bg-blue-500/30 min-h-screen font-sans text-gray-300">
      <main className="space-y-8 mx-auto p-8 max-w-350">
        {/* ---------- HEADER ---------- */}
        <header className="flex lg:flex-row flex-col justify-between lg:items-start gap-6 pb-6 border-gray-800/50 border-b">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="bg-blue-500/10 px-3 py-1 border border-blue-500/20 rounded-full font-medium text-blue-400 text-xs uppercase tracking-wide">
                {data.metadata.domain}
              </span>
              <span className="bg-purple-500/10 px-3 py-1 border border-purple-500/20 rounded-full font-medium text-purple-400 text-xs uppercase tracking-wide">
                {data.metadata.platform}
              </span>
            </div>
            <h1 className="font-bold text-white text-5xl tracking-tight">
              PlanForge <span className="text-gray-600">Blueprint</span>
            </h1>
            <p className="max-w-2xl text-gray-400 text-lg">{data.overview.primary_goal}</p>
          </div>

          <div className="flex gap-3">
            <ActionButton icon={<Download size={16} />} label="Export" />
            <ActionButton icon={<Share2 size={16} />} label="Share" />
            <ActionButton icon={<RefreshCw size={16} />} label="Regenerate" />
          </div>
        </header>

        {/* ---------- QUICK STATS GRID ---------- */}
        <section className="gap-4 grid grid-cols-2 md:grid-cols-4">
          <HealthCard
            icon={<Cpu size={20} className="text-emerald-400" />}
            label="Skill Level"
            value={data.metadata.skillLevel}
          />
          <HealthCard
            icon={<Zap size={20} className="text-amber-400" />}
            label="Est. Effort"
            value={data.metadata.estimated_effort}
          />
          <HealthCard
            icon={<Database size={20} className="text-blue-400" />}
            label="Budget"
            value={data.metadata.budget_profile}
          />
          <HealthCard
            icon={<ShieldCheck size={20} className="text-red-400" />}
            label="Risk Factors"
            value={`${data.metadata.risk_assessment.length} Identified`}
          />
        </section>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* LEFT COLUMN (2/3 width) */}
          <div className="space-y-8 lg:col-span-2">
            {/* ---------- OVERVIEW & GOALS ---------- */}
            <Section title="Project Vision" icon={<Target className="text-blue-400" size={20} />}>
              <div className="space-y-6">
                <div className="bg-[#13161c] p-6 border border-gray-800 rounded-2xl">
                  <h3 className="mb-4 font-semibold text-white text-lg">Core Objectives</h3>
                  <div className="gap-6 grid md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 text-gray-500 text-xs uppercase tracking-widest">
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {data.overview.summary_points.map((point, i) => (
                          <li key={i} className="flex gap-2 text-gray-300 text-sm">
                            <span className="mt-1 text-blue-500">•</span> {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 text-gray-500 text-xs uppercase tracking-widest">
                        Success Criteria
                      </h4>
                      <ul className="space-y-2">
                        {data.overview.success_criteria.map((point, i) => (
                          <li key={i} className="flex gap-2 text-gray-300 text-sm">
                            <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 shrink-0" />{' '}
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="gap-4 grid md:grid-cols-2">
                  {data.overview.user_personas.map((persona, i) => (
                    <div
                      key={i}
                      className="bg-[#13161c] p-5 border border-gray-800 hover:border-gray-700 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-indigo-500/10 p-2 rounded-lg">
                          <Users size={18} className="text-indigo-400" />
                        </div>
                        <h4 className="font-bold text-white">{persona.role}</h4>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        "{persona.primary_need}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* ---------- TECH STACK ---------- */}
            <Section
              title="Technical Architecture"
              icon={<Layers className="text-emerald-400" size={20} />}
            >
              <div className="gap-6 grid">
                {/* High Level Arch */}
                <div className="relative bg-[#13161c] p-6 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="top-0 right-0 absolute opacity-10 p-4">
                    <GitBranch size={100} />
                  </div>
                  <h3 className="mb-1 font-semibold text-white">
                    System Pattern: {data.architecture_design.system_pattern}
                  </h3>
                  <p className="mb-4 text-gray-400 text-sm">
                    {data.architecture_design.data_flow_description}
                  </p>

                  <div className="flex items-center gap-2 bg-black/40 p-3 border border-gray-700 rounded-lg font-mono text-blue-300 text-xs">
                    <Terminal size={14} />
                    {data.architecture_design.diagram_reference}
                  </div>

                  <div className="gap-4 grid grid-cols-2 md:grid-cols-4 mt-6">
                    {data.architecture_design.infrastructure_and_devops && (
                      <TechBadge
                        label="CI/CD"
                        value={data.architecture_design.infrastructure_and_devops.ci_cd_pipeline}
                      />
                    )}
                    {data.architecture_design.infrastructure_and_devops && (
                      <TechBadge
                        label="Hosting"
                        value={data.architecture_design.infrastructure_and_devops.hosting_provider}
                      />
                    )}
                    {data.architecture_design.infrastructure_and_devops && (
                      <TechBadge
                        label="Monitoring"
                        value={
                          data.architecture_design.infrastructure_and_devops.monitoring_strategy
                        }
                      />
                    )}
                    <TechBadge label="Auth" value="JWT + RLS" />
                  </div>
                </div>

                {/* Tech Stack Cards */}
                <div className="gap-4 grid md:grid-cols-2">
                  {data.tech_stack.map((tech, i) => (
                    <div
                      key={i}
                      className="flex flex-col bg-[#13161c] p-5 border border-gray-800 rounded-xl h-full"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="font-mono text-gray-500 text-xs uppercase">
                            {tech.layer}
                          </span>
                          <h4 className="mt-1 font-bold text-white text-xl">{tech.technology}</h4>
                          <span className="inline-block bg-blue-500/10 mt-1 ml-0.5 px-2 py-0.5 rounded text-blue-400 text-xs">
                            {tech.variant}
                          </span>
                        </div>
                        <div
                          className={`h-2 w-2 rounded-full ${
                            tech.decision_factors.complexity_level === 'Low'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                          }`}
                        />
                      </div>

                      <div className="space-y-3 grow">
                        <div className="text-sm">
                          <span className="block mb-1 text-gray-500 text-xs uppercase">
                            Why Recommended
                          </span>
                          <p className="text-gray-300">{tech.why_recommended}</p>
                        </div>
                      </div>

                      <div className="gap-2 grid grid-cols-2 mt-5 pt-4 border-gray-800 border-t text-xs">
                        <div>
                          <span className="block mb-1 font-medium text-emerald-400">Pros</span>
                          <ul className="pl-3 text-gray-500 list-disc">
                            {tech.pros.slice(0, 2).map((p, idx) => (
                              <li key={idx}>{p}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="block mb-1 font-medium text-red-400">Cons</span>
                          <ul className="pl-3 text-gray-500 list-disc">
                            {tech.cons.slice(0, 2).map((p, idx) => (
                              <li key={idx}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* ---------- DATABASE ENTITIES ---------- */}
            <Section title="Data Model" icon={<Database className="text-purple-400" size={20} />}>
              <div className="gap-4 grid md:grid-cols-3">
                {data.architecture_design.key_entities.map((entity, i) => (
                  <div
                    key={i}
                    className="bg-[#13161c] border border-gray-800 rounded-xl overflow-hidden"
                  >
                    <div className="flex justify-between items-center bg-gray-800/40 p-3 border-gray-800 border-b">
                      <span className="font-mono font-bold text-white text-sm">{entity.name}</span>
                      <Database size={12} className="text-gray-500" />
                    </div>
                    <div className="space-y-3 p-4">
                      <ul className="space-y-1">
                        {entity.attributes.map((attr, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 font-mono text-gray-400 text-xs"
                          >
                            <div className="bg-purple-500 rounded-full w-1 h-1"></div>
                            {attr}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-2 border-gray-800/50 border-t">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                          Relationship
                        </p>
                        <p className="text-purple-300 text-xs">{entity.relationships}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* RIGHT COLUMN (1/3 width) - ACTIONABLE ITEMS */}
          <div className="space-y-8">
            {/* ---------- NEXT ACTIONS ---------- */}
            <div className="bg-linear-to-b from-[#13161c] to-[#0d0f12] shadow-lg p-6 border border-gray-800/80 rounded-2xl">
              <div className="flex items-center gap-2 mb-5 text-white">
                <Zap size={20} className="fill-yellow-400/20 text-yellow-400" />
                <h3 className="font-bold text-lg">Immediate Actions</h3>
              </div>
              <ul className="space-y-3">
                {data.next_actions.map((action, i) => (
                  <li
                    key={i}
                    className="group flex items-start gap-3 hover:bg-white/5 p-3 border border-transparent hover:border-gray-800 rounded-lg transition"
                  >
                    <div className="mt-1 border-2 border-gray-600 group-hover:border-yellow-500 rounded w-4 h-4 transition-colors cursor-pointer" />
                    <span className="text-gray-300 group-hover:text-white text-sm transition-colors">
                      {action}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---------- ROADMAP PHASES ---------- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2 px-1 text-white">
                <BookOpen size={20} className="text-blue-400" />
                <h3 className="font-bold text-lg">Roadmap</h3>
              </div>

              {data.roadmap.map((phase, i) => (
                <div
                  key={i}
                  className="bg-[#13161c] border border-gray-800 rounded-xl overflow-hidden"
                >
                  <div className="bg-gray-800/20 p-4 border-gray-800 border-b">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-white text-sm">{phase.title}</h4>
                      <span className="bg-gray-800 px-2 py-0.5 rounded font-mono text-[10px] text-gray-500">
                        {phase.estimated_duration}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{phase.intent}</p>
                  </div>
                  <div className="bg-[#0a0c10]/50 p-4">
                    <h5 className="mb-2 font-bold text-[10px] text-gray-500 uppercase">
                      Key Tasks
                    </h5>
                    <ul className="space-y-2">
                      {/* Filter tasks for this phase */}
                      {data.tasks
                        .filter(t => t.phase_id === phase.phase_id)
                        .map(task => (
                          <li
                            key={task.id}
                            className="flex items-start gap-2 text-gray-400 text-xs"
                          >
                            <ListTodo size={12} className="mt-0.5 text-blue-500 shrink-0" />
                            <span>{task.title}</span>
                          </li>
                        ))}
                      {data.tasks.filter(t => t.phase_id === phase.phase_id).length === 0 && (
                        <li className="text-gray-600 text-xs italic">No specific tasks defined</li>
                      )}
                    </ul>
                    <div className="mt-3 pt-3 border-gray-800/50 border-t">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs">
                        <CheckCircle2 size={12} />
                        <span>Gate: {phase.milestone_gate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ---------- RISKS ---------- */}
            <div className="bg-[#13161c] p-6 border border-red-900/20 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-red-500" />
                <h3 className="font-bold text-white">Risk Assessment</h3>
              </div>
              <div className="space-y-4">
                {data.metadata.risk_assessment.map((risk, i) => (
                  <div key={i} className="bg-red-500/5 p-3 border border-red-500/10 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-red-400 text-xs">{risk.risk}</span>
                      <span className="bg-red-500/20 px-1.5 py-0.5 rounded text-[10px] text-red-300 uppercase">
                        {risk.impact}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">
                      Mitigation: <span className="text-gray-400">{risk.mitigation}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* ---------------- UI HELPERS ---------------- */

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section>
    <div className="flex items-center gap-3 mb-5 pl-1">
      <div className="bg-[#1c2029] p-2 border border-gray-800 rounded-lg">{icon}</div>
      <h2 className="font-bold text-white text-xl tracking-wide">{title}</h2>
    </div>
    {children}
  </section>
);

const ActionButton = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-2 bg-[#13161c] hover:bg-[#1c2029] shadow-sm px-4 py-2 border border-gray-800 hover:border-gray-600 rounded-lg text-gray-400 hover:text-white text-sm transition-all duration-200">
    {icon} {label}
  </button>
);

const HealthCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 bg-[#13161c] p-4 border border-gray-800 hover:border-gray-700 rounded-xl transition duration-300">
    <div className="bg-[#0a0c10] p-2 border border-gray-800/50 rounded-lg">{icon}</div>
    <div>
      <p className="font-semibold text-[10px] text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="mt-0.5 font-bold text-white text-sm sm:text-base leading-tight">{value}</p>
    </div>
  </div>
);

const TechBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-[#0a0c10] px-3 py-2 border border-gray-800 rounded">
    <span className="block text-[10px] text-gray-500 uppercase">{label}</span>
    <span className="block font-medium text-gray-300 text-xs truncate">{value}</span>
  </div>
);
