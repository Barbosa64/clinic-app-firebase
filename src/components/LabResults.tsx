// src/components/LabResults.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface LabResult {
	id: string;
	patientId: string;
	fileName: string;
	fileUrl: string;
	uploadAt: string;
	type: string;
}

const LabResults: React.FC = () => {
	const { user, role } = useAuth();
	const [labResults, setLabResults] = useState<LabResult[]>([]);
	const [file, setFile] = useState<File | null>(null);
	const [labType, setLabType] = useState('');
	const [selectedPatientId, setSelectedPatientId] = useState('');

	useEffect(() => {
		if (role === 'patient' && user) {
			setSelectedPatientId(user.uid);
		}
	}, [user, role]);

	const fetchResults = async () => {
		if (!user || !selectedPatientId) return;
		try {
			const q = query(collection(db, 'LabResults'), where('patientId', '==', selectedPatientId));
			const snapshot = await getDocs(q);
			const results: LabResult[] = snapshot.docs.map(doc => ({
				id: doc.id,
				...(doc.data() as Omit<LabResult, 'id'>),
			}));
			setLabResults(results);
		} catch (err) {
			console.error('Erro ao buscar resultados:', err);
		}
	};

	useEffect(() => {
		if (user) {
			fetchResults();
		}
	}, [user]);

	const handleUpload = async () => {
		if (!file || !labType || selectedPatientId === '') {
			console.warn('Falta o arquivo, tipo do exame ou paciente');
			return;
		}

		try {
			const fileUrl = URL.createObjectURL(file);
			const timestamp = new Date().toISOString();

			// Simula criação de documento apenas localmente (sem storage)
			const fakeId = `${Date.now()}`;
			const newResult: LabResult = {
				id: fakeId,
				patientId: selectedPatientId,
				fileName: file.name,
				fileUrl,
				uploadAt: timestamp,
				type: labType,
			};

			// Adiciona ao estado local (você pode salvar no Firestore se quiser)
			setLabResults(prev => [...prev, newResult]);

			setFile(null);
			setLabType('');
		} catch (err) {
			console.error('Erro ao processar arquivo:', err);
		}
	};

	const handleDelete = (id: string) => {
		setLabResults(prev => prev.filter(result => result.id !== id));
	};

	return (
		<div className='p-4 bg-white rounded shadow'>
			<h2 className='text-lg font-bold mb-4'>Resultados de Laboratório</h2>

			{(role === 'doctor' || role === 'admin') && (
				<div className='mb-6'>
					<input type='text' placeholder='Tipo de exame' value={labType} onChange={e => setLabType(e.target.value)} className='border p-2 mr-2 rounded' />
					<input type='file' onChange={e => setFile(e.target.files?.[0] || null)} className='mr-2' />
					<button onClick={handleUpload} disabled={!file || !labType} className='bg-teal-500 text-white px-4 py-2 rounded'>
						Fazer upload
					</button>
				</div>
			)}

			<ul className='space-y-3'>
				{labResults.map(result => (
					<li key={result.id} className='flex justify-between items-center border p-2 rounded'>
						<div>
							<p className='font-semibold'>{result.type}</p>
							<a href={result.fileUrl} target='_blank' rel='noopener noreferrer' className='text-blue-500'>
								Ver resultado
							</a>
						</div>
						{(role === 'doctor' || role === 'admin') && (
							<button onClick={() => handleDelete(result.id)} className='text-red-500'>
								🗑️
							</button>
						)}
					</li>
				))}
				{labResults.length === 0 && <p className='text-gray-500'>Nenhum resultado disponível.</p>}
			</ul>
		</div>
	);
};

export default LabResults;
