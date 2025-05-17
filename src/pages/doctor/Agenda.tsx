import React, { useState } from 'react';

interface Consulta {
	id: string;
	paciente: string;
	data: string;
	hora: string;
	status: 'Confirmada' | 'Pendente' | 'Cancelada';
}

const todasConsultas: Consulta[] = [
	{ id: '1', paciente: 'João da Silva', data: '2025-05-18', hora: '14:00', status: 'Confirmada' },
	{ id: '2', paciente: 'Maria Oliveira', data: '2025-05-18', hora: '16:00', status: 'Pendente' },
	{ id: '3', paciente: 'Carlos Souza', data: '2025-05-19', hora: '10:30', status: 'Cancelada' },
];

const Agenda: React.FC = () => {
	const [filtros, setFiltros] = useState({ data: '', paciente: '', status: '' });

	const consultasFiltradas = todasConsultas.filter(consulta => {
		return (
			(!filtros.data || consulta.data === filtros.data) &&
			(!filtros.paciente || consulta.paciente.toLowerCase().includes(filtros.paciente.toLowerCase())) &&
			(!filtros.status || consulta.status === filtros.status)
		);
	});

	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Agenda de Consultas</h1>

			{/* Filtros */}
			<div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
				<input type='date' value={filtros.data} onChange={e => setFiltros({ ...filtros, data: e.target.value })} className='border p-2 rounded' />
				<input type='text' placeholder='Filtrar por paciente' value={filtros.paciente} onChange={e => setFiltros({ ...filtros, paciente: e.target.value })} className='border p-2 rounded' />
				<select value={filtros.status} onChange={e => setFiltros({ ...filtros, status: e.target.value })} className='border p-2 rounded'>
					<option value=''>Todos os status</option>
					<option value='Confirmada'>Confirmada</option>
					<option value='Pendente'>Pendente</option>
					<option value='Cancelada'>Cancelada</option>
				</select>
			</div>

			{/* Tabela */}
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-200 shadow rounded-lg'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-600'>Paciente</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-600'>Data</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-600'>Hora</th>
							<th className='px-6 py-3 text-left text-sm font-medium text-gray-600'>Status</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200 bg-white'>
						{consultasFiltradas.map(consulta => (
							<tr key={consulta.id}>
								<td className='px-6 py-4'>{consulta.paciente}</td>
								<td className='px-6 py-4'>{consulta.data}</td>
								<td className='px-6 py-4'>{consulta.hora}</td>
								<td className='px-6 py-4'>
									<span
										className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
											consulta.status === 'Confirmada' ? 'bg-green-100 text-green-800' : consulta.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
										}`}
									>
										{consulta.status}
									</span>
								</td>
							</tr>
						))}
						{consultasFiltradas.length === 0 && (
							<tr>
								<td colSpan={4} className='text-center text-sm text-gray-500 py-4'>
									Nenhuma consulta encontrada.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Agenda;
