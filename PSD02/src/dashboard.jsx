/* Dashboard screens — ID-058 (full) + ID-059 (reduced) */

function useCountUp(value, duration = 900) {
  const target = Number(value);
  const isNum = Number.isFinite(target);
  const fromRef = useRef(isNum ? target : 0);
  const [display, setDisplay] = useState(isNum ? target : 0);

  useEffect(() => {
    if (!isNum) return;
    const from = fromRef.current;
    if (from === target) { setDisplay(target); return; }
    const startTime = performance.now();
    let raf;
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const v = from + (target - from) * eased;
      setDisplay(Math.round(v));
      if (t < 1) raf = requestAnimationFrame(step);
      else { fromRef.current = target; setDisplay(target); }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, isNum]);

  return isNum ? display : value;
}

function StatWidget({ title, value, ok, updated = "1min ago", onAnzeigen }) {
  const display = useCountUp(value);
  const isBumping = String(display) !== String(value);
  const activate = () => onAnzeigen && onAnzeigen();
  return (
    <div
      className="widget widget-clickable"
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } }}
    >
      <h3>{title}</h3>
      <div className={`big-number ${isBumping ? "is-bumping" : ""}`}>{display}</div>
      {ok && <span className="ok-check"><IconCheck size={14} strokeWidth={3} /></span>}
      <div className="footer">
        <span className="updated"><IconRefresh size={14} />{updated}</span>
        <span className="anzeigen" aria-hidden="true">
          Anzeigen <IconArrowRight size={16} />
        </span>
      </div>
    </div>
  );
}

function CallListWidget({ onCallClick, onAllCalls }) {
  const { recentCalls } = useDataStore();
  const calls = (recentCalls || []).slice(0, 3);
  const activate = () => onAllCalls && onAllCalls();
  return (
    <div
      className="widget widget-clickable"
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); } }}
      style={{ gridRow: "span 2" }}
    >
      <div>
        <h3>Anrufliste</h3>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, marginTop: 12 }}>Letzte Anrufe</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
        {calls.map((c, i) => (
          <button
            key={i}
            className="call-row"
            onClick={(e) => { e.stopPropagation(); onCallClick && onCallClick(c); }}
            style={{ textAlign: "left", width: "100%", background: "transparent" }}
          >
            <div className="left">
              <span className="name">{c.name}</span>
              <span className={`tag ${c.tagClass}`}>{c.tag}</span>
            </div>
            <span className="phone">{c.phone}</span>
          </button>
        ))}
      </div>
      <div className="footer">
        <span className="updated"><IconRefresh size={14} />1min ago</span>
        <span className="anzeigen" aria-hidden="true">
          Alle Anrufe <IconArrowRight size={16} />
        </span>
      </div>
    </div>
  );
}

function PersonErfassenWidget({ onClick }) {
  return (
    <button
      className="widget widget-clickable"
      onClick={onClick}
      style={{ textAlign: "left", cursor: "pointer", background: "white" }}
      aria-label="Person erfassen"
    >
      <h3>Person erfassen</h3>
      <span className="cta-plus" aria-hidden="true">
        <IconPlus size={42} stroke="white" strokeWidth={2.5} />
      </span>
    </button>
  );
}

function Dashboard({ variant = "full", navigate, openErfassen, openList }) {
  const { people, vermisste } = useDataStore();
  // variant 'full' = ID-058 (Infoline), 'reduced' = ID-059
  return (
    <div className="page-scroll" style={{ paddingTop: 16 }}>
      <div className="dashboard-grid">
        <PersonErfassenWidget onClick={openErfassen} />

        {variant === "full" && (
          <>
            <StatWidget title="Personen" value={String(people.length)} ok onAnzeigen={() => openList("personen")} />
            <StatWidget title="Vermisstmeldungen" value={String(vermisste.length)} onAnzeigen={() => openList("vermisste")} />
          </>
        )}

        <CallListWidget
          onCallClick={(c) => openErfassen({ caller: c })}
          onAllCalls={() => openList("anrufer")}
        />

        {variant === "full" && (
          <>
            <StatWidget title="Patienten" value="12" onAnzeigen={() => openList("patienten")} />
            <StatWidget title="Informationsträger" value="2" onAnzeigen={() => openList("info")} />
          </>
        )}

        {variant === "full" && (
          <StatWidget title="Streugut" value="3" onAnzeigen={() => openList("streugut")} />
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, StatWidget, CallListWidget, PersonErfassenWidget });
