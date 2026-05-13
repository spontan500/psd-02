/* Inline SVG icon set — Lucide-style, matching Figma design system */

const Icon = ({ children, size = 20, stroke = "currentColor", strokeWidth = 2, fill = "none", style }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flex: "0 0 auto", display: "block", ...style }}
  >
    {children}
  </svg>
);

const IconDashboard = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </Icon>
);
const IconLayoutDashboard = IconDashboard;
const IconSearch = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);
const IconBell = (p) => (
  <Icon {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Icon>
);
const IconChevronDown = (p) => (
  <Icon {...p}><polyline points="6 9 12 15 18 9" /></Icon>
);
const IconChevronRight = (p) => (
  <Icon {...p}><polyline points="9 18 15 12 9 6" /></Icon>
);
const IconChevronLeft = (p) => (
  <Icon {...p}><polyline points="15 18 9 12 15 6" /></Icon>
);
const IconChevronsUpDown = (p) => (
  <Icon {...p}>
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </Icon>
);
const IconCheck = (p) => (
  <Icon {...p}><polyline points="20 6 9 17 4 12" /></Icon>
);
const IconCheckCircle = (p) => (
  <Icon {...p}>
    <path d="M21.8 10A10 10 0 1 1 17 3.3" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Icon>
);
const IconX = (p) => (
  <Icon {...p}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
);
const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Icon>
);
const IconPlusCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </Icon>
);
const IconExpand = (p) => (
  <Icon {...p}>
    <path d="M15 3h6v6" />
    <path d="M9 21H3v-6" />
    <path d="M21 3l-7 7" />
    <path d="M3 21l7-7" />
  </Icon>
);
const IconPanelLeftClose = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d="m16 15-3-3 3-3" />
  </Icon>
);
const IconMapPin = (p) => (
  <Icon {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);
const IconCalendar = (p) => (
  <Icon {...p}>
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </Icon>
);
const IconRefresh = (p) => (
  <Icon {...p}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M8 16H3v5" />
  </Icon>
);
const IconArrowRight = (p) => (
  <Icon {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Icon>
);
const IconUser = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
  </Icon>
);
const IconUserCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6.5 18.5a6 6 0 0 1 11 0" />
  </Icon>
);
const IconFlag = (p) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <path d="M4 4a1 1 0 0 1 1-1h11l-1.5 4L16 11H5v10H3V4a1 1 0 0 1 1-1Z" />
  </Icon>
);
const IconFlagOutline = (p) => (
  <Icon {...p}>
    <path d="M4 22V4a1 1 0 0 1 1-1h11l-2 5 2 5H5" />
  </Icon>
);
const IconFire = (p) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <path d="M12 2c1.5 3.5-1 5 .5 7.5C14 12 16 11 16 13c0 3-2 5-4 5s-4-2-4-5c0-1.5 1-2.5 1-4 0-2-1.5-3-1.5-3S6 8 6 12c0 4.5 3 8 6 8s6-3.5 6-8c0-7-6-10-6-10Z" />
  </Icon>
);
const IconRadioactive = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49" />
    <path d="M4 12h4" />
    <path d="M9 6 7 9.5" />
    <path d="m15 6 2 3.5" />
    <path d="M7 14.5 9 18" />
    <path d="M15 18l2-3.5" />
  </Icon>
);
const IconTrain = (p) => (
  <Icon {...p}>
    <rect x="6" y="3" width="12" height="14" rx="2" />
    <path d="M6 11h12" />
    <path d="M9 17 6 21" />
    <path d="m15 17 3 4" />
    <circle cx="9" cy="14" r="1" />
    <circle cx="15" cy="14" r="1" />
  </Icon>
);
const IconHash = (p) => (
  <Icon {...p}>
    <path d="M4 9h16" />
    <path d="M4 15h16" />
    <path d="M10 3 8 21" />
    <path d="m16 3-2 18" />
  </Icon>
);
const IconHeadset = (p) => (
  <Icon {...p} stroke="currentColor" fill="none">
    <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
    <path d="M21 14v3a2 2 0 0 1-2 2h-1v-7h1a2 2 0 0 1 2 2Z" />
    <path d="M3 14v3a2 2 0 0 0 2 2h1v-7H5a2 2 0 0 0-2 2Z" />
  </Icon>
);
const IconList = (p) => (
  <Icon {...p}>
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </Icon>
);
const IconGrid = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
  </Icon>
);
const IconArrowUpDown = (p) => (
  <Icon {...p}>
    <path d="m21 16-4 4-4-4" />
    <path d="M17 20V4" />
    <path d="m3 8 4-4 4 4" />
    <path d="M7 4v16" />
  </Icon>
);
const IconArrowUp = (p) => (
  <Icon {...p}>
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </Icon>
);
const IconMore = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </Icon>
);
const IconEye = (p) => (
  <Icon {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);
const IconCircle = (p) => (
  <Icon {...p}><circle cx="12" cy="12" r="10" /></Icon>
);

// Headset (caller avatar) — solid circle with headset glyph
function AvatarCaller({ size = 36 }) {
  return (
    <div className="avatar-circle avatar-caller" style={{ width: size, height: size }}>
      <svg width={Math.round(size * 0.6)} height={Math.round(size * 0.6)} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
        <path d="M19 12v6a1.5 1.5 0 0 1-3 0v-4a1.5 1.5 0 0 1 3 0Z" fill="white" />
        <path d="M5 12v6a1.5 1.5 0 0 0 3 0v-4a1.5 1.5 0 0 0-3 0Z" fill="white" />
      </svg>
    </div>
  );
}

function AvatarAbholer({ size = 36 }) {
  return (
    <div className="avatar-circle avatar-abholer" style={{ width: size, height: size }}>
      <svg width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} viewBox="0 0 24 24" fill="white" stroke="none">
        <path d="M6 4c-1.5 0-2.5 1-2.5 2.5v9.5c0 1.5 1 2.5 2.5 2.5h1l1 2.5L9.5 21h5l1.5-2 1-2.5h1c1.5 0 2.5-1 2.5-2.5V6.5C20.5 5 19.5 4 18 4Zm6 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
      </svg>
    </div>
  );
}

function AvatarUnknown({ size = 36 }) {
  return (
    <div className="avatar-circle avatar-unknown" style={{ width: size, height: size }}>
      <svg width={Math.round(size * 0.5)} height={Math.round(size * 0.5)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    </div>
  );
}

function AvatarVermisst({ size = 36 }) {
  return (
    <div className="avatar-circle avatar-vermisst" style={{ width: size, height: size }}>
      <svg width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <circle cx="12" cy="17" r="1.2" />
      </svg>
    </div>
  );
}

function AvatarPatient({ size = 36, label = "II" }) {
  return (
    <div className="avatar-circle" style={{ width: size, height: size, background: "rgb(16,185,129)", color: "white", fontWeight: 700, fontSize: Math.round(size * 0.32) }}>
      {label}
    </div>
  );
}

function AvatarPhoto({ size = 36, color = "rgb(255,181,195)", letter = "K" }) {
  return (
    <div className="avatar-circle" style={{ width: size, height: size, background: color, color: "var(--danger)", fontWeight: 700, fontSize: Math.round(size * 0.4) }}>
      {letter}
    </div>
  );
}

// IES NG mark — light blue asterisk
function IESLogo() {
  return (
    <div className="sidebar-logo">
      <span className="sidebar-logo-mark">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 3v18M5 6l14 12M5 18 19 6M3 12h18" stroke="rgb(28,121,229)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </span>
      <span>IES NG</span>
    </div>
  );
}

Object.assign(window, {
  Icon,
  IconDashboard, IconLayoutDashboard, IconSearch, IconBell,
  IconChevronDown, IconChevronRight, IconChevronLeft, IconChevronsUpDown,
  IconCheck, IconCheckCircle, IconX, IconPlus, IconPlusCircle,
  IconExpand, IconPanelLeftClose, IconMapPin, IconCalendar, IconRefresh,
  IconArrowRight, IconUser, IconUserCircle, IconFlag, IconFlagOutline,
  IconFire, IconRadioactive, IconTrain, IconHash, IconHeadset,
  IconList, IconGrid, IconArrowUpDown, IconArrowUp, IconMore, IconEye, IconCircle,
  AvatarCaller, AvatarAbholer, AvatarUnknown, AvatarVermisst, AvatarPatient, AvatarPhoto,
  IESLogo,
});
