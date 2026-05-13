/* Sample data — fictional incidents and people for the Anrufer/Abholer prototype */

const EVENTS = [
  {
    id: "ag-koblenz-7",
    title: "AG - Koblenz - 7 - Frontalkollision PW - SNZ Bern",
    short: "AG - Koblenz - 7 - Frontalkollision PW - SNZ Bern",
    icon: "fire",
    color: "rgb(240,17,58)",
    badge: 1,
    expanded: true,
    children: [
      { id: "standard", label: "Standardansicht" },
      { id: "einsatzleiter", label: "Einsatzleiter" },
      { id: "chat", label: "Chat", badge: 1 },
      { id: "karte", label: "Karte" },
      { id: "infoline", label: "Infoline" },
      { id: "journal", label: "Ereignisjournal" },
    ],
  },
  {
    id: "be-oey",
    title: "BE - Oey Diemtigen - 12 - Frontalkollision Car und Lastwagen - SNZ Bern",
    short: "BE - Oey Diemtigen - 12",
    icon: "radioactive",
    color: "rgb(240,17,58)",
  },
  {
    id: "zh-waedenswil",
    title: "ZH - Wädenswil - 5 - Chemieunfall - SNZ Zürich",
    short: "ZH - Wädenswil - 5",
    icon: "train",
    color: "rgb(240,17,58)",
  },
];

const FREE_VIEWS = [
  { id: "viasuisse", label: "Viasuisse" },
  { id: "freie-2", label: "Freie Ansicht 2" },
];

// Recent calls on dashboard
const RECENT_CALLS = [
  { name: "Hans Hurni", phone: "+41 31 333 31 13", tag: "INFORMATIONSTRÄGER", tagClass: "tag-neutral" },
  { name: "Jolanda Kachelmann", phone: "+41 31 333 31 13", tag: "VERMISSTENMELDUNG", tagClass: "tag-vermisst" },
  { name: "Hans Hurni", phone: "+41 31 333 31 13", tag: "INFORMATIONSTRÄGER", tagClass: "tag-neutral" },
];

// Master person list (Übersicht modal — Personen 132)
const PEOPLE = [
  { id: 1, kind: "abholer", name: "Badoux", first: "Anna", phone: "+41 79 777 00 00", type: "ABHOLER", verified: null, location: "Betreuungsposten", lastContact: "Heute, 11:37 Uhr", color: "rgb(165,116,240)" },
  { id: 2, kind: "caller", name: "Gaultier", first: "Serge", phone: "+41 78 000 00 00", type: "INFORMATIONSTRÄGER", verified: null, flagged: true, location: "3600 Thun, Mattenstrasse", lastContact: "Heute, 11:37 Uhr" },
  { id: 3, kind: "patient", patientLabel: "III", name: "Meier", first: "Lea", phone: "+41 33 336 40 10", type: "PATIENT", verified: true, location: "SanHist", lastContact: "Heute, 11:32 Uhr" },
  { id: 4, kind: "caller", name: "Schmid", first: "Noah", phone: "+41 33 336 40 10", type: "INFORMATIONSTRÄGER", location: "SanHist", lastContact: "Heute, 11:29 Uhr" },
  { id: 5, kind: "unknown", name: "Kellenberger", first: "Marius", phone: "+41 79 880 81 82", type: "PATIENT,INFORMATIONSTRÄGER", location: "Sammelstelle", lastContact: "Heute, 11:30 Uhr" },
  { id: 6, kind: "patient", patientLabel: "0", name: "Schneider", first: "Mia", phone: "+41 33 336 40 10", type: "PATIENT,INFORMATIONSTRÄGER", flagged: true, verified: true, location: "SanHist", lastContact: "Heute, 11:27 Uhr" },
  { id: 7, kind: "patient", patientLabel: "0", name: "Fischer", first: "Leon", phone: "+41 79 880 81 82", type: "PATIENT,INFORMATIONSTRÄGER", verified: true, location: "SanHist", lastContact: "Heute, 11:21 Uhr" },
  { id: 8, kind: "patient", patientLabel: "0", name: "Weber", first: "Emma", phone: "+41 79 880 81 82", type: "PATIENT", location: "SanHist", lastContact: "Heute, 11:13 Uhr" },
  { id: 9, kind: "unknown", photo: true, name: "Kellenberger", first: "Petra", phone: "+41 79 880 81 82", type: "VERMISST", location: "Unbekannt", lastContact: "Heute, 11:01 Uhr" },
  { id: 10, kind: "patient", patientLabel: "0", name: "Baumann", first: "Maria", phone: "+41 33 336 40 10", type: "PATIENT", location: "SanHist", lastContact: "Heute, 10:57 Uhr" },
  { id: 11, kind: "patient", patientLabel: "0", name: "Frei", first: "Nico", phone: "+41 33 336 40 10", type: "PATIENT,INFORMATIONSTRÄGER", flagged: true, location: "SanHist", lastContact: "Heute, 10:52 Uhr" },
  { id: 12, kind: "patient", patientLabel: "III", name: "Keller", first: "Nina", phone: "+41 33 336 40 10", type: "PATIENT,INFORMATIONSTRÄGER", flagged: true, location: "SanHist", lastContact: "Heute, 10:36 Uhr" },
  { id: 13, kind: "caller", name: "Moser", first: "Sarah", phone: "+41 33 336 40 10", type: "INFORMATIONSTRÄGER", location: "3604 Thun, Sonnmattweg 20A", lastContact: "Heute, 10:29 Uhr" },
  { id: 14, kind: "patient", patientLabel: "0", name: "Roth", first: "David", phone: "+41 33 336 40 10", type: "INFORMATIONSTRÄGER", location: "SanHist", lastContact: "Heute, 10:27 Uhr" },
  { id: 15, kind: "patient", patientLabel: "0", name: "Graf", first: "Simon", phone: "+41 33 336 40 10", type: "INFORMATIONSTRÄGER", location: "SanHist", lastContact: "Heute, 10:07 Uhr" },
];

// Caller list (ID-076)
const CALLERS = [
  { id: "c-mu",  name: "Müller",     first: "Lukas",  phone: "+41 33 336 40 10", reason: "Vermisstmeldung (1)",   relation: "Vater" },
  { id: "c-me",  name: "Meier",      first: "Lea",    phone: "+41 33 336 40 10", reason: "Informationsträger",   relation: "—" },
  { id: "c-sc",  name: "Schmid",     first: "Noah",   phone: "+41 33 336 40 10", reason: "Patient, Informationsträger", relation: "—" },
  { id: "c-sn",  name: "Schneider",  first: "Mia",    phone: "+41 33 336 40 10", reason: "Vermisstmeldungen (3)", relation: "—" },
  { id: "c-fi",  name: "Fischer",    first: "Leon",   phone: "+41 33 336 40 10", reason: "Vermisstmeldung (2)",   relation: "Freund, Mutter" },
  { id: "c-we",  name: "Weber",      first: "Emma",   phone: "+41 33 336 40 10", reason: "Vermisstmeldung (1)",   relation: "Tochter" },
  { id: "c-ba",  name: "Baumann",    first: "Maria",  phone: "+41 33 336 40 10", reason: "Informationsträger",   relation: "—" },
  { id: "c-br",  name: "Brunner",    first: "Lara",   phone: "+41 33 336 40 10", reason: "Vermisstmeldung (1)",   relation: "Vater" },
  { id: "c-fr",  name: "Frei",       first: "Nico",   phone: "+41 33 336 40 10", reason: "Vermisstmeldung (1)",   relation: "Freundin" },
  { id: "c-ke",  name: "Keller",     first: "Nina",   phone: "+41 33 336 40 10", reason: "Vermisstmeldung (1)",   relation: "Schwester" },
  { id: "c-mo",  name: "Moser",      first: "Sarah",  phone: "+41 33 336 40 10", reason: "Informationsträger",   relation: "—" },
  { id: "c-ro",  name: "Roth",       first: "David",  phone: "+41 33 336 40 10", reason: "Informationsträger",   relation: "Freund" },
  { id: "c-gr",  name: "Graf",       first: "Simon",  phone: "+41 33 336 40 10", reason: "Vermisstmeldung (1)",   relation: "—" },
];

// Vermisste Personen (ID-077)
const VERMISSTE = [
  { id: "v-1", name: "Lehmann", first: "Anna",    age: 34, dob: "12.04.1990", status: "Vermutet", location: "Im Zug",        last: "Heute, 11:30", relation: "Schwester" },
  { id: "v-2", name: "Bühlmann", first: "Markus", age: 58, dob: "03.08.1966", status: "Unbekannt", location: "Unbekannt",    last: "Heute, 11:18", relation: "Sohn" },
  { id: "v-3", name: "Tanner", first: "Lina",     age: 9,  dob: "21.11.2015", status: "Vermutet", location: "Wagen 3",       last: "Heute, 10:59", relation: "Vater" },
  { id: "v-4", name: "Schenk", first: "Yannick",  age: 22, dob: "07.05.2002", status: "Bestätigt",location: "Sammelstelle",  last: "Heute, 10:48", relation: "Freund" },
  { id: "v-5", name: "Berger", first: "Selma",    age: 67, dob: "14.02.1957", status: "Vermutet", location: "Im Zug",        last: "Heute, 10:21", relation: "Tochter" },
  { id: "v-6", name: "Pfister", first: "Jonas",   age: 41, dob: "30.09.1983", status: "Unbekannt", location: "Unbekannt",    last: "Heute, 10:09", relation: "Ehefrau" },
  { id: "v-7", name: "Iseli", first: "Marc",      age: 29, dob: "18.07.1995", status: "Vermutet", location: "Bahnübergang",   last: "Heute, 09:56", relation: "Bruder" },
];

// Witness reports
const ZEUGEN_TEXT = `Ich befand mich am heute gegen 13:20 Uhr als Fahrgast im Zug in Fahrtrichtung Bern. Ich sass im hinteren Teil des Zuges.

Beobachtungen:
Unmittelbar vor dem Unglück: Der Zug fuhr mit normaler Geschwindigkeit. Plötzlich erfolgte eine extrem starke Notbremsung, die mehrere Sekunden anhielt.

Kurz darauf gab es einen heftigen Aufprall und ein lautes Knallgeräusch. Der Waggon wurde stark erschüttert, kam jedoch nicht zum Umstürzen.
Nach dem Stillstand kam es zu einer Rauchentwicklung im vorderen Bereich. Die Beleuchtung fiel teilweise aus. Das Zugpersonal gab über die Lautsprecher die Anweisung, Ruhe zu bewahren.

Ich habe den Zug gegen 13:35 Uhr über den Notausstieg verlassen. Am Gleisbett sah ich einen beschädigten PKW auf dem Bahnübergang.`;

const ZEUGEN_2 = `Beobachtungen aus Wagen 1: Vor der Notbremsung hörte ich ein lautes metallisches Geräusch von vorne. Nach dem Aufprall stark verformte Frontscheibe. Drei Personen wurden bei der Türöffnung verletzt; ein älterer Herr lag bewusstlos auf dem Boden.`;

// Vermisste Effekte
const EFFEKTE = [
  { kategorie: "Mobiltelefon / Elektronik", verlustort: "Wagen 1 des Zuges", beschreibung: "iPhone 17 Pro mit blauer Hülle, alt etwas zerkratzt", marke: "Apple", farbe: "Phone schwarz, Hülle blau", menge: "1", gewicht: "—", zustand: "gebraucht", serien: "" },
  { kategorie: "Bekleidung", verlustort: "Sammelstelle", beschreibung: "Schwarze Wolljacke, Marke unbekannt, Grösse M, mit Hausschlüssel in der Innentasche", marke: "—", farbe: "Schwarz", menge: "1", gewicht: "—", zustand: "gebraucht", serien: "" },
];

// Person erfassen — default form values
const PRESET_VALUES = {
  bezug: "Anrufer",
  name: "Serge",
  vorname: "Gautier",
  geburt: "22.05.1979",
  geschlecht: "Mann",
  standort: "",
  status: "",
  strasse: "Rougemontweg",
  hausnr: "31",
  plz: "3200",
  ort: "Biel",
  land: "Schweiz",
  mobile: "+41 78 000 00 00",
  privat: "+41 32 000 00 00",
  geschaeft: "",
  email: "sergegautier@mail.com",
  erreichbar: "Ist von 14:00 bis 15:00 nicht erreichbar",
  mutter: "Deutsch",
  weitere: "Französisch",
  konfession: "",
};

// Empty form preset
const EMPTY_VALUES = {
  bezug: "Anrufer",
  name: "", vorname: "", geburt: "", geschlecht: "",
  standort: "", status: "",
  strasse: "", hausnr: "", plz: "", ort: "", land: "",
  mobile: "", privat: "", geschaeft: "", email: "", erreichbar: "",
  mutter: "", weitere: "", konfession: "",
};

const EMPTY_VERMISST = {
  beziehung: "", status: "", standort: "",
  name: "", vorname: "", geburt: "", alter: "", geschaetzt: false,
  geschlecht: "", identisch: false,
  strasse: "", hausnr: "", plz: "", ort: "", land: "",
  mobile: "", privat: "", nationalitaet: "", konfession: "",
  koerper: "", statur: "", augen: "", haare: "", haarschnitt: "",
  bart: "", kleidung: "", tattoos: "", kennzeichen: "", weitere: "",
};

const EMPTY_EFFEKT = {
  kategorie: "", verlustort: "", beschreibung: "",
  marke: "", farbe: "", menge: "", gewicht: "", zustand: "", serien: "",
};

// Vermisstenmeldung defaults
const PRESET_VERMISST = {
  beziehung: "Schwager",
  status: "Vermutet",
  standort: "Im Zug",
  name: "Lehmann",
  vorname: "Anna",
  geburt: "12.04.1990",
  alter: "",
  geschaetzt: false,
  geschlecht: "Frau",
  identisch: false,
  strasse: "",
  hausnr: "",
  plz: "",
  ort: "",
  land: "",
  mobile: "",
  privat: "",
  nationalitaet: "Schweiz",
  konfession: "",
  // Signalemente
  koerper: "Ca. 180 cm",
  statur: "Schlank",
  augen: "Blau",
  haare: "Blond",
  haarschnitt: "Schulterlang",
  bart: "Oberlippenbart",
  kleidung: "Unbekannt",
  tattoos: "",
  kennzeichen: "Brille",
  weitere: "Hat wahrscheinlich eine Gitarre dabei. Unterwegs mit Ehefrau",
};

Object.assign(window, {
  EVENTS, FREE_VIEWS, RECENT_CALLS, PEOPLE, CALLERS, VERMISSTE,
  ZEUGEN_TEXT, ZEUGEN_2, EFFEKTE,
  PRESET_VALUES, EMPTY_VALUES, EMPTY_VERMISST, EMPTY_EFFEKT, PRESET_VERMISST,
});
