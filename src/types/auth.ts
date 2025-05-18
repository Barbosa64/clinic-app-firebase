import { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
	uid: string;
	email: string;
	role: 'paciente' | 'medico' | 'admin' | null;
	displayName?: string;
	pacienteDocId?: string;
	medicoDocId?: string;
	// ... outros campos do Firestore
}

export interface AuthContextType {
	currentUser: FirebaseUser | null;
	userProfile: UserProfile | null;
	loadingAuth: boolean;
}
