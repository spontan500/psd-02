/* IES NG — Anrufer/Abholer prototype root */

const DEFAULT_TWEAKS = /*EDITMODE-BEGIN*/{
  "dashboardVariant": "full",
  "formPreset": "empty",
  "personType": "Anrufer",
  "initialTab": "Vermisstenmeldung",
  "sidebarStart": "open"
}/*EDITMODE-END*/;

/* Simple data store passed via context so saved Anrufer + Vermisstmeldungen
   appear live in the Anrufliste, Personen-Liste and Vermisste-Personen-Liste. */
const DataStoreContext = React.createContext(null);
function useDataStore() {
  return React.useContext(DataStoreContext) || {
    people: PEOPLE, callers: CALLERS, vermisste: VERMISSTE, recentCalls: RECENT_CALLS,
  };
}
window.useDataStore = useDataStore;

function App() {
  const [route, setRoute] = useState({ screen: "dashboard", tab: "infoline", eventId: "ag-koblenz-7" });
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [t, setT] = useTweaks(DEFAULT_TWEAKS);

  // Live data store — seeded from sample data, mutated on save.
  const [people, setPeople] = useState(PEOPLE);
  const [callers, setCallers] = useState(CALLERS);
  const [vermisste, setVermisste] = useState(VERMISSTE);
  const [recentCalls, setRecentCalls] = useState(RECENT_CALLS);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return t.sidebarStart === "collapsed" || window.innerWidth < 900;
  });

  const closeModal = () => setModal(null);

  const openErfassen = (opts = {}) => {
    setModal({
      kind: "erfassen",
      preset: t.formPreset,
      initialTab: t.initialTab,
      personType: t.personType,
      ...opts,
    });
  };

  const openList = (kind) => {
    setModal({ kind: "list", listKind: kind });
  };

  const openDossier = (person) => {
    const dKind = person.kind === "abholer" ? "abholer" : "anrufer";
    setModal({ kind: "dossier", person, dossierKind: dKind });
  };

  const handlePersonSaved = (payload) => {
    addPersonRecord(payload);
    closeModal();
    const meldungenCount = (payload?.vermisst || []).filter(v => (v.name || "").trim() || (v.vorname || "").trim()).length;
    if (meldungenCount > 0) {
      setToast({ message: `Anrufer erfasst – ${meldungenCount} Vermisstmeldung${meldungenCount > 1 ? "en" : ""} gespeichert` });
    } else {
      setToast({ message: "Anrufer erfasst" });
    }
  };

  /* Push the newly-saved person into the live store:
     - Caller goes into the Anrufliste (CallListWidget) + Anrufer-Liste
     - Caller is added to the Personen-Liste as type "ANRUFER"
     - Each filled Vermisstmeldung is appended to the Vermisste-Personen-Liste */
  const addPersonRecord = (payload) => {
    if (!payload) return;
    const { values, vermisst } = payload;
    if (!values?.name?.trim() && !values?.vorname?.trim()) return;

    const filledVermisst = (vermisst || []).filter(
      v => (v.name || "").trim() || (v.vorname || "").trim()
    );
    const reason = filledVermisst.length === 0
      ? "Informationsträger"
      : `Vermisstmeldung${filledVermisst.length > 1 ? "en" : ""} (${filledVermisst.length})`;

    const phone = values.mobile || values.privat || values.geschaeft || "—";
    const relations = filledVermisst.map(v => v.beziehung).filter(Boolean);
    const relation = relations.length ? Array.from(new Set(relations)).join(", ") : "—";
    const stamp = Date.now();

    const newCaller = {
      id: `c-${stamp}`,
      name: values.name || "—",
      first: values.vorname || "—",
      phone,
      reason,
      relation,
      isNew: true,
    };

    const newPerson = {
      id: stamp,
      kind: "caller",
      name: values.name || "—",
      first: values.vorname || "—",
      phone,
      type: "ANRUFER",
      location: [values.plz, values.ort].filter(Boolean).join(" ") || values.standort || "—",
      lastContact: "Soeben",
      isNew: true,
    };

    const tag = filledVermisst.length ? "VERMISSTENMELDUNG" : "INFORMATIONSTRÄGER";
    const tagClass = filledVermisst.length ? "tag-vermisst" : "tag-neutral";
    const newRecent = {
      name: `${values.name || ""} ${values.vorname || ""}`.trim() || "—",
      phone,
      tag,
      tagClass,
    };

    const newVermisstRows = filledVermisst.map((v, i) => ({
      id: `v-${stamp}-${i}`,
      name: v.name || "—",
      first: v.vorname || "—",
      age: v.alter || "—",
      dob: v.geburt || "",
      status: v.status || "Unbekannt",
      location: v.standort || "Unbekannt",
      last: "Soeben",
      relation: v.beziehung || "—",
      caller: { name: values.name, first: values.vorname, phone },
      isNew: true,
    }));

    setCallers(prev => [newCaller, ...prev]);
    setPeople(prev => [newPerson, ...prev]);
    setRecentCalls(prev => [newRecent, ...prev].slice(0, 5));
    if (newVermisstRows.length) setVermisste(prev => [...newVermisstRows, ...prev]);
  };

  // Render main screen
  let mainContent;
  if (route.screen === "dashboard") {
    const tab = route.tab || "infoline";
    const variant = (tab === "infoline" && t.dashboardVariant === "full") ? "full"
      : (tab === "chat" || t.dashboardVariant === "reduced") ? "reduced" : "full";
    mainContent = (
      <Dashboard
        variant={variant}
        navigate={setRoute}
        openErfassen={openErfassen}
        openList={openList}
      />
    );
  } else if (route.screen === "ereignisliste") {
    mainContent = <EreignisListe />;
  }

  return (
    <DataStoreContext.Provider value={{ people, callers, vermisste, recentCalls }}>
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        route={route}
        navigate={(r) => setRoute({ ...route, ...r })}
        collapsed={sidebarCollapsed}
        onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="main">
        <Topbar
          route={route}
          navigate={(r) => setRoute({ ...route, ...r })}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        {mainContent}
      </div>

      {modal?.kind === "erfassen" && (
        <PersonErfassenModal
          onClose={closeModal}
          onSaved={handlePersonSaved}
          preset={modal.preset}
          initialTab={modal.initialTab}
        />
      )}

      {modal?.kind === "list" && (
        <ListModalSwitch
          listKind={modal.listKind}
          onClose={closeModal}
          onSelect={(p) => {
            if (modal.listKind === "personen") openDossier(p);
            else if (modal.listKind === "anrufer") openDossier({ ...p, kind: "caller" });
            else if (modal.listKind === "vermisste") openDossier({ ...p, kind: "unknown" });
          }}
        />
      )}

      {modal?.kind === "dossier" && (
        <PersonendossierModal
          person={modal.person}
          kind={modal.dossierKind}
          onClose={closeModal}
        />
      )}

      {toast && <Toast message={toast.message} onDone={() => setToast(null)} />}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Dashboard">
          <TweakRadio
            label="Variante"
            value={t.dashboardVariant}
            onChange={(v) => setT("dashboardVariant", v)}
            options={[
              { value: "full", label: "Datenmanager" },
              { value: "reduced", label: "Infoline" },
            ]}
          />
          <TweakRadio
            label="Sidebar"
            value={t.sidebarStart}
            onChange={(v) => { setT("sidebarStart", v); setSidebarCollapsed(v === "collapsed"); }}
            options={[
              { value: "open", label: "Offen" },
              { value: "collapsed", label: "Eingeklappt" },
            ]}
          />
        </TweakSection>

        <TweakSection label="Person erfassen">
          <TweakRadio
            label="Formular"
            value={t.formPreset}
            onChange={(v) => setT("formPreset", v)}
            options={[
              { value: "filled", label: "Ausgefüllt" },
              { value: "empty", label: "Leer" },
            ]}
          />
          <TweakSelect
            label="Bezugsperson"
            value={t.personType}
            onChange={(v) => setT("personType", v)}
            options={["Anrufer", "Abholer", "Anrufer & Abholer"]}
          />
          <TweakSelect
            label="Initialer Tab"
            value={t.initialTab}
            onChange={(v) => setT("initialTab", v)}
            options={["Vermisstenmeldung", "Informationen", "Vermisste Effekte", "Betroffener"]}
          />
        </TweakSection>

        <TweakSection label="Screens öffnen">
          <TweakButton label="Person erfassen" onClick={() => openErfassen()} />
          <TweakButton label="Übersicht – Personen" onClick={() => openList("personen")} />
          <TweakButton label="Liste – Anrufer" onClick={() => openList("anrufer")} />
          <TweakButton label="Liste – Vermisste" onClick={() => openList("vermisste")} />
          <TweakButton label="Liste – Vermisstmeldungen" onClick={() => openList("vermisstmeldungen")} />
          <TweakButton label="Liste – Zeugen" onClick={() => openList("zeugen")} />
          <TweakButton label="Liste – Streugut" onClick={() => openList("streugut")} />
          <TweakButton label="Dossier – Anrufer" onClick={() => openDossier({ kind: "caller", name: "Gaultier", first: "Serge", location: "3600 Thun, Mattenstrasse" })} />
          <TweakButton label="Dossier – Abholer" onClick={() => openDossier({ kind: "abholer", name: "Badoux", first: "Anna", location: "Betreuungsposten" })} />
        </TweakSection>
      </TweaksPanel>
    </div>
    </DataStoreContext.Provider>
  );
}

function ListModalSwitch({ listKind, onClose, onSelect }) {
  switch (listKind) {
    case "anrufer": return <AnruferListModal onClose={onClose} onSelect={onSelect} />;
    case "vermisste": return <VermisstListModal onClose={onClose} onSelect={onSelect} />;
    case "vermisstmeldungen": return <VermisstmeldungenListModal onClose={onClose} />;
    case "zeugen": return <ZeugenListModal onClose={onClose} />;
    case "streugut": return <StreugutListModal onClose={onClose} />;
    case "personen":
    case "patienten":
    case "info":
    default:
      return <PersonenListModal title={
        listKind === "patienten" ? "Patienten (12)" :
        listKind === "info" ? "Informationsträger (2)" : undefined
      } onClose={onClose} onSelect={onSelect} onSave={onClose} />;
  }
}

function EreignisListe() {
  return (
    <div className="page-scroll">
      <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>Ereignisliste</div>
        <div className="muted">Übersicht aller aktiven Einsätze.</div>
        <div style={{ height: 8 }} />
        {EVENTS.map((ev) => (
          <div key={ev.id} className="row" style={{
            justifyContent: "space-between",
            padding: 16, borderRadius: 12,
            border: "1px solid var(--border-light)",
          }}>
            <div className="row" style={{ gap: 16 }}>
              <SidebarEventIcon kind={ev.icon} color={ev.color} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{ev.title}</div>
                <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>SNZ Bern · Aktiv</div>
              </div>
            </div>
            <Button variant="ghost" icon={<IconArrowRight size={16} />}>Öffnen</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
