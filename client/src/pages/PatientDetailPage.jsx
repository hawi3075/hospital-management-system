import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

export default function PatientDetailPage() {
  const { role, patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { apiClient.get(`/patients/${patientId}`).then((response) => setPatient(response.data.data)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load this patient record.')); }, [patientId]);
  const basePath = `/workspace/${role}`;
  if (error) return <div className="inline-error">{error}</div>;
  if (!patient) return <div className="state-panel">Loading patient record...</div>;
  return <section className="module-page"><div className="page-heading"><div><span className="eyebrow">Patient record / {patient.patientId}</span><h1>{patient.firstName} {patient.fatherName} {patient.grandfatherName}</h1><p>Registered {new Date(patient.createdAt).toLocaleDateString()} · {patient.gender} · {patient.bloodGroup || 'Blood group not recorded'}</p></div><Link className="ghost-button inline-action" to={`${basePath}/patients`}>Back to patients</Link></div><div className="profile-grid"><article className="content-panel"><span className="section-label">Personal information</span><dl className="detail-list"><div><dt>Patient ID</dt><dd>{patient.patientId}</dd></div><div><dt>Date of birth</dt><dd>{new Date(patient.dateOfBirth).toLocaleDateString()}</dd></div><div><dt>Phone</dt><dd>{patient.phone}</dd></div><div><dt>Email</dt><dd>{patient.email || 'Not recorded'}</dd></div><div><dt>Address</dt><dd>{patient.address}</dd></div></dl></article><article className="content-panel"><span className="section-label">Clinical alerts</span><h2>Allergies and conditions</h2><p>{patient.allergies || 'No allergies recorded.'}</p><div className="profile-callout">Review and update clinical information during the patient\'s care journey.</div></article></div></section>;
}
