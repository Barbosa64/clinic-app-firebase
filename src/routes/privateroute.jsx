import { Navigate } from 'react-router-dom';
import { fakeAuth } from '../store/auth';

export function PrivateRoute({ children, roles }) {
	if (!fakeAuth.isAuthenticated) {
		return <Navigate to='/login' />;
	}

	if (roles && !roles.includes(fakeAuth.user.tipo)) {
		return <Navigate to='/unauthorized' />;
	}

	return children;
}
