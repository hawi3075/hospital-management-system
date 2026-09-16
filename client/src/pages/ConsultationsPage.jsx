import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import apiClient from '../utils/apiClient';

export default function ConsultationsPage() {
  const { role } = useParams();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = () => { setLoading(true); apiClient.get('/consultations').then((response) => setConsultations(response.data.data || [])).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load consultations.')).finally(() => setLoading(false)); };
  useEffect(() => { apiClient.get('/consultations').then((response) => setConsultations(response.data.data || [])).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load consultations.')).finally(() => setLoading(false)); }, []);
  return <section className="module-page"><div className="page-heading"><div><span className="eyebrow">Clinical documentation</span><h1>Consultations</h1><p>Review completed encounters, diagnoses, vitals, and treatment plans.</p></div><div className="heading-actions"><button className="ghost-button inline-action" onClick={load}><RefreshCw size={16} /> Refresh</button><Link className="primary-action inline-action" to={`/workspace/${role}/consultations/new`}><Plus size={16} /> New consultation</Link></div></div>{error && <div className="inline-error">{error}</div>}{loading ? <div className="state-panel">Loading consultations...</div> : consultations.length === 0 ? <div className="state-panel"><h2>No consultations recorded</h2><p>Completed doctor encounters will appear here.</p></div> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Date</th><th>Patient</th><th>Chief complaint</th><th>Diagnosis</th><th>Treatment plan</th><th /></tr></thead><tbody>{consultations.map((consultation) => <tr key={consultation.id}><td>{new Date(consultation.createdAt).toLocaleDateString()}</td><td><strong>{consultation.patient?.firstName} {consultation.patient?.fatherName}</strong><small className="table-subtext">{consultation.patient?.patientId}</small></td><td>{consultation.chiefComplaint}</td><td>{consultation.diagnoses?.[0]?.description || 'Not recorded'}</td><td>{consultation.treatmentPlan}</td><td><Link className="table-link" to={`/workspace/${role}/consultations/${consultation.id}`}>Open</Link></td></tr>)}</tbody></table></div>}</section>;
}
