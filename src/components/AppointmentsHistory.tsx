import React from 'react';

type Appointment = {
	id: string;
	date: string;
	time: string;
	doctor: string;
	location: string;
};

const pastAppointments: Appointment[] = [
	{
		id: '1',
		date: '2024-12-10',
		time: '10:30',
		doctor: 'Dr. João Silva',
		location: 'Clínica Central',
	},
	{
		id: '2',
		date: '2024-11-01',
		time: '14:00',
		doctor: 'Dra. Maria Costa',
		location: 'Hospital São José',
	},
];

const upcomingAppointments: Appointment[] = [
	{
		id: '3',
		date: '2025-06-01',
		time: '09:00',
		doctor: 'Dr. Carlos Mendes',
		location: 'Clínica Saúde Mais',
	},
];

export default function AppointmentsHistory() {
	return (
		<div className='bg-white p-4 rounded shadow space-y-6'>
			{/* Próximas Consultas */}
			<section>
				<h2 className='text-lg font-semibold mb-2'>📅 Próximas Consultas</h2>
				{upcomingAppointments.length === 0 ? (
					<p className='text-gray-400'>Nenhuma consulta agendada</p>
				) : (
					<ul className='space-y-3'>
						{upcomingAppointments.map(appt => (
							<li key={appt.id} className='border p-3 rounded hover:bg-gray-50'>
								<p>
									<strong>Data:</strong> {appt.date} às {appt.time}
								</p>
								<p>
									<strong>Médico:</strong> {appt.doctor}
								</p>
								<p>
									<strong>Local:</strong> {appt.location}
								</p>
							</li>
						))}
					</ul>
				)}
			</section>

			{/* Histórico de Consultas */}
			<section>
				<h2 className='text-lg font-semibold mb-2'>🕓 Histórico de Consultas</h2>
				{pastAppointments.length === 0 ? (
					<p className='text-gray-400'>Nenhuma consulta realizada</p>
				) : (
					<ul className='space-y-3'>
						{pastAppointments.map(appt => (
							<li key={appt.id} className='border p-3 rounded hover:bg-gray-50'>
								<p>
									<strong>Data:</strong> {appt.date} às {appt.time}
								</p>
								<p>
									<strong>Médico:</strong> {appt.doctor}
								</p>
								
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}
