import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';

const AppointmentForm = () => {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    departmentId: '',
    date: '',
    time: '10:00 AM',
    reason: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const patientsRes = await apiClient.get('/patients');
        setPatients(patientsRes.data.data);
        // Note: You can add a GET /staff/doctors route later if needed, or select dynamically
      } catch {
        setError('Failed to load dropdown dependencies.');
      }
    };
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      await apiClient.post('/appointments', formData);
      setMessage('Appointment successfully scheduled!');
      setFormData({
        patientId: '',
        doctorId: '',
        departmentId: '',
        date: '',
        time: '10:00 AM',
        reason: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule appointment.');
    }
  };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginTop: '30px' }}>
      <h4>Schedule Clinical Appointment</h4>
      {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Select Patient</label>
          <select name="patientId" value={formData.patientId} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="">-- Choose Patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.fatherName} ({p.patientId})</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Doctor ID</label>
          <input type="text" name="doctorId" placeholder="Paste Doctor UUID" value={formData.doctorId} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Department ID</label>
          <input type="text" name="departmentId" placeholder="Paste Department UUID" value={formData.departmentId} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Appointment Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Time Slot</label>
          <input type="text" name="time" value={formData.time} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Reason for Visit</label>
          <input type="text" name="reason" value={formData.reason} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="e.g. Regular Checkup" />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <button type="submit" style={{ padding: '10px 20px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Confirm Appointment
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;