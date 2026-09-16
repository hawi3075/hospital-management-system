import { useState } from 'react';
import apiClient from '../utils/apiClient';

const PatientForm = ({ onPatientCreated }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    fatherName: '',
    grandfatherName: '',
    gender: 'MALE',
    dateOfBirth: '',
    phone: '',
    address: '',
    bloodGroup: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await apiClient.post('/patients', formData);
      setMessage(`Successfully registered patient ID: ${response.data.data.patientId}`);
      setFormData({
        firstName: '',
        fatherName: '',
        grandfatherName: '',
        gender: 'MALE',
        dateOfBirth: '',
        phone: '',
        address: '',
        bloodGroup: ''
      });
      if (onPatientCreated) onPatientCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register patient.');
    }
  };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
      <h4>Register New Patient</h4>
      {message && <div style={{ color: 'green', marginBottom: '10px' }}>{message}</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Father's Name</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Grandfather's Name</label>
          <input type="text" name="grandfatherName" value={formData.grandfatherName} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold' }}>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ gridColumn: 'span 2' }}>
          <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Save Patient
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;