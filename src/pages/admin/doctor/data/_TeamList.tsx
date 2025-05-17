import React from 'react';
import { doctors } from '../data/doctors';

export default function TeamList() {
	return (
		<div className='p-6'>
			<h1 className='text-2xl font-bold mb-4'>Equipa Médica</h1>
			<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
				{doctors.map((doctor, index) => (
					<li key={index} className='bg-white p-4 rounded shadow flex items-center space-x-4'>
						<img src={doctor.imageUrl} alt={doctor.name} className='h-16 w-16 rounded-full' />
						<div>
							<p className='font-semibold'>{doctor.name}</p>
							<p className='text-sm text-gray-500'>{doctor.specialty}</p>
							{doctor.lastSeen && <p className='text-xs text-gray-400'>Última vez visto: {doctor.lastSeen}</p>}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
