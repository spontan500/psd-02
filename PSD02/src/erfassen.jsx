/* Person erfassen — modal flow with Anrufer/Abholer + 4 Meldungstypen */

const BEZUG_OPTIONS = ["Anrufer", "Abholer", "Anrufer & Abholer"];
const STATUS_LOCATION = ["Bestätigt", "Vermutet", "Unbekannt"];
const KONFESSIONEN = ["Römisch-katholisch", "Evangelisch-reformiert", "Christkatholisch", "Jüdisch", "Muslimisch", "Konfessionslos", "Andere"];
const SPRACHEN = ["Deutsch", "Französisch", "Italienisch", "Rätoromanisch", "Englisch", "Spanisch", "Portugiesisch"];
const NATIONALITAETEN = ["Schweiz", "Deutschland", "Italien", "Frankreich", "Österreich", "Portugal", "Spanien", "Andere"];
const EFFEKT_KATEGORIEN = ["Mobiltelefon / Elektronik", "Bekleidung", "Schmuck / Uhren", "Dokumente / Ausweis", "Tasche / Rucksack", "Sportgeräte", "Andere"];
const ZUSTAND = ["neu", "gebraucht", "beschädigt"];

function LeftPane({ values, setValues, errors, mode }) {
  const onField = (key) => (val) => setValues({ ...values, [key]: val });

  return (
    <div className="pane left">
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-default)", marginBottom: 16 }}>
        Personendaten
      </div>
      <div className="card" style={{ padding: 24 }}>
        <Field label="Bezugspersonstatus">
          <Select value={values.bezug} onChange={onField("bezug")} options={BEZUG_OPTIONS} />
        </Field>

        <div style={{ height: 16 }} />
        <hr style={{ border: 0, borderTop: "1px solid var(--border-light)" }} />
        <div style={{ height: 16 }} />

        <div className="row-2">
          <Field label="Name" error={errors.name}>
            <Input value={values.name} onChange={onField("name")} placeholder="Name hinzufügen" invalid={!!errors.name} />
          </Field>
          <Field label="Vorname" error={errors.vorname}>
            <Input value={values.vorname} onChange={onField("vorname")} placeholder="Vorname hinzufügen" invalid={!!errors.vorname} />
          </Field>
        </div>

        <div style={{ height: 16 }} />

        <div className="row-2">
          <Field label="Geburtsdatum">
            <DateInput value={values.geburt} onChange={onField("geburt")} />
          </Field>
          <Field label="Geschlecht">
            <Segmented value={values.geschlecht} onChange={onField("geschlecht")} options={["Mann", "Frau", "Divers"]} />
          </Field>
        </div>

        <div style={{ height: 24 }} />
        <hr style={{ border: 0, borderTop: "1px solid var(--border-light)" }} />
        <div style={{ height: 20 }} />

        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-default)", marginBottom: 12 }}>
          Standort Anrufer/Abholer
        </div>
        <div className="row-2">
          <Field label="Standort">
            <Input value={values.standort} onChange={onField("standort")} placeholder="Erfassen" />
          </Field>
          <Field label="Status">
            <Select value={values.status} onChange={onField("status")} options={STATUS_LOCATION} />
          </Field>
        </div>

        <div style={{ height: 24 }} />
        <CollapseSection title="Adressdaten">
          <div className="row-2">
            <Field label="Strasse">
              <Input value={values.strasse} onChange={onField("strasse")} placeholder="Strasse" />
            </Field>
            <Field label="Hausnummer">
              <Input value={values.hausnr} onChange={onField("hausnr")} placeholder="Nr." />
            </Field>
          </div>
          <div style={{ height: 16 }} />
          <div className="row-2">
            <Field label="PLZ">
              <Input value={values.plz} onChange={onField("plz")} placeholder="PLZ" />
            </Field>
            <Field label="Ort">
              <Input value={values.ort} onChange={onField("ort")} placeholder="Ort" />
            </Field>
          </div>
          <div style={{ height: 16 }} />
          <div className="row-2">
            <Field label="Land">
              <Select value={values.land} onChange={onField("land")} options={NATIONALITAETEN} />
            </Field>
            <span />
          </div>
        </CollapseSection>

        <CollapseSection title="Kontaktinformationen">
          <div className="row-2">
            <Field label="Telefon Mobile" error={errors.mobile}>
              <Input value={values.mobile} onChange={onField("mobile")} placeholder="Telefon Mobile hinzufügen" invalid={!!errors.mobile} />
            </Field>
            <Field label="Telefon Privat">
              <Input value={values.privat} onChange={onField("privat")} placeholder="Telefon Privat hinzufügen" />
            </Field>
          </div>
          <div style={{ height: 16 }} />
          <div className="row-2">
            <Field label="Telefon Geschäft">
              <Input value={values.geschaeft} onChange={onField("geschaeft")} placeholder="Telefon Geschäft hinzufügen" />
            </Field>
            <Field label="E-Mail" error={errors.email}>
              <Input value={values.email} onChange={onField("email")} placeholder="E-Mail hinzufügen" invalid={!!errors.email} />
            </Field>
          </div>
          <div style={{ height: 16 }} />
          <Field label="Standort/Erreichbarkeit">
            <Textarea value={values.erreichbar} onChange={onField("erreichbar")} placeholder="z.B. erreichbare Zeiten, Hinweise" rows={3} />
          </Field>
        </CollapseSection>

        <CollapseSection title="Weiters">
          <div className="row-2">
            <Field label="Muttersprache">
              <Select value={values.mutter} onChange={onField("mutter")} options={SPRACHEN} />
            </Field>
            <Field label="Weitere Sprachen">
              <Select value={values.weitere} onChange={onField("weitere")} options={SPRACHEN} />
            </Field>
          </div>
          <div style={{ height: 16 }} />
          <div className="row-2">
            <Field label="Konfession">
              <Select value={values.konfession} onChange={onField("konfession")} options={KONFESSIONEN} />
            </Field>
            <span />
          </div>
        </CollapseSection>
      </div>
    </div>
  );
}

/* ===== Right pane: 4 tabs ===== */

const MELDUNG_TABS = ["Vermisstenmeldung", "Informationen", "Vermisste Effekte", "Betroffener"];

function RightPaneTabs({ active, onChange, counts }) {
  return (
    <div className="tabs-pills" style={{ marginBottom: 16 }}>
      {MELDUNG_TABS.map((t) => {
        const c = counts[t];
        return (
          <button
            key={t}
            className={active === t ? "active" : ""}
            onClick={() => onChange(t)}
          >
            {t}{c ? ` (${c})` : ""}
          </button>
        );
      })}
    </div>
  );
}

/* Vermisstenmeldung — multi-tab inside (Personendaten / Signalemente) */
function VermisstForm({ entry, setEntry, idx, total, callerValues }) {
  const [tab, setTab] = useState("Personendaten");
  const set = (k) => (v) => setEntry({ ...entry, [k]: v });

  // Auto-calculate Alter from Geburtsdatum (DD.MM.YYYY) — only when alter is empty or was auto-set
  const setGeburt = (v) => {
    const m = v && v.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    let next = { ...entry, geburt: v };
    if (m) {
      const d = parseInt(m[1], 10), mo = parseInt(m[2], 10) - 1, y = parseInt(m[3], 10);
      const now = new Date();
      let age = now.getFullYear() - y;
      if (now.getMonth() < mo || (now.getMonth() === mo && now.getDate() < d)) age -= 1;
      if (age >= 0 && age <= 130) next.alter = String(age);
    }
    setEntry(next);
  };

  // Toggle "Identisch mit Anrufer": copy address fields from caller when enabled
  const toggleIdentisch = (checked) => {
    if (checked) {
      setEntry({
        ...entry,
        identisch: true,
        strasse: callerValues?.strasse || "",
        hausnr: callerValues?.hausnr || "",
        plz: callerValues?.plz || "",
        ort: callerValues?.ort || "",
        land: callerValues?.land || "",
      });
    } else {
      // Clear when unchecking so the user can enter different values
      setEntry({
        ...entry,
        identisch: false,
        strasse: "",
        hausnr: "",
        plz: "",
        ort: "",
        land: "",
      });
    }
  };

  return (
    <div className="card" style={{ padding: 24 }}>
      {total > 1 && (
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12 }}>
          Vermisstmeldung {idx + 1} von {total}
        </div>
      )}

      <Field label="Beziehung">
        <Select value={entry.beziehung} onChange={set("beziehung")}
          options={["Schwager", "Bruder", "Schwester", "Vater", "Mutter", "Sohn", "Tochter", "Freund", "Freundin", "Ehemann", "Ehefrau", "Nachbar"]} />
      </Field>

      <div style={{ height: 20 }} />
      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-default)", marginBottom: 12 }}>
        Standort vermisste Person
      </div>
      <div className="row-2">
        <Field label="Status">
          <Select value={entry.status} onChange={set("status")} options={STATUS_LOCATION} />
        </Field>
        <Field label="Standort">
          <Input value={entry.standort} onChange={set("standort")} placeholder="Erfassen" />
        </Field>
      </div>

      <div style={{ height: 20 }} />
      <div className="tabs-card-track" style={{ margin: "0 -24px" }}>
        <div className="tabs-card">
          {["Personendaten", "Signalemente"].map((t) => (
            <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t}</button>
          ))}
          <span className="tabs-card-filler" aria-hidden="true" />
        </div>
      </div>

      <div style={{ paddingTop: 20 }}>
        {tab === "Personendaten" && (
          <>
            <div className="row-2">
              <Field label="Name"><Input value={entry.name} onChange={set("name")} placeholder="Name hinzufügen" /></Field>
              <Field label="Vorname"><Input value={entry.vorname} onChange={set("vorname")} placeholder="Vorname hinzufügen" /></Field>
            </div>
            <div style={{ height: 16 }} />
            <div className="row-2">
              <Field label="Geburtsdatum">
                <DateInput value={entry.geburt} onChange={setGeburt} />
              </Field>
              <Field label="Alter" right={<Checkbox checked={entry.geschaetzt} onChange={set("geschaetzt")} label="Geschätzt" />}>
                <div className="row" style={{ gap: 8 }}>
                  <Input value={entry.alter} onChange={set("alter")} placeholder="Alter" />
                  <Checkbox checked={entry.geschaetzt} onChange={set("geschaetzt")} label="Geschätzt" />
                </div>
              </Field>
            </div>
            <div style={{ height: 16 }} />
            <div className="row-2">
              <Field label="Geschlecht">
                <Segmented value={entry.geschlecht} onChange={set("geschlecht")} options={["Mann", "Frau", "Divers"]} />
              </Field>
              <span />
            </div>

            <div style={{ height: 20 }} />
            <CollapseSection title="Adressdaten" right={<Checkbox checked={entry.identisch} onChange={toggleIdentisch} label="Identisch mit Anrufer" />}>
              <div className="row-2">
                <Field label="Strasse"><Input value={entry.strasse} onChange={set("strasse")} placeholder="Strasse" disabled={entry.identisch} /></Field>
                <Field label="Hausnummer"><Input value={entry.hausnr} onChange={set("hausnr")} placeholder="Nr." disabled={entry.identisch} /></Field>
              </div>
              <div style={{ height: 16 }} />
              <div className="row-2">
                <Field label="PLZ"><Input value={entry.plz} onChange={set("plz")} placeholder="PLZ" disabled={entry.identisch} /></Field>
                <Field label="Ort"><Input value={entry.ort} onChange={set("ort")} placeholder="Ort" disabled={entry.identisch} /></Field>
              </div>
              <div style={{ height: 16 }} />
              <Field label="Land"><Select value={entry.land} onChange={set("land")} options={NATIONALITAETEN} /></Field>
            </CollapseSection>

            <CollapseSection title="Kontaktinformationen">
              <div className="row-2">
                <Field label="Telefon Mobile"><Input value={entry.mobile} onChange={set("mobile")} placeholder="Telefon Mobile hinzufügen" /></Field>
                <Field label="Telefon Privat"><Input value={entry.privat} onChange={set("privat")} placeholder="Telefon Privat hinzufügen" /></Field>
              </div>
            </CollapseSection>

            <CollapseSection title="Weiters">
              <div className="row-2">
                <Field label="Nationalität"><Select value={entry.nationalitaet} onChange={set("nationalitaet")} options={NATIONALITAETEN} /></Field>
                <Field label="Konfession"><Select value={entry.konfession} onChange={set("konfession")} options={KONFESSIONEN} /></Field>
              </div>
            </CollapseSection>
          </>
        )}

        {tab === "Signalemente" && (
          <>
            <div className="row-2">
              <Field label="Körpergrösse"><Input value={entry.koerper} onChange={set("koerper")} placeholder="Ca. xxx cm" /></Field>
              <Field label="Statur"><Select value={entry.statur} onChange={set("statur")} options={["Schlank", "Normal", "Athletisch", "Kräftig", "Übergewichtig"]} /></Field>
            </div>
            <div style={{ height: 16 }} />
            <div className="row-2">
              <Field label="Augenfarbe"><Select value={entry.augen} onChange={set("augen")} options={["Blau", "Braun", "Grün", "Grau", "Haselnussbraun"]} /></Field>
              <Field label="Haarfarbe"><Select value={entry.haare} onChange={set("haare")} options={["Blond", "Braun", "Schwarz", "Rot", "Grau", "Weiss", "Gefärbt"]} /></Field>
            </div>
            <div style={{ height: 16 }} />
            <div className="row-2">
              <Field label="Haarschnitt"><Input value={entry.haarschnitt} onChange={set("haarschnitt")} placeholder="z.B. Schulterlang" /></Field>
              <Field label="Bart/Schnauz"><Select value={entry.bart} onChange={set("bart")} options={["Keine", "Schnauz", "Oberlippenbart", "Vollbart", "Drei-Tage-Bart"]} /></Field>
            </div>
            <div style={{ height: 16 }} />
            <Field label="Kleidung"><Input value={entry.kleidung} onChange={set("kleidung")} placeholder="z.B. Jeans, blaue Jacke" /></Field>
            <div style={{ height: 16 }} />
            <div className="row-2">
              <Field label="Tattoos / Piercings"><Input value={entry.tattoos} onChange={set("tattoos")} placeholder="Hinzufügen" /></Field>
              <Field label="Besondere Kennzeichen"><Input value={entry.kennzeichen} onChange={set("kennzeichen")} placeholder="z.B. Brille" /></Field>
            </div>
            <div style={{ height: 16 }} />
            <Field label="Weitere Angaben">
              <Textarea value={entry.weitere} onChange={set("weitere")} placeholder="Zusätzliche Hinweise zur Person" rows={3} />
            </Field>
          </>
        )}
      </div>
    </div>
  );
}

function VermisstCollapsedCard({ entry, idx, onExpand }) {
  const fullName = [entry.name, entry.vorname].filter(Boolean).join(" ").trim();
  const display = fullName || `Vermisste Person ${idx + 1}`;
  const statusParts = [entry.status, entry.standort].filter(Boolean);
  const subtitle = statusParts.length ? statusParts.join(", ") : "Noch nicht erfasst";
  return (
    <div
      className="vermisst-collapsed"
      role="button"
      tabIndex={0}
      onClick={onExpand}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onExpand(); } }}
    >
      <div className="vermisst-collapsed-left">
        <AvatarUnknown size={40} />
        <div className="vermisst-collapsed-text">
          <div className="vermisst-collapsed-name">{display}</div>
          <div className="vermisst-collapsed-sub">{subtitle}</div>
          <span className="tag tag-vermisst" style={{ marginTop: 6 }}>VERMISST</span>
        </div>
      </div>
      <div className="vermisst-collapsed-right">
        <span className="vermisst-collapsed-meta">
          <IconRefresh size={13} /> 1min ago
        </span>
        <span className="vermisst-collapsed-chevron" aria-hidden="true">
          <IconChevronRight size={18} />
        </span>
      </div>
    </div>
  );
}

function VermisstPanel({ entries, setEntries, callerValues }) {
  const [expandedIdx, setExpandedIdx] = useState(0);
  const add = () => {
    const next = [...entries, { ...EMPTY_VERMISST }];
    setEntries(next);
    setExpandedIdx(next.length - 1);
  };
  // Keep expanded index in range if entries shrinks somehow
  const safeExpanded = Math.min(expandedIdx, entries.length - 1);
  return (
    <div className="fieldset" style={{ gap: 16 }}>
      {entries.map((entry, i) => (
        i === safeExpanded ? (
          <VermisstForm
            key={i}
            entry={entry}
            idx={i}
            total={entries.length}
            callerValues={callerValues}
            setEntry={(e) => {
              const nxt = [...entries];
              nxt[i] = e;
              setEntries(nxt);
            }}
          />
        ) : (
          <VermisstCollapsedCard
            key={i}
            entry={entry}
            idx={i}
            onExpand={() => setExpandedIdx(i)}
          />
        )
      ))}
      <button className="add-row" onClick={add}>
        <IconPlusCircle size={18} /> Weitere Meldung hinzufügen
      </button>
    </div>
  );
}

/* Informationen (formerly Zeugenmeldung) */
function ZeugenPanel({ entries, setEntries }) {
  const add = () => setEntries([...entries, { text: "" }]);
  return (
    <div className="fieldset" style={{ gap: 16 }}>
      {entries.map((entry, i) => (
        <div key={i} className="card" style={{ padding: 24 }}>
          <div className="spread" style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 16, fontWeight: 700 }}>
              Information{entries.length > 1 ? ` ${i + 1}` : ""}
            </div>
            <button className="icon-btn" title="Wichtige Information markieren">
              <IconFlagOutline size={18} />
            </button>
          </div>
          <Textarea
            value={entry.text}
            onChange={(v) => {
              const next = [...entries];
              next[i] = { ...entry, text: v };
              setEntries(next);
            }}
            placeholder="Information erfassen…"
            autoGrow
            minRows={6}
          />
          <div className="row muted" style={{ marginTop: 12, fontSize: 12, gap: 8 }}>
            <IconRefresh size={14} /> 1min ago <span className="sep">|</span>
            <span>Name Vorname, Rolle, Location</span>
          </div>
        </div>
      ))}
      <button className="add-row" onClick={add}>
        <IconPlusCircle size={18} /> Weitere Information hinzufügen
      </button>
    </div>
  );
}

/* Vermisste Effekte */
function EffekteForm({ entry, setEntry, idx, total }) {
  const set = (k) => (v) => setEntry({ ...entry, [k]: v });
  return (
    <div className="card" style={{ padding: 24 }}>
      {total > 1 && (
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", marginBottom: 12 }}>
          Effekt {idx + 1} von {total}
        </div>
      )}
      <div className="row-2">
        <Field label="Kategorie">
          <Select value={entry.kategorie} onChange={set("kategorie")} options={EFFEKT_KATEGORIEN} />
        </Field>
        <Field label="Verlustort">
          <Input value={entry.verlustort} onChange={set("verlustort")} placeholder="z.B. Wagen 1 des Zuges" />
        </Field>
      </div>

      <div style={{ height: 24 }} />
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Objektinformationen</div>
      <Field label="Beschreibung">
        <Textarea value={entry.beschreibung} onChange={set("beschreibung")} rows={3} placeholder="Detaillierte Beschreibung" />
      </Field>

      <div style={{ height: 16 }} />
      <div className="row-2">
        <Field label="Marke"><Input value={entry.marke} onChange={set("marke")} placeholder="z.B. Apple" /></Field>
        <Field label="Serien-/Rahmen-/IMEI-Nr."><Input value={entry.serien} onChange={set("serien")} placeholder="Erfassen" /></Field>
      </div>
      <div style={{ height: 16 }} />
      <div className="row-2">
        <Field label="Farbe"><Input value={entry.farbe} onChange={set("farbe")} placeholder="Farbe" /></Field>
        <Field label="Menge / Stückzahl"><Input value={entry.menge} onChange={set("menge")} placeholder="1" /></Field>
      </div>
      <div style={{ height: 16 }} />
      <div className="row-2">
        <Field label="Gewicht / Masse (ca.)"><Input value={entry.gewicht} onChange={set("gewicht")} placeholder="Erfassen" /></Field>
        <Field label="Zustand"><Select value={entry.zustand} onChange={set("zustand")} options={ZUSTAND} /></Field>
      </div>

      <div style={{ height: 24 }} />
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Zugehörige Effekte</div>
      <button className="add-row">
        <IconPlusCircle size={18} /> Hinzufügen
      </button>
    </div>
  );
}

function EffektePanel({ entries, setEntries }) {
  const add = () => setEntries([...entries, { ...EFFEKTE[0], beschreibung: "", marke: "", farbe: "", menge: "", zustand: "" }]);
  return (
    <div className="fieldset" style={{ gap: 16 }}>
      {entries.map((e, i) => (
        <EffekteForm
          key={i}
          entry={e}
          idx={i}
          total={entries.length}
          setEntry={(v) => {
            const next = [...entries];
            next[i] = v;
            setEntries(next);
          }}
        />
      ))}
      <button className="add-row" onClick={add}>
        <IconPlusCircle size={18} /> Weitere Effekte hinzufügen
      </button>
    </div>
  );
}

/* Betroffener — simplified */
function BetroffenenPanel() {
  const [vals, setVals] = useState({ name: "", vorname: "", geburt: "", geschlecht: "", verletzt: "", besonderes: "" });
  const set = (k) => (v) => setVals({ ...vals, [k]: v });
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="row-2">
        <Field label="Name"><Input value={vals.name} onChange={set("name")} placeholder="Name hinzufügen" /></Field>
        <Field label="Vorname"><Input value={vals.vorname} onChange={set("vorname")} placeholder="Vorname hinzufügen" /></Field>
      </div>
      <div style={{ height: 16 }} />
      <div className="row-2">
        <Field label="Geburtsdatum">
        <DateInput value={vals.geburt} onChange={set("geburt")} />
      </Field>
        <Field label="Geschlecht">
          <Segmented value={vals.geschlecht} onChange={set("geschlecht")} options={["Mann", "Frau", "Divers"]} />
        </Field>
      </div>
      <div style={{ height: 20 }} />
      <Field label="Verletzungen / Zustand">
        <Textarea value={vals.verletzt} onChange={set("verletzt")} rows={3} placeholder="Beschreibung der Verletzungen oder des Zustands" />
      </Field>
      <div style={{ height: 16 }} />
      <Field label="Besondere Hinweise">
        <Textarea value={vals.besonderes} onChange={set("besonderes")} rows={2} placeholder="Allergien, Medikamente, ärztliche Versorgung, etc." />
      </Field>
    </div>
  );
}

/* Right pane container */
function RightPane({ activeTab, setActiveTab, vermisst, setVermisst, zeugen, setZeugen, effekte, setEffekte, callerValues }) {
  return (
    <div className="pane right">
      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text-default)", marginBottom: 16 }}>
        Meldungen
      </div>
      <RightPaneTabs
        active={activeTab}
        onChange={setActiveTab}
        counts={{
          "Vermisstenmeldung": vermisst.length > 1 ? vermisst.length : (vermisst.length === 1 && vermisst[0].name ? 1 : 0),
          "Informationen": zeugen.length > 1 ? zeugen.length : (zeugen.length === 1 && zeugen[0].text ? 1 : 0),
          "Vermisste Effekte": effekte.length > 1 ? effekte.length : 0,
          "Betroffener": 0,
        }}
      />
      {activeTab === "Vermisstenmeldung" && <VermisstPanel entries={vermisst} setEntries={setVermisst} callerValues={callerValues} />}
      {activeTab === "Informationen" && <ZeugenPanel entries={zeugen} setEntries={setZeugen} />}
      {activeTab === "Vermisste Effekte" && <EffektePanel entries={effekte} setEntries={setEffekte} />}
      {activeTab === "Betroffener" && <BetroffenenPanel />}
    </div>
  );
}

/* Top-level Person erfassen modal */
function PersonErfassenModal({ onClose, onSaved, preset = "empty", initialTab = "Vermisstenmeldung" }) {
  const startEmpty = preset === "empty";
  const [values, setValues] = useState(startEmpty ? { ...EMPTY_VALUES } : { ...PRESET_VALUES });
  const [activeTab, setActiveTab] = useState(initialTab);
  const [vermisst, setVermisst] = useState(startEmpty
    ? [{ ...EMPTY_VERMISST }]
    : [{ ...PRESET_VERMISST }]);
  const [zeugen, setZeugen] = useState(startEmpty ? [{ text: "" }] : [{ text: ZEUGEN_TEXT }]);
  const [effekte, setEffekte] = useState(startEmpty
    ? [{ ...EMPTY_EFFEKT }]
    : [{ ...EFFEKTE[0] }]);
  const [errors, setErrors] = useState({});
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  // Track snapshot of initial state to detect "dirty"
  const initialRef = useRef(null);
  if (!initialRef.current) {
    initialRef.current = JSON.stringify({ values, vermisst, zeugen, effekte });
  }
  const isDirty = () => {
    return JSON.stringify({ values, vermisst, zeugen, effekte }) !== initialRef.current;
  };

  const handleSave = () => {
    const errs = validatePerson(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSaved && onSaved({ values, vermisst, zeugen, effekte, activeTab });
  };

  const guard = () => {
    if (isDirty()) {
      setConfirmDiscard(true);
      return false;
    }
    return true;
  };

  return (
    <>
      <Modal
        title="Person erfassen"
        subtitle="AG - Koblenz - 7 - Frontalkollision PW - SNZ Bern"
        onClose={onClose}
        onBeforeClose={guard}
        footer={
          <>
            <Button variant="ghost" onClick={() => { if (guard()) onClose && onClose(); }}>Abbrechen</Button>
            <Button variant="primary" onClick={handleSave}>Speichern</Button>
          </>
        }
      >
        <div className="erfassen-split">
          <LeftPane values={values} setValues={setValues} errors={errors} mode={preset} />
          <RightPane
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            vermisst={vermisst} setVermisst={setVermisst}
            zeugen={zeugen} setZeugen={setZeugen}
            effekte={effekte} setEffekte={setEffekte}
            callerValues={values}
          />
        </div>
      </Modal>
      {confirmDiscard && (
        <ConfirmDialog
          title="Erfassung verwerfen?"
          message="Die eingegebenen Daten gehen verloren. Möchtest du die Erfassung wirklich abbrechen?"
          confirmLabel="Verwerfen"
          cancelLabel="Weiter bearbeiten"
          onConfirm={() => { setConfirmDiscard(false); onClose && onClose(); }}
          onCancel={() => setConfirmDiscard(false)}
        />
      )}
    </>
  );
}

Object.assign(window, {
  PersonErfassenModal,
  BEZUG_OPTIONS, MELDUNG_TABS,
});
