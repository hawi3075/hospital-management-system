import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { normalizeRole } from '../routes/roleConfig';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&display=swap');

.ns-auth-root {
  --ns-bg-dark: #030712;
  --ns-bg-card: rgba(15, 23, 42, 0.65);
  --ns-teal: #2dd4bf;
  --ns-teal-glow: rgba(45, 212, 191, 0.35);
  --ns-indigo: #6366f1;
  --ns-rose: #f43f5e;
  --ns-amber: #fbbf24;
  --ns-border: rgba(255, 255, 255, 0.08);
  --ns-border-active: rgba(45, 212, 191, 0.4);
  --ns-text-main: #f8fafc;
  --ns-text-muted: #94a3b8;
  --ns-text-dim: #64748b;

  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-color: var(--ns-bg-dark);
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--ns-text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
}

/* Dynamic Glowing Orbs */
.ns-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}
.ns-orb-1 {
  width: 35rem;
  height: 35rem;
  top: -10%;
  left: -10%;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.25) 0%, transparent 70%);
  animation: floatOrb 18s ease-in-out infinite alternate;
}
.ns-orb-2 {
  width: 30rem;
  height: 30rem;
  bottom: -10%;
  right: -5%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  animation: floatOrb 22s ease-in-out infinite alternate-reverse;
}

@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(3rem, 4rem) scale(1.1); }
}

/* Background Grid Overlay */
.ns-grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at 50% 50%, black 30%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}

/* Layout Shell */
.ns-auth-shell {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 4rem;
  align-items: center;
}

@media (max-width: 1024px) {
  .ns-auth-shell {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

/* Hero Section (Left Column) */
.ns-hero {
  display: flex;
  flex-direction: column;
}

.ns-brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 2.5rem;
}

.ns-logo-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--ns-teal) 0%, #0d9488 100%);
  box-shadow: 0 0 20px var(--ns-teal-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
  color: #042f2e;
}

.ns-brand-text h3 {
  font-family: 'Syne', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.02em;
}

.ns-brand-text p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--ns-text-muted);
}

.ns-live-badge {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  padding: 0.35rem 0.8rem;
  border-radius: 9999px;
  background: rgba(45, 212, 191, 0.08);
  border: 1px solid rgba(45, 212, 191, 0.25);
  color: var(--ns-teal);
  font-weight: 500;
}

.ns-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ns-teal);
  box-shadow: 0 0 10px var(--ns-teal);
  animation: pulseDot 2s infinite;
}

@keyframes pulseDot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

.ns-hero-tag {
  color: var(--ns-teal);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.ns-hero-title {
  font-family: 'Syne', sans-serif;
  font-size: clamp(2.5rem, 5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin: 0 0 1.25rem;
  background: linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ns-hero-desc {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--ns-text-muted);
  max-width: 40ch;
  margin: 0 0 2.5rem;
}

/* Floating Metrics Grid */
.ns-hero-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.ns-metric-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--ns-border);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.ns-metric-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.15);
}

.ns-metric-val {
  font-family: 'Syne', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ns-text-main);
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ns-metric-lbl {
  font-size: 0.8rem;
  color: var(--ns-text-dim);
}

/* Right Column: Glass Card */
.ns-card {
  background: var(--ns-bg-card);
  border: 1px solid var(--ns-border);
  border-radius: 28px;
  padding: 2.5rem;
  backdrop-filter: blur(24px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.ns-card-header-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--ns-teal), var(--ns-indigo), var(--ns-rose));
}

.ns-tab-group {
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.35rem;
  border-radius: 14px;
  border: 1px solid var(--ns-border);
  margin-bottom: 2rem;
}

.ns-tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--ns-text-muted);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.65rem 0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.ns-tab-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--ns-text-main);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.ns-card-heading h2 {
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.4rem;
}

.ns-card-heading p {
  color: var(--ns-text-muted);
  font-size: 0.875rem;
  margin: 0 0 1.75rem;
  line-height: 1.5;
}

/* Form Controls */
.ns-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.ns-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.ns-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ns-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ns-input, .ns-select {
  width: 100%;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--ns-border);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  color: var(--ns-text-main);
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.ns-input::placeholder {
  color: var(--ns-text-dim);
}

.ns-input:focus, .ns-select:focus {
  border-color: var(--ns-teal);
  box-shadow: 0 0 0 3px var(--ns-teal-glow);
  background: rgba(0, 0, 0, 0.5);
}

.ns-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

/* Primary Action Button */
.ns-btn-submit {
  margin-top: 0.5rem;
  background: linear-gradient(135deg, var(--ns-teal) 0%, #14b8a6 100%);
  color: #042f2e;
  border: none;
  border-radius: 12px;
  padding: 0.95rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 20px var(--ns-teal-glow);
}

.ns-btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(45, 212, 191, 0.5);
}

.ns-btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ns-error-box {
  background: rgba(244, 63, 94, 0.12);
  border: 1px solid rgba(244, 63, 94, 0.3);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
}

/* Demo Roster Grouping */
.ns-demo-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--ns-border);
}

.ns-demo-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--ns-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.ns-demo-sub {
  font-size: 0.8rem;
  color: var(--ns-text-dim);
  margin-bottom: 1.25rem;
}

.ns-role-group {
  margin-bottom: 1.25rem;
}

.ns-role-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ns-text-muted);
  margin-bottom: 0.6rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.ns-role-label-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.tone-leadership .ns-role-label-dot, .avatar-leadership { background: #818cf8; }
.tone-clinical .ns-role-label-dot, .avatar-clinical { background: var(--ns-teal); }
.tone-support .ns-role-label-dot, .avatar-support { background: var(--ns-rose); }
.tone-patient .ns-role-label-dot, .avatar-patient { background: var(--ns-amber); }

.ns-chip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
  gap: 0.6rem;
}

.ns-role-chip {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--ns-border);
  border-radius: 12px;
  padding: 0.6rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.ns-role-chip:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}

.ns-role-chip.selected {
  border-color: var(--ns-teal);
  background: rgba(45, 212, 191, 0.08);
}

.ns-avatar {
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  color: #0f172a;
  flex-shrink: 0;
}

.ns-chip-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ns-chip-meta strong {
  font-size: 0.8rem;
  color: var(--ns-text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ns-chip-meta span {
  font-size: 0.7rem;
  color: var(--ns-text-dim);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  ['LAB_TECHNICIAN', 'Lab Tech', 'lab', 'Lab@123', 'LT'],
  ['CASHIER', 'Cashier', 'finance', 'Finance@123', 'CA'],
  ['PATIENT', 'Patient', 'patient', 'Patient@123', 'PT'],
];

const roleGroups = [
  { label: 'Leadership', roleValues: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'], tone: 'leadership' },
  { label: 'Clinical Teams', roleValues: ['DOCTOR', 'NURSE', 'RADIOLOGY_TECHNICIAN', 'LAB_TECHNICIAN'], tone: 'clinical' },
  { label: 'Operations & Support', roleValues: ['RECEPTIONIST', 'PHARMACIST', 'CASHIER'], tone: 'support' },
  { label: 'Patient Access', roleValues: ['PATIENT'], tone: 'patient' },
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
      <div className="ns-auth-root">
        {/* Glow ambient Orbs */}
        <div className="ns-orb ns-orb-1" aria-hidden="true" />
        <div className="ns-orb ns-orb-2" aria-hidden="true" />
        <div className="ns-grid-bg" aria-hidden="true" />

        <div className="ns-auth-shell">
          {/* Left Column - Hero */}
          <section className="ns-hero">
            <div className="ns-brand">
              <div className="ns-logo-icon">N</div>
              <div className="ns-brand-text">
                <h3>Northstar</h3>
                <p>Healthcare Intelligence</p>
              </div>
              <div className="ns-live-badge">
                <span className="ns-badge-dot" />
                Operational
              </div>
            </div>

            <div className="ns-hero-tag">
              {mode === 'login' ? 'Command Center' : 'Patient Registration'}
            </div>
            <h1 className="ns-hero-title">
              {mode === 'login' ? 'Next-gen care starts here.' : 'Connecting patients to care.'}
            </h1>
            <p className="ns-hero-desc">
              {mode === 'login'
                ? 'Unified access for clinical teams, staff, and leadership driving care operations forward.'
                : 'Set up your digital health footprint and manage care appointments seamlessly.'}
            </p>

            <div className="ns-hero-cards">
              <div className="ns-metric-card">
                <div className="ns-metric-val">10 Roles</div>
                <div className="ns-metric-lbl">Role-based access system</div>
              </div>
              <div className="ns-metric-card">
                <div className="ns-metric-val">24/7</div>
                <div className="ns-metric-lbl">Continuous uptime monitoring</div>
              </div>
            </div>
          </section>

          {/* Right Column - Form Card */}
          <section className="ns-card">
            <div className="ns-card-header-bar" />

            <div className="ns-tab-group">
              <button 
                type="button" 
                className={`ns-tab-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
              <button 
                type="button" 
                className={`ns-tab-btn ${mode === 'signup' ? 'active' : ''}`}
                onClick={() => setMode('signup')}
              >
                Create Account
              </button>
            </div>

            <div className="ns-card-heading">
              <h2>{mode === 'login' ? 'Welcome Back' : 'New Patient Account'}</h2>
              <p>
                {mode === 'login'
                  ? 'Select a demo persona or log in with system credentials.'
                  : 'Self-service registration for patient profiles.'}
              </p>
            </div>

            {error && <div className="ns-error-box">{error}</div>}

            <form className="ns-form" onSubmit={handleSubmit}>
              <div className="ns-field">
                <label className="ns-label">Username</label>
                <input 
                  className="ns-input" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  placeholder="Enter username" 
                />
              </div>

              {mode === 'signup' && (
                <div className="ns-field">
                  <label className="ns-label">Email Address</label>
                  <input 
                    type="email" 
                    className="ns-input" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="you@example.com" 
                  />
                </div>
              )}

              <div className="ns-field">
                <label className="ns-label">Password</label>
                <input 
                  type="password" 
                  className="ns-input" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••••••" 
                />
              </div>

              {mode === 'signup' && (
                <div className="ns-field">
                  <label className="ns-label">Account Type</label>
                  <select className="ns-select" value={roleName} onChange={(e) => setRoleName(e.target.value)}>
                    <option value="PATIENT">Patient</option>
                    <option value="RECEPTIONIST">Receptionist</option>
                  </select>
                </div>
              )}

              {mode === 'signup' && roleName === 'PATIENT' && (
                <>
                  <div className="ns-field">
                    <label className="ns-label">Full Name</label>
                    <input className="ns-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="First Name" />
                  </div>
                  <div className="ns-grid-2">
                    <div className="ns-field">
                      <label className="ns-label">Father's Name</label>
                      <input className="ns-input" value={fatherName} onChange={(e) => setFatherName(e.target.value)} required placeholder="Father's Name" />
                    </div>
                    <div className="ns-field">
                      <label className="ns-label">Grandfather's Name</label>
                      <input className="ns-input" value={grandFatherName} onChange={(e) => setGrandFatherName(e.target.value)} required placeholder="Grandfather's Name" />
                    </div>
                  </div>
                  <div className="ns-grid-2">
                    <div className="ns-field">
                      <label className="ns-label">Age</label>
                      <input type="number" min="0" className="ns-input" value={age} onChange={(e) => setAge(e.target.value)} required placeholder="Age" />
                    </div>
                    <div className="ns-field">
                      <label className="ns-label">Gender</label>
                      <select className="ns-select" value={gender} onChange={(e) => setGender(e.target.value)} required>
                        <option value="" disabled>Select</option>
                        <option value="FEMALE">Female</option>
                        <option value="MALE">Male</option>
                      </select>
                    </div>
                  </div>
                  <div className="ns-field">
                    <label className="ns-label">Address</label>
                    <input className="ns-input" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Sub-city, woreda, street" />
                  </div>
                </>
              )}

              <button className="ns-btn-submit" type="submit" disabled={busy}>
                {busy ? 'Processing...' : mode === 'login' ? 'Sign In to Workspace' : 'Complete Registration'}
              </button>
            </form>

            {mode === 'login' && (
              <div className="ns-demo-section">
                <div className="ns-demo-title">Demo Access Roster</div>
                <div className="ns-demo-sub">Click any role to autofill system demo accounts:</div>

                {roleGroups.map((group) => (
                  <div className={`ns-role-group tone-${group.tone}`} key={group.label}>
                    <div className="ns-role-label">
                      <span className="ns-role-label-dot" />
                      {group.label}
                    </div>
                    <div className="ns-chip-grid">
                      {group.roleValues.map((value) => {
                        const account = roles.find(([roleValue]) => roleValue === value);
                        if (!account) return null;
                        const [roleValue, label, accountUsername, accountPassword, abbr] = account;
                        return (
                          <button
                            key={roleValue}
                            type="button"
                            className={`ns-role-chip ${username === accountUsername ? 'selected' : ''}`}
                            onClick={() => selectRole(roleValue)}
                          >
                            <span className={`ns-avatar avatar-${group.tone}`}>{abbr}</span>
                            <span className="ns-chip-meta">
                              <strong>{label}</strong>
                              <span>{accountUsername}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Login;