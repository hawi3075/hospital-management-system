import { useEffect, useState } from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import apiClient from '../utils/apiClient';

const statusLabels = { SCHEDULED: 'Scheduled', CONFIRMED: 'Confirmed', CHECKED_IN: 'Checked in', WAITING: 'Waiting', IN_CONSULTATION: 'In consultation', COMPLETED: 'Completed', CANCELLED: 'Cancelled', NO_SHOW: 'No show' };

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const loadAppointments = () => {
    setLoading(true);
    apiClient.get('/appointments').then((response) => setAppointments(response.data.data || [])).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load appointments.')).finally(() => setLoading(false));
  };

  useEffect(() => {
    apiClient.get('/appointments').then((response) => setAppointments(response.data.data || [])).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load appointments.')).finally(() => setLoading(false));
  }, []);

  const checkIn = async (id) => {
    setBusyId(id); setError('');
    try { await apiClient.post(`/appointments/${id}/check-in`); loadAppointments(); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to check in this appointment.'); } finally { setBusyId(''); }
  };

  return <section className="module-page"><div className="page-heading"><div><span className="eyebrow">Care coordination</span><h1>Appointments</h1><p>Review scheduled visits and move arrivals into the clinical queue.</p></div><button className="ghost-button inline-action" onClick={loadAppointments}><RefreshCw size={16} /> Refresh</button></div>{error && <div className="inline-error">{error}</div>}{loading ? <div className="state-panel">Loading appointments...</div> : appointments.length === 0 ? <div className="state-panel"><h2>No appointments found</h2><p>Appointments created by reception and patients will appear here.</p></div> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Date & time</th><th>Patient</th><th>Doctor</th><th>Department</th><th>Status</th><th>Queue</th><th /></tr></thead><tbody>{appointments.map((appointment) => <tr key={appointment.id}><td>{new Date(appointment.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</td><td><strong>{appointment.patient?.firstName} {appointment.patient?.fatherName}</strong><small className="table-subtext">{appointment.patient?.patientId}</small></td><td>{appointment.doctor?.employee ? `${appointment.doctor.employee.firstName} ${appointment.doctor.employee.lastName}` : 'Assigned doctor'}</td><td>{appointment.department?.name || 'Department'}</td><td><span className={`status-badge ${appointment.status === 'COMPLETED' ? 'success' : appointment.status === 'CANCELLED' ? 'danger' : 'warning'}`}>{statusLabels[appointment.status] || appointment.status}</span></td><td>{appointment.queueEntry ? `Token ${appointment.queueEntry.token}` : 'Not checked in'}</td><td>{['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && <button className="table-action" disabled={busyId === appointment.id} onClick={() => checkIn(appointment.id)}><CheckCircle2 size={15} /> {busyId === appointment.id ? 'Checking...' : 'Check in'}</button>}</td></tr>)}</tbody></table></div>}</section>;
}
