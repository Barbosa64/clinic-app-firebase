import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardPaciente from './pages/patient/Dashboard';
import DashboardMedico from './pages/doctor/Dashboard';
import DashboardAdmin from './pages/admin/Dashboard';
import { PrivateRoute } from './routes/PrivateRoute';

export default function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />

				{/* Rotas privadas por tipo */}
				<Route
					path='/paciente'
					element={
						<PrivateRoute roles={['paciente']}>
							<DashboardPaciente />
						</PrivateRoute>
					}
				/>

				<Route
					path='/medico'
					element={
						<PrivateRoute roles={['medico']}>
							<DashboardMedico />
						</PrivateRoute>
					}
				/>

				<Route
					path='/admin'
					element={
						<PrivateRoute roles={['admin']}>
							<DashboardAdmin />
						</PrivateRoute>
					}
				/>

				<Route path='/unauthorized' element={<h1>Acesso Negado</h1>} />
			</Routes>
		</BrowserRouter>
	);
}
