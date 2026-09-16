import { Link, useNavigate, useParams } from 'react-router-dom';
import PatientForm from '../components/PatientForm';

export default function PatientRegistrationPage() {
  const navigate = useNavigate();
  const { role } = useParams();
  const basePath = `/workspace/${role}`;
  return <section className="module-page narrow-page"><div className="page-heading"><div><span className="eyebrow">Patient operations</span><h1>Register patient</h1><p>Create a patient record before scheduling care.</p></div><Link className="ghost-button inline-action" to={`${basePath}/patients`}>Cancel</Link></div><PatientForm onPatientCreated={() => navigate(`${basePath}/patients`)} /></section>;
}
