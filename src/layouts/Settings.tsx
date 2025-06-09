import { useEffect, useState } from 'react';
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './../lib/firebase';

export default function PatientProfile() {
	const auth = getAuth();
	const user = auth.currentUser;

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [newEmail, setNewEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [currentPassword, setCurrentPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		if (user) {
			loadPatientData(user.uid);
		}
	}, [user]);

	const loadPatientData = async (uid: string) => {
		try {
			const docRef = doc(db, 'users', uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const data = docSnap.data();
				setName(data.name || '');
				setEmail(data.email || '');
				setNewEmail(data.email || '');
				setImageUrl(data.imageUrl || '');
			}
		} catch (err) {
			console.error('Erro ao carregar dados:', err);
		}
	};

	const handleSave = async () => {
		if (!user) return;

		setError('');
		setSuccess('');

		try {
			const isEmailChanged = newEmail !== email;
			const isPasswordChanged = !!newPassword;

			if ((isEmailChanged || isPasswordChanged) && !currentPassword) {
				setError('Informe a senha atual para atualizar o e-mail ou senha.');
				return;
			}

			if (isEmailChanged || isPasswordChanged) {
				const credential = EmailAuthProvider.credential(user.email || '', currentPassword);
				await reauthenticateWithCredential(user, credential);
			}

			if (isEmailChanged) {
				await updateEmail(user, newEmail);
				setEmail(newEmail);
			}

			if (isPasswordChanged) {
				await updatePassword(user, newPassword);
			}

			await setDoc(doc(db, 'users', user.uid), { name, email: newEmail, imageUrl }, { merge: true });

			setSuccess('Dados atualizados com sucesso!');
		} catch (err: any) {
			switch (err.code) {
				case 'auth/wrong-password':
					setError('Senha atual incorreta.');
					break;
				case 'auth/invalid-credential':
					setError('Credenciais inválidas. Verifique o e-mail e a senha.');
					break;
				case 'auth/requires-recent-login':
					setError('Você precisa fazer login novamente para atualizar essas informações.');
					break;
				case 'auth/email-already-in-use':
					setError('Este e-mail já está em uso por outra conta.');
					break;
				default:
					setError('Erro: ' + err.message);
			}
		}
	};

	return (
		<div className='max-w-xl mx-auto p-6'>
			<div className='bg-white shadow-md rounded-xl p-6 space-y-6'>
				<h2 className='text-2xl font-bold text-gray-800'>Alterar Informações</h2>

				{error && <p className='text-sm text-red-600'>{error}</p>}
				{success && <p className='text-sm text-green-600'>{success}</p>}

				<form onSubmit={e => e.preventDefault()} className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700'>Nome</label>
						<input type='text' value={name} onChange={e => setName(e.target.value)} className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none' />
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>Novo Email</label>
						<input
							type='email'
							value={newEmail}
							onChange={e => setNewEmail(e.target.value)}
							autoComplete='email'
							className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>Nova Senha</label>
						<input
							type='password'
							value={newPassword}
							onChange={e => setNewPassword(e.target.value)}
							autoComplete='new-password'
							placeholder='Deixe vazio para não mudar'
							className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>
							Password Atual <span className='text-gray-500'>(obrigatória p/ mudar email/paswword)</span>
						</label>
						<input
							type='password'
							value={currentPassword}
							onChange={e => setCurrentPassword(e.target.value)}
							autoComplete='current-password'
							className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700'>Imagem (URL)</label>
						<input type='text' value={imageUrl} onChange={e => setImageUrl(e.target.value)} className='w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none' />
						{imageUrl && <img src={imageUrl} alt='preview' className='mt-3 h-24 w-24 object-cover rounded-full border' />}
					</div>

					<button onClick={handleSave} className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200'>
						Salvar Alterações
					</button>
				</form>
			</div>
		</div>
	);
}
