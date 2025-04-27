import { Link } from 'react-router-dom';

export default function SidebarAdmin() {
	return (
		<aside className='w-64 h-screen bg-blue-800 text-white flex flex-col p-4'>
			<h2 className='text-2xl font-bold mb-8'>Painel Admin</h2>

			<nav className='flex flex-col gap-4'>
				<Link to='/admin' className='hover:bg-blue-700 p-2 rounded'>
					Dashboard
				</Link>
				<Link to='/admin/users' className='hover:bg-blue-700 p-2 rounded'>
					Gerir Pacientes
				</Link>
				<Link to='/admin/settings' className='hover:bg-blue-700 p-2 rounded'>
					Configurações
				</Link>
			</nav>

			<div className='mt-auto'>
				<Link to='/logout' className='text-red-300 hover:text-red-400 mt-10 block'>
					Sair
				</Link>
			</div>
		</aside>
	);
}
