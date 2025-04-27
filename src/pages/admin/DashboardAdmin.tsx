import SidebarAdmin from './SidebarAdmin';

export default function DashboardAdmin() {
	return (
		<div className='flex min-h-screen'>
			<SidebarAdmin />

			<main className='flex-1 p-6 bg-gray-100'>
				<h1 className='text-3xl font-bold text-blue-700 mb-4'>Dashboard Admin</h1>
				<p className='text-gray-700'>Bem-vindo ao painel da Clinica! Use o menu para navegar.</p>
			</main>
		</div>
	);
}
