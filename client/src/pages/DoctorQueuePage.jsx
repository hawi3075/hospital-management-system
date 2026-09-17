import { useEffect, useState } from 'react';
import { ArrowUpRight, ClipboardCheck, RefreshCw, TestTube2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const patientName = (appointment) => `${appointment.patient?.firstName || ''} ${appointment.patient?.fatherName || ''}`.trim() || 'Unnamed patient';
const priorityLabel = { CRITICAL: 'Critical', URGENT: 'Urgent', STABLE: 'Stable' };

export default function DoctorQueuePage() {
  const { role } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = () => { setLoading(true); setError(''); apiClient.get('/nursing/doctor-queue').then((response) => setAppointments(response.data.data || [])).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load doctor handoffs.')).finally(() => setLoading(false)); };
  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, []);

  return <section className="module-page doctor-queue-page"><div className="page-heading"><div><span className="eyebrow">Doctor workspace / triage handoffs</span><h1>Patients ready for review</h1><p>Triage findings, vitals, and acuity arrive here before you decide on treatment, laboratory, imaging, pharmacy, or another care handoff.</p></div><button className="ghost-button inline-action" onClick={load}><RefreshCw size={16} /> Refresh</button></div>{error && <div className="inline-error">{error}</div>}{loading ? <div className="state-panel">Loading clinical handoffs...</div> : appointments.length === 0 ? <div className="state-panel"><h2>No patients are waiting for review</h2><p>Completed triage assessments will appear here.</p></div> : <div className="doctor-queue-list">{appointments.map((appointment) => { const triage = appointment.triageAssessment; return <article className="content-panel doctor-handoff-card" key={appointment.id}><div className="doctor-handoff-head"><div><span className="section-label">{appointment.status === 'IN_CONSULTATION' ? 'In consultation' : 'Triage handoff'}</span><h2>{patientName(appointment)}</h2><small>{appointment.patient?.patientId} · {appointment.reason || 'No complaint recorded'}</small></div>{triage && <span className={`doctor-acuity ${triage.priority.toLowerCase()}`}>{priorityLabel[triage.priority]}</span>}</div><div className="doctor-handoff-grid"><div><span className="section-label">Initial assessment</span><p>{triage?.assessmentNotes || 'No triage notes recorded.'}</p></div><div><span className="section-label">Vitals</span><p>BP {triage?.bloodPressure || '--'} · HR {triage?.heartRate || '--'} · Temp {triage?.temperature || '--'} · SpO2 {triage?.spo2 || '--'}%</p></div><div><span className="section-label">Triage nurse</span><p>{triage?.recordedBy?.username || 'Not recorded'}</p></div></div><div className="doctor-handoff-actions"><Link className="primary-action inline-action" to={`/workspace/${role}/consultations/new?appointmentId=${appointment.id}&patientId=${appointment.patientId}&doctorId=${appointment.doctorId}`}><ClipboardCheck size={16} /> Open patient review <ArrowUpRight size={16} /></Link>{appointment.consultation?.labOrders?.length > 0 && <span className="handoff-badge"><TestTube2 size={15} /> Lab results linked</span>}</div></article>; })}</div>}</section>;
}
