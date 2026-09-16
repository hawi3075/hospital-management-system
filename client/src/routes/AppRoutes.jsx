import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import Login from '../pages/Login';
import Forbidden from '../pages/Forbidden';
import NotFound from '../pages/NotFound';
import PatientDetailPage from '../pages/PatientDetailPage';
import PatientRegistrationPage from '../pages/PatientRegistrationPage';
import PatientsPage from '../pages/PatientsPage';
import RoleDashboard from '../pages/RoleDashboard';
import ModulePage from '../pages/ModulePage';
import AppointmentsPage from '../pages/AppointmentsPage';
import QueuePage from '../pages/QueuePage';
import ConsultationsPage from '../pages/ConsultationsPage';
import ConsultationFormPage from '../pages/ConsultationFormPage';
import ConsultationDetailPage from '../pages/ConsultationDetailPage';
import ProtectedRoute from './ProtectedRoute';
import { normalizeRole } from './roleConfig';

const roles = ['PATIENT', 'RECEPTIONIST', 'DOCTOR', 'NURSE', 'LAB_TECHNICIAN', 'RADIOLOGY_TECHNICIAN', 'PHARMACIST', 'CASHIER', 'HOSPITAL_ADMIN', 'SUPER_ADMIN'];

export default function AppRoutes() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const startPath = user.role ? `/workspace/${normalizeRole(user.role).toLowerCase()}/dashboard` : '/login';
  return <Routes><Route path="/login" element={<Login />} /><Route path="/dashboard" element={<Navigate to={startPath} replace />} /><Route element={<ProtectedRoute allowedRoles={roles} />}><Route path="/workspace/:role" element={<AppLayout />}><Route index element={<Navigate to="dashboard" replace />} /><Route path="dashboard" element={<RoleDashboard />} /><Route path="patients" element={<PatientsPage />} /><Route path="patients/new" element={<PatientRegistrationPage />} /><Route path="patients/:patientId" element={<PatientDetailPage />} /><Route path="appointments" element={<AppointmentsPage />} /><Route path="queue" element={<QueuePage />} /><Route path="consultations" element={<ConsultationsPage />} /><Route path="consultations/new" element={<ConsultationFormPage />} /><Route path="consultations/:consultationId" element={<ConsultationDetailPage />} /><Route path="*" element={<ModulePage />} /></Route></Route><Route path="/403" element={<Forbidden />} /><Route path="/" element={<Navigate to={startPath} replace />} /><Route path="*" element={<NotFound />} /></Routes>;
}
