const app = require('./server.js')()

// Lista de clientes conectados
const connections = [];

app.get('/events', (req, res) => {
    // Enviar cabeçalhos na resposta
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive'
    });

    // Adicionar conexão na lista
    connections.push(res);

    res.write('\n\n');
});

app.get('/emit', (req, res) => {
    // Para cada cliente conectado no momento
    for (const conn of connections) {
        // Payload
        const data = JSON.stringify({ name: 'Gabriel' });

        conn.write(
            `event: current-time\n` +
            `data: ${data}\n\n`
        );
    }

    res.status(200).end();
})