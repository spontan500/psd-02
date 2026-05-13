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

const PHOTO_MAP = {
  marius: "src/assets/photo-marius.png",
  petra: "src/assets/photo-petra.png",
};

function PersonRowAvatar({ p, size = 36 }) {
  if (p.photo) {
    const src = typeof p.photo === "string" ? PHOTO_MAP[p.photo] : (p.photoSrc || null);
    if (src) return <AvatarPhoto size={size} src={src} />;
    return <AvatarPhoto size={size} />;
  }
  // Default generic avatar — figma: icon=avatar_filled (3:1330)
  return <IconAvatarFilled size={size} />;
}

function CategoryBadge({ p }) {
  if (p.kind === "caller")  return <IconAvatarCaller size={36} />;
  if (p.kind === "abholer") return <IconAvatarAbholer size={36} />;
  if (p.kind === "patient") {
    const label = p.patientLabel || "II";
    return <IconAvatarPatient size={36} label={label} outline={label === "0"} />;
  }
  // unknown
  return <IconAvatarHelp size={36} />;
}

function TypeTags({ types, flagged }) {
  const parts = (types || "").split(",").map((s) => s.trim()).filter(Boolean);
  return (
    <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
      {parts.map((t) => {
        let cls = "tag-info-light";
        let label = t;
        if (t === "VERMISST") cls = "tag-vermisst";
        else if (t === "ABHOLER") cls = "tag-info";
        else if (t === "INFORMATIONSTRÄGER") cls = "tag-trader";
        return <span key={t} className={`tag ${cls}`}>{label}</span>;
      })}
      {flagged && <span className="flag-mark" aria-label="Markiert"><IconFlag size={16} /></span>}
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
  const dynTitle = title || `Personen (${people.length})`;

  // Track toolbar height so the sticky table header sits exactly below it
  const toolbarRef = useRef(null);
  const [toolbarH, setToolbarH] = useState(72);
  useLayoutEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;
    const measure = () => setToolbarH(el.getBoundingClientRect().height || 72);
    measure();
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    window.addEventListener("resize", measure);
    return () => { ro && ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  /* ---- Column definitions, ordering, sorting, drag ---- */
  const allColumns = useMemo(() => {
    const cols = [];
    if (showCategory) cols.push({
      key: "category", label: "Kat.", sortable: false, width: 80,
      render: (p) => <CategoryBadge p={p} />,
    });
    cols.push({
      key: "name", label: "Name", sortable: true, sortVal: (p) => (p.name || "").toLowerCase(),
      render: (p) => (
        <div className="row" style={{ gap: 12 }}>
          <PersonRowAvatar p={p} />
          <span className="col-name">{p.name}</span>
        </div>
      ),
    });
    cols.push({ key: "first", label: "Vorname", sortable: true, sortVal: (p) => (p.first || "").toLowerCase(), render: (p) => p.first });
    cols.push({ key: "phone", label: "Telefonnummer", sortable: true, sortVal: (p) => p.phone || "", render: (p) => p.phone });
    cols.push({
      key: "type", label: "Art/Status", sortable: true, sortVal: (p) => (p.type || ""),
      render: (p) => <TypeTags types={p.type} flagged={p.flagged} />,
    });
    if (showVerified) cols.push({
      key: "verified", label: "Verifiziert", sortable: true, sortVal: (p) => p.verified ? 1 : 0,
      render: (p) => p.verified
        ? <span className="verified-check"><IconBadgeCheck size={24} stroke="rgb(20,200,96)" strokeWidth={2} /></span>
        : <span className="muted">–</span>,
    });
    cols.push({ key: "location", label: "Standort", sortable: true, sortVal: (p) => (p.location || "").toLowerCase(), render: (p) => p.location });
    cols.push({
      key: "lastContact", label: "Letzter Kontakt", sortable: true,
      // Treat lastContact strings like "Heute, 11:32 Uhr" — sort by trailing time
      sortVal: (p) => p.lastContact || "",
      render: (p) => p.lastContact,
    });
    return cols;
  }, [showCategory, showVerified]);
  const colMap = useMemo(() => Object.fromEntries(allColumns.map(c => [c.key, c])), [allColumns]);

  const [colOrder, setColOrder] = useState(() => allColumns.map(c => c.key));
  // Re-sync when allColumns shape changes (e.g. hiding/showing columns)
  useEffect(() => {
    const validKeys = new Set(allColumns.map(c => c.key));
    setColOrder(prev => {
      const kept = prev.filter(k => validKeys.has(k));
      const missing = [...validKeys].filter(k => !kept.includes(k));
      return [...kept, ...missing];
    });
  }, [allColumns]);
  const orderedCols = colOrder.map(k => colMap[k]).filter(Boolean);

  const [sort, setSort] = useState({ key: "lastContact", dir: "desc" });
  const toggleSort = (key) => {
    const col = colMap[key]; if (!col?.sortable) return;
    setSort(prev => prev.key === key
      ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
      : { key, dir: "asc" });
  };

  /* Drag-to-reorder columns */
  const [dragKey, setDragKey] = useState(null);
  const [dropKey, setDropKey] = useState(null);
  const onDragStart = (key, e) => {
    setDragKey(key);
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", key); } catch (_) {}
  };
  const onDragOver = (key, e) => {
    if (!dragKey) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (key !== dropKey) setDropKey(key);
  };
  const onDrop = (targetKey, e) => {
    e.preventDefault();
    if (!dragKey || dragKey === targetKey) { setDragKey(null); setDropKey(null); return; }
    setColOrder(prev => {
      const next = [...prev];
      const srcIdx = next.indexOf(dragKey);
      const tgtIdx = next.indexOf(targetKey);
      if (srcIdx < 0 || tgtIdx < 0) return prev;
      next.splice(srcIdx, 1);
      next.splice(tgtIdx, 0, dragKey);
      return next;
    });
    setDragKey(null);
    setDropKey(null);
  };
  const onDragEnd = () => { setDragKey(null); setDropKey(null); };

  /* ---- Filter + sort rows ---- */
  const rows = useMemo(() => {
    let out = people.filter((p) => {
      if (q) {
        const s = q.toLowerCase();
        if (![p.name, p.first, p.phone].some((v) => (v || "").toLowerCase().includes(s))) return false;
      }
      if (art && !(p.type || "").toUpperCase().includes(art.toUpperCase())) return false;
      if (standort && !(p.location || "").toLowerCase().includes(standort.toLowerCase())) return false;
      if (verifiziert) {
        const wantVerified = verifiziert === "Ja";
        if (!!p.verified !== wantVerified) return false;
      }
      return true;
    });
    if (sort.key) {
      const col = colMap[sort.key];
      if (col?.sortVal) {
        out = [...out].sort((a, b) => {
          const va = col.sortVal(a);
          const vb = col.sortVal(b);
          if (va < vb) return sort.dir === "asc" ? -1 : 1;
          if (va > vb) return sort.dir === "asc" ? 1 : -1;
          return 0;
        });
      }
    }
    return out;
  }, [q, art, standort, verifiziert, farbe, people, sort, colMap]);

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
      <div className="list-card" style={{ "--toolbar-h": `${toolbarH}px` }}>
        <div className="toolbar" ref={toolbarRef}>
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
            <button className="filter-pill" onClick={() => toggleSort(sort.key)}>
              <span>{colMap[sort.key]?.label || "Letzter Kontakt"}</span>
              {sort.dir === "asc" ? <IconArrowUp size={14} /> : <IconArrowUp size={14} style={{ transform: "rotate(180deg)" }} />}
              <IconChevronDown size={16} />
            </button>
          </div>
        </div>

        <div className="data-table-wrap">
          <table className="data-table data-table-sticky">
            <thead>
              <tr>
                {orderedCols.map((col, i) => {
                  const isSorted = sort.key === col.key;
                  const isDragging = dragKey === col.key;
                  const isDropTarget = dropKey === col.key && dragKey && dragKey !== col.key;
                  return (
                    <th
                      key={col.key}
                      draggable={true}
                      onDragStart={(e) => onDragStart(col.key, e)}
                      onDragOver={(e) => onDragOver(col.key, e)}
                      onDrop={(e) => onDrop(col.key, e)}
                      onDragEnd={onDragEnd}
                      onClick={() => toggleSort(col.key)}
                      style={{
                        width: col.width,
                      }}
                      className={`th-col ${col.sortable ? "is-sortable" : ""} ${isSorted ? "is-sorted" : ""} ${isDragging ? "is-dragging" : ""} ${isDropTarget ? "is-drop-target" : ""}`}
                      aria-sort={isSorted ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                    >
                      <span className="th-grip" aria-hidden="true">
                        <span /><span /><span /><span /><span /><span />
                      </span>
                      <span className="th-label">{col.label}</span>
                      {col.sortable && (
                        <span className={`th-sort ${isSorted ? `dir-${sort.dir}` : ""}`} aria-hidden="true">
                          <svg viewBox="0 0 12 16" width="10" height="14" fill="none">
                            <path d="M6 1 L10 6 L2 6 Z" fill="currentColor" className={`s-up ${isSorted && sort.dir === "asc" ? "active" : ""}`} />
                            <path d="M6 15 L2 10 L10 10 Z" fill="currentColor" className={`s-down ${isSorted && sort.dir === "desc" ? "active" : ""}`} />
                          </svg>
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} {...rowProps(() => onSelect && onSelect(p))} className={p.isNew ? "row-new" : ""}>
                  {orderedCols.map((col, i) => (
                    <td key={col.key}>
                      {col.render(p)}
                    </td>
                  ))}
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
