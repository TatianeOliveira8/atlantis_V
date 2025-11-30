import http from 'http';
import { DatabaseManager } from './database/database';

const dbManager = new DatabaseManager();
const PORT = 3001;

const server = http.createServer(async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/clientes' && req.method === 'GET') {
        try {
            const clientes = await dbManager.getAllClientes();
            // Parse JSON fields back to objects
            const parsedClientes = clientes.map(c => ({
                ...c,
                telefones: JSON.parse(c.telefones || '[]'),
                endereco: JSON.parse(c.endereco || 'null'),
                documentos: JSON.parse(c.documentos || '[]')
            }));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(parsedClientes));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err }));
        }
    } else if (req.url === '/titulares' && req.method === 'GET') {
        try {
            const titulares = await dbManager.getAllTitulares();
            // Parse JSON fields back to objects
            const parsedTitulares = titulares.map(t => ({
                ...t,
                telefones: JSON.parse(t.telefones || '[]'),
                endereco: JSON.parse(t.endereco || 'null'),
                documentos: JSON.parse(t.documentos || '[]')
            }));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(parsedTitulares));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err }));
        }
    } else if (req.url === '/dependentes' && req.method === 'GET') {
        try {
            const dependentes = await dbManager.getAllDependentes();
            // Parse JSON fields back to objects
            const parsedDependentes = dependentes.map(d => ({
                ...d,
                telefones: JSON.parse(d.telefones || '[]'),
                endereco: JSON.parse(d.endereco || 'null'),
                documentos: JSON.parse(d.documentos || '[]')
            }));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(parsedDependentes));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err }));
        }
    } else if (req.url === '/clientes' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const cliente = JSON.parse(body);
                await dbManager.addCliente(cliente);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Cliente added' }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err }));
            }
        });
    } else if (req.url === '/clientes' && req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const cliente = JSON.parse(body);
                await dbManager.updateCliente(cliente);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Cliente updated' }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err }));
            }
        });
    } else if (req.url?.startsWith('/clientes') && req.method === 'DELETE') {
        const urlParts = req.url.split('/');
        const id = parseInt(urlParts[urlParts.length - 1]);
        if (isNaN(id)) {

            const url = new URL(req.url, `http://${req.headers.host}`);
            const idParam = url.searchParams.get('id');
            if (idParam) {
                try {
                    await dbManager.deleteCliente(parseInt(idParam));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Cliente deleted' }));
                } catch (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: err }));
                }
            } else {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Missing id' }));
            }
        } else {
            // Path param logic if I changed routing
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'Invalid ID' }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
