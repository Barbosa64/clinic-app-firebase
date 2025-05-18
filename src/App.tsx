// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import PatientsLista from './pages/admin/Patients';
import ScheduleAppointment from './pages/admin/ScheduleAppointment';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthRoute from './pages/AuthRoute'; // ou PrivateRoute, dependendo da sua escolha
import TeamList from './pages/admin/doctor/data/_TeamList'; // Considere renomear e mover este
import PatientList from './pages/patient/data/PatientLista'; // Considere renomear e mover este
import Agenda from './pages/doctor/Agenda';

// ADICIONE ESTA LINHA:
import AdminDashboardPage from './pages/admin/DashboardAdmin'; // Verifique se o nome do arquivo é DashboardAdmin.tsx
// Se o componente exportado no arquivo for default, você pode nomear como quiser aqui.
// Se for uma exportação nomeada, ex: export const AdminDashboardPage = ...,
// então o import deve ser: import { AdminDashboardPage } from './pages/admin/DashboardAdmin';

// Se você tiver DoctorAgendaPage e PatientBookAppointmentPage sendo usados em rotas,
// eles também precisarão ser importados:
// import DoctorAgendaPage from './pages/doctor/Agenda'; // Se Agenda.tsx exporta default e é usado como DoctorAgendaPage
// import PatientBookAppointmentPage from './pages/patient/BookAppointmentPage'; // Exemplo de caminho

function App() {
	const location = useLocation();

	return (
		<>
			{location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}

			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<Signup />} />

				{/* Rota Raiz - Exemplo, pode ser diferente */}
				<Route
					path='/'
					element={
						<AuthRoute>
							{' '}
							{/* Ou <PrivateRoute> */}
							{/* Decidir qual componente vai aqui. Pode ser um dashboard geral ou redirecionar baseado na role */}
							<PatientsLista /> {/* Este era seu exemplo original */}
						</AuthRoute>
					}
				/>

				{/* Exemplo de como a rota do AdminDashboardPage seria usada */}
				<Route
					path='/admin/dashboard' // Certifique-se que esta rota corresponde à href na Navbar
					element={
						<AuthRoute allowedRoles={['admin']}>
							{' '}
							{/* Ou <PrivateRoute> */}
							<AdminDashboardPage /> {/* Aqui está o uso do componente */}
						</AuthRoute>
					}
				/>

				{/* Outras rotas que você tinha */}
				<Route
					path='/medicos' // Antiga rota /medicos, talvez agora /admin/medicos ou /lista-medicos
					element={
						<AuthRoute allowedRoles={['admin', 'paciente']}>
							<TeamList />
						</AuthRoute>
					}
				/>
				<Route
					path='/pacientes' // Antiga rota /pacientes, talvez /admin/pacientes ou /lista-pacientes
					element={
						<AuthRoute allowedRoles={['admin', 'medico']}>
							<PatientList />
						</AuthRoute>
					}
				/>
				<Route
					path='/marcar-consulta' // Talvez /paciente/marcar-consulta
					element={
						<AuthRoute allowedRoles={['paciente', 'admin']}>
							<ScheduleAppointment />
						</AuthRoute>
					}
				/>
				<Route
					path='/agenda' // Talvez /medico/agenda ou /paciente/agenda
					element={
						<AuthRoute allowedRoles={['medico', 'paciente']}>
							<Agenda />
						</AuthRoute>
					}
				/>

				{/* Rotas mais específicas que você adicionou no exemplo de AuthRoute */}
				{/*
        <Route
          path='/medico/agenda'
          element={
            <AuthRoute allowedRoles={['medico']}>
              <DoctorAgendaPage /> // Precisa ser importado
            </AuthRoute>
          }
        />
        <Route
          path='/paciente/marcar-consulta'
          element={
            <AuthRoute allowedRoles={['paciente', 'admin']}>
              <PatientBookAppointmentPage /> // Precisa ser importado
            </AuthRoute>
          }
        />
        */}

				{/* Erro 404 - Redireciona para a raiz ou uma página específica de "Não Encontrado" */}
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
		</>
	);
}

// Garante que o componente App use o Router
export default () => (
	<Router>
		<App />
	</Router>
);
