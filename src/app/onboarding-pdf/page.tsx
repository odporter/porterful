import type { Metadata } from 'next';
import './pdf.css';

export const metadata: Metadata = {
  title: 'Artist Guide — Porterful',
};

export default function OnboardingPDFPage() {
  return (
    <div className="pdf-page">
      {/* HEADER */}
      <header className="pdf-header">
        <div className="logo">PORTERFUL</div>
        <div className="header-tag">Artist Guide</div>
      </header>

      {/* HERO */}
      <section className="pdf-hero">
        <h1>Your music.<br />Your store.<br />Your retirement plan.</h1>
        <p className="hero-sub">
          Welcome to Porterful — the direct-to-artist commerce platform where every purchase
          puts real money in artists' pockets. No labels. No middlemen. No gatekeepers.
        </p>
      </section>

      {/* STATS */}
      <section className="pdf-stats">
        <div className="stat">
          <span className="stat-num">80%</span>
          <span className="stat-label">You keep on every sale</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">$1 min</span>
          <span className="stat-label">Set your own price for music</span>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <span className="stat-num">$0</span>
          <span className="stat-label">Monthly or listing fees</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="pdf-section">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div>
              <strong>Upload your music or merch</strong>
              <p>Albums, singles, t-shirts, prints — anything you create.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <div>
              <strong>Set your own prices</strong>
              <p>$1 minimum for music. Merch pricing is up to you. You control your income.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <div>
              <strong>Share your Porterful link</strong>
              <p>Every artist gets a unique page. Share it everywhere — social, DMs, bio links.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-num">4</div>
            <div>
              <strong>Get paid directly</strong>
              <p>Sales pay out to your wallet. Track everything in your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT TO SELL */}
      <section className="pdf-section">
        <h2>What You Can Sell</h2>
        <div className="sell-grid">
          <div className="sell-item">
            <span className="sell-icon">🎵</span>
            <strong>Music</strong>
            <p>Albums, singles, beats, instrumentals. Set your own price.</p>
          </div>
          <div className="sell-item">
            <span className="sell-icon">👕</span>
            <strong>Merch</strong>
            <p>Print-on-demand t-shirts, hoodies, prints. No inventory needed.</p>
          </div>
          <div className="sell-item">
            <span className="sell-icon">📦</span>
            <strong>Digital</strong>
            <p>Courses, PDFs, presets, templates — anything digital.</p>
          </div>
          <div className="sell-item">
            <span className="sell-icon">🏪</span>
            <strong>Marketplace</strong>
            <p>Art, photography, crafts. Reach music fans who want to support you.</p>
          </div>
        </div>
      </section>

      {/* SUPERFANS */}
      <section className="pdf-section pdf-callout">
        <div className="callout-inner">
          <h2>Turn Fans Into Promoters</h2>
          <p>
            Porterful's Superfan system lets your biggest supporters earn money by sharing
            your link. When someone buys through their code, they get a cut — and you still
            keep 80%. It turns casual listeners into active promoters who have a real stake
            in your success.
          </p>
        </div>
      </section>

      {/* REVENUE SPLIT */}
      <section className="pdf-section">
        <h2>Who Gets What</h2>
        <table className="pdf-table">
          <thead>
            <tr>
              <th>Who</th>
              <th>Share</th>
              <th>What this means</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Artist</strong></td>
              <td className="highlight">80%</td>
              <td>You earn on every music sale, merch sale, and marketplace item</td>
            </tr>
            <tr>
              <td><strong>Superfan Referrer</strong></td>
              <td className="highlight">3%</td>
              <td>The fan who shared the link and drove the sale</td>
            </tr>
            <tr>
              <td><strong>Porterful</strong></td>
              <td className="highlight">10%</td>
              <td>Platform maintenance, hosting, payments, support</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* GETTING STARTED CHECKLIST */}
      <section className="pdf-section">
        <h2>Getting Started Checklist</h2>
        <div className="checklist">
          <div className="checklist-item">☐ &nbsp; Sign up and verify as an artist at porterful.com</div>
          <div className="checklist-item">☐ &nbsp; Upload your first album, single, or product</div>
          <div className="checklist-item">☐ &nbsp; Set your prices — you can always adjust later</div>
          <div className="checklist-item">☐ &nbsp; Customize your artist page (bio, photo, links)</div>
          <div className="checklist-item">☐ &nbsp; Share your link on social media and bios</div>
          <div className="checklist-item">☐ &nbsp; Connect your wallet to receive payouts</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pdf-footer">
        <div className="footer-logo">PORTERFUL</div>
        <div className="footer-links">
          <span>Dashboard: porterful.com/dashboard</span>
          <span>Support: support@porterful.com</span>
        </div>
        <p className="footer-tagline">The artist retirement plan.</p>
      </footer>
    </div>
  );
}
