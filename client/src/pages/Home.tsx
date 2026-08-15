/**
 * CRISISGRID — SIGNAL IN THE STORM
 * Design reminder: calm clarity, explainable decisions, map-like spatial language,
 * and emergency colour used only for life-safety risk.
 */
import { useEffect, useMemo, useState } from "react";
import "./Home.css";
import { Activity, AlertTriangle, ArrowUpRight, BatteryCharging, Check, ChevronRight, CloudRain, Crosshair, FileText, MapPinned, Menu, MessageSquareMore, Network, Radio, Route, Send, ShieldAlert, Signal, Siren, Users, WifiOff, X } from "lucide-react";

type Zone = {
  id: string; name: string; risk: "Critical" | "Elevated" | "Watch"; score: number;
  people: number; route: string; confidence: number; position: { left: string; top: string };
};

const zones: Zone[] = [
  { id: "z1", name: "Farakka East", risk: "Critical", score: 94, people: 128, route: "Route 04", confidence: 78, position: { left: "53%", top: "43%" } },
  { id: "z2", name: "Raghunathganj", risk: "Critical", score: 89, people: 76, route: "Route 07", confidence: 84, position: { left: "30%", top: "62%" } },
  { id: "z3", name: "Jangipur South", risk: "Elevated", score: 71, people: 42, route: "Route 04", confidence: 92, position: { left: "69%", top: "64%" } },
  { id: "z4", name: "Suti Corridor", risk: "Watch", score: 38, people: 18, route: "Route 11", confidence: 87, position: { left: "72%", top: "28%" } },
];

const feeds = [
  { source: "Community SMS", detail: "12 new reports", status: "LIVE", icon: MessageSquareMore },
  { source: "River gauge", detail: "2.8m and rising", status: "LIVE", icon: Activity },
  { source: "Road mesh", detail: "1 relay delayed", status: "PARTIAL", icon: Network },
];

const resourceBase = [
  { label: "Rescue boats", unit: "04", available: "3 ready", tone: "teal" },
  { label: "Medical teams", unit: "08", available: "6 ready", tone: "sand" },
  { label: "Supply kits", unit: "160", available: "124 ready", tone: "red" },
];

export default function Home() {
  const [selectedZone, setSelectedZone] = useState<Zone>(zones[0]);
  const [meshMode, setMeshMode] = useState(false);
  const [isDispatched, setIsDispatched] = useState(false);
  const [logMessage, setLogMessage] = useState("Decision model updated from 17 verified signals.");
  const [sosOpen, setSosOpen] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [queuedReports, setQueuedReports] = useState(0);

  useEffect(() => {
    const storedQueue = JSON.parse(window.localStorage.getItem("crisisgrid-sos-queue") || "[]") as unknown[];
    setQueuedReports(storedQueue.length);
  }, []);

  const activeResources = useMemo(() => resourceBase.map(resource => ({
    ...resource,
    available: isDispatched && resource.label === "Rescue boats" ? "2 ready" : resource.available,
  })), [isDispatched]);

  const dispatchResource = () => {
    setIsDispatched(true);
    setLogMessage(`Boat unit R-12 dispatched toward ${selectedZone.name} via ${selectedZone.route}.`);
  };
  const changeNetwork = () => {
    setMeshMode(current => !current);
    setLogMessage(!meshMode ? "Mesh fallback activated. Cached road graph and SMS relays are now preferred." : "Primary network restored. Live sensor feeds are being reconciled.");
  };
  const sendSos = () => {
    const storedQueue = JSON.parse(window.localStorage.getItem("crisisgrid-sos-queue") || "[]") as Array<Record<string, string>>;
    storedQueue.push({ id: crypto.randomUUID(), queuedAt: new Date().toISOString(), status: "awaiting-relay" });
    window.localStorage.setItem("crisisgrid-sos-queue", JSON.stringify(storedQueue));
    setQueuedReports(storedQueue.length);
    setSosSent(true);
    setLogMessage("New SOS receipt created from the low-connectivity reporting form.");
    window.setTimeout(() => { setSosOpen(false); setSosSent(false); }, 1600);
  };

  return (
    <div className="cg-shell">
      <header className="cg-topbar">
        <div className="cg-brand">
          <img src="/manus-storage/crisisgrid-relay-logo_5d5fc802.png" alt="CrisisGrid relay symbol" />
          <div><p className="cg-wordmark">CrisisGrid</p><p className="cg-brand-subtitle">response coordination layer</p></div>
        </div>
        <div className="cg-top-meta">
          <span><CloudRain size={14} /> MONSOON SIMULATION / 14 AUG 2026</span>
          <span className="cg-live"><i /> SYSTEM LIVE</span>
          <button className="cg-icon-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation"><Menu size={19} /></button>
        </div>
      </header>

      <div className="cg-frame">
        <aside className={`cg-rail ${mobileOpen ? "is-open" : ""}`}>
          <div className="cg-incident-stamp"><span>INCIDENT</span><strong>FLOOD / 07</strong><small>West Bengal, India<br />23.39° N / 88.07° E</small></div>
          <nav className="cg-nav" aria-label="CrisisGrid workspace">
            <button className="active"><Crosshair size={18} /><span>Situation board</span><em>01</em></button>
            <button><MapPinned size={18} /><span>Field map</span><em>04</em></button>
            <button><Users size={18} /><span>Resource ledger</span><em>12</em></button>
            <button><Radio size={18} /><span>Communications</span><em>03</em></button>
          </nav>
          <div className="cg-rail-footer">
            <span className="cg-mono-label">NETWORK PATH</span>
            <button className={`cg-network-toggle ${meshMode ? "mesh" : ""}`} onClick={changeNetwork}>
              {meshMode ? <WifiOff size={17} /> : <Signal size={17} />}<span>{meshMode ? "MESH FALLBACK" : "PRIMARY UPLINK"}</span><i />
            </button>
            <p>{meshMode ? "40% infrastructure loss simulated. Local cache is active." : "94% feed integrity across verified sources."}</p>
            <p className="cg-queue-count">{queuedReports} SOS receipt{queuedReports === 1 ? "" : "s"} stored locally</p>
          </div>
        </aside>

        <main className="cg-main">
          <section className="cg-mission-line">
            <div><p className="cg-eyebrow">LIVE DECISION WINDOW <span>•</span> 06:45–07:15 IST</p><h1>Decide with what you know.<br /><em>Protect where it matters.</em></h1></div>
            <div className="cg-command-actions"><button className="cg-secondary-button" onClick={() => setSosOpen(true)}><Siren size={16} /> Log SOS</button><button className="cg-primary-button" onClick={dispatchResource}>{isDispatched ? <Check size={16} /> : <Send size={16} />}{isDispatched ? "Unit assigned" : "Approve dispatch"}</button></div>
          </section>

          <section className="cg-overview-grid">
            <article className="cg-map-card">
              <div className="cg-card-heading cg-map-heading"><div><span className="cg-mono-label">TERRITORY PLANE / UPDATED 06:54</span><h2>Flood impact & accessible corridors</h2></div><button className="cg-layer-button"><MapPinned size={15} /> Risk layer <ChevronRight size={14} /></button></div>
              <div className="cg-territory" style={{ backgroundImage: "url('/manus-storage/crisisgrid-terrain-hero_85a9d9ca.jpg')" }}>
                <div className="cg-river river-a" /><div className="cg-river river-b" />
                <svg className="cg-route-svg" viewBox="0 0 800 420" preserveAspectRatio="none" aria-hidden="true"><path d="M 78 318 C 170 268, 210 306, 305 218 S 490 144, 588 220 S 708 255, 754 130" /><path className="alternate" d="M 85 120 C 175 178, 270 120, 345 188 S 516 312, 690 280" /></svg>
                <div className="cg-map-key"><span><i className="critical" /> critical</span><span><i className="elevated" /> elevated</span><span><i className="route" /> viable route</span></div>
                {zones.map(zone => <button key={zone.id} className={`cg-zone-dot ${zone.risk.toLowerCase()} ${selectedZone.id === zone.id ? "selected" : ""}`} style={zone.position} onClick={() => { setSelectedZone(zone); setLogMessage(`${zone.name} selected. Priority model recalculated from local signals.`); }} aria-label={`Inspect ${zone.name}, ${zone.risk} risk`}><span>{zone.score}</span><small>{zone.name}</small></button>)}
                <div className="cg-map-legend">DATA: gauge + SMS + aerial relay + cached road graph</div>
              </div>
              <div className="cg-map-footer"><div><span>ROUTE 04 / ARAMBAG BYPASS</span><strong><Route size={15} /> OPEN WITH CONSTRAINTS</strong></div><div><span>ROUTE CONFIDENCE</span><strong>{meshMode ? "68%" : "78%"}</strong></div><button onClick={() => setLogMessage("Route 04 inspected. Bridge payload limit and water-depth constraints are available in the decision receipt.")}>Inspect receipt <ArrowUpRight size={15} /></button></div>
            </article>

            <div className="cg-side-stack">
              <article className="cg-decision-card">
                <div className="cg-card-heading"><div><span className="cg-mono-label">PRIORITY RECEIPT / 01</span><h2>Why this dispatch?</h2></div><ShieldAlert size={20} /></div>
                <div className="cg-decision-target"><div className="cg-priority-number">{selectedZone.score}</div><div><strong>{selectedZone.name}</strong><p>{selectedZone.people} people potentially isolated</p></div></div>
                <div className="cg-receipt-lines"><p><span>Life-safety exposure</span><strong>+36</strong></p><p><span>Water rise velocity</span><strong>+24</strong></p><p><span>Route accessibility</span><strong>+18</strong></p><p><span>Report reliability</span><strong>+16</strong></p></div>
                <div className="cg-confidence"><span>MODEL CONFIDENCE</span><div><i style={{ width: `${selectedZone.confidence}%` }} /></div><strong>{selectedZone.confidence}%</strong></div>
                <p className="cg-human-note"><AlertTriangle size={14} /> Human confirmation required before crossing water depth threshold.</p>
              </article>
              <article className="cg-log-card"><div className="cg-log-icon"><Radio size={18} /></div><div><span className="cg-mono-label">DECISION LOG</span><p>{logMessage}</p></div></article>
            </div>
          </section>

          <section className="cg-bottom-grid">
            <article className="cg-resources-card"><div className="cg-card-heading"><div><span className="cg-mono-label">RESOURCE LEDGER</span><h2>Deployable capacity</h2></div><button className="cg-text-button">Full ledger <ChevronRight size={15} /></button></div><div className="cg-resource-list">{activeResources.map((resource, index) => <div className="cg-resource-item" key={resource.label}><span className={`cg-resource-mark ${resource.tone}`}>{index === 0 ? <Route size={18} /> : index === 1 ? <BatteryCharging size={18} /> : <Activity size={18} />}</span><div><strong>{resource.label}</strong><p>{resource.available}</p></div><b>{resource.unit}</b></div>)}</div></article>
            <article className="cg-feed-card"><div className="cg-card-heading"><div><span className="cg-mono-label">SIGNAL INTEGRITY</span><h2>Field feeds</h2></div><span className="cg-timestamp">06:54:32</span></div><div className="cg-feed-list">{feeds.map(feed => { const Icon = feed.icon; return <div className="cg-feed" key={feed.source}><span className="cg-feed-icon"><Icon size={17} /></span><div><strong>{feed.source}</strong><p>{feed.detail}</p></div><em className={feed.status.toLowerCase()}>{feed.status}</em></div>; })}</div></article>
            <article className="cg-evidence-card"><div className="cg-evidence-image" style={{ backgroundImage: "url('/manus-storage/crisisgrid-response-scene_515b3dcb.jpg')" }} /><div className="cg-evidence-content"><span className="cg-mono-label">FIELD NOTE / 06:51</span><h3>Command is stronger when the field can still speak.</h3><p>CrisisGrid accepts structured SOS reports through low-bandwidth relay forms when conventional service is disrupted.</p><button onClick={() => setSosOpen(true)}>Open reporting relay <ArrowUpRight size={15} /></button></div></article>
          </section>

          <section className="cg-method-strip"><div><FileText size={19} /><span><strong>Built for the STAMPERS Open Innovation track.</strong> Simulated data is clearly marked, every allocation is explainable, and fallback logic is observable.</span></div><button onClick={() => setLogMessage("Submission mode: the full scenario, architecture, demo flow, and data disclaimers are documented in the repository.")}>View project notes <ChevronRight size={15} /></button></section>
        </main>
      </div>

      {sosOpen && <div className="cg-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="sos-title"><div className="cg-sos-modal"><button className="cg-close" onClick={() => setSosOpen(false)} aria-label="Close SOS form"><X size={18} /></button><span className="cg-mono-label">LOW-CONNECTIVITY REPORTING RELAY</span><h2 id="sos-title">Log a field SOS</h2><p>This prototype queues the report locally, then sends it through the preferred available path.</p><label>Location / landmark<input defaultValue="Farakka East / sector 3" /></label><label>Immediate need<select defaultValue="Evacuation"><option>Evacuation</option><option>Medical assistance</option><option>Food and water</option><option>Infrastructure report</option></select></label><label>People affected<input defaultValue="4" type="number" min="1" /></label><button className="cg-primary-button modal-submit" onClick={sendSos}>{sosSent ? <><Check size={16} /> Receipt queued</> : <><Send size={16} /> Queue SOS receipt</>}</button></div></div>}
    </div>
  );
}
