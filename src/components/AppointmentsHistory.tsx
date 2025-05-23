import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

type Appointment = {
	id: string;
	date: Date;
	doctorId: string;
	doctorName?: string;
	specialty?: string;
};

type Props = {
	patientId: string;
};

export default function AppointmentsHistory({ patientId }: Props) {
	const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
	const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAppointments = async () => {
			try {
				const q = query(collection(db, 'Appointments'), where('patientId', '==', patientId));
				const querySnapshot = await getDocs(q);

				const now = new Date();
				const upcoming: Appointment[] = [];
				const past: Appointment[] = [];

				for (const docSnap of querySnapshot.docs) {
					const data = docSnap.data() as DocumentData;
					const apptDate = data.date.toDate(); // CORREÇÃO AQUI

					// Buscar dados do médico
					const doctorDoc = await getDoc(doc(db, 'users', data.doctorId));
					const doctorData = doctorDoc.exists() ? doctorDoc.data() : null;

					const appointment: Appointment = {
						id: docSnap.id,
						date: apptDate,
						doctorId: data.doctorId,
						doctorName: doctorData?.name || 'Desconhecido',
						specialty: doctorData?.specialty || 'N/A',
					};

					if (apptDate >= now) {
						upcoming.push(appointment);
					} else {
						past.push(appointment);
					}
				}

				// Sort by date
				upcoming.sort((a, b) => a.date.getTime() - b.date.getTime());
				past.sort((a, b) => b.date.getTime() - a.date.getTime());

				setUpcomingAppointments(upcoming);
				setPastAppointments(past);
			} catch (error) {
				console.error('Erro ao buscar consultas:', error);
			} finally {
				setLoading(false);
			}
		};

		if (patientId) {
			fetchAppointments();
		}
	}, [patientId]);

	if (loading) return <p className='text-center'>Carregando consultas...</p>;

	return (
		<div className='bg-white p-4 rounded shadow space-y-6'>
			<section>
				<h2 className='text-lg font-semibold mb-2'>📅 Próximas Consultas</h2>
				{upcomingAppointments.length === 0 ? (
					<p className='text-gray-400'>Nenhuma consulta agendada</p>
				) : (
					<ul className='space-y-3'>
						{upcomingAppointments.map(appt => (
							<li key={appt.id} className='border p-3 rounded'>
								<p>
									<strong>Data:</strong> {appt.date.toLocaleString()}
								</p>
								<p>
									<strong>Médico:</strong> {appt.doctorName}
								</p>
								<p>
									<strong>Especialidade:</strong> {appt.specialty}
								</p>
							</li>
						))}
					</ul>
				)}
			</section>

			<section>
				<h2 className='text-lg font-semibold mb-2'>🕓 Histórico de Consultas</h2>
				{pastAppointments.length === 0 ? (
					<p className='text-gray-400'>Nenhuma consulta realizada</p>
				) : (
					<ul className='space-y-3'>
						{pastAppointments.map(appt => (
							<li key={appt.id} className='border p-3 rounded'>
								<p>
									<strong>Data:</strong> {appt.date.toLocaleString()}
								</p>
								<p>
									<strong>Médico:</strong> {appt.doctorName}
								</p>
								<p>
									<strong>Especialidade:</strong> {appt.specialty}
								</p>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
