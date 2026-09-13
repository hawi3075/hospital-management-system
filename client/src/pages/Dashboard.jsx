import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import PatientForm from '../components/PatientForm';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchPatients = async () => {
    try {
      const response = await apiClient.get('/patients');
      setPatients(response.data.data);
    } catch (err) {
      setError('Failed to load hospital records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '15px' }}>
        <h2>Admin Dashboard ({user.email || 'Administrator'})</h2>
        <button onClick={handleLogout} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sign Out
        </button>
      </div>

      <PatientForm onPatientCreated={fetchPatients} />

      <h3>Registered Patients</h3>
      {loading ? <p>Loading records...</p> : error ? <p style={{ color: 'red' }}>{error}</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ background: '#0056b3', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Patient ID</th>
              <th style={{ padding: '12px' }}>Full Name</th>
              <th style={{ padding: '12px' }}>Gender</th>
              <th style={{ padding: '12px' }}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.patientId}</td>
                <td style={{ padding: '12px' }}>{`${p.firstName} ${p.fatherName} ${p.grandfatherName}`}</td>
                <td style={{ padding: '12px' }}>{p.gender}</td>
                <td style={{ padding: '12px' }}>{p.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;