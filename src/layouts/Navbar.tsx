// src/layouts/Navbar.tsx
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { signOut } from 'firebase/auth'; // Importar signOut diretamente
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth as firebaseAuthInstance } from '../lib/firebase'; // Importar a instância de auth

function classNames(...classes: (string | boolean | undefined)[]): string {
	return classes.filter(Boolean).join(' ');
}

interface NavigationItem {
	name: string;
	href: string;
	current: boolean;
	roles?: Array<'admin' | 'medico' | 'paciente'>;
}

const Navbar = () => {
	const { currentUser, userProfile, loadingAuth } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const handleSignOut = async () => {
		try {
			await signOut(firebaseAuthInstance);
			navigate('/login');
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	const allNavigationItems: Omit<NavigationItem, 'current'>[] = [
		// Rota raiz genérica - pode ser melhorada para redirecionar com base na role no App.tsx
		{ name: 'Início', href: '/', roles: ['admin', 'medico', 'paciente'] },

		// Admin Links
		{ name: 'Painel Admin', href: '/admin/dashboard', roles: ['admin'] },
		{ name: 'Gerir Médicos', href: '/admin/medicos', roles: ['admin'] }, // Ajuste este href se a página TeamList foi movida/renomeada
		{ name: 'Gerir Pacientes (Admin)', href: '/admin/pacientes', roles: ['admin'] }, // Ajuste este href se a página PatientList (admin) foi movida/renomeada
		{ name: 'Marcar Consulta (Admin)', href: '/admin/marcar-consulta', roles: ['admin'] }, // Para admin marcar por outros

		// Médico Links
		{ name: 'Minha Agenda', href: '/medico/agenda', roles: ['medico'] },
		{ name: 'Pacientes (Médico)', href: '/medico/lista-pacientes', roles: ['medico'] }, // Para médico ver seus pacientes

		// Paciente Links
		{ name: 'Marcar Consulta', href: '/paciente/marcar-consulta', roles: ['paciente'] },
		{ name: 'Minhas Consultas', href: '/paciente/agenda', roles: ['paciente'] },
		{ name: 'Meu Perfil (Paciente)', href: `/paciente/perfil/${userProfile?.pacienteDocId || 'id'}`, roles: ['paciente'] }, // Exemplo com ID do paciente

		// Links que foram mencionados no seu App.tsx original e podem precisar de ajuste de role/path
		// Se TeamList é para admin ver medicos, já está coberto. Se for paciente ver medicos:
		{ name: 'Nossos Médicos', href: '/medicos', roles: ['paciente'] }, // Rota para pacientes verem a lista de médicos disponíveis
		// Se PatientList é para admin ver pacientes, já está coberto.
		// Se Agenda é uma agenda geral (improvável) ou específica:
		// A rota '/agenda' original é muito genérica. Melhor ter '/medico/agenda' e '/paciente/agenda'.
	];

	const navigation = allNavigationItems
		.filter(item => !item.roles || (userProfile?.role && item.roles.includes(userProfile.role)))
		.map(item => ({
			...item,
			current: location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href) && item.href.length > 1),
		}));

	const userNavigation = [
		{
			name: 'Meu Perfil',
			action: () => {
				if (userProfile?.role === 'paciente') navigate(`/paciente/perfil/${userProfile.pacienteDocId || currentUser?.uid}`);
				else if (userProfile?.role === 'medico') navigate(`/medico/perfil/${userProfile.medicoDocId || currentUser?.uid}`);
				else if (userProfile?.role === 'admin') navigate('/admin/perfil');
				else navigate('/perfil'); // fallback
			},
		},
		{ name: 'Configurações', action: () => navigate('/configuracoes') },
		{ name: 'Terminar Sessão', action: handleSignOut },
	];

	if (loadingAuth) {
		return (
			<Disclosure as='nav' className='bg-gray-800'>
				<div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
					<div className='relative flex h-16 items-center justify-between'>
						<div className='h-8 w-auto bg-gray-700 rounded animate-pulse'>
							<img className='h-8 w-auto opacity-0' src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500' alt='' />
						</div>
						<div className='hidden sm:flex space-x-4'>
							<div className='h-8 w-24 bg-gray-700 rounded animate-pulse'></div>
							<div className='h-8 w-24 bg-gray-700 rounded animate-pulse'></div>
						</div>
						<div className='flex items-center'>
							<div className='h-6 w-6 bg-gray-700 rounded-full animate-pulse mr-3'></div>
							<div className='h-8 w-8 bg-gray-700 rounded-full animate-pulse'></div>
						</div>
					</div>
				</div>
			</Disclosure>
		);
	}

	if (!currentUser) {
		// Se não estiver logado (após o loading), não mostra a navbar
		return null;
	}

	return (
		<Disclosure as='nav' className='bg-gray-800'>
			{({ open }) => (
				<>
					<div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
						<div className='relative flex h-16 items-center justify-between'>
							<div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
								<Disclosure.Button className='relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'>
									<span className='absolute -inset-0.5' />
									<span className='sr-only'>Abrir menu principal</span>
									{open ? <XMarkIcon className='block size-6' aria-hidden='true' /> : <Bars3Icon className='block size-6' aria-hidden='true' />}
								</Disclosure.Button>
							</div>

							<div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
								<div className='flex shrink-0 items-center'>
									<Link to='/'>
										<img className='h-8 w-auto' src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500' alt='Clínica Sr. Zacarias' />
									</Link>
								</div>
								<div className='hidden sm:ml-6 sm:block'>
									<div className='flex space-x-4'>
										{navigation.map(item => (
											<Link
												key={item.name}
												to={item.href}
												className={classNames(item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'rounded-md px-3 py-2 text-sm font-medium')}
												aria-current={item.current ? 'page' : undefined}
											>
												{item.name}
											</Link>
										))}
									</div>
								</div>
							</div>

							<div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
								<button
									type='button'
									className='relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
								>
									<span className='absolute -inset-1.5' />
									<span className='sr-only'>Ver notificações</span>
									<BellIcon className='size-6' aria-hidden='true' />
								</button>

								<Menu as='div' className='relative ml-3'>
									<div>
										<Menu.Button className='relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
											<span className='absolute -inset-1.5' />
											<span className='sr-only'>Abrir menu do usuário</span>
											{currentUser.photoURL ? (
												<img className='size-8 rounded-full' src={currentUser.photoURL} alt='Foto do usuário' />
											) : (
												<UserCircleIcon className='size-8 rounded-full text-gray-400' />
											)}
										</Menu.Button>
									</div>
									<Transition
										as={Fragment}
										enter='transition ease-out duration-100'
										enterFrom='transform opacity-0 scale-95'
										enterTo='transform opacity-100 scale-100'
										leave='transition ease-in duration-75'
										leaveFrom='transform opacity-100 scale-100'
										leaveTo='transform opacity-0 scale-95'
									>
										<Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
											<div className='px-4 py-3'>
												<p className='text-sm font-medium text-gray-900 truncate'>{userProfile?.displayName || currentUser.email}</p>
												<p className='text-xs text-gray-500 capitalize'>{userProfile?.role || 'Usuário'}</p>
											</div>
											{userNavigation.map(item => (
												<Menu.Item key={item.name}>
													{({ active }) => (
														<button onClick={item.action} className={classNames(active ? 'bg-gray-100' : '', 'block w-full text-left px-4 py-2 text-sm text-gray-700')}>
															{item.name}
														</button>
													)}
												</Menu.Item>
											))}
										</Menu.Items>
									</Transition>
								</Menu>
							</div>
						</div>
					</div>

					<Disclosure.Panel className='sm:hidden'>
						<div className='space-y-1 px-2 pb-3 pt-2'>
							{navigation.map(item => (
								<Disclosure.Button
									key={item.name}
									as={Link}
									to={item.href}
									className={classNames(item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium')}
									aria-current={item.current ? 'page' : undefined}
								>
									{item.name}
								</Disclosure.Button>
							))}
						</div>
						<div className='border-t border-gray-700 pb-3 pt-4'>
							<div className='flex items-center px-5'>
								<div className='shrink-0'>
									{currentUser.photoURL ? <img className='size-10 rounded-full' src={currentUser.photoURL} alt='' /> : <UserCircleIcon className='size-10 rounded-full text-gray-400' />}
								</div>
								<div className='ml-3'>
									<div className='text-base font-medium leading-none text-white truncate'>{userProfile?.displayName || currentUser.email}</div>
									<div className='text-sm font-medium leading-none text-gray-400 capitalize'>{userProfile?.role || 'Usuário'}</div>
								</div>
								<button
									type='button'
									className='relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
								>
									<span className='absolute -inset-1.5' />
									<span className='sr-only'>View notifications</span>
									<BellIcon className='size-6' aria-hidden='true' />
								</button>
							</div>
							<div className='mt-3 space-y-1 px-2'>
								{userNavigation.map(item => (
									<Disclosure.Button
										key={item.name}
										as='button'
										onClick={item.action}
										className='block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'
									>
										{item.name}
									</Disclosure.Button>
								))}
							</div>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};

export default Navbar;
