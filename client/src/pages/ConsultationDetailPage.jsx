import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

export default function ConsultationDetailPage() {
  const { role, consultationId } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { apiClient.get(`/consultations/${consultationId}`).then((response) => setConsultation(response.data.data)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load consultation.')); }, [consultationId]);
  if (error) return <div className="inline-error">{error}</div>;
  if (!consultation) return <div className="state-panel">Loading consultation...</div>;
  return <section className="module-page"><div className="page-heading"><div><span className="eyebrow">Clinical record</span><h1>{consultation.patient?.firstName} {consultation.patient?.fatherName}</h1><p>{new Date(consultation.createdAt).toLocaleString()} · {consultation.patient?.patientId}</p></div><Link className="ghost-button inline-action" to={`/workspace/${role}/consultations`}>Back to consultations</Link></div><div className="profile-grid"><article className="content-panel"><span className="section-label">Assessment</span><dl className="detail-list"><div><dt>Chief complaint</dt><dd>{consultation.chiefComplaint}</dd></div><div><dt>Symptoms</dt><dd>{consultation.symptoms || 'Not recorded'}</dd></div><div><dt>Examination</dt><dd>{consultation.examinationNotes}</dd></div><div><dt>Diagnosis</dt><dd>{consultation.diagnoses?.[0]?.description || 'Not recorded'}</dd></div><div><dt>Treatment</dt><dd>{consultation.treatmentPlan}</dd></div></dl></article><article className="content-panel"><span className="section-label">Recorded vitals</span>{consultation.vitalSigns ? <dl className="detail-list"><div><dt>Blood pressure</dt><dd>{consultation.vitalSigns.bloodPressure}</dd></div><div><dt>Heart rate</dt><dd>{consultation.vitalSigns.heartRate}</dd></div><div><dt>Temperature</dt><dd>{consultation.vitalSigns.temperature}</dd></div><div><dt>Oxygen saturation</dt><dd>{consultation.vitalSigns.spo2}%</dd></div></dl> : <p className="profile-callout">No vital signs were recorded for this consultation.</p>}</article></div></section>;
}
