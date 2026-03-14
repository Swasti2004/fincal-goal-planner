export default function Navbar() {
  return (
    <header className="navbar" role="banner">
      <div className="navbar-left">
        <div className="navbar-title-row">
          <span className="navbar-dot" aria-hidden="true" />
          <span className="navbar-name">FINCAL</span>
        </div>
        <span className="navbar-sub">Goal-Based Investment Calculator</span>
      </div>
      <div className="navbar-right" aria-label="Tool type">
        <div className="navbar-right-label">Tool Type</div>
        <span className="navbar-right-badge">Investor Education Tool</span>
      </div>
    </header>
  );
}
