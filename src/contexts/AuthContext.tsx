import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore'; // getDoc pode ser usado se não precisar de real-time
import { auth, db } from '../lib/firebase';
import { AuthContextType, UserProfile } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
	const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

	useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(auth, firebaseUser => {
			if (firebaseUser) {
				setCurrentUser(firebaseUser);
				const userProfileRef = doc(db, 'users', firebaseUser.uid);

				// Usar onSnapshot para atualizações em tempo real do perfil
				const unsubscribeProfile = onSnapshot(
					userProfileRef,
					docSnap => {
						if (docSnap.exists()) {
							setUserProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
						} else {
							console.warn(`Perfil não encontrado no Firestore para UID: ${firebaseUser.uid}`);
							setUserProfile(null);
						}
						setLoadingAuth(false);
					},
					error => {
						console.error('Erro ao buscar perfil do usuário:', error);
						setUserProfile(null);
						setLoadingAuth(false);
					},
				);
				// Guardar a função de cancelamento do listener do perfil para o cleanup
				// Isso é importante porque o firebaseUser pode mudar (novo login), e precisamos
				// cancelar o listener do perfil do usuário anterior.
				return () => unsubscribeProfile();
			} else {
				setCurrentUser(null);
				setUserProfile(null);
				setLoadingAuth(false);
				// Não há perfil para cancelar aqui se não houver firebaseUser
			}
		});
		return () => unsubscribeAuth(); // Cleanup do listener de autenticação
	}, []);

	const value = {
		currentUser,
		userProfile,
		loadingAuth,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth deve ser usado dentro de um AuthProvider');
	}
	return context;
};
