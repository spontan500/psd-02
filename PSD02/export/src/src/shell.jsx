/* Sidebar + Topbar shell */

function SidebarEventIcon({ kind, color, badge, filled = true }) {
  let Glyph = IconFire;
  if (kind === "radioactive") Glyph = IconRadioactive;
  if (kind === "train") Glyph = IconTrain;
  if (kind === "fire") Glyph = IconFire;
  return (
    <span className={`sidebar-event-icon ${filled ? "filled" : "outline"}`} style={filled ? { background: color } : { color }}>
      <Glyph size={26} stroke={filled ? "white" : color} strokeWidth={2} />
      {badge ? <span className="badge">{badge}</span> : null}
    </span>
  );
}

function Sidebar({ route, navigate, collapsed, onCollapseToggle, sidebarCount = 1 }) {
  const [eventOpen, setEventOpen] = useState("ag-koblenz-7");

  const isActive = (path) => {
    if (typeof path === "function") return path(route);
    return route.screen === path;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <IESLogo />
        <div className="row" style={{ gap: 4 }}>
          <button className="icon-btn" title="Suche">
            <IconSearch size={24} />
          </button>
          <button className="icon-btn" title="Benachrichtigungen">
            <IconBell size={24} />
            <span className="badge-dot">{sidebarCount}</span>
          </button>
        </div>
      </div>

      <div className="sidebar-scroll">
        <button
          className="section-trigger"
          onClick={() => navigate({ screen: "dashboard" })}
        >
          <IconLayoutDashboard size={24} />
          <span>Dashboard</span>
          <IconChevronsUpDown size={18} className="chev" />
        </button>

        <div style={{ height: 8 }} />

        <button
          className={`sidebar-link ${route.screen === "ereignisliste" ? "active" : ""}`}
          onClick={() => navigate({ screen: "ereignisliste" })}
        >
          <IconList size={22} />
          <span>Ereignisliste</span>
        </button>

        <div className="sidebar-group-title">Ereignisse</div>

        {EVENTS.map((ev) => {
          const isOpen = eventOpen === ev.id;
          return (
            <div key={ev.id} className={`sidebar-event-group ${isOpen ? "open" : ""}`}>
              <button
                className={`sidebar-event ${isOpen ? "open" : ""}`}
                onClick={() => setEventOpen(isOpen ? null : ev.id)}
              >
                <SidebarEventIcon kind={ev.icon} color={ev.color} badge={ev.badge} filled={!!ev.badge} />
                <div className="sidebar-event-body">{ev.title}</div>
                {isOpen
                  ? <IconChevronDown size={18} className="chev" />
                  : <IconChevronRight size={18} className="chev" />}
              </button>
              {isOpen && ev.children && (
                <div className="sidebar-subnav">
                  {ev.children.map((c) => (
                    <button
                      key={c.id}
                      className={`sidebar-link sidebar-sublink ${route.screen === "dashboard" && route.tab === c.id ? "active" : ""}`}
                      onClick={() => navigate({ screen: "dashboard", tab: c.id, eventId: ev.id })}
                    >
                      <span>{c.label}</span>
                      {c.badge && <span className="count-dot">{c.badge}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <div className="sidebar-group-title">Organisationsansichten</div>
        <button className="sidebar-link">
          <IconGrid size={22} />
          <span>Kapazitätsmanagement</span>
        </button>
        <button className="sidebar-link">
          <IconGrid size={22} />
          <span>Einsatzbibliothek der Organisation</span>
        </button>

        <div className="sidebar-group-title">Freie Ansichten</div>
        {FREE_VIEWS.map((v) => (
          <button key={v.id} className="sidebar-link">
            <IconHash size={22} />
            <span>{v.label}</span>
            <IconChevronRight size={16} className="meta muted" />
          </button>
        ))}
      </div>

      <div className="sidebar-user">
        <div className="sidebar-user-card">
          <div className="avatar">MN</div>
          <div className="meta">
            <div className="name">Müller Nicolas</div>
            <div className="org">Kantonspolizei Bern</div>
          </div>
          <IconChevronsUpDown size={16} className="muted" />
        </div>
      </div>
    </aside>
  );
}

function Topbar({ route, navigate, onSidebarToggle, sidebarCollapsed }) {
  // Build breadcrumb based on route
  const crumbs = useMemo(() => {
    const out = [];
    out.push({ label: "Ereignisse", onClick: () => navigate({ screen: "ereignisliste" }) });
    const ev = EVENTS.find((e) => e.id === (route.eventId || "ag-koblenz-7"));
    if (ev) {
      out.push({ label: "BE Thun 17 Explosion Autogarage SNZ Bern Zentral", onClick: () => navigate({ screen: "dashboard", eventId: ev.id }) });
    }
    if (route.screen === "dashboard") {
      const tabLabel = (ev?.children || []).find((c) => c.id === (route.tab || "infoline"))?.label || "Infoline";
      out.push({ label: tabLabel, current: true });
    } else if (route.screen === "ereignisliste") {
      // single
      return [{ label: "Ereignisliste", current: true }];
    }
    return out;
  }, [route]);

  return (
    <div className="topbar">
      <button
        className="icon-btn"
        title={sidebarCollapsed ? "Seitenleiste öffnen" : "Seitenleiste schliessen"}
        onClick={onSidebarToggle}
      >
        <IconPanelLeftClose size={20} />
      </button>
      <div className="crumb">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep"><IconChevronRight size={14} /></span>}
            {c.current
              ? <span className="current">{c.label}</span>
              : <a href="#" onClick={(e) => { e.preventDefault(); c.onClick && c.onClick(); }}>{c.label}</a>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar, SidebarEventIcon });
