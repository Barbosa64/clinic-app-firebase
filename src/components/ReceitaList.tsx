import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Receita {
	id: string;
	farmaco: string;
	dose: string;
	frequencia: string;
	observacoes: string;
	patientId: string;
	doctorId: string;
	criadoEm: Date;
}

interface Props {
	patientId: string;
}

export default function ReceitaList({ patientId }: Props) {
	const [receitas, setReceitas] = useState<Receita[]>([]);
	const [doctorNames, setDoctorNames] = useState<{ [key: string]: string }>({});
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!patientId) return;

		const q = query(collection(db, 'receitas'), where('patientId', '==', patientId));

		const unsubscribe = onSnapshot(
			q,
			async snapshot => {
				const lista: Receita[] = snapshot.docs.map(doc => ({
					id: doc.id,
					...(doc.data() as Omit<Receita, 'id'>),
				}));
				setReceitas(lista);

				// Buscar nomes dos médicos na coleção 'users'
				const doctorIds = [...new Set(lista.map(receita => receita.doctorId))]; // Evita duplicatas
				const doctorNameMap: { [key: string]: string } = {};

				await Promise.all(
					doctorIds.map(async doctorId => {
						const docRef = doc(db, 'users', doctorId);
						const docSnap = await getDoc(docRef);
						if (docSnap.exists()) {
							doctorNameMap[doctorId] = docSnap.data().name;
						} else {
							doctorNameMap[doctorId] = 'Desconhecido';
						}
					}),
				);

				setDoctorNames(doctorNameMap);
			},
			err => {
				console.error('Erro ao carregar receitas:', err);
				setError('Erro ao carregar receitas.');
			},
		);

		return () => unsubscribe();
	}, [patientId]);

	if (error) return <p>{error}</p>;

	return (
		<div className='bg-white p-4 rounded shadow overflow-x-auto'>
			<h2 className='text-lg font-semibold mb-4'>Receitas Médicas</h2>
			{receitas.length === 0 ? (
				<p>Nenhuma receita encontrada para este paciente.</p>
			) : (
				<table className='w-full min-w-[600px] text-left'>
					<thead>
						<tr className='text-gray-500 text-sm'>
							<th className='pb-2'>Fármaco</th>
							<th className='pb-2'>Dose</th>
							<th className='pb-2'>Frequência</th>
							<th className='pb-2'>Observações</th>
							<th className='pb-2'>Prescritor</th>
							<th className='pb-2'>Data</th>
						</tr>
					</thead>
					<tbody>
						{receitas.map(({ id, farmaco, dose, frequencia, observacoes, doctorId, criadoEm }) => (
							<tr key={id} className='border-t'>
								<td className='py-2'>{farmaco}</td>
								<td className='py-2'>{dose}</td>
								<td className='py-2'>{frequencia}</td>
								<td className='py-2'>{observacoes}</td>
								<td className='py-2'>{doctorNames[doctorId] || 'Carregando...'}</td>
								<td className='py-2'>{criadoEm.toDate().toLocaleDateString()}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
