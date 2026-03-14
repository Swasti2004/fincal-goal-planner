import { DISCLAIMER } from "@/lib/goals";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-top">
        <div className="footer-left">
          <div className="footer-brand-name">FINCAL</div>
          <div className="footer-brand-sub">Goal-Based Investment Calculator</div>
        </div>
        <div className="footer-right">
          <div className="footer-built-by">Built by</div>
          <div className="footer-team-name">Team ThreadHeads</div>
          <div className="footer-event">Technex 2026 · IIT BHU</div>
        </div>
      </div>
      <div className="footer-divider" aria-hidden="true" />
      <p className="footer-disc">
        <strong>Disclaimer:</strong> {DISCLAIMER}
      </p>
    </footer>
  );
}
