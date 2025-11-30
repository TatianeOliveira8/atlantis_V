import mysql from 'mysql2/promise';
import 'dotenv/config';

export class DatabaseManager {
    private pool: mysql.Pool;

    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'atlantis',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        this.initialize();
    }

    private async initialize() {
        try {
            const connection = await this.pool.getConnection();
            try {
                await connection.query(`
                    CREATE TABLE IF NOT EXISTS acomodacoes (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nomeAcomadacao VARCHAR(255),
                        camaSolteiro INT,
                        camaCasal INT,
                        suite INT,
                        climatizacao INT,
                        garagem INT
                    )
                `);
                await connection.query(`
                    CREATE TABLE IF NOT EXISTS hospedagens (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        cliente_id INT,
                        acomodacao_id INT,
                        dataEntrada VARCHAR(20),
                        dataSaida VARCHAR(20)
                    )
                `);
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error(error);
        }
    }

    public async getAllAcomodacoes(): Promise<any[]> {
        const [rows] = await this.pool.query('SELECT * FROM acomodacoes');
        return rows as any[];
    }

    public async addAcomodacao(acomodacao: any): Promise<void> {
        const query = `
            INSERT INTO acomodacoes (nomeAcomadacao, camaSolteiro, camaCasal, suite, climatizacao, garagem)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [
            acomodacao.nomeAcomadacao,
            acomodacao.camaSolteiro || 0,
            acomodacao.camaCasal || 0,
            acomodacao.suite || 0,
            acomodacao.climatizacao ? 1 : 0,
            acomodacao.garagem || 0
        ];
        await this.pool.execute(query, params);
    }

    public async getAllHospedagens(): Promise<any[]> {
        const [rows] = await this.pool.query('SELECT * FROM hospedagens');
        return rows as any[];
    }

    public async addHospedagem(hospedagem: any): Promise<void> {
        const query = `
            INSERT INTO hospedagens (cliente_id, acomodacao_id, dataEntrada, dataSaida)
            VALUES (?, ?, ?, ?)
        `;
        const params = [
            hospedagem.cliente_id,
            hospedagem.acomodacao_id,
            hospedagem.dataEntrada,
            hospedagem.dataSaida
        ];
        await this.pool.execute(query, params);
    }

    public async deleteHospedagem(id: number): Promise<void> {
        const query = 'DELETE FROM hospedagens WHERE id = ?';
        await this.pool.execute(query, [id]);
    }
}
