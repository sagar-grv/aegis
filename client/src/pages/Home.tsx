/**
 * AEGIS — THE DECISION REFUSAL ENGINE
 * Design premise: uncertainty is not decoration. Evidence, confidence, abstention,
 * and human accountability must be legible in the same visual field.
 */
import { useMemo, useState, type ChangeEvent } from "react";
import { trpc } from "@/lib/trpc";
import "./Home.css";
import { Activity, AlertTriangle, ArrowRight, BadgeCheck, BrainCircuit, Camera, Check, ChevronRight, CloudRain, EyeOff, FileCheck2, Gauge, MapPin, Menu, MessageSquareText, RefreshCw, ScanLine, ShieldAlert, ShieldCheck, SlidersHorizontal, Sparkles, ThermometerSun, TriangleAlert, UserRoundCheck, Wind, X, Zap } from "lucide-react";

type SourceId = "weather" | "rain" | "air" | "field";
type Site = { label: string; latitude: number; longitude: number };

const sites: Site[] = [
  { label: "Bengaluru — Cubbon Park", latitude: 12.9716, longitude: 77.5946 },
  { label: "New Delhi — India Gate", latitude: 28.6129, longitude: 77.2295 },
  { label: "Mumbai — Oval Maidan", latitude: 18.9388, longitude: 72.8354 },
  { label: "Hyderabad — Tank Bund", latitude: 17.4239, longitude: 78.4738 },
];

const sourceLabels: Record<SourceId, { label: string; sublabel: string; icon: typeof Wind }> = {
  weather: { label: "Wind & weather", sublabel: "Live numerical stream", icon: Wind },
  rain: { label: "Rain likelihood", sublabel: "Short-range forecast", icon: CloudRain },
  air: { label: "Air exposure", sublabel: "Live atmospheric stream", icon: Activity },
  field: { label: "Field observation", sublabel: "Operator-provided text or photo", icon: MessageSquareText },
};

export default function Home() {
  const [site, setSite] = useState<Site>(sites[0]);
  const [disabled, setDisabled] = useState<SourceId[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [fieldCondition, setFieldCondition] = useState<"clear" | "wet" | "unsafe" | "unknown">("unknown");
  const [observedWind, setObservedWind] = useState<string>("");
  const [fieldNote, setFieldNote] = useState("");
  const [fieldPhotoDataUrl, setFieldPhotoDataUrl] = useState<string | null>(null);
  const [fieldPhotoName, setFieldPhotoName] = useState<string | null>(null);
  const [fieldPhotoError, setFieldPhotoError] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const utils = trpc.useUtils();

  const locationInput = useMemo(() => ({ latitude: site.latitude, longitude: site.longitude, siteLabel: site.label }), [site]);
  const liveQuery = trpc.aegis.live.useQuery({ latitude: site.latitude, longitude: site.longitude }, { refetchInterval: 120_000, retry: 1 });
  const assessmentQuery = trpc.aegis.assess.useQuery({ ...locationInput, disabled }, { refetchInterval: 120_000, retry: 1 });

  const fieldMutation = trpc.aegis.reportField.useMutation({
    onSuccess: async data => {
      setNotice(data.photoEvidence ? "Field report and attributed visual observation recorded. Aegis recalculated the evidence graph." : "Field report recorded. Aegis recalculated the evidence graph.");
      setShowReport(false); setFieldNote(""); setObservedWind(""); setFieldCondition("unknown"); setFieldPhotoDataUrl(null); setFieldPhotoName(null); setFieldPhotoError(null);
      await assessmentQuery.refetch();
    },
  });
  const receiptMutation = trpc.aegis.recordReview.useMutation({
    onSuccess: async data => {
      setNotice(`Human decision receipt #${data.receiptId} recorded. Aegis did not act autonomously.`);
      setReviewOpen(false); setReviewNote("");
      await assessmentQuery.refetch();
    },
  });

  const assessment = assessmentQuery.data?.assessment;
  const live = assessment?.liveEvidence ?? liveQuery.data;
  const status = assessment?.decision ?? "observe";
  const isFaultMode = disabled.length > 0;
  const riskTone = status === "refuse" ? "refuse" : status === "restrict" ? "restrict" : status === "proceed" ? "proceed" : "observe";

  const toggleFault = (source: SourceId) => setDisabled(current => current.includes(source) ? current.filter(item => item !== source) : current.length >= 2 ? current : [...current, source]);
  const selectSite = (next: Site) => { setSite(next); setDisabled([]); setNotice(null); };
  const refresh = async () => { await Promise.all([liveQuery.refetch(), assessmentQuery.refetch()]); setNotice("Live sources refreshed from the environmental evidence providers."); };
  const submitField = (event: React.FormEvent) => { event.preventDefault(); fieldMutation.mutate({ ...locationInput, fieldCondition, observedWindKph: observedWind ? Number(observedWind) : null, note: fieldNote, photoDataUrl: fieldPhotoDataUrl ?? undefined }); };
  const submitReview = (action: "approve" | "request_check" | "defer") => receiptMutation.mutate({ ...locationInput, disabled, operatorAction: action, operatorNote: reviewNote || "Operator acknowledgement recorded." });
  const selectFieldPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0];
    setFieldPhotoError(null);
    if (!photo) { setFieldPhotoDataUrl(null); setFieldPhotoName(null); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) { setFieldPhotoError("Choose a JPEG, PNG, or WebP image."); event.target.value = ""; return; }
    if (photo.size > 2_500_000) { setFieldPhotoError("Choose an image no larger than 2.5 MB."); event.target.value = ""; return; }
    const reader = new FileReader();
    reader.onload = () => { setFieldPhotoDataUrl(typeof reader.result === "string" ? reader.result : null); setFieldPhotoName(photo.name); };
    reader.onerror = () => setFieldPhotoError("The selected image could not be read. Please try another file.");
    reader.readAsDataURL(photo);
  };

  return <div className="ag-shell">
    <header className="ag-topbar">
      <div className="ag-brand"><div className="ag-mark"><ShieldCheck size={20} /><i /></div><div><strong>Aegis</strong><span>decision refusal engine</span></div></div>
      <div className="ag-top-meta"><span className="ag-live-dot"><i /> LIVE ENVIRONMENTAL EVIDENCE</span><span className="ag-mono">TRACK 01 / PUBLIC EVIDENCE DESK</span><button className="ag-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle desk navigation">{mobileOpen ? <X size={19} /> : <Menu size={19} />}</button></div>
    </header>

    <div className="ag-frame">
      <aside className={`ag-rail ${mobileOpen ? "open" : ""}`}>
        <div className="ag-incident"><span className="ag-mono">OPERATING QUESTION</span><strong>Can an outdoor team proceed safely?</strong><p>Aegis recommends, restricts, or refuses—based on evidence quality, not confidence theatre.</p></div>
        <div className="ag-site-picker"><span className="ag-mono">SITE / LIVE COORDINATES</span>{sites.map(candidate => <button key={candidate.label} className={site.label === candidate.label ? "active" : ""} onClick={() => { selectSite(candidate); setMobileOpen(false); }}><MapPin size={15} /><span>{candidate.label.split(" — ")[0]}</span><i>{candidate.latitude.toFixed(2)}°</i></button>)}</div>
        <div className="ag-rail-footer"><span className="ag-mono">AUTONOMY CONTRACT</span><p><ShieldAlert size={16} /><strong>Never infer certainty.</strong> Aegis refuses when decisive evidence is absent.</p></div>
      </aside>

      <main className="ag-main">
        <section className="ag-hero">
          <div><p className="ag-kicker"><ScanLine size={15} /> EVIDENCE LEDGER / {site.label.toUpperCase()}</p><h1>What should we do<br /><em>when the signals disagree?</em></h1><p className="ag-lede">Aegis is a confidence-aware decision layer for exposed outdoor operations. It traces source reliability, requests the smallest missing fact, and hands the final action to a human.</p></div>
          <div className="ag-hero-actions"><button className="ag-ghost" onClick={refresh} disabled={liveQuery.isFetching || assessmentQuery.isFetching}><RefreshCw size={16} className={liveQuery.isFetching ? "spin" : ""} /> Refresh evidence</button><button className="ag-primary" onClick={() => setShowReport(true)}><MessageSquareText size={16} /> Add public field fact</button></div>
        </section>

        <section className="ag-auth-banner"><UserRoundCheck size={19} /><div><strong>Public contributions are unattributed.</strong><span>They can surface a concern, but cannot restore Aegis confidence or authorise an action.</span></div></section>

        <section className="ag-command-grid">
          <article className="ag-decision-card">
            <div className="ag-card-heading"><div><span className="ag-mono">CURRENT RECOMMENDATION</span><h2>{status === "refuse" ? "Aegis refuses to decide." : status === "restrict" ? "Restrict exposed operations." : status === "proceed" ? "Proceed with monitoring." : "Evidence is loading."}</h2></div><div className={`ag-status-orb ${riskTone}`}><span>{assessment ? assessment.confidence : "—"}</span><small>confidence</small></div></div>
            <div className={`ag-verdict ${riskTone}`}><div className="ag-verdict-icon">{status === "refuse" ? <EyeOff size={23} /> : status === "restrict" ? <TriangleAlert size={23} /> : status === "proceed" ? <BadgeCheck size={23} /> : <BrainCircuit size={23} />}</div><div><strong>{status === "refuse" ? "REFUSE / HUMAN FACT REQUIRED" : status === "restrict" ? "RESTRICT / OPERATOR ACKNOWLEDGEMENT" : status === "proceed" ? "PROCEED / LIVE MONITORING" : "LIVE EVIDENCE ASSESSMENT"}</strong><p>{assessment?.action ?? "Aegis is retrieving live environmental evidence."}</p></div></div>
            {assessment && <><p className="ag-rationale">{assessment.rationale}</p><div className="ag-meters"><div><span>Evidence coverage</span><strong>{assessment.coverage}%</strong><i><b style={{ width: `${assessment.coverage}%` }} /></i></div><div><span>Operational exposure</span><strong>{assessment.riskScore}/100</strong><i className="risk"><b style={{ width: `${assessment.riskScore}%` }} /></i></div></div></>}
            {assessment?.decision === "refuse" && <div className="ag-missing-fact"><Sparkles size={17} /><div><span className="ag-mono">SMALLEST FACT THAT UNBLOCKS A DECISION</span><p>{assessment.smallestMissingFact}</p></div><button onClick={() => setShowReport(true)}>Contribute it <ChevronRight size={15} /></button></div>}
            {assessment && <button className="ag-review-button" onClick={() => setReviewOpen(true)}><UserRoundCheck size={17} /> Record public human response <ArrowRight size={15} /></button>}
          </article>

          <article className="ag-evidence-card">
            <div className="ag-card-heading"><div><span className="ag-mono">SOURCE PROVENANCE</span><h2>What Aegis can see</h2></div><span className={`ag-fault-label ${isFaultMode ? "on" : ""}`}>{isFaultMode ? "FAULT INJECTION ACTIVE" : "ALL AVAILABLE"}</span></div>
            <div className="ag-source-list">{(assessment?.sources ?? (["weather", "rain", "air", "field"] as SourceId[]).map(id => ({ id, state: id === "field" ? "missing" : "live" }))).map((source: any) => { const info = sourceLabels[source.id as SourceId]; const Icon = info.icon; const disabledSource = source.state === "fault_injected"; return <div className={`ag-source ${source.state}`} key={source.id}><span className="ag-source-icon"><Icon size={18} /></span><div><strong>{info.label}</strong><p>{disabledSource ? "Deliberately omitted for resilience test" : source.state === "unattributed" ? "Public contribution — human verification required" : source.state === "missing" ? "No public field contribution yet" : info.sublabel}</p></div><em>{source.state === "live" ? "LIVE" : source.state === "operator" ? "FIELD" : source.state === "unattributed" ? "PUBLIC" : source.state === "fault_injected" ? "HIDDEN" : "ABSENT"}</em></div>; })}</div>
            <div className="ag-hard-mode"><div><span className="ag-mono">HARD MODE / EVIDENCE FAULT INJECTION</span><p>Deliberately remove one or two live inputs. Aegis must become less certain—not more decisive.</p></div><div className="ag-fault-controls">{(["weather", "rain", "air"] as SourceId[]).map(source => <button className={disabled.includes(source) ? "disabled" : ""} onClick={() => toggleFault(source)} key={source}>{disabled.includes(source) ? <EyeOff size={14} /> : <Zap size={14} />}{sourceLabels[source].label}</button>)}</div></div>
          </article>
        </section>

        <section className="ag-live-grid">
          <article className="ag-telemetry-card"><div className="ag-card-heading"><div><span className="ag-mono">LIVE SENSOR-CLASS EVIDENCE</span><h2>Environmental telemetry</h2></div><span className="ag-time">{live ? `${live.location.timezone}` : "CONNECTING"}</span></div>{liveQuery.isError ? <div className="ag-data-error"><TriangleAlert size={20} /><p>Live environmental sources did not respond. Aegis will not replace that absence with invented values.</p><button onClick={refresh}>Retry now</button></div> : <div className="ag-readings"><Reading icon={ThermometerSun} label="Temperature" value={live ? `${live.weather.temperature}°C` : "—"} detail={live ? `Feels ${live.weather.apparentTemperature}°C` : "Live source loading"} /><Reading icon={Wind} label="Wind gusts" value={live ? `${live.weather.windGusts} km/h` : "—"} detail={live ? `Sustained ${live.weather.windSpeed} km/h` : "Live source loading"} /><Reading icon={CloudRain} label="Rain chance" value={live ? `${live.rain.probability}%` : "—"} detail={live ? `Observed ${live.weather.precipitation} mm` : "Live source loading"} /><Reading icon={Gauge} label="US AQI" value={live ? String(live.air.usAqi) : "—"} detail={live ? `PM2.5 ${live.air.pm25} μg/m³` : "Live source loading"} /></div>}<p className="ag-source-note">Weather and atmospheric data are requested live per selected coordinate. Operator reports are persisted separately and never silently substituted for source data.</p></article>
          <article className="ag-anomaly-card"><div className="ag-card-heading"><div><span className="ag-mono">CONTRADICTION SCAN</span><h2>What needs attention</h2></div><SlidersHorizontal size={20} /></div>{assessment?.anomalies?.length ? <div className="ag-anomaly-list">{assessment.anomalies.map((item: any) => <div className={`ag-anomaly ${item.severity}`} key={item.label}><AlertTriangle size={17} /><div><strong>{item.label}</strong><p>{item.explanation}</p></div><em>{item.severity}</em></div>)}</div> : <div className="ag-empty-scan"><ScanLine size={29} /><p>No material contradiction is visible across the available live sources.</p></div>}<div className="ag-provenance"><FileCheck2 size={16} /><span><strong>Public responses are immutable, unattributed records.</strong> They remain separate from Aegis’s recommendation.</span></div></article>
        </section>

        {notice && <div className="ag-toast"><Check size={17} /> {notice}</div>}
      </main>
    </div>

    {showReport && <div className="ag-modal-backdrop" role="dialog" aria-modal="true"><form className="ag-modal" onSubmit={submitField}><button type="button" className="ag-close" onClick={() => setShowReport(false)}><X size={18} /></button><span className="ag-mono">PUBLIC FIELD CONTRIBUTION</span><h2>Contribute a field fact</h2><p>Do not invent observations. This contribution is intentionally unattributed and can surface a concern, but it cannot restore Aegis confidence or authorise an action.</p><label>Field condition<select value={fieldCondition} onChange={event => setFieldCondition(event.target.value as typeof fieldCondition)}><option value="unknown">Unknown / cannot verify</option><option value="clear">Clear and stable</option><option value="wet">Wet / degraded surface</option><option value="unsafe">Unsafe / immediate concern</option></select></label><label>Observed gusts, if measured (km/h)<input type="number" min="0" max="200" value={observedWind} onChange={event => setObservedWind(event.target.value)} placeholder="Optional" /></label><label>What did you observe?<textarea required minLength={4} maxLength={2000} value={fieldNote} onChange={event => setFieldNote(event.target.value)} placeholder="Describe the actual condition, obstruction, or safety concern." /></label><label>Optional site photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFieldPhoto} /></label><p className="ag-photo-note"><Camera size={15} /> Aegis stores this image with your public report and extracts a neutral visual observation. It never makes or executes the decision. JPEG, PNG, or WebP; up to 2.5 MB.</p>{fieldPhotoDataUrl && <div className="ag-photo-preview"><img src={fieldPhotoDataUrl} alt="Selected public field evidence" /><div><strong>{fieldPhotoName}</strong><span>Ready for neutral extraction</span><button type="button" onClick={() => { setFieldPhotoDataUrl(null); setFieldPhotoName(null); }}>Remove photo</button></div></div>}{fieldPhotoError && <p className="ag-form-error">{fieldPhotoError}</p>}<button className="ag-primary modal-submit" disabled={fieldMutation.isPending}>{fieldMutation.isPending ? <><RefreshCw size={16} className="spin" /> Recording…</> : <><MessageSquareText size={16} /> Add public field fact</>}</button>{fieldMutation.error && <p className="ag-form-error">{fieldMutation.error.message}</p>}</form></div>}
    {reviewOpen && assessment && <div className="ag-modal-backdrop" role="dialog" aria-modal="true"><div className="ag-modal ag-review-modal"><button className="ag-close" onClick={() => setReviewOpen(false)}><X size={18} /></button><span className="ag-mono">PUBLIC HUMAN RESPONSE</span><h2>What will you do with Aegis’s recommendation?</h2><p>Aegis cannot execute this action. Your response is stored as an unattributed public receipt, separately from the recommendation and evidence snapshot.</p><textarea value={reviewNote} onChange={event => setReviewNote(event.target.value)} placeholder="Optional public note" maxLength={2000} /><div className="ag-review-actions"><button className="ag-ghost" onClick={() => submitReview("defer")} disabled={receiptMutation.isPending}>Defer decision</button><button className="ag-ghost" onClick={() => submitReview("request_check")} disabled={receiptMutation.isPending}>Request check</button><button className="ag-primary" onClick={() => submitReview("approve")} disabled={receiptMutation.isPending}>{receiptMutation.isPending ? "Recording…" : "Acknowledge recommendation"}</button></div>{receiptMutation.error && <p className="ag-form-error">{receiptMutation.error.message}</p>}</div></div>}
  </div>;
}

function Reading({ icon: Icon, label, value, detail }: { icon: typeof ThermometerSun; label: string; value: string; detail: string }) { return <div className="ag-reading"><span><Icon size={18} /></span><div><p>{label}</p><strong>{value}</strong><small>{detail}</small></div></div>; }
