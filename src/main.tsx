import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
<<<<<<< Updated upstream
import { App } from './app';
=======
import App from './App';
>>>>>>> Stashed changes

import './styles/global.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
