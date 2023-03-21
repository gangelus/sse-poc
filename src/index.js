const { randomUUID } = require('crypto')
const startServer = require('./server.js')

const app = startServer()

// Lista de clientes conectados
const clients = [];

app.get('/events', (req, res) => {
    const uuid = randomUUID();

    // Enviar cabeçalhos na resposta
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    // Enviar mensagem para cliente
    res.write('data: connected\n\n');

    // Adicionar cliente na lista
    clients.push({
        uuid,
        res
    })

    // Remover cliente da lista após evento de desconexão
    res.on('close', () => {
        const indexToRemove = clients.findIndex(c => c.uuid == uuid)
        clients.splice(indexToRemove, 1);
    });
});

app.get('/emit/:eventName', (req, res) => {
    const { eventName } = req.params;

    // Para cada cliente conectado no momento
    for (const client of clients) {
        // Hora de agora
        const now = new Date().toLocaleTimeString();

        // Enviar mensagem com payload
        client.res.write(
            `event: ${eventName}\n` +
            `data: ${now}\n\n`
        );
    }

    res.json({
        message: `Event ${eventName} emitted to ${clients.length} clients.`
    });
})