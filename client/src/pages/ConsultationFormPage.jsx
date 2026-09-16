import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const initialForm = { appointmentId: '', patientId: '', doctorId: '', chiefComplaint: '', symptoms: '', examinationNotes: '', treatmentPlan: '', diagnosis: '', followUpDate: '', bloodPressure: '', heartRate: '', temperature: '', spo2: '', respiratoryRate: '', weight: '', height: '' };

export default function ConsultationFormPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const vitalSigns = ['bloodPressure', 'heartRate', 'temperature', 'spo2', 'respiratoryRate', 'weight', 'height'].every((key) => form[key]) ? { bloodPressure: form.bloodPressure, heartRate: form.heartRate, temperature: form.temperature, spo2: form.spo2, respiratoryRate: form.respiratoryRate, weight: form.weight, height: form.height } : undefined;
      await apiClient.post('/consultations', { appointmentId: form.appointmentId, patientId: form.patientId, doctorId: form.doctorId, chiefComplaint: form.chiefComplaint, symptoms: form.symptoms, examinationNotes: form.examinationNotes, treatmentPlan: form.treatmentPlan, diagnosis: form.diagnosis, followUpDate: form.followUpDate || undefined, vitalSigns });
      navigate(`/workspace/${role}/consultations`);
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save the consultation.'); } finally { setSaving(false); }
  };
  return <section className="module-page narrow-page"><div className="page-heading"><div><span className="eyebrow">Doctor workspace</span><h1>New consultation</h1><p>Document the encounter and create a durable clinical record.</p></div><Link className="ghost-button inline-action" to={`/workspace/${role}/consultations`}>Cancel</Link></div>{error && <div className="inline-error">{error}</div>}<form className="clinical-form" onSubmit={submit}><fieldset><legend>Encounter context</legend><div className="form-grid"><label>Appointment ID<input name="appointmentId" value={form.appointmentId} onChange={update} required placeholder="Appointment UUID" /></label><label>Patient ID<input name="patientId" value={form.patientId} onChange={update} required placeholder="Patient UUID" /></label><label>Doctor ID<input name="doctorId" value={form.doctorId} onChange={update} required placeholder="Doctor UUID" /></label><label>Follow-up date<input type="date" name="followUpDate" value={form.followUpDate} onChange={update} /></label></div></fieldset><fieldset><legend>Clinical assessment</legend><div className="form-grid"><label>Chief complaint<textarea name="chiefComplaint" value={form.chiefComplaint} onChange={update} required /></label><label>Symptoms<textarea name="symptoms" value={form.symptoms} onChange={update} /></label><label>Physical examination<textarea name="examinationNotes" value={form.examinationNotes} onChange={update} required /></label><label>Treatment plan<textarea name="treatmentPlan" value={form.treatmentPlan} onChange={update} required /></label><label>Diagnosis<textarea name="diagnosis" value={form.diagnosis} onChange={update} /></label></div></fieldset><fieldset><legend>Vital signs <small>Complete every field to save vitals</small></legend><div className="form-grid vitals-grid">{[['bloodPressure','Blood pressure'],['heartRate','Heart rate'],['temperature','Temperature'],['spo2','Oxygen saturation'],['respiratoryRate','Respiratory rate'],['weight','Weight'],['height','Height']].map(([name, label]) => <label key={name}>{label}<input name={name} value={form[name]} onChange={update} /></label>)}</div></fieldset><button className="primary-action" disabled={saving} type="submit">{saving ? 'Saving consultation...' : 'Complete consultation'}</button></form></section>;
}
