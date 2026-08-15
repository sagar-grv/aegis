import { useMemo, useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import "./Home.css";
import { Activity, ArrowRight, BookOpenCheck, BrainCircuit, ChevronRight, CircleHelp, Compass, Lightbulb, LoaderCircle, LogOut, Menu, PencilLine, ShieldCheck, Sparkles, Target, Users, X } from "lucide-react";

type Workspace = "learn" | "teach";

const emptyForm = { topic: "", prompt: "", learnerAnswer: "", selfConfidence: 50 };

function formatDate(value: Date | string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace>("learn");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [notice, setNotice] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const isTeacher = user?.role === "admin" || user?.role === "analyst";
  const learnerQuery = trpc.learning.mine.useQuery(undefined, { enabled: isAuthenticated });
  const teacherQuery = trpc.learning.teacherAnalytics.useQuery(undefined, { enabled: Boolean(isAuthenticated && isTeacher && workspace === "teach") });
  const submit = trpc.learning.submit.useMutation({
    onSuccess: async () => {
      setForm(emptyForm);
      setNotice("Your learning path has been updated from this response.");
      await utils.learning.mine.invalidate();
      await utils.learning.teacherAnalytics.invalidate();
    },
  });

  const latest = learnerQuery.data?.attempts?.[0];
  const paths = learnerQuery.data?.paths ?? [];
  const nextPath = paths[0];
  const learningState = useMemo(() => {
    if (!paths.length) return { label: "Starting point", detail: "Submit your own response to create the first learning thread." };
    const active = paths.filter(path => path.status === "active").length;
    return { label: active ? `${active} active thread${active === 1 ? "" : "s"}` : "Review ready", detail: "Your path is derived only from your submitted work." };
  }, [paths]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setNotice(null);
    submit.mutate(form);
  };

  return (
    <div className="il-shell" style={{ backgroundImage: "url('/manus-storage/insightloop-paper-texture_d1219bb7.jpg')" }}>
      <header className="il-topbar">
        <div className="il-brand"><img src="/manus-storage/insightloop-thread-mark_0298194b.png" alt="InsightLoop thread mark" /><div><strong>InsightLoop</strong><span>misconception-first learning</span></div></div>
        <div className="il-top-actions">
          <span className="il-data-note"><i /> PRIVATE LEARNER DATA</span>
          {user ? <div className="il-user"><span>{user.name?.split(" ")[0] || "Learner"}</span><button onClick={() => logout()} aria-label="Sign out"><LogOut size={16} /></button></div> : <button className="il-login" onClick={() => startLogin()}>Sign in <ArrowRight size={15} /></button>}
          <button className="il-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </header>

      <div className="il-layout">
        <aside className={`il-rail ${mobileOpen ? "open" : ""}`}>
          <div className="il-rail-intro"><span className="il-mono">YOUR STUDIO</span><strong>{isAuthenticated ? learningState.label : "Think in public. Learn in private."}</strong><p>{isAuthenticated ? learningState.detail : "InsightLoop listens for the reasoning behind an answer—not just whether it was right."}</p></div>
          <nav className="il-nav" aria-label="InsightLoop workspace">
            <button className={workspace === "learn" ? "active" : ""} onClick={() => { setWorkspace("learn"); setMobileOpen(false); }}><PencilLine size={18} /><span>Learning studio</span><em>01</em></button>
            {isTeacher && <button className={workspace === "teach" ? "active" : ""} onClick={() => { setWorkspace("teach"); setMobileOpen(false); }}><Users size={18} /><span>Teacher lens</span><em>02</em></button>}
          </nav>
          <div className="il-safety-card"><ShieldCheck size={18} /><p><strong>Human-centred AI</strong>Feedback is a learning prompt, not a diagnosis or a grade.</p></div>
          <div className="il-rail-bottom"><span className="il-mono">HOW IT ADAPTS</span><p>Response → reasoning signal → targeted probe → updated path.</p></div>
        </aside>

        <main className="il-main">
          {!isAuthenticated ? <PublicStart /> : workspace === "teach" && isTeacher ? <TeacherLens data={teacherQuery.data} loading={teacherQuery.isLoading} /> : <LearningStudio
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            pending={submit.isPending}
            error={submit.error?.message}
            notice={notice}
            latest={latest}
            paths={paths}
            nextPath={nextPath}
          />}
        </main>
      </div>
    </div>
  );
}

function PublicStart() {
  return <>
    <section className="il-hero" style={{ backgroundImage: "linear-gradient(90deg, rgba(19,22,52,.95) 0%, rgba(19,22,52,.81) 42%, rgba(19,22,52,.18) 100%), url('/manus-storage/insightloop-learning-hero_d82e4561.jpg')" }}>
      <div className="il-hero-copy"><span className="il-mono">STAMPERS TRACK 04 / ADAPTIVE LEARNING</span><h1>Don’t just mark the answer.<br /><em>Find the thought behind it.</em></h1><p>InsightLoop turns a learner’s real written answer into an explainable misconception signal, a focused next question, and a living learning path.</p><button className="il-cta" onClick={() => startLogin()}>Open your learning studio <ArrowRight size={17} /></button></div>
      <div className="il-hero-stamp"><BrainCircuit size={24} /><span>NO SAMPLE PROGRESS</span><strong>Your path begins with your own response.</strong></div>
    </section>
    <section className="il-public-grid"><article><span>01</span><h2>Surface the misconception</h2><p>Analyses the method and reasoning in the learner’s own response, not simply right or wrong.</p></article><article><span>02</span><h2>Test the right next thing</h2><p>Creates one targeted probe designed to distinguish a fragile idea from a genuine understanding.</p></article><article><span>03</span><h2>Make growth legible</h2><p>Builds a private topic path that learners can revisit and teachers can review with permissioned access.</p></article></section>
  </>;
}

function LearningStudio({ form, setForm, onSubmit, pending, error, notice, latest, paths, nextPath }: {
  form: typeof emptyForm; setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>; onSubmit: (event: React.FormEvent) => void; pending: boolean; error?: string; notice: string | null; latest: any; paths: any[]; nextPath: any;
}) {
  const diagnosis = latest?.diagnosis as any | undefined;
  return <>
    <section className="il-studio-head"><div><span className="il-mono">LEARNING STUDIO / YOUR REAL WORK</span><h1>Show your reasoning.<br /><em>We’ll find the next foothold.</em></h1></div><div className="il-process-key"><span><i /> your response</span><span><i /> AI diagnosis</span><span><i /> next probe</span></div></section>
    <section className="il-studio-grid">
      <article className="il-submit-card"><div className="il-card-heading"><div><span className="il-mono">NEW RESPONSE</span><h2>What are you working on?</h2></div><PencilLine size={20} /></div><form onSubmit={onSubmit}>
        <label>Topic<input value={form.topic} onChange={e => setForm(current => ({ ...current, topic: e.target.value }))} placeholder="e.g., Algebra — simplifying expressions" required maxLength={160} /></label>
        <label>Question or task<textarea value={form.prompt} onChange={e => setForm(current => ({ ...current, prompt: e.target.value }))} placeholder="Paste the exact question you are trying to solve." required minLength={8} maxLength={2000} /></label>
        <label>Your reasoning or answer<textarea className="il-answer" value={form.learnerAnswer} onChange={e => setForm(current => ({ ...current, learnerAnswer: e.target.value }))} placeholder="Write how you approached it. Partial work is useful." required minLength={8} maxLength={5000} /></label>
        <div className="il-confidence"><div><span>Your confidence</span><strong>{form.selfConfidence}%</strong></div><input type="range" min="0" max="100" value={form.selfConfidence} onChange={e => setForm(current => ({ ...current, selfConfidence: Number(e.target.value) }))} /><div><span>Guessing</span><span>Very sure</span></div></div>
        <button className="il-submit" disabled={pending}>{pending ? <><LoaderCircle size={17} className="spin" /> Reading your reasoning…</> : <><Sparkles size={17} /> Generate my next learning step</>}</button>
        <p className="il-form-note"><ShieldCheck size={14} /> Your submission is stored in your private learning record. It is not used to train the model.</p>
      </form></article>
      <article className="il-diagnosis-card"><div className="il-card-heading"><div><span className="il-mono">LATEST INSIGHT</span><h2>{diagnosis ? "A reading of your reasoning" : "Waiting for your first response"}</h2></div><Lightbulb size={20} /></div>{diagnosis ? <><div className="il-mastery"><div className="il-ring" style={{ "--score": `${diagnosis.masteryEstimate * 3.6}deg` } as React.CSSProperties}><strong>{diagnosis.masteryEstimate}</strong><span>mastery</span></div><div><span className="il-mono">LIKELY MISCONCEPTION</span><h3>{diagnosis.misconceptionLabel}</h3><p>{diagnosis.misconceptionExplanation}</p></div></div><div className="il-feedback"><span className="il-mono">FEEDBACK</span><p>{diagnosis.feedback}</p></div><div className="il-confidence-band"><span>Model confidence</span><div><i style={{ width: `${diagnosis.confidence}%` }} /></div><strong>{diagnosis.confidence}%</strong></div></> : <div className="il-empty-insight"><Compass size={28} /><p>There is no fabricated profile here. Submit an actual answer and InsightLoop will create a first, reviewable insight.</p></div>}</article>
    </section>
    <section className="il-path-grid"><article className="il-next-card"><div className="il-card-heading"><div><span className="il-mono">NEXT ADAPTIVE PROBE</span><h2>{nextPath ? "Follow the thread" : "Your next question will appear here"}</h2></div><Target size={19} /></div>{nextPath ? <><div className="il-path-tag">{nextPath.targetSkill}</div><p className="il-next-question">“{nextPath.nextPrompt}”</p><div className="il-path-meta"><span>{nextPath.misconceptionLabel}</span><span className={`il-status ${nextPath.status}`}>{nextPath.status.replaceAll("_", " ")}</span></div></> : <p className="il-empty-copy">This space becomes useful after a learner shares real reasoning.</p>}</article><article className="il-history-card"><div className="il-card-heading"><div><span className="il-mono">YOUR LEARNING PATHS</span><h2>Topics with a next step</h2></div><BookOpenCheck size={19} /></div>{paths.length ? <div className="il-path-list">{paths.map(path => <div className="il-path-row" key={path.id}><span className="il-path-score">{path.masteryEstimate}</span><div><strong>{path.topic}</strong><p>{path.targetSkill}</p></div><ChevronRight size={17} /></div>)}</div> : <div className="il-empty-copy">Your progress will appear as a set of focused threads, not an arbitrary scorecard.</div>}</article></section>
    {notice && <div className="il-toast"><ShieldCheck size={16} /> {notice}</div>}{error && <div className="il-error"><CircleHelp size={16} /> {error}</div>}
  </>;
}

function TeacherLens({ data, loading }: { data: any; loading: boolean }) {
  const statuses = data?.activePaths ?? [];
  return <><section className="il-studio-head teacher"><div><span className="il-mono">TEACHER LENS / CONSENTED CLASS SIGNALS</span><h1>See the patterns.<br /><em>Keep the learner human.</em></h1><p>Only authenticated submissions in this workspace appear here. There is no seeded class data.</p></div></section><section className="il-teacher-metrics"><Metric label="Learner submissions" value={loading ? "—" : data?.summary.submissions ?? 0} icon={PencilLine} /><Metric label="Active learners" value={loading ? "—" : data?.summary.learners ?? 0} icon={Users} /><Metric label="Adaptive paths" value={loading ? "—" : statuses.reduce((sum: number, item: any) => sum + Number(item.total), 0)} icon={Activity} /></section><section className="il-teacher-grid"><article><div className="il-card-heading"><div><span className="il-mono">TOPIC SIGNALS</span><h2>Where learners are asking for help</h2></div><BookOpenCheck size={20} /></div>{data?.topicRows?.length ? <div className="il-topic-list">{data.topicRows.map((row: any, index: number) => <div key={row.topic}><span>{String(index + 1).padStart(2, "0")}</span><strong>{row.topic}</strong><em>{row.submissions} submission{Number(row.submissions) === 1 ? "" : "s"}</em></div>)}</div> : <div className="il-empty-insight"><Compass size={26} /><p>Analytics will appear after real learner submissions arrive. InsightLoop does not invent a class profile.</p></div>}</article><article><div className="il-card-heading"><div><span className="il-mono">PATH HEALTH</span><h2>What the learner paths need</h2></div><BrainCircuit size={20} /></div>{statuses.length ? <div className="il-status-list">{statuses.map((item: any) => <div key={item.status}><span className={`il-status ${item.status}`}>{item.status.replaceAll("_", " ")}</span><strong>{item.total}</strong></div>)}</div> : <div className="il-empty-copy">No active paths yet. Once learners submit work, this view will surface aggregated progress states.</div>}</article></section></>;
}

function Metric({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) { return <article className="il-metric"><span><Icon size={18} /></span><div><strong>{value}</strong><p>{label}</p></div></article>; }
