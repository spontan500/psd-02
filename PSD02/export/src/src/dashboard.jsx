/* Dashboard screens — ID-058 (full) + ID-059 (reduced) */

function StatWidget({ title, value, ok, updated = "1min ago", onAnzeigen }) {
  return (
    <div className="widget">
      <h3>{title}</h3>
      <div className="big-number">{value}</div>
      {ok && <span className="ok-check"><IconCheck size={14} strokeWidth={3} /></span>}
      <div className="footer">
        <span className="updated"><IconRefresh size={14} />{updated}</span>
        <button className="anzeigen" onClick={onAnzeigen}>
          Anzeigen <IconArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function CallListWidget({ onCallClick, onAllCalls }) {
  const { recentCalls } = useDataStore();
  const calls = (recentCalls || []).slice(0, 3);
  return (
    <div className="widget" style={{ gridRow: "span 2" }}>
      <div>
        <h3>Anrufliste</h3>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 600, marginTop: 12 }}>Letzte Anrufe</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
        {calls.map((c, i) => (
          <button
            key={i}
            className="call-row"
            onClick={() => onCallClick && onCallClick(c)}
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
        <button className="anzeigen" onClick={onAllCalls}>
          Alle Anrufe <IconArrowRight size={16} />
        </button>
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
