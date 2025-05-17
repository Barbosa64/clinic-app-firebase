# my-clinic-app
 Projeto Final Front-End Flag


Criar ficheiro em \src\lib\firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'XXXX',
	authDomain: 'xxxx',
	projectId: 'xxxx',
	storageBucket: 'xxxx',
	messagingSenderId: 'xxxx',
	appId: 'xxxx',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
