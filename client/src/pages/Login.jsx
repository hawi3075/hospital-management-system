import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { normalizeRole } from '../routes/roleConfig';

// Styles are inlined so this file is drop-in on its own. Move the string
// into Login.css and swap back to `import './Login.css'` if you'd rather
// keep styles in a separate file.
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.auth-shell {
  --bg-1: #060b16;
  --bg-2: #0f1e33;
  --teal: #38e0bb;
  --rose: #ff6f5e;
  --amber: #ffbf6b;
  --glass: rgba(255, 255, 255, 0.06);
  --glass-strong: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.14);
  --text-1: #f4f6f5;
  --text-2: rgba(244, 246, 245, 0.68);
  --text-3: rgba(244, 246, 245, 0.42);

  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: radial-gradient(120% 140% at 12% 8%, var(--bg-2) 0%, var(--bg-1) 55%);
  font-family: 'IBM Plex Sans', -apple-system, sans-serif;
  color: var(--text-1);
  padding: 4vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-shell::before,
.auth-shell::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.5;
  pointer-events: none;
  animation: drift 22s ease-in-out infinite alternate;
}

.auth-shell::before {
  width: 34rem;
  height: 34rem;
  top: -12rem;
  right: -8rem;
  background: radial-gradient(circle, var(--teal) 0%, transparent 70%);
}

.auth-shell::after {
  width: 30rem;
  height: 30rem;
  bottom: -14rem;
  left: -6rem;
  background: radial-gradient(circle, var(--rose) 0%, transparent 70%);
  animation-delay: -9s;
}

@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(2.5rem, 3rem) scale(1.08); }
}

.auth-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(244, 246, 245, 0.09) 1px, transparent 1px);
  background-size: 26px 26px;
  mask-image: radial-gradient(circle at 30% 30%, black, transparent 75%);
  pointer-events: none;
}

.auth-frame {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 76rem;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  gap: 3.5rem;
  align-items: center;
}

@media (max-width: 900px) {
  .auth-frame {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

/* ---------- Left: hero ---------- */

.auth-hero {
  display: flex;
  flex-direction: column;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 3rem;
}

.brand-glyph {
  font-family: 'Fraunces', serif;
  font-size: 1.3rem;
  width: 2.6rem;
  height: 2.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: linear-gradient(145deg, var(--teal), #1f8f78);
  color: #04231d;
  font-weight: 600;
}

.brand-name {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-name strong {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: 1.05rem;
}

.brand-name span {
  font-size: 0.8rem;
  color: var(--text-3);
}

.status-pill {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--text-2);
  background: var(--glass);
  border: 1px solid var(--glass-border);
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--teal);
  box-shadow: 0 0 0 0 rgba(56, 224, 187, 0.6);
  animation: status-ping 2.4s ease-out infinite;
}

@keyframes status-ping {
  0% { box-shadow: 0 0 0 0 rgba(56, 224, 187, 0.55); }
  70% { box-shadow: 0 0 0 8px rgba(56, 224, 187, 0); }
  100% { box-shadow: 0 0 0 0 rgba(56, 224, 187, 0); }
}

.auth-hero h1 {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: clamp(2.4rem, 4.2vw, 3.6rem);
  line-height: 1.08;
  letter-spacing: -0.015em;
  margin: 0 0 1.1rem;
  max-width: 20ch;
}

.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  width: fit-content;
  margin-bottom: 1rem;
  color: var(--teal);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero-kicker::before {
  content: '';
  width: 1.8rem;
  height: 1px;
  background: currentColor;
}

.auth-hero > p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-2);
  max-width: 34ch;
  margin: 0 0 2.75rem;
}

.pulse-wrap {
  position: relative;
  width: 100%;
  margin-bottom: 2.75rem;
}

.pulse-line {
  width: 100%;
  height: 72px;
  display: block;
}

.pulse-line .trace {
  fill: none;
  stroke: var(--glass-border);
  stroke-width: 1.5;
}

.pulse-line .trace-active {
  fill: none;
  stroke: url(#pulseGradient);
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.pulse-dot {
  fill: var(--teal);
  filter: drop-shadow(0 0 6px rgba(56, 224, 187, 0.9));
}

.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.stat-chip {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  padding: 0.65rem 0.95rem;
  font-size: 0.82rem;
  color: var(--text-2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-chip .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.stat-chip.teal .dot { background: var(--teal); }
.stat-chip.rose .dot { background: var(--rose); }
.stat-chip.amber .dot { background: var(--amber); }

/* ---------- Right: glass card ---------- */

.auth-card {
  position: relative;
  background: var(--glass-strong);
  border: 1px solid var(--glass-border);
  border-radius: 22px;
  backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.6);
  padding: 2.5rem;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 2.5rem;
  right: 2.5rem;
  height: 2px;
  background: linear-gradient(90deg, var(--teal), var(--rose));
  border-radius: 0 0 4px 4px;
}

.card-eyebrow {
  color: var(--teal);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.auth-tabs {
  display: flex;
  gap: 0.4rem;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 0.3rem;
  margin-bottom: 1.9rem;
}

.auth-tabs button {
  flex: 1;
  background: none;
  border: none;
  border-radius: 9px;
  padding: 0.55rem 0;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-2);
  cursor: pointer;
}

.auth-tabs button.active {
  background: var(--text-1);
  color: #0b1220;
}

.auth-heading h2 {
  font-family: 'Fraunces', serif;
  font-weight: 500;
  font-size: 1.55rem;
  margin: 0 0 0.4rem;
}

.auth-heading p {
  font-size: 0.9rem;
  color: var(--text-2);
  margin: 0 0 1.6rem;
  line-height: 1.5;
}

.form-error {
  background: rgba(255, 111, 94, 0.14);
  border: 1px solid rgba(255, 111, 94, 0.4);
  color: #ffb3a8;
  font-size: 0.86rem;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  margin-bottom: 1.2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-form label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-2);
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.auth-form input,
.auth-form select {
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--text-1);
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  padding: 0.7rem 0.85rem;
}

.auth-form input::placeholder {
  color: var(--text-3);
}

.auth-form input:focus,
.auth-form select:focus {
  outline: none;
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(56, 224, 187, 0.18);
}

.primary-action {
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  color: #04231d;
  background: linear-gradient(120deg, var(--teal), #7fe9cf);
  border: none;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  margin-top: 0.3rem;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary-action:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px -10px rgba(56, 224, 187, 0.5);
}

.primary-action:disabled {
  opacity: 0.6;
  cursor: default;
  transform: none;
  box-shadow: none;
}

/* ---------- Demo roster ---------- */

.demo-access {
  margin-top: 2rem;
  padding-top: 1.6rem;
  border-top: 1px solid var(--glass-border);
}

.demo-heading {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-2);
  margin-bottom: 1rem;
}

.demo-subheading {
  color: var(--text-3);
  font-size: 0.78rem;
  line-height: 1.45;
  margin: -0.55rem 0 1rem;
}

.signup-note {
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
  margin-top: 1.5rem;
  padding: 0.85rem 0.9rem;
  border: 1px solid rgba(56, 224, 187, 0.22);
  border-radius: 12px;
  background: rgba(56, 224, 187, 0.07);
  color: var(--text-2);
  font-size: 0.78rem;
  line-height: 1.45;
}

.signup-note strong {
  display: block;
  color: var(--text-1);
  font-size: 0.8rem;
  margin-bottom: 0.15rem;
}

.signup-note-mark {
  width: 1.65rem;
  height: 1.65rem;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--teal);
  color: #04231d;
  font-weight: 700;
}

.role-group {
  margin-bottom: 1rem;
}

.role-group-label {
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 0.55rem;
  padding-left: 1rem;
  position: relative;
  color: var(--text-3);
}

.role-group-label::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.role-group-label.tone-leadership { color: #8fb2ff; }
.role-group-label.tone-clinical { color: var(--teal); }
.role-group-label.tone-support { color: var(--rose); }
.role-group-label.tone-patient { color: var(--amber); }

.role-chip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 0.55rem;
}

.role-chip {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 0.55rem 0.6rem;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
}

.role-chip:hover {
  transform: translateY(-1px);
  background: rgba(0, 0, 0, 0.32);
}

.role-chip.selected {
  border-color: var(--teal);
  background: rgba(56, 224, 187, 0.1);
}

.role-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 600;
  color: #04231d;
}

.role-avatar.tone-leadership { background: #8fb2ff; }
.role-avatar.tone-clinical { background: var(--teal); }
.role-avatar.tone-support { background: var(--rose); color: #260a06; }
.role-avatar.tone-patient { background: var(--amber); }

.role-chip-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  min-width: 0;
}

.role-chip-text strong {
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-1);
}

.role-chip-text span {
  font-size: 0.68rem;
  color: var(--text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (prefers-reduced-motion: reduce) {
  .auth-shell::before,
  .auth-shell::after,
  .status-dot,
  .pulse-motion {
    animation: none !important;
  }
}
`;

const roles = [
  ['SUPER_ADMIN', 'Super Admin', 'superadmin', 'SuperAdmin@123', 'SA'],
  ['HOSPITAL_ADMIN', 'Hospital Admin', 'admin', 'Admin@123', 'HA'],
  ['DOCTOR', 'Doctor', 'doctor', 'Doctor@123', 'DR'],
  ['NURSE', 'Nurse', 'nurse', 'Nurse@123', 'RN'],
  ['RECEPTIONIST', 'Receptionist', 'reception', 'Reception@123', 'RC'],
  ['RADIOLOGY_TECHNICIAN', 'Radiology', 'radiology', 'Radiology@123', 'RT'],
  ['PHARMACIST', 'Pharmacist', 'pharmacy', 'Pharmacy@123', 'PH'],
  ['LAB_TECHNICIAN', 'Lab Technician', 'lab', 'Lab@123', 'LT'],
  ['CASHIER', 'Cashier', 'finance', 'Finance@123', 'CA'],
  ['PATIENT', 'Patient', 'patient', 'Patient@123', 'PT'],
];


const roleGroups = [
  { label: 'Leadership', roleValues: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'], tone: 'leadership' },
  { label: 'Clinical teams', roleValues: ['DOCTOR', 'NURSE', 'RADIOLOGY_TECHNICIAN', 'LAB_TECHNICIAN'], tone: 'clinical' },
  { label: 'Support & front desk', roleValues: ['RECEPTIONIST', 'PHARMACIST', 'CASHIER'], tone: 'support' },
  { label: 'Patient', roleValues: ['PATIENT'], tone: 'patient' },
];

const statChips = [
  { text: '10 roles, one door in', tone: 'teal' },
  { text: 'Built for 24/7 shifts', tone: 'rose' },
  { text: 'Secure by design', tone: 'amber' },
];

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleName, setRoleName] = useState('PATIENT');
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [grandFatherName, setGrandFatherName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const selectRole = (role) => {
    const account = roles.find(([value]) => value === role);
    if (!account) return;
    setUsername(account[2]);
    setPassword(account[3]);
    setRoleName(role);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const payload = mode === 'login'
        ? { username, password }
        : roleName === 'PATIENT'
          ? { username, email, password, roleName, fullName, fatherName, grandFatherName, age, gender, address }
          : { username, email, password, roleName };
      const response = await apiClient.post(`/auth/${mode === 'login' ? 'login' : 'register'}`, payload);
      const { token, data } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data));

      if (onLoginSuccess) {
        onLoginSuccess(data);
      } else {
        navigate(`/workspace/${normalizeRole(data.role).toLowerCase()}/dashboard`, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to complete the request.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <main className="auth-shell">
        <div className="auth-grid-overlay" aria-hidden="true" />

        <div className="auth-frame">
          <section className="auth-hero">
            <div className="brand-mark">
              <span className="brand-glyph" aria-hidden="true">N</span>
              <div className="brand-name">
                <strong>Northstar</strong>
                <span>Hospital operations</span>
              </div>
              <span className="status-pill">
                <span className="status-dot" aria-hidden="true" />
                All systems normal
              </span>
            </div>

            <span className="hero-kicker">{mode === 'login' ? 'Operations command center' : 'Patient access, simplified'}</span>
            <h1>{mode === 'login' ? 'Every shift starts here.' : 'Make care easier to reach.'}</h1>
            <p>{mode === 'login'
              ? 'One workspace for doctors, nurses, and every team keeping care moving, day and night.'
              : 'Create a secure patient profile and keep your care journey in one calm, connected place.'}</p>

            <div className="pulse-wrap">
              <svg className="pulse-line" viewBox="0 0 400 72" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="pulseGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38e0bb" />
                    <stop offset="100%" stopColor="#ff6f5e" />
                  </linearGradient>
                </defs>
                <path className="trace" d="M0,40 L120,40 L136,12 L154,64 L170,26 L184,40 L400,40" />
                <path className="trace-active" d="M0,40 L120,40 L136,12 L154,64 L170,26 L184,40 L400,40" />
                <circle className="pulse-dot pulse-motion" r="4">
                  <animateMotion
                    dur="3.6s"
                    repeatCount="indefinite"
                    path="M0,40 L120,40 L136,12 L154,64 L170,26 L184,40 L400,40"
                  />
                </circle>
              </svg>
            </div>

            <div className="stat-row">
              {statChips.map((chip) => (
                <span className={`stat-chip ${chip.tone}`} key={chip.text}>
                  <span className="dot" aria-hidden="true" />
                  {chip.text}
                </span>
              ))}
            </div>
          </section>

          <section className="auth-card">
            <div className="auth-tabs">
              <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>
                Sign in
              </button>
              <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
                Create account
              </button>
            </div>

            <div className="auth-heading">
              <div className="card-eyebrow">{mode === 'login' ? 'Secure workspace access' : 'New patient profile'}</div>
              <h2>{mode === 'login' ? 'Open your workspace' : 'Start a patient profile'}</h2>
              <p>
                {mode === 'login'
                  ? 'Pick a role below to try the demo, or sign in with your own credentials.'
                  : 'Patient accounts are self-service. Staff accounts are set up by an administrator.'}
              </p>
            </div>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <label>
                Username
                <input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="your.username" />
              </label>
              {mode === 'signup' && (
                <label>
                  Email address
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                </label>
              )}
              <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password" />
              </label>
              {mode === 'signup' && (
                <label>
                  Account type
                  <select value={roleName} onChange={(e) => setRoleName(e.target.value)}>
                    <option value="PATIENT">Patient</option>
                    <option value="RECEPTIONIST">Receptionist</option>
                  </select>
                </label>
              )}
              {mode === 'signup' && roleName === 'PATIENT' && (
                <>
                  <label>
                    Full name
                    <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Given name" />
                  </label>
                  <label>
                    Father&apos;s name
                    <input value={fatherName} onChange={(e) => setFatherName(e.target.value)} required placeholder="Father's name" />
                  </label>
                  <label>
                    Grandfather&apos;s name
                    <input value={grandFatherName} onChange={(e) => setGrandFatherName(e.target.value)} required placeholder="Grandfather's name" />
                  </label>
                  <div className="field-row">
                    <label>
                      Age
                      <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="Age" />
                    </label>
                    <label>
                      Gender
                      <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                        <option value="" disabled>Select</option>
                        <option value="FEMALE">Female</option>
                        <option value="MALE">Male</option>
                      </select>
                    </label>
                  </div>
                  <label>
                    Address
                    <input value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Sub-city, woreda, street" />
                  </label>
                </>
              )}
              <button className="primary-action" type="submit" disabled={busy}>
                {busy ? 'Please wait…' : mode === 'login' ? 'Open workspace' : 'Create account'}
              </button>
            </form>

            {mode === 'login' && (
              <div className="demo-access">
                <div className="demo-heading">Demo roster</div>
                <div className="demo-subheading">Choose a role to prefill a ready-to-use demo account.</div>
                {roleGroups.map((group) => (
                  <div className="role-group" key={group.label}>
                    <div className={`role-group-label tone-${group.tone}`}>{group.label}</div>
                    <div className="role-chip-grid">
                      {group.roleValues.map((value) => {
                        const account = roles.find(([roleValue]) => roleValue === value);
                        if (!account) return null;
                        const [roleValue, label, accountUsername, accountPassword, abbr] = account;
                        return (
                          <button
                            key={roleValue}
                            type="button"
                            onClick={() => selectRole(roleValue)}
                            className={`role-chip ${username === accountUsername ? 'selected' : ''}`}
                          >
                            <span className={`role-avatar tone-${group.tone}`} aria-hidden="true">{abbr}</span>
                            <span className="role-chip-text">
                              <strong>{label}</strong>
                              <span>{accountUsername} / {accountPassword}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mode === 'signup' && (
              <div className="signup-note">
                <span className="signup-note-mark" aria-hidden="true">+</span>
                <span><strong>Designed for real care journeys</strong>Your profile can be completed now and connected to the hospital team when you are ready.</span>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default Login;