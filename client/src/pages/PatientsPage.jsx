import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import apiClient from '../utils/apiClient';

export default function PatientsPage() {
  const { role } = useParams();
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get('/patients').then((response) => setPatients(response.data.data || [])).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load patients.')).finally(() => setLoading(false));
  }, []);
  const filtered = patients.filter((patient) => `${patient.patientId} ${patient.firstName} ${patient.fatherName} ${patient.grandfatherName} ${patient.phone}`.toLowerCase().includes(query.toLowerCase()));
  const basePath = `/workspace/${role}`;

  return <section className="module-page"><div className="page-heading"><div><span className="eyebrow">Patient operations</span><h1>Patients</h1><p>Search the hospital patient registry and open a complete patient record.</p></div><Link className="primary-action inline-action" to={`${basePath}/patients/new`}><Plus size={17} /> Register patient</Link></div><div className="toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by patient ID, name, or phone" aria-label="Search patients" /></div><span className="toolbar-count">{filtered.length} records</span></div>{loading && <div className="state-panel">Loading patient records...</div>}{error && <div className="inline-error">{error}</div>}{!loading && !error && filtered.length === 0 && <div className="state-panel"><h2>No patients found</h2><p>Register a patient or adjust your search.</p></div>}{!loading && !error && filtered.length > 0 && <div className="table-wrap"><table className="data-table"><thead><tr><th>Patient ID</th><th>Name</th><th>Gender</th><th>Phone</th><th>Blood group</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((patient) => <tr key={patient.id}><td><strong>{patient.patientId}</strong></td><td>{patient.firstName} {patient.fatherName} {patient.grandfatherName}</td><td>{patient.gender}</td><td>{patient.phone}</td><td>{patient.bloodGroup || 'Not recorded'}</td><td><span className="status-badge success">Active</span></td><td><Link className="table-link" to={`${basePath}/patients/${patient.id}`}>Open</Link></td></tr>)}</tbody></table></div>}</section>;
}
