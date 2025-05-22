import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Patient } from '../pages/patient/data/types';

// Definindo a estrutura de um paciente

export default function SidebarPatients() {
	const [patients, setPatients] = useState<Patient[]>([]);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const q = query(collection(db, 'users'), where('role', '==', 'patient'));
				const querySnapshot = await getDocs(q);
				const fetchedPatients: Patient[] = querySnapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				})) as Patient[];

				setPatients(fetchedPatients);
			} catch (error) {
				console.error('Erro ao buscar pacientes:', error);
			}
		};

		fetchPatients();
	}, []);

	const filteredPatients = patients.filter(patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<aside className='w-full sm:w-64 bg-white p-4 sm:static fixed bottom-0 sm:bottom-auto sm:left-0 z-50 sm:z-auto'>
			<h2 className='text-xl font-bold mb-4'>Pacientes</h2>
			<input type='text' placeholder='Buscar...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className='mb-4 p-2 w-full border rounded' />
			<ul className='space-y-4 overflow-y-auto max-h-64 sm:max-h-none'>
				{filteredPatients.map(patient => (
					<li key={patient.id} className='flex items-center space-x-4'>
						<img src={patient.imageUrl || 'https://via.placeholder.com/40'} alt={patient.name} className='h-10 w-10 rounded-full' />
						<div>
							<p className='font-semibold'>{patient.name}</p>
							<p className='text-xs text-gray-500'>
								{patient.gender}, {patient.age}
							</p>
						</div>
					</li>
				))}
			</ul>
		</aside>
	);
}
