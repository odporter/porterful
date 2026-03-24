import type { Metadata } from 'next';
import './pdf.css';

export const metadata: Metadata = {
  title: 'Pilot Onboarding — Porterful',
};

const PILOT_ROLES = [
  {
    id: 'artist',
    label: 'Artist',
    icon: '🎤',
    color: '#FF6B00',
    steps: [
      'Join the Discord server',
      'Verify your account — type <span class="code">/verify</span> in any channel',
      'Go to <span class="code">#artist-talk</span> and introduce yourself',
      'Upload at least one piece of work (music, art, or merch)',
      'Set a price on something',
      'Make one small purchase to test checkout — even $1 counts',
      'Turn on notifications for <span class="code">#feedback</span> and <span class="code">#bugs</span>',
      'Share honest feedback in <span class="code">#feedback</span> — your voice shapes what we build',
    ],
  },
  {
    id: 'business',
    label: 'Business',
    icon: '🏪',
    color: '#3B82F6',
    steps: [
      'Join the Discord server',
      'Verify your account — type <span class="code">/verify</span> in any channel',
      'Go to <span class="code">#general</span> and introduce yourself',
      'List your first product on Porterful',
      'Connect with artists for promotions',
      'Turn on notifications for <span class="code">#feedback</span> and <span class="code">#bugs</span>',
      'Share what you\'re selling in <span class="code">#feedback</span>',
    ],
  },
  {
    id: 'brand',
    label: 'Brand',
    icon: '💼',
    color: '#10B981',
    steps: [
      'Join the Discord server',
      'Verify your account — type <span class="code">/verify</span> in any channel',
      'Go to <span class="code">#general</span> and introduce yourself',
      'Explore the artist roster',
      'Reach out directly to artists you want to sponsor',
      'Turn on notifications for <span class="code">#feedback</span> and <span class="code">#bugs</span>',
    ],
  },
  {
    id: 'fan',
    label: 'Supporter / Fan',
    icon: '❤️',
    color: '#A855F7',
    steps: [
      'Join the Discord server',
      'Verify your account — type <span class="code">/verify</span> in any channel',
      'Go to <span class="code">#general</span> and say hi',
      'Browse porterful.com — find an artist you like',
      'Make your first purchase',
      'Optional: sign up as a Superfan to earn by sharing referral links',
      'Turn on notifications for <span class="code">#general</span> so you don\'t miss updates',
    ],
  },
];

const DISCORD_STEPS = [
  'Open Discord or download it at discord.com',
  'Click the invite link we sent you',
  'Accept the invite to the Porterful pilot server',
  'Verify: type <span class="code">/verify</span> in any channel',
  'Go to channel settings → Notifications → turn on all messages for this server',
];

export default function PilotOnboardingPDFPage() {
  return (
    <div className="pdf-page">
      {/* HEADER */}
      <header className="pdf-header">
        <div className="logo">PORTERFUL</div>
        <div className="header-tag">Pilot Onboarding</div>
      </header>

      {/* HERO */}
      <section className="pdf-hero">
        <h1>Welcome to the<br />Porterful Pilot. 🚀</h1>
        <p className="hero-sub">
          This guide gets you set up in 10 minutes. Follow the steps for your role below.
          When you need help, post in the channel — we read everything.
        </p>
      </section>

      {/* DISCORD SETUP — ALL ROLES */}
      <section className="pdf-section">
        <h2>Step 1 — Get on Discord</h2>
        <div className="discord-grid">
          <div className="discord-steps">
            {DISCORD_STEPS.map((step, i) => (
              <div key={i} className="discord-step">
                <div className="discord-num">{i + 1}</div>
                <p dangerouslySetInnerHTML={{ __html: step }} />
              </div>
            ))}
          </div>
          <div className="discord-note">
            <p className="note-title">⚠️ Don&apos;t skip notifications</p>
            <p>We communicate exclusively through Discord during the pilot. If you don&apos;t turn on notifications, you&apos;ll miss updates, bug fixes, and feature drops.</p>
          </div>
        </div>
      </section>

      {/* ROLE-SPECIFIC STEPS */}
      <section className="pdf-section">
        <h2>Step 2 — Your Role</h2>
        <div className="roles-grid">
          {PILOT_ROLES.map((role) => (
            <div key={role.id} className="role-card">
              <div className="role-header" style={{ borderColor: role.color }}>
                <span className="role-icon">{role.icon}</span>
                <span className="role-label" style={{ color: role.color }}>{role.label}</span>
              </div>
              <div className="role-steps">
                {role.steps.map((step, i) => (
                  <div key={i} className="role-step">
                    <span className="role-step-num" style={{ color: role.color }}>{i + 1}</span>
                    <p dangerouslySetInnerHTML={{ __html: step }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHANNEL GUIDE */}
      <section className="pdf-section">
        <h2>Channel Guide</h2>
        <div className="channels">
          <div className="channel">
            <span className="channel-name">#general</span>
            <span className="channel-desc">Introductions, chat with other pilots</span>
          </div>
          <div className="channel">
            <span className="channel-name">#feedback</span>
            <span className="channel-desc">Questions, ideas, feature requests — we read every post</span>
          </div>
          <div className="channel">
            <span className="channel-name">#bugs</span>
            <span className="channel-desc">Something broken? Describe what you did and what went wrong</span>
          </div>
          <div className="channel">
            <span className="channel-name">#artist-talk</span>
            <span className="channel-desc">Artists only — share work, ask questions, connect</span>
          </div>
        </div>
        <p className="channel-note">No @mentions needed. Don&apos;t DM us. Just post in the channel.</p>
      </section>

      {/* FOOTER */}
      <footer className="pdf-footer">
        <div className="footer-logo">PORTERFUL PILOT</div>
        <div className="footer-links">
          <span>porterful.com</span>
          <span>support@porterful.com</span>
        </div>
        <p className="footer-tagline">Your feedback builds this thing.</p>
      </footer>
    </div>
  );
}
