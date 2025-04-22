import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<div className='min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6'>
			<h1 className='text-4xl font-bold text-blue-700 mb-4'>Bem-vindo à Clínica*</h1>
			<p className='text-gray-700 text-lg mb-6 text-center max-w-xl'>Agenda as suas consultas com facilidade, acompanhe o seu histórico e tenha acesso rápido às suas informações de saúde.</p>

			<div className='flex gap-4'>
				<Link to='/login' className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition'>
					Login
				</Link>
				<Link to='/cadastro' className='bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition'>
					Registe-se
				</Link>
			</div>
		</div>
	);
}
