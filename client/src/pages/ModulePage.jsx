import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { normalizeRole, roleTitles } from '../routes/roleConfig';

const moduleContent = {
  appointments: ['Appointments', 'Coordinate scheduled visits, confirmations, and the next patient handoff.'],
  queue: ['Check-in and queue', 'Track arrivals and move checked-in patients to the right care team.'],
  consultations: ['Consultations', 'Open clinical encounters, document assessment, and continue the care plan.'],
  'lab-orders': ['Laboratory requests', 'Review tests requested by clinicians and follow them through verification.'],
  requests: ['Imaging requests', 'Review imaging requests and move studies through reporting.'],
  prescriptions: ['Prescription requests', 'Review prescriptions received from clinicians and validate dispensing.'],
  invoices: ['Invoices', 'Review service charges, balances, and invoices waiting for payment.'],
  users: ['Users', 'Manage access to the hospital workspace according to role and responsibility.'],
  notifications: ['Notifications', 'Review operational updates and care-team handoffs that need attention.'],
  profile: ['Profile', 'Review the account identity and professional context associated with this workspace.'],
  settings: ['Settings', 'Manage workspace preferences and security settings for this account.'],
};

export default function ModulePage() {
  const { role, '*': path } = useParams();
  const currentRole = normalizeRole(role?.toUpperCase());
  const segment = path?.split('/')[0] || 'workspace';
  const [title, description] = moduleContent[segment] || [segment.replaceAll('-', ' '), 'This workspace is connected to the CarePulse operational navigation.'];
  return <section className="module-page"><div className="page-heading"><div><span className="eyebrow">{roleTitles[currentRole] || currentRole}</span><h1>{title}</h1><p>{description}</p></div></div><article className="content-panel workflow-panel"><span className="section-label">Workflow context</span><h2>Ready for live records</h2><p>This screen is routed to the {currentRole.replaceAll('_', ' ').toLowerCase()} workspace. The next workflow action should be completed against the corresponding API record, with status changes and audit events recorded by the server.</p><Link className="table-link" to={`/workspace/${role}/dashboard`}>Return to dashboard <ArrowUpRight size={16} /></Link></article></section>;
}
