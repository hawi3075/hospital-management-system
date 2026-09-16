import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import PatientForm from '../components/PatientForm';
import RoleWorkspace from './RoleWorkspace';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get('/patients');
      setPatients(response.data.data);
    } catch {
      setError('Failed to load hospital records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.role === 'ADMIN') {
      // The admin view owns the patient list; role workspaces do not need this request.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchPatients();
    }
  }, [user.role]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  if (user.role && user.role !== 'ADMIN') {
    return <RoleWorkspace user={user} onLogout={() => { localStorage.clear(); window.location.reload(); }} />;
  }

  return (
    <div className="admin-shell">
      <div className="workspace-header">
        <div><span className="eyebrow">Administration / overview</span><h2>Hospital command center</h2></div>
        <button className="ghost-button" onClick={handleLogout}>Sign out</button>
      </div>

      <div className="welcome-strip"><div><span className="section-label">Signed in as</span><strong>{user.username || user.email || 'Administrator'}</strong></div><span className="role-badge">ADMIN</span></div>
      <PatientForm onPatientCreated={fetchPatients} />

      <h3 className="content-title">Registered patients</h3>
      {loading ? <p>Loading records...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <table className="patient-table">
          <thead>
            <tr style={{ background: '#0056b3', color: 'white', textAlign: 'left' }}>
              <th>Patient ID</th><th>Full Name</th><th>Gender</th><th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td><strong>{p.patientId}</strong></td><td>{`${p.firstName} ${p.fatherName} ${p.grandfatherName}`}</td><td>{p.gender}</td><td>{p.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;