/*const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/api/agendamentos', (req, res) => {
	const { doctor, specialty, timestamp } = req.body;

	console.log('Consulta recebida:', { doctor, specialty, timestamp });

	// Aqui você pode salvar no banco de dados (MongoDB, PostgreSQL, etc.)
	res.status(201).json({ message: 'Consulta registrada com sucesso' });
});

app.listen(PORT, () => {
	console.log(`Servidor ouvindo em http://localhost:${PORT}`);
});
*/
