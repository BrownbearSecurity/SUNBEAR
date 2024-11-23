const WebSocket = require('ws');
const os = require('os');
const fs = require('fs');

const PORT = 8080;

// Charger les utilisateurs depuis un fichier JSON
let USERS = {};
try {
    USERS = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
} catch (err) {
    console.error('Erreur lors du chargement du fichier users.json:', err);
}

// Initialize chat history
let chatHistory = [];

// Load chat history from file if it exists
try {
    const savedHistory = fs.readFileSync('./chat_history.json', 'utf-8');
    chatHistory = JSON.parse(savedHistory);
} catch (err) {
    console.log('No previous chat history found, starting fresh.');
}

// Helper function to get the server's IP address
function getServerIP() {
    const interfaces = os.networkInterfaces();
    let ipAddress = '127.0.0.1'; // Default to local address if no external IP is found

    console.log('Available network interfaces:');
    for (const interfaceName in interfaces) {
        interfaces[interfaceName].forEach(iface => {
            console.log(`${interfaceName}: ${JSON.stringify(iface)}`);
            if (iface.family === 'IPv4' && !iface.internal) {
                ipAddress = iface.address;
            }
        });
    }

    return ipAddress;
}

const wss = new WebSocket.Server({ port: PORT });

console.log(`WebSocket server is running on ws://${getServerIP()}:${PORT}`);

const clients = new Map(); // Map to track connected clients and their usernames

wss.on('connection', (ws) => {
    console.log('A new client connected.');

    // Send the chat history to the new client
    ws.send(JSON.stringify({ type: 'chat_history', history: chatHistory }));

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);

            // Login handler
            if (message.type === 'login') {
                const { username, password } = message;

                // Vérifier si le nom d'utilisateur et le mot de passe sont valides
                if (USERS[username] && USERS[username].password === password) {
                    clients.set(ws, username);
                    ws.send(JSON.stringify({ type: 'login_response', success: true, message: 'Bienvenue sur le chat!' }));
                    broadcastUserList();
                } else {
                    ws.send(JSON.stringify({ type: 'login_response', success: false, message: 'Identifiants incorrects.' }));
                }
            }

            // Chat message handler
            if (message.type === 'message') {
                const sender = clients.get(ws) || 'Anonymous';
                broadcastMessage(message.message, sender);

                // Save the message to the chat history
                const chatMessage = { sender, message: message.message, timestamp: new Date().toISOString() };
                chatHistory.push(chatMessage);

                // Write the chat history to a file
                fs.writeFileSync('./chat_history.json', JSON.stringify(chatHistory, null, 2));
            }
        } catch (err) {
            console.error('Error handling message:', err);
        }
    });

    ws.on('close', () => {
        console.log('A client disconnected.');
        clients.delete(ws);
        broadcastUserList();
    });
});

// Helper function to broadcast a message to all clients
function broadcastMessage(message, sender) {
    const payload = JSON.stringify({ type: 'message', message, sender });
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    }
}

// Helper function to send the user list to all clients
function broadcastUserList() {
    const users = Array.from(clients.values()).map(username => {
        // Attach custom text if it exists in the USERS object
        return { username, customText: USERS[username]?.customText || '' };
    });
    const payload = JSON.stringify({ type: 'user_list', users });
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
        }
    }
}
