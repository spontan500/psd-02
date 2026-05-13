/* Listen-Modals: Personen (132), Anrufer (27), Vermisste Personen (11), etc. */

// Helper to make a row clickable AND keyboard-actionable
const rowProps = (onActivate) => ({
  tabIndex: 0,
  role: "button",
  onClick: onActivate,
  onKeyDown: (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate(e);
    }
  },
});

function PersonRowAvatar({ p, size = 36 }) {
  if (p.kind === "caller") return <AvatarCaller size={size} />;
  if (p.kind === "abholer") return <AvatarAbholer size={size} />;
  if (p.kind === "patient") return <AvatarPatient size={size} label={p.patientLabel || "II"} />;
  if (p.kind === "unknown") {
    if (p.photo) return <AvatarPhoto size={size} letter="K" />;
    return <AvatarUnknown size={size} />;
  }
  return <AvatarUnknown size={size} />;
}

function CategoryBadge({ p }) {
  const cls = {
    caller: { bg: "rgb(20,200,96)", icon: <IconHeadset size={16} stroke="white" strokeWidth={2.5} /> },
    abholer: { bg: "rgb(165,116,240)", icon: <IconUser size={16} stroke="white" strokeWidth={2.5} /> },
    patient: { bg: "rgb(16,185,129)", icon: <span style={{ fontWeight: 700, fontSize: 11, color: "white" }}>{p.patientLabel || "II"}</span> },
    unknown: { bg: "var(--bg-field)", icon: <span style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 700 }}>?</span> },
  };
  const c = cls[p.kind] || cls.unknown;
  return (
    <span style={{
      width: 24, height: 24, borderRadius: "50%",
      background: c.bg, display: "inline-grid", placeItems: "center",
      flex: "0 0 auto",
    }}>
      {c.icon}
    </span>
  );
}

function TypeTags({ types, flagged }) {
  const parts = (types || "").split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
      {parts.map((t) => {
        let cls = "tag-info-light";
        let label = t;
        if (t === "VERMISST") cls = "tag-vermisst";
        if (t === "ABHOLER") cls = "tag-info";
        return <span key={t} className={`tag ${cls}`}>{label}</span>;
      })}
      {flagged && <span className="flag-mark" style={{ display: "inline-flex" }}><IconFlag size={16} /></span>}
    </div>
  );
}

function PersonenListModal({ onClose, onSelect, title, showCategory = true, showVerified = true, onSave }) {
  const { people } = useDataStore();
  const [q, setQ] = useState("");
  const [art, setArt] = useState("");
  const [standort, setStandort] = useState("");
  const [verifiziert, setVerifiziert] = useState("");
  const [farbe, setFarbe] = useState("");
  const [sort, setSort] = useState("Letzter Kontakt");
  const dynTitle = title || `Personen (${people.length})`;

  const filtered = useMemo(() => {
    return people.filter((p) => {
      if (q) {
        const s = q.toLowerCase();
        if (![p.name, p.first, p.phone].some((v) => (v || "").toLowerCase().includes(s))) return false;
      }
      if (art && !(p.type || "").toUpperCase().includes(art.toUpperCase())) return false;
      return true;
    });
  }, [q, art, standort, verifiziert, farbe, people]);

  return (
    <Modal
      title={dynTitle}
      onClose={onClose}
      footer={onSave ? (
        <>
          <Button variant="ghost" onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" onClick={onSave}>Änderungen speichern</Button>
        </>
      ) : null}
    >
      <div className="list-card">
        <div className="toolbar">
          <div className="search">
            <span className="icon"><IconSearch size={18} /></span>
            <Input value={q} onChange={setQ} placeholder="Suchen…" />
          </div>
          <FilterPill label="Art" value={art} onChange={setArt} options={["Anrufer", "Abholer", "Patient", "Informationsträger", "Vermisst"]} />
          <FilterPill label="Standort" value={standort} onChange={setStandort} options={["SanHist", "Sammelstelle", "Betreuungsposten", "Unbekannt"]} />
          <FilterPill label="Verifiziert" value={verifiziert} onChange={setVerifiziert} options={["Ja", "Nein"]} />
          <FilterPill label="Farbe" value={farbe} onChange={setFarbe} options={["Rot", "Gelb", "Grün", "Schwarz"]} />

          <div className="sort-by">
            <span>Sortiert nach</span>
            <button className="filter-pill">
              <span>{sort}</span>
              <IconArrowUp size={14} />
              <IconChevronDown size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: "16px 0 0 0", overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                {showCategory && <th style={{ width: 60, paddingLeft: 24 }}>Kat.</th>}
                <th>Name</th>
                <th>Vorname</th>
                <th>Telefonnummer</th>
                <th>Art/Status</th>
                {showVerified && <th>Verifiziert</th>}
                <th>Standort</th>
                <th style={{ paddingRight: 24 }}>Letzter Kontakt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} {...rowProps(() => onSelect && onSelect(p))}>
                  {showCategory && (
                    <td style={{ paddingLeft: 24 }}><CategoryBadge p={p} /></td>
                  )}
                  <td>
                    <div className="row" style={{ gap: 12 }}>
                      <PersonRowAvatar p={p} />
                      <span className="col-name">{p.name}</span>
                    </div>
                  </td>
                  <td>{p.first}</td>
                  <td>{p.phone}</td>
                  <td><TypeTags types={p.type} flagged={p.flagged} /></td>
                  {showVerified && (
                    <td>{p.verified ? <span className="verified-check"><IconCheckCircle size={20} /></span> : <span className="muted">–</span>}</td>
                  )}
                  <td>{p.location}</td>
                  <td style={{ paddingRight: 24 }}>{p.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

/* ID-076: Anrufer (27) */
function AnruferListModal({ onClose, onSelect }) {
  const { callers } = useDataStore();
  const [q, setQ] = useState("");
  const [grund, setGrund] = useState("");

  const filtered = useMemo(() => {
    return callers.filter((c) => {
      if (q) {
        const s = q.toLowerCase();
        if (![c.name, c.first, c.phone].some((v) => v.toLowerCase().includes(s))) return false;
      }
      if (grund && !c.reason.toLowerCase().includes(grund.toLowerCase())) return false;
      return true;
    });
  }, [q, grund, callers]);

  return (
    <Modal title={`Anrufer (${callers.length})`} onClose={onClose}>
      <div className="list-card">
        <div className="toolbar">
          <div className="search">
            <span className="icon"><IconSearch size={18} /></span>
            <Input value={q} onChange={setQ} placeholder="Suchen…" />
          </div>
          <FilterPill label="Anrufgrund" value={grund} onChange={setGrund} options={["Vermisstmeldung", "Zeugenmeldung", "Informationsträger", "Vermisste Effekte"]} />
          <div className="sort-by">
            <span>Sortiert nach</span>
            <button className="filter-pill">
              <span>Letzter Anrufzeitpunkt</span>
              <IconArrowUp size={14} />
              <IconChevronDown size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: "16px 0 0 0", overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 80 }}>Name</th>
                <th>Vorname</th>
                <th>Telefonnummer</th>
                <th>Meldungsgrund</th>
                <th>Beziehung</th>
                <th style={{ paddingRight: 24 }}>Letzter Anrufzeitpunkt</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} {...rowProps(() => onSelect && onSelect(c))} className={c.isNew ? "row-new" : ""}>
                  <td style={{ paddingLeft: 24 }}>
                    <div className="row" style={{ gap: 12 }}>
                      <AvatarCaller size={36} />
                      <span className="col-name">{c.name}</span>
                    </div>
                  </td>
                  <td>{c.first}</td>
                  <td>{c.phone}</td>
                  <td>{c.reason}</td>
                  <td>{c.relation}</td>
                  <td style={{ paddingRight: 24 }}>{c.isNew ? "Soeben" : "Heute, 11:37 Uhr"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

/* ID-077: Vermisste Personen (11) */
function VermisstListModal({ onClose, onSelect }) {
  const { vermisste } = useDataStore();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const filtered = useMemo(() => {
    return vermisste.filter((v) => {
      if (q) {
        const s = q.toLowerCase();
        if (![v.name, v.first].some((x) => (x || "").toLowerCase().includes(s))) return false;
      }
      if (status && (v.status || "").toLowerCase() !== status.toLowerCase()) return false;
      return true;
    });
  }, [q, status, vermisste]);
  return (
    <Modal title={`Vermisste Personen (${vermisste.length})`} onClose={onClose}>
      <div className="list-card">
        <div className="toolbar">
          <div className="search">
            <span className="icon"><IconSearch size={18} /></span>
            <Input value={q} onChange={setQ} placeholder="Suchen…" />
          </div>
          <FilterPill label="Status" value={status} onChange={setStatus} options={STATUS_LOCATION} />
          <div className="sort-by">
            <span>Sortiert nach</span>
            <button className="filter-pill">
              <span>Erfassung</span>
              <IconArrowUp size={14} />
              <IconChevronDown size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: "16px 0 0 0", overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 80 }}>Name</th>
                <th>Vorname</th>
                <th>Alter</th>
                <th>Status</th>
                <th>Vermutet</th>
                <th>Beziehung</th>
                <th style={{ paddingRight: 24 }}>Letzte Aktualisierung</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} {...rowProps(() => onSelect && onSelect(v))} className={v.isNew ? "row-new" : ""}>
                  <td style={{ paddingLeft: 24 }}>
                    <div className="row" style={{ gap: 12 }}>
                      <AvatarVermisst size={36} />
                      <span className="col-name">{v.name}</span>
                    </div>
                  </td>
                  <td>{v.first}</td>
                  <td>{v.age}</td>
                  <td><span className="tag tag-vermisst">VERMISST</span></td>
                  <td>{v.location}</td>
                  <td>{v.relation}</td>
                  <td style={{ paddingRight: 24 }}>{v.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

/* ID-078: Vermisstmeldungen (3) - aggregated by caller */
function VermisstmeldungenListModal({ onClose }) {
  const { vermisste, callers } = useDataStore();
  return (
    <Modal title={`Vermisstmeldungen (${vermisste.length})`} onClose={onClose}>
      <div className="list-card">
        <div className="toolbar">
          <div className="search">
            <span className="icon"><IconSearch size={18} /></span>
            <Input placeholder="Suchen…" onChange={() => {}} />
          </div>
          <FilterPill label="Status" options={STATUS_LOCATION} />
        </div>
        <div style={{ padding: "16px 0 0 0", overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 24 }}>Anrufer</th>
                <th>Vermisste Person</th>
                <th>Beziehung</th>
                <th>Status</th>
                <th style={{ paddingRight: 24 }}>Erfasst</th>
              </tr>
            </thead>
            <tbody>
              {vermisste.map((v, i) => {
                const c = v.caller || callers[i] || {};
                return (
                <tr key={v.id} className={v.isNew ? "row-new" : ""}>
                  <td style={{ paddingLeft: 24 }}>
                    <div className="row" style={{ gap: 12 }}>
                      <AvatarCaller />
                      <span className="col-name">{c.name} {c.first}</span>
                    </div>
                  </td>
                  <td>{v.name} {v.first}</td>
                  <td>{v.relation}</td>
                  <td><span className="tag tag-vermisst">{(v.status || "").toUpperCase()}</span></td>
                  <td style={{ paddingRight: 24 }}>{v.last}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

/* ID-079: Zeugen list */
function ZeugenListModal({ onClose }) {
  return (
    <Modal title="Zeugen (8)" onClose={onClose}>
      <div className="list-card">
        <div className="toolbar">
          <div className="search">
            <span className="icon"><IconSearch size={18} /></span>
            <Input placeholder="Suchen…" onChange={() => {}} />
          </div>
        </div>
        <div style={{ padding: "16px 0 0 0", overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 24 }}>Zeuge</th>
                <th>Aussage</th>
                <th>Standort</th>
                <th style={{ paddingRight: 24 }}>Erfasst</th>
              </tr>
            </thead>
            <tbody>
              {CALLERS.slice(0, 6).map((c, i) => (
                <tr key={c.id}>
                  <td style={{ paddingLeft: 24 }}>
                    <div className="row" style={{ gap: 12 }}>
                      <AvatarCaller />
                      <span className="col-name">{c.name} {c.first}</span>
                    </div>
                  </td>
                  <td className="muted" style={{ maxWidth: 480, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {i % 2 ? ZEUGEN_2 : ZEUGEN_TEXT.split("\n")[0]}
                  </td>
                  <td>Wagen {i + 1}</td>
                  <td style={{ paddingRight: 24 }}>Heute, 1{0 + i}:0{i} Uhr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

/* ID-080: Streugut / Effekte list */
function StreugutListModal({ onClose }) {
  return (
    <Modal title="Streugut (3)" onClose={onClose}>
      <div className="list-card">
        <div className="toolbar">
          <div className="search">
            <span className="icon"><IconSearch size={18} /></span>
            <Input placeholder="Suchen…" onChange={() => {}} />
          </div>
          <FilterPill label="Kategorie" options={EFFEKT_KATEGORIEN} />
        </div>
        <div style={{ padding: "16px 0 0 0", overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: 24 }}>Kategorie</th>
                <th>Beschreibung</th>
                <th>Verlustort</th>
                <th>Zustand</th>
                <th style={{ paddingRight: 24 }}>Erfasst von</th>
              </tr>
            </thead>
            <tbody>
              {EFFEKTE.map((e, i) => (
                <tr key={i}>
                  <td style={{ paddingLeft: 24 }} className="col-name">{e.kategorie}</td>
                  <td className="muted" style={{ maxWidth: 480 }}>{e.beschreibung}</td>
                  <td>{e.verlustort}</td>
                  <td><span className="tag tag-neutral">{e.zustand.toUpperCase()}</span></td>
                  <td style={{ paddingRight: 24 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <AvatarAbholer size={28} /> Badoux Anna
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td style={{ paddingLeft: 24 }} className="col-name">Schmuck / Uhren</td>
                <td className="muted">Silberne Damen-Armbanduhr, ovales Zifferblatt, Lederband braun</td>
                <td>Wagen 2 des Zuges</td>
                <td><span className="tag tag-neutral">GEBRAUCHT</span></td>
                <td style={{ paddingRight: 24 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <AvatarCaller size={28} /> Gaultier Serge
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}

// All Übersicht / list modals exposed
Object.assign(window, {
  PersonenListModal, AnruferListModal, VermisstListModal,
  VermisstmeldungenListModal, ZeugenListModal, StreugutListModal,
  STATUS_LOCATION,
});
