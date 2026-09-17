import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const initialForm = { appointmentId: '', patientId: '', doctorId: '', chiefComplaint: '', symptoms: '', examinationNotes: '', treatmentPlan: '', diagnosis: '', followUpDate: '', bloodPressure: '', heartRate: '', temperature: '', spo2: '', respiratoryRate: '', weight: '', height: '', labTestId: '', imagingType: '', medicineId: '', dosage: '', frequency: '', duration: '', quantity: '' };

export default function ConsultationFormPage() {
  const { role } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({ ...initialForm, appointmentId: searchParams.get('appointmentId') || '', patientId: searchParams.get('patientId') || '', doctorId: searchParams.get('doctorId') || '' }));
  const [triage, setTriage] = useState(null);
  const [labTests, setLabTests] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const appointmentId = searchParams.get('appointmentId');
    if (!appointmentId) return;
    apiClient.get('/appointments?status=WAITING').then((response) => {
      const appointment = (response.data.data || []).find((item) => item.id === appointmentId);
      if (appointment?.triageAssessment) setTriage(appointment.triageAssessment);
    }).catch(() => {});
  }, [searchParams]);
  useEffect(() => {
    Promise.all([apiClient.get('/clinical-workflow/lab-tests'), apiClient.get('/clinical-workflow/medicines')]).then(([labResponse, medicineResponse]) => { setLabTests(labResponse.data.data || []); setMedicines(medicineResponse.data.data || []); }).catch(() => {});
  }, []);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const vitalSigns = ['bloodPressure', 'heartRate', 'temperature', 'spo2', 'respiratoryRate', 'weight', 'height'].every((key) => form[key]) ? { bloodPressure: form.bloodPressure, heartRate: form.heartRate, temperature: form.temperature, spo2: form.spo2, respiratoryRate: form.respiratoryRate, weight: form.weight, height: form.height } : undefined;
      const consultationResponse = await apiClient.post('/consultations', { appointmentId: form.appointmentId, patientId: form.patientId, doctorId: form.doctorId, chiefComplaint: form.chiefComplaint, symptoms: form.symptoms, examinationNotes: form.examinationNotes, treatmentPlan: form.treatmentPlan, diagnosis: form.diagnosis, followUpDate: form.followUpDate || undefined, vitalSigns });
      const consultationId = consultationResponse.data.data.id;
      const handoffs = [];
      if (form.labTestId) handoffs.push(apiClient.post('/clinical-workflow/lab-orders', { consultationId, testId: form.labTestId, doctorId: form.doctorId }));
      if (form.imagingType) handoffs.push(apiClient.post('/clinical-workflow/radiology-orders', { consultationId, imagingType: form.imagingType, doctorId: form.doctorId }));
      if (form.medicineId && form.dosage && form.frequency && form.duration && form.quantity) handoffs.push(apiClient.post('/clinical-workflow/prescriptions', { consultationId, medicineId: form.medicineId, dosage: form.dosage, frequency: form.frequency, duration: form.duration, quantity: form.quantity }));
      await Promise.all(handoffs);
      navigate(`/workspace/${role}/consultations/${consultationId}`);
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save the consultation.'); } finally { setSaving(false); }
  };
  return <section className="module-page narrow-page"><div className="page-heading"><div><span className="eyebrow">Doctor workspace</span><h1>Patient review</h1><p>Review the triage handoff, document the encounter, and choose the next clinical service.</p></div><Link className="ghost-button inline-action" to={`/workspace/${role}/doctor-queue`}>Back to handoffs</Link></div>{triage && <article className="content-panel profile-callout"><strong>Triage handoff: {triage.priority}</strong><span> {triage.assessmentNotes || 'No notes'} · BP {triage.bloodPressure || '--'} · HR {triage.heartRate || '--'} · SpO2 {triage.spo2 || '--'}%</span></article>}{error && <div className="inline-error">{error}</div>}<form className="clinical-form" onSubmit={submit}><fieldset><legend>Encounter context</legend><div className="form-grid"><label>Appointment ID<input name="appointmentId" value={form.appointmentId} onChange={update} required placeholder="Appointment UUID" /></label><label>Patient ID<input name="patientId" value={form.patientId} onChange={update} required placeholder="Patient UUID" /></label><label>Doctor ID<input name="doctorId" value={form.doctorId} value={form.doctorId} onChange={update} required placeholder="Doctor UUID" /></label><label>Follow-up date<input type="date" name="followUpDate" value={form.followUpDate} onChange={update} /></label></div></fieldset><fieldset><legend>Clinical assessment</legend><div className="form-grid"><label>Chief complaint<textarea name="chiefComplaint" value={form.chiefComplaint} onChange={update} required /></label><label>Symptoms<textarea name="symptoms" value={form.symptoms} onChange={update} /></label><label>Physical examination<textarea name="examinationNotes" value={form.examinationNotes} onChange={update} required /></label><label>Treatment plan<textarea name="treatmentPlan" value={form.treatmentPlan} onChange={update} required /></label><label>Diagnosis<textarea name="diagnosis" value={form.diagnosis} onChange={update} /></label></div></fieldset><fieldset><legend>Vital signs <small>Complete every field to save vitals</small></legend><div className="form-grid vitals-grid">{[['bloodPressure','Blood pressure'],['heartRate','Heart rate'],['temperature','Temperature'],['spo2','Oxygen saturation'],['respiratoryRate','Respiratory rate'],['weight','Weight'],['height','Height']].map(([name, label]) => <label key={name}>{label}<input name={name} value={form[name]} onChange={update} /></label>)}</div></fieldset><fieldset><legend>Next clinical handoff <small>Optional</small></legend><div className="form-grid"><label>Laboratory test<select name="labTestId" value={form.labTestId} onChange={update}><option value="">No laboratory order</option>{labTests.map((test) => <option key={test.id} value={test.id}>{test.name}</option>)}</select></label><label>Radiology request<input name="imagingType" value={form.imagingType} onChange={update} placeholder="e.g. Chest X-ray" /></label><label>Medicine<select name="medicineId" value={form.medicineId} onChange={update}><option value="">No prescription</option>{medicines.map((medicine) => <option key={medicine.id} value={medicine.id}>{medicine.name}</option>)}</select></label><label>Dosage<input name="dosage" value={form.dosage} onChange={update} placeholder="e.g. 500 mg" /></label><label>Frequency<input name="frequency" value={form.frequency} onChange={update} placeholder="e.g. Twice daily" /></label><label>Duration<input name="duration" value={form.duration} onChange={update} placeholder="e.g. 5 days" /></label><label>Quantity<input type="number" min="1" name="quantity" value={form.quantity} onChange={update} /></label></div></fieldset><button className="primary-action" disabled={saving} type="submit">{saving ? 'Saving care plan...' : 'Save and send handoffs'}</button></form></section>;
}
