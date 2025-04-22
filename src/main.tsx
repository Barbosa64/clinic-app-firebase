import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import AppRouter from './router';

import './styles/global.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
		<Route path='/' element={<Home />} />
	</StrictMode>,
);
