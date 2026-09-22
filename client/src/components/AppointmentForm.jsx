import { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';

const emptyForm = { patientId: '', doctorId: '', departmentId: '', date: '', time: '10:00', reason: '' };

const AppointmentForm = ({ onScheduled }) => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true);
        // Fetch patients, doctors, and departments concurrently
        const [patientsRes, doctorsRes, departmentsRes] = await Promise.all([
          apiClient.get('/patients'),
          apiClient.get('/staff/doctors'), 
          apiClient.get('/departments')    
        ]);

        setPatients(patientsRes.data.data || []);
        setDoctors(doctorsRes.data.data || []);
        setDepartments(departmentsRes.data.data || []);
      } catch {
        setError('Failed to load dropdown dependencies.');
      } finally {
        setLoading(false);
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
      setFormData(emptyForm);
      onScheduled?.();
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
        {/* Patient Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Select Patient</label>
          <select name="patientId" value={formData.patientId} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="">-- Choose Patient --</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.firstName} {p.fatherName} ({p.patientId})</option>
            ))}
          </select>
        </div>

        {/* Doctor Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Select Doctor</label>
          <select name="doctorId" value={formData.doctorId} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="">-- Choose Doctor --</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>
            ))}
          </select>
        </div>

        {/* Department Selection */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Select Department</label>
          <select name="departmentId" value={formData.departmentId} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="">-- Choose Department --</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Appointment Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>

        {/* Time Slot */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Time Slot</label>
          <input type="time" name="time" value={formData.time} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>

        {/* Reason for Visit */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Reason for Visit</label>
          <input type="text" name="reason" value={formData.reason} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} placeholder="e.g. Regular Checkup" />
        </div>

        
        <div style={{ gridColumn: 'span 2' }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Loading...' : 'Confirm Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}
export default AppointmentForm;