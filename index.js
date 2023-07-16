const express = require('express');

const app = express();

app.get('/', (request, response) => {
	return response.sendFile('index.html', { root: '.' });
});

app.get('/auth/discord', (request, response) => {
	return response.sendFile('dash.html', { root: '.' });
});


const port = '53134';
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));