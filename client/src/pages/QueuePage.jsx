import { useEffect, useState } from 'react';
import { RefreshCw, Volume2 } from 'lucide-react';
import apiClient from '../utils/apiClient';

export default function QueuePage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadQueue = () => { setLoading(true); apiClient.get('/appointments?status=WAITING').then((response) => setAppointments(response.data.data || [])).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load the queue.')).finally(() => setLoading(false)); };
  useEffect(() => {
    apiClient.get('/appointments?status=WAITING').then((response) => setAppointments(response.data.data || [])).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load the queue.')).finally(() => setLoading(false));
  }, []);
  return <section className="module-page"><div className="page-heading"><div><span className="eyebrow">Reception / live flow</span><h1>Waiting queue</h1><p>Patients checked in for care, ordered by their issued token.</p></div><button className="ghost-button inline-action" onClick={loadQueue}><RefreshCw size={16} /> Refresh</button></div>{error && <div className="inline-error">{error}</div>}{loading ? <div className="state-panel">Loading the waiting queue...</div> : appointments.length === 0 ? <div className="state-panel"><h2>The queue is clear</h2><p>Checked-in patients will receive a token and appear here.</p></div> : <div className="queue-grid">{appointments.map((appointment) => <article className="queue-card" key={appointment.id}><div className="queue-token">{appointment.queueEntry?.token || '-'}</div><div><span className="section-label">Waiting patient</span><h2>{appointment.patient?.firstName} {appointment.patient?.fatherName}</h2><p>{appointment.department?.name || 'Department'} · {appointment.reason}</p></div><button className="table-action" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(`Token ${appointment.queueEntry?.token}`))}><Volume2 size={15} /> Recall</button></article>)}</div>}</section>;
}
