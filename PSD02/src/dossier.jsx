/* Personendossier (Detail) — ID-072 to ID-075 */

function DossierSidebar({ person, activeIdx = 0, onChange, history = [] }) {
  let Avatar = AvatarUnknown;
  if (person.kind === "caller") Avatar = AvatarCaller;
  else if (person.kind === "abholer") Avatar = AvatarAbholer;

  return (
    <div className="dossier-side">
      <div>
        <Avatar size={88} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-default)" }}>
          {person.name} {person.first}
        </div>
        <div style={{ marginTop: 8 }}>
          <span className="location-pill">
            <IconMapPin size={14} />
            {person.location || "Unbekannt"}
          </span>
        </div>
      </div>
      <div className="dossier-history">
        {history.map((h, i) => (
          <button
            key={i}
            className={`history-item ${i === activeIdx ? "active" : ""}`}
            onClick={() => onChange && onChange(i)}
          >
            <div className="left">
              <span>{h.title}</span>
              <span className="when"><IconRefresh size={12} /> {h.when || "1min ago"}</span>
            </div>
            <IconChevronRight size={16} className="muted" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ReadField({ label, value, placeholder }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="input" style={{ background: "var(--bg-field)", cursor: "default" }}>
        {value || <span className="muted">{placeholder || "—"}</span>}
      </div>
    </div>
  );
}

/* Dossier — Anrufer Personendaten (ID-072) */
function DossierAnruferPersonendaten({ person }) {
  return (
    <div className="dossier-main">
      <div className="section-card">
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Personendaten</div>
        <div className="row-2">
          <ReadField label="Name" value={person.name} />
          <ReadField label="Vorname" value={person.first} />
        </div>
        <div style={{ height: 16 }} />
        <div className="row-2">
          <ReadField label="Geburtsdatum" value="22.05.1979" />
          <Field label="Geschlecht">
            <Segmented value="Mann" onChange={() => {}} options={["Mann", "Frau", "Divers"]} />
          </Field>
        </div>
      </div>

      <div className="section-card">
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Adressdaten</div>
        <div className="row-2">
          <ReadField label="Strasse" value="Rougemontweg" />
          <ReadField label="Hausnummer" value="31" />
        </div>
        <div style={{ height: 16 }} />
        <div className="row-2">
          <ReadField label="PLZ" value="3200" />
          <ReadField label="Ort" value="Biel" />
        </div>
        <div style={{ height: 16 }} />
        <ReadField label="Land" value="Schweiz" />
      </div>

      <div className="section-card">
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Kontaktinformationen</div>
        <div className="row-2">
          <ReadField label="Telefon Mobile" value="+41 78 000 00 00" />
          <ReadField label="Telefon Privat" value="+41 32 000 00 00" />
        </div>
        <div style={{ height: 16 }} />
        <div className="row-2">
          <ReadField label="Telefon Geschäft" placeholder="Telefon Geschäft hinzufügen" />
          <ReadField label="E-Mail" value={`${person.first.toLowerCase()}${person.name.toLowerCase()}@mail.com`} />
        </div>
        <div style={{ height: 16 }} />
        <Field label="Standort/Erreichbarkeit">
          <Textarea value="Ist von 14:00 bis 15:00 nicht erreichbar" onChange={() => {}} rows={2} />
        </Field>
      </div>

      <div className="section-card">
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Weiteres</div>
        <div className="row-2">
          <Field label="Muttersprache">
            <Select value="Deutsch" onChange={() => {}} options={SPRACHEN} />
          </Field>
          <Field label="Weitere Sprachen">
            <Select value="Französisch" onChange={() => {}} options={SPRACHEN} />
          </Field>
        </div>
        <div style={{ height: 16 }} />
        <Field label="Konfession">
          <Select value="" onChange={() => {}} options={KONFESSIONEN} />
        </Field>
      </div>

      <div className="section-card">
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Patientenidentifikation</div>
        <div className="row-2">
          <Field label="PLS Nummer" required>
            <Input value="" onChange={() => {}} placeholder="PLS Nummer hinzufügen" />
          </Field>
          <ReadField label="AHV Nummer" value="756.0000.0000.00" />
        </div>
        <div style={{ height: 16 }} />
        <div className="row-2">
          <ReadField label="ID- oder Passnummer" placeholder="ID- oder Passnummer hinzufügen" />
          <ReadField label="Führerschein Nummer" placeholder="Führerschein Nummer hinzufügen" />
        </div>
        <div style={{ height: 16 }} />
        <div className="row-2">
          <Field label="KIS-Nummer PID">
            <Input value="" onChange={() => {}} placeholder="KIS-Nummer local FID hinzufügen" />
            <button className="add-row" style={{ alignSelf: "flex-start", paddingTop: 4 }}>
              <IconPlus size={16} /> Hinzufügen
            </button>
          </Field>
          <Field label="KIS-Nummer FID">
            <Input value="" onChange={() => {}} placeholder="KIS-Nummer local FID hinzufügen" />
            <button className="add-row" style={{ alignSelf: "flex-start", paddingTop: 4 }}>
              <IconPlus size={16} /> Hinzufügen
            </button>
          </Field>
        </div>
        <div style={{ height: 16 }} />
        <Field label="Bemerkung">
          <Input value="" onChange={() => {}} placeholder="Bemerkung hinzufügen" />
        </Field>
      </div>
    </div>
  );
}

/* Dossier — Aussagen (Vermisstmeldungen) (ID-073) */
function DossierAussagen({ kind = "vermisst" }) {
  if (kind === "vermisst") {
    return (
      <div className="dossier-main">
        {VERMISSTE.slice(0, 2).map((v, i) => (
          <div key={v.id} className="section-card">
            <div className="spread" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Vermisstmeldung #{i + 1}</div>
              <span className="tag tag-vermisst">{v.status.toUpperCase()}</span>
            </div>
            <div className="row-2">
              <ReadField label="Name" value={v.name} />
              <ReadField label="Vorname" value={v.first} />
            </div>
            <div style={{ height: 16 }} />
            <div className="row-2">
              <ReadField label="Geburtsdatum" value={v.dob} />
              <ReadField label="Alter" value={`${v.age} Jahre`} />
            </div>
            <div style={{ height: 16 }} />
            <div className="row-2">
              <ReadField label="Standort" value={v.location} />
              <ReadField label="Beziehung" value={v.relation} />
            </div>
            <div style={{ height: 20 }} />
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Signalemente</div>
            <div className="row-2">
              <ReadField label="Körpergrösse" value="Ca. 180 cm" />
              <ReadField label="Statur" value="Schlank" />
            </div>
            <div style={{ height: 16 }} />
            <Field label="Weitere Angaben">
              <Textarea value={i === 0 ? "Hat wahrscheinlich eine Gitarre dabei. Unterwegs mit Ehefrau" : "Trug bunte Jacke. Hat eine Gehhilfe dabei."} onChange={() => {}} rows={2} />
            </Field>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "effekte") {
    return (
      <div className="dossier-main">
        {EFFEKTE.map((e, i) => (
          <div key={i} className="section-card">
            <div className="spread" style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{e.kategorie}</div>
              <span className="tag tag-info-light">EFFEKT {i + 1}</span>
            </div>
            <Field label="Beschreibung">
              <Textarea value={e.beschreibung} onChange={() => {}} rows={2} />
            </Field>
            <div style={{ height: 16 }} />
            <div className="row-2">
              <ReadField label="Marke" value={e.marke} />
              <ReadField label="Farbe" value={e.farbe} />
            </div>
            <div style={{ height: 16 }} />
            <div className="row-2">
              <ReadField label="Verlustort" value={e.verlustort} />
              <ReadField label="Zustand" value={e.zustand} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

/* Top-level dossier modal */
function PersonendossierModal({ person, kind = "anrufer", onClose }) {
  const [tab, setTab] = useState("Personendaten");
  const [activeIdx, setActiveIdx] = useState(0);

  const history = kind === "anrufer"
    ? [
        { title: "Vermisstmeldung – Lehmann Anna", when: "1min ago" },
        { title: "Informationsträger – allgemein", when: "12min ago" },
      ]
    : [
        { title: "Effekt – iPhone 17 Pro", when: "1min ago" },
        { title: "Abholung – Wagen 1 des Zuges", when: "32min ago" },
      ];

  const detailType = kind === "anrufer" ? "vermisst" : "effekte";

  return (
    <Modal
      title="Personendossier"
      onClose={onClose}
      headerRight={
        <div className="row" style={{ gap: 12, marginRight: 8 }}>
          <Button variant="ghost" onClick={onClose}>Änderungen verwerfen</Button>
          <Button variant="primary" onClick={onClose}>Änderungen speichern</Button>
        </div>
      }
    >
      <div style={{ padding: 24 }}>
        <div className="tabs-pills" style={{ marginBottom: 16 }}>
          {["Personendaten", "Aussagen"].map((t) => (
            <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <div className="dossier-grid" style={{ padding: 0 }}>
          <DossierSidebar
            person={person}
            activeIdx={activeIdx}
            onChange={setActiveIdx}
            history={history}
          />
          {tab === "Personendaten" && <DossierAnruferPersonendaten person={person} />}
          {tab === "Aussagen" && <DossierAussagen kind={detailType} />}
        </div>
      </div>
    </Modal>
  );
}

Object.assign(window, { PersonendossierModal });
