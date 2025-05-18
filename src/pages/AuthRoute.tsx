// src/pages/AuthRoute.tsx (ou src/components/PrivateRoute.tsx)
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthRouteProps {
	children: JSX.Element;
	allowedRoles?: Array<'paciente' | 'medico' | 'admin'>; // Opcional: para proteção baseada em role
}

const AuthRoute: React.FC<AuthRouteProps> = ({ children, allowedRoles }) => {
	const { currentUser, userProfile, loadingAuth } = useAuth();
	const location = useLocation();

	if (loadingAuth) {
		return <p>Verificando autenticação...</p>; // Ou um componente de Spinner/Loading global
	}

	if (!currentUser) {
		// Usuário não logado, redirecionar para login
		// Passar a localização atual para que possa ser redirecionado de volta após o login
		return <Navigate to='/login' state={{ from: location }} replace />;
	}

	if (allowedRoles && userProfile?.role && !allowedRoles.includes(userProfile.role)) {
		// Usuário logado, mas não tem a role permitida para esta rota
		console.warn(`Usuário com role '${userProfile.role}' tentou acessar rota restrita para '${allowedRoles.join(', ')}'`);
		// Redirecionar para uma página "Não Autorizado" ou para o dashboard principal do usuário
		return <Navigate to='/' replace />; // Ou para uma página específica de "acesso negado"
	}

	// Usuário logado e (se aplicável) tem a role permitida
	return children;
};

export default AuthRoute;
