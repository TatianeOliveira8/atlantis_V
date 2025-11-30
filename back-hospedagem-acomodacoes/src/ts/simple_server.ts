import http from 'http';
import { DatabaseManager } from './database/database';
import DiretorCasalSimples from './diretores/diretorCasalSimples';
import DiretorFamiliaMais from './diretores/diretorFamiliaMais';
import DiretorFamiliaSimples from './diretores/diretorFamiliaSimples';
import DiretorFamiliaSuper from './diretores/diretorFamiliaSuper';
import DiretorSolteiroMais from './diretores/diretorSolteiroMais';
import DiretorSolteiroSimples from './diretores/diretorSolteiroSimples';

const dbManager = new DatabaseManager();
const PORT = 3002;

// Build accommodations from directors (pre-configured, not from database)
function getAcomodacoesFromDiretores() {
    const diretores = [
        new DiretorCasalSimples(),
        new DiretorFamiliaMais(),
        new DiretorFamiliaSimples(),
        new DiretorFamiliaSuper(),
        new DiretorSolteiroMais(),
        new DiretorSolteiroSimples()
    ];

    return diretores.map((diretor, index) => {
        const acomodacao = diretor.construir();
        return {
            id: index + 1,
            nomeAcomadacao: acomodacao.NomeAcomadacao,
            camaSolteiro: Number(acomodacao.CamaSolteiro),
            camaCasal: Number(acomodacao.CamaCasal),
            suite: Number(acomodacao.Suite),
            climatizacao: Boolean(acomodacao.Climatizacao),
            garagem: Number(acomodacao.Garagem)
        };
    });
}

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

    if (req.url === '/acomodacoes' && req.method === 'GET') {
        try {
            // Get accommodations from directors (not from database)
            const acomodacoes = getAcomodacoesFromDiretores();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(acomodacoes));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err }));
        }
    } else if (req.url === '/hospedagens' && req.method === 'GET') {
        try {
            const hospedagens = await dbManager.getAllHospedagens();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(hospedagens));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err }));
        }
    } else if (req.url === '/hospedagens' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const hospedagem = JSON.parse(body);
                await dbManager.addHospedagem(hospedagem);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Hospedagem added' }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err }));
            }
        });
    } else if (req.url?.startsWith('/hospedagens') && req.method === 'DELETE') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const idParam = url.searchParams.get('id');
        if (idParam) {
            try {
                await dbManager.deleteHospedagem(parseInt(idParam));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Hospedagem deleted' }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err }));
            }
        } else {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'Missing id' }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

