import SidePanel3D from './SidePanel3D';

export default function InvestigationFrame({ children }) {
  return (
    <div className="devverse-frame">
      {/* Compact Mobile Top Border */}
      <div className="devverse-mobile-banner" aria-hidden="true">
        <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)' }} />
      </div>

      {/* Desktop Left Border: Clean Visual Composition Only (No Unwanted Text, Natural Page Scroll) */}
      <aside className="devverse-side-panel devverse-side-left" aria-hidden="true">
        <SidePanel3D variant="devverse" />
      </aside>

      {/* Center Playable Content */}
      <main className="devverse-center-content">{children}</main>

      {/* Desktop Right Border: Clean 3D Visual Composition Only (No Unwanted Text, Natural Page Scroll) */}
      <aside className="devverse-side-panel devverse-side-right" aria-hidden="true">
        <SidePanel3D variant="investigation" />
      </aside>

      {/* Compact Mobile Bottom Border */}
      <div className="devverse-mobile-footer" aria-hidden="true">
        <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
      </div>
    </div>
  );
}
