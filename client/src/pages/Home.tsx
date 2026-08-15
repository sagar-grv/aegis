/**
 * VEILTRACE — EVIDENCE UNDER GLASS
 * Design reminder: every fraud alert is an inspectable claim; network evidence,
 * uncertainty, and false-positive protection must remain visible at every step.
 */
import { useMemo, useState } from "react";
import "./Home.css";
import { Activity, AlertTriangle, ArrowUpRight, BadgeCheck, Binary, Check, ChevronRight, CircleDollarSign, Eye, FileText, Fingerprint, GitBranch, Layers3, Menu, Network, PanelRight, Pause, Play, Radio, ScanSearch, ShieldCheck, ShieldQuestion, Sparkles, Target, TimerReset, UserCheck, X } from "lucide-react";

type CaseMode = "latent" | "unmasked" | "cleared";

const events = [
  { time: "09:42:06", from: "A-117", to: "M-9C", amount: "₹4,940", tag: "normal-looking" },
  { time: "09:42:51", from: "A-204", to: "M-9C", amount: "₹5,020", tag: "device shared" },
  { time: "09:43:17", from: "A-381", to: "M-9C", amount: "₹4,880", tag: "timing match" },
  { time: "09:43:39", from: "A-117", to: "B-711", amount: "₹4,810", tag: "beneficiary hop" },
];

const evidence = [
  { id: "01", title: "Device relay", copy: "3 accounts authenticate through one device fingerprint across 11 minutes.", strength: "High", icon: Fingerprint },
  { id: "02", title: "Beneficiary convergence", copy: "Funds fragment, then reassemble across a previously unrelated account path.", strength: "High", icon: GitBranch },
  { id: "03", title: "Timing heartbeat", copy: "The transactions repeat at a 41-second cadence outside each user’s normal rhythm.", strength: "Medium", icon: TimerReset },
  { id: "04", title: "Individual normality", copy: "Each payment amount sits inside the expected personal range.", strength: "Counter", icon: ShieldQuestion },
];

const nodeClass: Record<CaseMode, string> = { latent: "latent", unmasked: "unmasked", cleared: "cleared" };

export default function Home() {
  const [mode, setMode] = useState<CaseMode>("latent");
  const [selected, setSelected] = useState("M-9C");
  const [streaming, setStreaming] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const score = mode === "latent" ? 41 : mode === "unmasked" ? 93 : 58;
  const action = mode === "latent" ? "Monitor" : mode === "unmasked" ? "Hold & review" : "Allow with watch";
  const narrative = mode === "latent"
    ? "Transactions remain individually ordinary. Relationship correlation has not yet been expanded."
    : mode === "unmasked"
      ? "A coordinated mule network is visible. The relationship pattern—not payment size—drives the alert."
      : "Verified employment linkage explains the shared device. Two network factors remain under observation.";
  const riskLabel = mode === "latent" ? "LOW VISIBILITY" : mode === "unmasked" ? "COORDINATED RING" : "REVIEW ADJUSTED";
  const decisionCopy = mode === "latent" ? "Expand relationship evidence" : mode === "unmasked" ? "Place a temporary review hold" : "Continue with enhanced monitoring";

  const benefit = useMemo(() => mode === "unmasked" ? "11 related payments protected" : mode === "cleared" ? "False-positive friction reduced" : "Awaiting relationship check", [mode]);

  return (
    <div className={`vt-shell vt-${mode}`}>
      <header className="vt-topbar">
        <div className="vt-brand"><img src="https://files.manuscdn.com/user_upload_by_module/session_file/91236325/MsANkwECuIgQsDwP.png" alt="VeilTrace split fingerprint mark" /><div><strong>VeilTrace</strong><span>network intelligence</span></div></div>
        <div className="vt-top-meta"><span><Radio size={14} /> SANDBOX STREAM / 09:44:12 IST</span><span className="vt-live"><i /> {streaming ? "ANALYSING" : "STREAM PAUSED"}</span><button className="vt-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle case controls"><Menu size={18} /></button></div>
      </header>

      <div className="vt-frame">
        <aside className={`vt-rail ${mobileOpen ? "is-open" : ""}`}>
          <div className="vt-case-id"><span>ACTIVE CASE</span><strong>VT–2026–041</strong><small>Payment cluster / review queue</small></div>
          <div className="vt-rail-block"><span className="vt-mono">CASE STATUS</span><div className={`vt-status ${mode}`}><i /> {riskLabel}</div><p>{mode === "latent" ? "Signals are individually weak." : mode === "unmasked" ? "Review required within 6 minutes." : "Customer harm protected by counter-evidence."}</p></div>
          <nav className="vt-nav" aria-label="VeilTrace investigation views"><button className="active"><ScanSearch size={18} /> Case table <em>01</em></button><button><Network size={18} /> Relationship graph <em>08</em></button><button><Layers3 size={18} /> Evidence ledger <em>04</em></button><button><PanelRight size={18} /> Review queue <em>12</em></button></nav>
          <div className="vt-rail-bottom"><span className="vt-mono">MODEL POSTURE</span><div><ShieldCheck size={18} /><p><strong>Human review first</strong>Automated scoring recommends; analysts decide.</p></div></div>
        </aside>

        <main className="vt-main">
          <section className="vt-hero" style={{ backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/91236325/kGZMGsWyjyqXwOFH.jpg')" }}>
            <div className="vt-hero-copy"><p className="vt-mono">TRACK 05 / REAL-TIME FINANCIAL FRAUD & RISK INTELLIGENCE</p><h1>The transaction looked normal.<br /><em>The network did not.</em></h1><p>VeilTrace detects coordinated fraud that imitates legitimate customer behaviour, then shows exactly why the pattern deserves review.</p></div>
            <div className="vt-hero-actions"><button className="vt-secondary" onClick={() => setStreaming(!streaming)}>{streaming ? <Pause size={15} /> : <Play size={15} />}{streaming ? "Pause stream" : "Resume stream"}</button><button className="vt-primary" onClick={() => setMode("unmasked")}><Eye size={15} /> Unmask pattern</button></div>
          </section>

          <section className="vt-case-bar">
            <div><span className="vt-mono">CASE QUESTION</span><strong>Is M-9C a legitimate merchant path—or the convergence point for a coordinated mule ring?</strong></div>
            <div className="vt-case-bars"><span><i className="normal" /> individually normal</span><span><i className="risk" /> collectively abnormal</span></div>
          </section>

          <section className="vt-workbench">
            <article className="vt-evidence-panel">
              <div className="vt-panel-heading"><div><span className="vt-mono">EVIDENCE LEDGER</span><h2>What raised suspicion?</h2></div><span className="vt-count">04</span></div>
              <div className="vt-evidence-list">{evidence.map(item => { const Icon = item.icon; return <button className={`vt-evidence ${item.strength.toLowerCase()}`} key={item.id} onClick={() => setSelected(item.id === "04" ? "A-204" : "M-9C")}><span className="vt-evidence-id">{item.id}</span><Icon size={17} /><div><strong>{item.title}</strong><p>{item.copy}</p></div><em>{item.strength}</em></button>; })}</div>
              <div className="vt-analyst-note"><Sparkles size={15} /><p><strong>Novel signal:</strong> the **Camouflage Index** detects where personal normality masks network abnormality.</p></div>
            </article>

            <article className="vt-graph-panel">
              <div className="vt-panel-heading"><div><span className="vt-mono">RELATIONSHIP GRAPH / 11-MINUTE WINDOW</span><h2>Coordinated pattern inference</h2></div><button className="vt-link-button" onClick={() => setMode(mode === "latent" ? "unmasked" : "latent")}>{mode === "latent" ? "Expand 2-hop graph" : "Collapse graph"} <ChevronRight size={15} /></button></div>
              <div className="vt-graph-stage">
                <svg className="vt-network" viewBox="0 0 720 405" role="img" aria-label="Interactive account relationship network">
                  <defs><filter id="soft"><feGaussianBlur stdDeviation="2" /></filter></defs>
                  <path className="vt-edge base" d="M130 155 C210 180 270 188 360 203" /><path className="vt-edge base" d="M160 295 C235 260 290 235 360 203" /><path className="vt-edge base" d="M260 90 C300 132 335 170 360 203" /><path className="vt-edge base" d="M360 203 C450 185 505 150 582 113" /><path className="vt-edge base" d="M360 203 C440 244 505 282 595 312" />
                  <path className="vt-edge ring" d="M130 155 C190 52 320 38 418 102 C510 162 524 286 410 334 C290 384 162 330 160 295" /><path className="vt-edge hop" d="M582 113 C645 170 655 252 595 312" />
                  <circle className="vt-halo" cx="360" cy="203" r="84" filter="url(#soft)" />
                </svg>
                <button className={`vt-node n1 ${selected === "A-117" ? "selected" : ""}`} onClick={() => setSelected("A-117")}><span>A–117</span><small>personal</small></button>
                <button className={`vt-node n2 ${selected === "A-204" ? "selected" : ""}`} onClick={() => setSelected("A-204")}><span>A–204</span><small>personal</small></button>
                <button className={`vt-node n3 ${selected === "A-381" ? "selected" : ""}`} onClick={() => setSelected("A-381")}><span>A–381</span><small>personal</small></button>
                <button className={`vt-node core ${nodeClass[mode]} ${selected === "M-9C" ? "selected" : ""}`} onClick={() => setSelected("M-9C")}><span>M–9C</span><small>convergence</small></button>
                <button className={`vt-node n4 ${selected === "B-711" ? "selected" : ""}`} onClick={() => setSelected("B-711")}><span>B–711</span><small>beneficiary</small></button>
                <button className="vt-node n5"><span>D–44</span><small>shared device</small></button>
                <div className="vt-graph-guide"><span><i className="vt-dot account" /> account</span><span><i className="vt-dot relation" /> relationship path</span><span><i className="vt-dot suspicious" /> coordinated ring</span></div>
                <div className="vt-focus-tag">FOCUS: {selected} <span>•</span> {mode === "unmasked" ? "RING REVEALED" : "PENDING CORRELATION"}</div>
              </div>
              <div className="vt-graph-footer"><div><span className="vt-mono">BEHAVIOURAL CAMOUFLAGE</span><strong>{mode === "latent" ? "18 / 100" : mode === "unmasked" ? "91 / 100" : "44 / 100"}</strong><p>How safely the network hides behind legitimate-looking events.</p></div><div className="vt-mini-bars"><i /><i /><i /><i /><i /></div><button onClick={() => setMode("unmasked")}>Reveal basis <ArrowUpRight size={15} /></button></div>
            </article>

            <article className="vt-receipt-panel">
              <div className="vt-panel-heading"><div><span className="vt-mono">DECISION RECEIPT</span><h2>Reviewable risk, not a black box</h2></div><AlertTriangle size={19} /></div>
              <div className="vt-score-row"><div className={`vt-score ${mode}`}><strong>{score}</strong><span>/100</span></div><div><span className="vt-mono">RECOMMENDED ACTION</span><h3>{action}</h3><p>{narrative}</p></div></div>
              <div className="vt-risk-measures"><div><span>Individual normality</span><strong>15</strong><i><b style={{ width: "15%" }} /></i></div><div><span>Network abnormality</span><strong>{mode === "latent" ? "24" : mode === "unmasked" ? "95" : "54"}</strong><i><b style={{ width: `${mode === "latent" ? 24 : mode === "unmasked" ? 95 : 54}%` }} /></i></div><div><span>False-positive guard</span><strong>{mode === "cleared" ? "88" : "62"}</strong><i><b className="guard" style={{ width: `${mode === "cleared" ? 88 : 62}%` }} /></i></div></div>
              <div className="vt-counterfactual"><span className="vt-mono">COUNTERFACTUAL</span><p>{mode === "cleared" ? "Verified payroll identity reduced the device-reuse signal; keep the beneficiary path under watch." : "A verified employment or household relationship between A–204 and A–381 would reduce the device-relay contribution."}</p><button onClick={() => setMode("cleared")}><UserCheck size={15} /> Add verified KYC evidence</button></div>
              <div className="vt-receipt-bottom"><div><ShieldCheck size={16} /><span><strong>Analyst approval required</strong>for a hold or customer-impacting action.</span></div><button className="vt-primary" onClick={() => setMode("unmasked")}>{mode === "unmasked" ? <Check size={15} /> : <Target size={15} />}{decisionCopy}</button></div>
            </article>
          </section>

          <section className="vt-bottom-row">
            <article className="vt-stream-panel"><div className="vt-panel-heading"><div><span className="vt-mono">LIVE TRANSACTION STREAM</span><h2>Events that look ordinary</h2></div><span className="vt-stream-pulse"><i /> {streaming ? "LIVE" : "HELD"}</span></div><div className="vt-events">{events.map((event, index) => <div className="vt-event" key={event.time}><span>{event.time}</span><strong>{event.from} <ArrowUpRight size={11} /> {event.to}</strong><b>{event.amount}</b><em className={index > 0 ? "flagged" : ""}>{event.tag}</em></div>)}</div></article>
            <article className="vt-case-photo"><div className="vt-photo" style={{ backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/91236325/BNYFankkAxrvptWW.jpg')" }} /><div><span className="vt-mono">WHY IT MATTERS</span><h3>Catch the ring. Spare the legitimate customer.</h3><p>VeilTrace surfaces the evidence behind suspicion and the counter-evidence that lowers friction.</p><span className="vt-benefit"><BadgeCheck size={15} /> {benefit}</span></div></article>
          </section>

          <section className="vt-ethics"><Binary size={18} /><p><strong>Prototype safeguard:</strong> all payments, identities, scores, and network relationships are simulated. VeilTrace recommends investigation; it never determines guilt.</p><button><FileText size={15} /> Evidence protocol <ChevronRight size={15} /></button></section>
        </main>
      </div>
    </div>
  );
}
