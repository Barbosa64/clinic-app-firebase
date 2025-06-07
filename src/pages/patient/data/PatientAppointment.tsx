import { useState, useEffect } from 'react';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';
import { useParams } from 'react-router-dom';

export default function PatientAppointment() {
	const { id } = useParams();
	const [specialties, setSpecialties] = useState<string[]>([]);
	const [doctors, setDoctors] = useState<any[]>([]);
	const [selectedSpecialty, setSelectedSpecialty] = useState('');
	const [selectedDoctorId, setSelectedDoctorId] = useState('');
	const [appointmentDate, setAppointmentDate] = useState('');
	const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
	const [patientData, setPatientData] = useState<any>(null);
	const [myAppointments, setMyAppointments] = useState<any[]>([]);

	const { user } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Buscar médicos com role 'doctor'
				const doctorQuery = query(collection(db, 'users'), where('role', '==', 'doctor'));
				const doctorSnap = await getDocs(doctorQuery);
				const fetchedDoctors = doctorSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
				setDoctors(fetchedDoctors);

				// Extrair especialidades únicas
				const specialtiesSet = new Set<string>();
				fetchedDoctors.forEach(doctor => {
					if (Array.isArray(doctor.specialty)) {
						doctor.specialty.forEach((spec: string) => specialtiesSet.add(spec));
					}
				});
				setSpecialties(Array.from(specialtiesSet));

				// Buscar dados do paciente logado
				if (user?.uid) {
					const patientRef = doc(db, 'users', user.uid);
					const patientSnap = await getDoc(patientRef);
					if (patientSnap.exists()) {
						setPatientData(patientSnap.data());
					}

					// Buscar agendamentos do paciente logado
					const appointmentsQuery = query(collection(db, 'Appointments'), where('patientId', '==', user.uid));
					const appointmentsSnap = await getDocs(appointmentsQuery);
					const appointmentsList = appointmentsSnap.docs.map(doc => ({
						id: doc.id,
						...doc.data(),
					}));
					setMyAppointments(appointmentsList);
				}
			} catch (error) {
				console.error('Erro ao buscar dados:', error);
			}
		};

		fetchData();
	}, [user]);

	// Filtra médicos pela especialidade selecionada
	const availableDoctors = doctors.filter(d => Array.isArray(d.specialty) && d.specialty.includes(selectedSpecialty));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDoctorId || !appointmentDate || !user?.uid || !patientData) {
			alert('Preencha todos os campos.');
			return;
		}

		setStatus('loading');

		try {
			const doctorDoc = await getDoc(doc(db, 'users', selectedDoctorId));
			if (!doctorDoc.exists()) {
				alert('Dados do médico não encontrados!');
				setStatus('error');
				return;
			}
			const doctorData = doctorDoc.data();

			await addDoc(collection(db, 'Appointments'), {
				doctorId: selectedDoctorId,
				doctorName: doctorData?.name || 'Desconhecido',
				specialty: selectedSpecialty,
				patientId: user.uid,
				patientName: patientData.name || patientData.email || 'Desconhecido',
				date: Timestamp.fromDate(new Date(appointmentDate)),
			});

			setStatus('success');
			alert('Consulta marcada com sucesso!');
			setSelectedSpecialty('');
			setSelectedDoctorId('');
			setAppointmentDate('');

			// Recarrega agendamentos após marcar
			const appointmentsQuery = query(collection(db, 'Appointments'), where('patientId', '==', user.uid));
			const appointmentsSnap = await getDocs(appointmentsQuery);
			const appointmentsList = appointmentsSnap.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));
			setMyAppointments(appointmentsList);
		} catch (error) {
			console.error('Erro ao marcar consulta:', error);
			setStatus('error');
			alert('Erro ao marcar consulta.');
		}
	};

	return (
		<div className='p-8'>
			<h1 className='text-2xl font-bold mb-6'>Marcar Consulta</h1>

			<form onSubmit={handleSubmit} className='space-y-4 max-w-md'>
				<div>
					<label className='block mb-1 font-medium'>Paciente:</label>
					<p className='border p-2 rounded bg-gray-100'>{patientData?.name || patientData?.email || user?.email}</p>
				</div>

				<div>
					<label className='block mb-1 font-medium'>Especialidade:</label>
					<select
						className='border w-full p-2 rounded'
						value={selectedSpecialty}
						onChange={e => {
							setSelectedSpecialty(e.target.value);
							setSelectedDoctorId('');
						}}
					>
						<option value=''>Selecione uma especialidade</option>
						{specialties.map(spec => (
							<option key={spec} value={spec}>
								{spec}
							</option>
						))}
					</select>
				</div>

				{selectedSpecialty && (
					<div>
						<label className='block mb-1 font-medium'>Médico:</label>
						<select className='border w-full p-2 rounded' value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)}>
							<option value=''>Selecione um médico</option>
							{availableDoctors.map(doc => (
								<option key={doc.id} value={doc.id}>
									{doc.name} - {doc.specialty.join(', ')}
								</option>
							))}
						</select>
					</div>
				)}

				<div>
					<label className='block mb-1 font-medium'>Data da Consulta:</label>
					<input type='datetime-local' className='border w-full p-2 rounded' value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} />
				</div>

				<button type='submit' className='mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition' disabled={status === 'loading'}>
					{status === 'loading' ? 'Marcando...' : 'Marcar Consulta'}
				</button>
			</form>

			{/* Agenda do paciente */}
			<div className='mt-10'>
				<h2 className='text-xl font-semibold mb-2'>As Minhas Consultas</h2>
				{myAppointments.length === 0 ? (
					<p>Nenhuma consulta agendada.</p>
				) : (
					<ul className='space-y-2'>
						{myAppointments.map(appt => (
							<li key={appt.id} className='border p-3 rounded shadow-sm bg-white'>
								<p>
									<strong>Médico:</strong> {appt.doctorName}
								</p>
								<p>
									<strong>Especialidade:</strong> {appt.specialty}
								</p>
								<p>
									<strong>Data:</strong> {new Date(appt.date.seconds * 1000).toLocaleString()}
								</p>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
