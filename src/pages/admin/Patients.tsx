import SidebarPatients from '../../components/SidebarPatients';
import AppointmentsHistory from '../../components/AppointmentsHistory';
import PatientQuickStats from '../../components/PatientQuickStats';
import DiagnosticList from '../../components/ReceitaList';
import PatientProfileCard from '../../components/PatientProfileCard';
import LabResults from '../../components/LabResults';
import { useParams } from 'react-router-dom';
import FarmacoTest from '../../components/RecipeDoctor';

export default function PatientsPage() {
	const { id } = useParams();

	return (
		<main className='flex-1 p-6 grid grid-cols-4 gap-4'>
			<aside className='col-span-1'>
				<SidebarPatients />
			</aside>

			<section className='col-span-2 space-y-4'>
				<AppointmentsHistory patientId={id} />
				<PatientQuickStats />
				<DiagnosticList patientId={id || ''} />
			</section>

			<aside className='col-span-1 space-y-4'>
				{id ? <PatientProfileCard id={id} /> : <p className='text-center'>Selecione um paciente</p>}
				<LabResults patientId={id || ''} />

				{id && <FarmacoTest patientId={id} />}
			</aside>
		</main>
	);
}
