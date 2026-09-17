import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { normalizeRole } from '../routes/roleConfig';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.ns-auth-root {
  --ns-bg: #f8fafc;
  --ns-card-bg: #ffffff;
  --ns-accent: #2563eb;
  --ns-accent-hover: #1d4ed8;
  --ns-accent-soft: #eff6ff;
  --ns-border: #e2e8f0;
  --ns-border-active: #2563eb;
  --ns-text-main: #0f172a;
  --ns-text-muted: #64748b;
  --ns-text-dim: #94a3b8;
  --ns-danger: #dc2626;
  --ns-danger-bg: #fef2f2;
  --ns-danger-border: #fecaca;

  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: var(--ns-bg);
  font-family: 'Inter', sans-serif;
  color: var(--ns-text-main);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 4rem 1.5rem 2rem;
}

/* Layout Shell */
.ns-auth-shell {
  width: 100%;
  max-width: 1100px;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 3rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .ns-auth-shell {
    grid-template-columns: 1fr;
    gap: 2.5rem;
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
  gap: 0.75rem;
  margin-bottom: 2.5rem;
}

.ns-logo-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 10px;
  background: var(--ns-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.3rem;
  color: #ffffff;
}

.ns-brand-text h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
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
  gap: 0.4rem;
  font-size: 0.75rem;
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  background: var(--ns-accent-soft);
  border: 1px solid #bfdbfe;
  color: var(--ns-accent);
  font-weight: 500;
}

.ns-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ns-accent);
}

.ns-hero-tag {
  color: var(--ns-accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.ns-hero-title {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
  color: var(--ns-text-main);
}

.ns-hero-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ns-text-muted);
  max-width: 40ch;
  margin: 0 0 2.25rem;
}

/* Metrics Grid */
.ns-hero-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.ns-metric-card {
  background: var(--ns-card-bg);
  border: 1px solid var(--ns-border);
  border-radius: 12px;
  padding: 1rem 1.15rem;
}

.ns-metric-val {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ns-text-main);
  margin-bottom: 0.2rem;
}

.ns-metric-lbl {
  font-size: 0.8rem;
  color: var(--ns-text-dim);
}

/* Right Column: Card */
.ns-card {
  background: var(--ns-card-bg);
  border: 1px solid var(--ns-border);
  border-radius: 16px;
  padding: 2.25rem;
}

.ns-tab-group {
  display: flex;
  background: var(--ns-bg);
  padding: 0.3rem;
  border-radius: 10px;
  border: 1px solid var(--ns-border);
  margin-bottom: 1.75rem;
}

.ns-tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--ns-text-muted);
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.6rem 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.ns-tab-btn.active {
  background: var(--ns-card-bg);
  color: var(--ns-text-main);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.ns-card-heading h2 {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.35rem;
}

.ns-card-heading p {
  color: var(--ns-text-muted);
  font-size: 0.875rem;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

/* Form Controls */
.ns-form {
  display: flex;
  flex-direction: column;
  gap: 1.05rem;
}

.ns-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ns-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--ns-text-muted);
}

.ns-input, .ns-select {
  width: 100%;
  background: var(--ns-card-bg);
  border: 1px solid var(--ns-border);
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  color: var(--ns-text-main);
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.ns-input::placeholder {
  color: var(--ns-text-dim);
}

.ns-input:focus, .ns-select:focus {
  border-color: var(--ns-border-active);
  box-shadow: 0 0 0 3px var(--ns-accent-soft);
}

.ns-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

/* Primary Action Button */
.ns-btn-submit {
  margin-top: 0.4rem;
  background: var(--ns-accent);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.85rem;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.ns-btn-submit:hover:not(:disabled) {
  background: var(--ns-accent-hover);
}

.ns-btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ns-error-box {
  background: var(--ns-danger-bg);
  border: 1px solid var(--ns-danger-border);
  color: var(--ns-danger);
  padding: 0.7rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
}

/* Demo Roster Grouping */
.ns-demo-section {
  margin-top: 1.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--ns-border);
}

.ns-demo-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--ns-text-muted);
  margin-bottom: 0.25rem;
}

.ns-demo-sub {
  font-size: 0.8rem;
  color: var(--ns-text-dim);
  margin-bottom: 1.15rem;
}

.ns-role-group {
  margin-bottom: 1.15rem;
}

.ns-role-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ns-text-muted);
  margin-bottom: 0.55rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.ns-role-label-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--ns-text-dim);
}

.ns-chip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
  gap: 0.55rem;
}

.ns-role-chip {
  background: var(--ns-card-bg);
  border: 1px solid var(--ns-border);
  border-radius: 10px;
  padding: 0.55rem 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.ns-role-chip:hover {
  background: var(--ns-bg);
}

.ns-role-chip.selected {
  border-color: var(--ns-accent);
  background: var(--ns-accent-soft);
}

.ns-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.7rem;
  color: #ffffff;
  background: var(--ns-text-dim);
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
  ['TRIAGE_NURSE', 'Triage Nurse', 'triage', 'Triage@123', 'TN'],
  ['CHARGE_NURSE', 'Charge Nurse', 'charge', 'Charge@123', 'CN'],
  ['STAFF_NURSE', 'Staff Nurse / ER Nurse', 'staffnurse', 'StaffNurse@123', 'SN'],
  ['RECEPTIONIST', 'Receptionist', 'reception', 'Reception@123', 'RC'],
  ['RADIOLOGY_TECHNICIAN', 'Radiology', 'radiology', 'Radiology@123', 'RT'],
  ['PHARMACIST', 'Pharmacist', 'pharmacy', 'Pharmacy@123', 'PH'],
  ['LAB_TECHNICIAN', 'Lab Tech', 'lab', 'Lab@123', 'LT'],
  ['CASHIER', 'Cashier', 'finance', 'Finance@123', 'CA'],
  ['PATIENT', 'Patient', 'patient', 'Patient@123', 'PT'],
];

const roleGroups = [
  { label: 'Leadership', roleValues: ['SUPER_ADMIN', 'HOSPITAL_ADMIN'] },
  { label: 'Clinical Teams', roleValues: ['DOCTOR', 'NURSE', 'TRIAGE_NURSE', 'CHARGE_NURSE', 'STAFF_NURSE', 'RADIOLOGY_TECHNICIAN', 'LAB_TECHNICIAN'] },
  { label: 'Operations & Support', roleValues: ['RECEPTIONIST', 'PHARMACIST', 'CASHIER'] },
  { label: 'Patient Access', roleValues: ['PATIENT'] },
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

            {/* Demo credential roster — dev/staging only, never shown in a production build */}
            {mode === 'login' && import.meta.env.DEV && (
              <div className="ns-demo-section">
                <div className="ns-demo-title">Demo Access Roster</div>
                <div className="ns-demo-sub">Click any role to autofill system demo accounts:</div>

                {roleGroups.map((group) => (
                  <div className="ns-role-group" key={group.label}>
                    <div className="ns-role-label">
                      <span className="ns-role-label-dot" />
                      {group.label}
                    </div>
                    <div className="ns-chip-grid">
                      {group.roleValues.map((value) => {
                        const account = roles.find(([roleValue]) => roleValue === value);
                        if (!account) return null;
                        const [roleValue, label, accountUsername, , abbr] = account;
                        return (
                          <button
                            key={roleValue}
                            type="button"
                            className={`ns-role-chip ${username === accountUsername ? 'selected' : ''}`}
                            onClick={() => selectRole(roleValue)}
                          >
                            <span className="ns-avatar">{abbr}</span>
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