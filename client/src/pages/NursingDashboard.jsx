import { useCallback, useEffect, useMemo, useState } from 'react';
import { BedDouble, ClipboardCheck, Clock3, GripVertical, HeartPulse, RefreshCw, ShieldAlert, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import { normalizeRole, roleTitles } from '../routes/roleConfig';

const acuity = {
  CRITICAL: { label: 'Critical', className: 'critical' },
  URGENT: { label: 'Urgent', className: 'urgent' },
  STABLE: { label: 'Stable', className: 'stable' },
};

const formatAge = (dateOfBirth) => {
  if (!dateOfBirth) return '--';
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age -= 1;
  return age;
};

const elapsed = (startedAt) => {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 60000));
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
};

export default function NursingDashboard({ initialTab = 'triage' }) {
  const { role } = useParams();
  const currentRole = normalizeRole(role);
  const [tab, setTab] = useState(initialTab);
  const [queue, setQueue] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [draggedId, setDraggedId] = useState('');
  const [nurseId, setNurseId] = useState('');
  const [form, setForm] = useState({ priority: 'STABLE', assessmentNotes: '', bloodPressure: '', heartRate: '', temperature: '', spo2: '', respiratoryRate: '' });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const canAssess = ['TRIAGE_NURSE', 'CHARGE_NURSE', 'NURSE', 'STAFF_NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'].includes(currentRole);
  const canAssign = ['CHARGE_NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'].includes(currentRole);
  const canAssignDoctor = ['TRIAGE_NURSE', 'CHARGE_NURSE', 'NURSE', 'ER_NURSE', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'].includes(currentRole);
  const selectedPatient = queue.find((appointment) => appointment.id === selectedId);
  const metrics = useMemo(() => ({ waiting: queue.length, triaged: queue.filter((appointment) => appointment.triageAssessment).length, occupied: rooms.flatMap((room) => room.beds || []).filter((bed) => bed.status === 'OCCUPIED').length }), [queue, rooms]);

  const loadData = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const requests = [apiClient.get('/nursing/triage'), apiClient.get('/nursing/rooms')];
      if (canAssign) requests.push(apiClient.get('/nursing/nurses'));
      if (canAssignDoctor) requests.push(apiClient.get('/nursing/doctors'));
      const responses = await Promise.all(requests);
      setQueue(responses[0].data.data || []);
      setRooms(responses[1].data.data || []);
      if (responses[2]) setNurses(responses[2].data.data || []);
      if (responses[canAssign ? 3 : 2]) setDoctors(responses[canAssign ? 3 : 2].data.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load the nursing board.');
    } finally { setLoading(false); }
  }, [canAssign, canAssignDoctor]);

  useEffect(() => {
    const timer = setTimeout(() => loadData(), 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    if (!selectedPatient) return undefined;
    const assessment = selectedPatient.triageAssessment || {};
    const timer = setTimeout(() => setForm({ priority: assessment.priority || 'STABLE', doctorId: selectedPatient.doctorId || '', assessmentNotes: assessment.assessmentNotes || '', bloodPressure: assessment.bloodPressure || '', heartRate: assessment.heartRate || '', temperature: assessment.temperature || '', spo2: assessment.spo2 || '', respiratoryRate: assessment.respiratoryRate || '' }), 0);
    return () => clearTimeout(timer);
  }, [selectedId, selectedPatient]);

  const saveAssessment = async () => {
    if (!selectedPatient || !canAssess) return;
    if (canAssignDoctor && doctors.length === 0) { setError('No receiving doctors are available.'); return; }
    setBusy(true); setError('');
    try {
      await apiClient.patch(`/nursing/triage/${selectedPatient.id}`, { ...form, doctorId: form.doctorId || undefined, heartRate: form.heartRate ? Number(form.heartRate) : undefined, temperature: form.temperature ? Number(form.temperature) : undefined, spo2: form.spo2 ? Number(form.spo2) : undefined, respiratoryRate: form.respiratoryRate ? Number(form.respiratoryRate) : undefined });
      await loadData();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save the triage assessment.'); } finally { setBusy(false); }
  };

  const assignToRoom = async (roomId) => {
    if (!draggedId || !canAssign) return;
    setBusy(true); setError('');
    try { await apiClient.post(`/nursing/rooms/${roomId}/assign`, { appointmentId: draggedId, nurseId: nurseId || undefined }); setDraggedId(''); await loadData(); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to assign this patient to the room.'); } finally { setBusy(false); }
  };

  const patientName = (appointment) => `${appointment.patient?.firstName || ''} ${appointment.patient?.fatherName || ''}`.trim() || 'Unnamed patient';
  return <section className="nursing-page">
    <div className="page-heading nursing-heading"><div><span className="eyebrow">{roleTitles[currentRole] || 'Nursing operations'} / live flow</span><h1>Clinical flow board</h1><p>Move arrivals from first assessment to the right treatment space with a shared view of acuity, wait time, and room capacity.</p></div><div className="nursing-header-actions">{canAssignDoctor && <label className="nurse-select">Receiving doctor<select value={form.doctorId || ''} onChange={(event) => setForm({ ...form, doctorId: event.target.value })}><option value="">Select when a patient is active</option>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.employee ? `${doctor.employee.firstName} ${doctor.employee.lastName}` : doctor.id}</option>)}</select></label>}<button className="ghost-button inline-action" onClick={loadData}><RefreshCw size={16} /> Refresh board</button></div></div>
    {error && <div className="inline-error">{error}</div>}
    <div className="nursing-metrics"><article><Clock3 size={17} /><strong>{metrics.waiting}</strong><span>Waiting for triage</span></article><article><ClipboardCheck size={17} /><strong>{metrics.triaged}</strong><span>Triaged patients</span></article><article><BedDouble size={17} /><strong>{metrics.occupied}</strong><span>Occupied beds</span></article></div>
    <div className="nursing-tabs" role="tablist"><button className={tab === 'triage' ? 'active' : ''} onClick={() => setTab('triage')}><HeartPulse size={17} /> Triage Room</button><button className={tab === 'rooms' ? 'active' : ''} onClick={() => setTab('rooms')}><BedDouble size={17} /> Room Arrangement</button></div>
    {loading ? <div className="state-panel">Loading the clinical flow board...</div> : tab === 'triage' ? <div className="nursing-grid"><article className="content-panel triage-queue"><div className="panel-heading"><div><span className="section-label">Arrival order</span><h2>Waiting area & registration queue</h2></div><span className="toolbar-count">{queue.length} patients</span></div><p className="panel-intro">Un-triaged arrivals stay ordered by check-in time. Select a patient to open the active triage workspace.</p><div className="triage-list">{queue.length === 0 ? <div className="state-panel compact-state"><h2>Queue is clear</h2><p>Checked-in patients will appear here.</p></div> : queue.map((appointment) => <button className={`triage-row ${selectedId === appointment.id ? 'selected' : ''}`} key={appointment.id} onClick={() => setSelectedId(appointment.id)} draggable={Boolean(appointment.triageAssessment && canAssign)} onDragStart={() => setDraggedId(appointment.id)}><span className="queue-token">{appointment.queueEntry?.token || '-'}</span><span className="triage-row-main"><strong>{patientName(appointment)}</strong><small>{appointment.patient?.patientId} · {appointment.department?.name || 'Main ER'}</small></span><span className="triage-row-wait">{elapsed(appointment.queueEntry?.createdAt || appointment.createdAt)}</span>{appointment.triageAssessment && <span className={`acuity-dot ${acuity[appointment.triageAssessment.priority]?.className}`} />}</button>)}</div></article>
      <article className="content-panel triage-workspace"><div className="panel-heading"><div><span className="section-label">Active triage workspace</span><h2>{selectedPatient ? patientName(selectedPatient) : 'Select an arrival'}</h2></div><ShieldAlert size={20} /></div>{selectedPatient ? <><div className="patient-signal"><strong>{formatAge(selectedPatient.patient?.dateOfBirth)} yrs</strong><span>{selectedPatient.reason || 'Chief complaint not recorded'}</span><small>Wait {elapsed(selectedPatient.queueEntry?.createdAt || selectedPatient.createdAt)} · Provider {selectedPatient.doctor?.employee ? `${selectedPatient.doctor.employee.firstName} ${selectedPatient.doctor.employee.lastName}` : 'Unassigned'}</small></div><div className="acuity-actions"><span className="section-label">Acuity assignment</span><div>{Object.entries(acuity).map(([value, details]) => <button key={value} disabled={!canAssess} className={`acuity-button ${details.className} ${form.priority === value ? 'active' : ''}`} onClick={() => setForm((current) => ({ ...current, priority: value }))}>{details.label}</button>)}</div></div><div className="vitals-form"><span className="section-label">Initial assessment & vitals</span><textarea disabled={!canAssess} value={form.assessmentNotes} onChange={(event) => setForm({ ...form, assessmentNotes: event.target.value })} placeholder="Initial assessment notes" /><div className="vitals-inputs">{[['bloodPressure', 'BP'], ['heartRate', 'HR'], ['temperature', 'Temp'], ['spo2', 'SpO2'], ['respiratoryRate', 'RR']].map(([key, label]) => <label key={key}>{label}<input disabled={!canAssess} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></label>)}</div><button className="primary-action" disabled={!canAssess || busy} onClick={saveAssessment}><ClipboardCheck size={16} /> {busy ? 'Saving...' : 'Save assessment'}</button></div></> : <div className="empty-workspace"><HeartPulse size={32} /><p>Choose the next arrival to review their complaint, wait time, acuity, and initial observations.</p></div>}</article></div> : <div className="room-layout"><article className="content-panel floor-plan"><div className="panel-heading"><div><span className="section-label">Visual floor plan</span><h2>Unit room arrangement</h2></div><span className="toolbar-count">Drag a triaged patient to a vacant bed</span></div><div className="room-legend"><span className="legend vacant">Vacant & cleaned</span><span className="legend occupied">Occupied</span><span className="legend cleaning">Awaiting turnover</span><span className="legend isolation">Out of service / isolation</span></div><div className="room-grid">{rooms.map((room) => { const roomBusy = room.status !== 'ACTIVE'; const firstAdmission = room.beds?.find((bed) => bed.admission)?.admission; const state = roomBusy ? room.status === 'ISOLATION' ? 'isolation' : 'maintenance' : room.beds?.some((bed) => bed.status === 'OCCUPIED') ? 'occupied' : room.beds?.some((bed) => bed.status === 'CLEANING') ? 'cleaning' : 'vacant'; return <div className={`room-card ${state}`} key={room.id} onDragOver={(event) => { if (!roomBusy && canAssign) event.preventDefault(); }} onDrop={() => assignToRoom(room.id)}><div className="room-card-head"><div><span className="section-label">{room.section || room.ward?.name}</span><h3>{room.number}</h3></div><span className="room-state">{state}</span></div><div className="bed-list">{(room.beds || []).map((bed) => <div className="bed-slot" key={bed.id}><BedDouble size={17} /><span>Bed {bed.bedNumber}</span>{bed.admission ? <strong>{bed.admission.patient?.firstName} {bed.admission.patient?.fatherName}<small>{bed.admission.assignedNurse?.employee ? `RN ${bed.admission.assignedNurse.employee.firstName}` : 'Care team pending'}</small></strong> : <em>{bed.status === 'CLEANING' ? 'Turnover' : roomBusy ? 'Unavailable' : 'Drop patient here'}</em>}</div>)}</div>{firstAdmission && <small className="los-label">In care since {new Date(firstAdmission.admittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>}</div>; })}</div></article><aside className="content-panel room-side-panel"><span className="section-label">Care team assignment</span><h2>Charge nurse controls</h2><p>Assign the receiving staff nurse when a patient is roomed.</p>{canAssign ? <label className="nurse-select">Staff nurse<select value={nurseId} onChange={(event) => setNurseId(event.target.value)}><option value="">Assign later</option>{nurses.map((nurse) => <option key={nurse.id} value={nurse.id}>{nurse.employee ? `${nurse.employee.firstName} ${nurse.employee.lastName}` : nurse.username}</option>)}</select></label> : <div className="permission-note"><Users size={18} /><span>Room assignment is controlled by the charge nurse or system administrator.</span></div>}<div className="room-drop-note"><GripVertical size={18} /><span>{draggedId ? 'Patient ready. Drop them onto an available bed.' : 'Triaged patients can be dragged from the Triage Room tab.'}</span></div></aside></div>}
  </section>;
}
