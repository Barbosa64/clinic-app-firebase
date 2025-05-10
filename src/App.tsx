import { useState } from 'react';
import Navbar from './components/Navbar';
import PatientsLista from './pages/admin/Patients';
import ScheduleAppointment from './pages/_ScheduleAppointment';
import Login from './pages/Login';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Login />
			<Navbar />
			<PatientsLista />
			<ScheduleAppointment />
		</>
	);
}

export default App;
