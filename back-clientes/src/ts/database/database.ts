import mysql from 'mysql2/promise';
import 'dotenv/config';

// Validation functions for mandatory personal data
function validateDadosPessoais(data: any): void {
    const erros: string[] = [];

    if (!data.nome || data.nome.trim() === '') {
        erros.push("Nome é obrigatório");
    }

    if (!data.nomeSocial || data.nomeSocial.trim() === '') {
        erros.push("Nome Social é obrigatório");
    }

    if (!data.dataNascimento || data.dataNascimento.trim() === '') {
        erros.push("Data de Nascimento é obrigatória");
    }

    // Validate date format (YYYY-MM-DD)
    if (data.dataNascimento && !isValidDate(data.dataNascimento)) {
        erros.push("Data de Nascimento em formato inválido");
    }

    if (erros.length > 0) {
        throw new Error(erros.join("; "));
    }
}

// Helper function to validate date
function isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}

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
                // Check if old clientes table exists and has data
                const [tables]: any = await connection.query(
                    "SHOW TABLES LIKE 'clientes'"
                );
                const oldTableExists = tables.length > 0;

                let oldData: any[] = [];
                if (oldTableExists) {
                    const [rows]: any = await connection.query('SELECT * FROM clientes');
                    oldData = rows;

                    // Drop old table to recreate structure
                    if (oldData.length > 0) {
                        console.log(`Found ${oldData.length} records in old clientes table. Migrating...`);
                    }
                    await connection.query('DROP TABLE IF EXISTS clientes');
                }

                // Create titulares table
                await connection.query(`
                    CREATE TABLE IF NOT EXISTS titulares (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(255) NOT NULL,
                        nomeSocial VARCHAR(255),
                        dataNascimento VARCHAR(20),
                        dataCadastro VARCHAR(20),
                        telefones TEXT,
                        endereco TEXT,
                        documentos TEXT
                    )
                `);

                // Create dependentes table
                await connection.query(`
                    CREATE TABLE IF NOT EXISTS dependentes (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        nome VARCHAR(255) NOT NULL,
                        nomeSocial VARCHAR(255),
                        dataNascimento VARCHAR(20),
                        dataCadastro VARCHAR(20),
                        telefones TEXT,
                        endereco TEXT,
                        documentos TEXT,
                        titular_id INT NOT NULL,
                        FOREIGN KEY (titular_id) REFERENCES titulares(id) ON DELETE CASCADE
                    )
                `);

                // Create view for backward compatibility
                await connection.query('DROP VIEW IF EXISTS clientes');
                await connection.query(`
                    CREATE VIEW clientes AS
                    SELECT id, nome, nomeSocial, dataNascimento, dataCadastro, 
                           telefones, endereco, documentos, NULL as titular_id
                    FROM titulares
                    UNION ALL
                    SELECT id, nome, nomeSocial, dataNascimento, dataCadastro, 
                           telefones, endereco, documentos, titular_id
                    FROM dependentes
                `);

                // Migrate old data if exists - DISABLED to start with empty database
                // if (oldData.length > 0) {
                //     await this.migrateOldData(connection, oldData);
                //     console.log('Migration completed successfully!');
                // }

            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Database initialization error:', error);
        }
    }

    private async migrateOldData(connection: mysql.PoolConnection, oldData: any[]) {
        // First, insert all titulares (records without titular_id)
        // Don't specify ID, let auto-increment handle it
        const titulares = oldData.filter(c => !c.titular_id);
        const titularIdMap = new Map<number, number>(); // old_id -> new_id

        for (const titular of titulares) {
            const [result]: any = await connection.execute(
                `INSERT INTO titulares (nome, nomeSocial, dataNascimento, dataCadastro, telefones, endereco, documentos)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    titular.nome,
                    titular.nomeSocial,
                    titular.dataNascimento,
                    titular.dataCadastro,
                    titular.telefones,
                    titular.endereco,
                    titular.documentos
                ]
            );
            // Map old ID to new auto-incremented ID
            titularIdMap.set(titular.id, result.insertId);
        }

        // Then, insert all dependentes (records with titular_id)
        // Map old titular_id to new titular_id
        const dependentes = oldData.filter(c => c.titular_id);
        for (const dependente of dependentes) {
            const newTitularId = titularIdMap.get(dependente.titular_id);
            if (newTitularId) {
                await connection.execute(
                    `INSERT INTO dependentes (nome, nomeSocial, dataNascimento, dataCadastro, telefones, endereco, documentos, titular_id)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        dependente.nome,
                        dependente.nomeSocial,
                        dependente.dataNascimento,
                        dependente.dataCadastro,
                        dependente.telefones,
                        dependente.endereco,
                        dependente.documentos,
                        newTitularId
                    ]
                );
            }
        }
    }

    // Get all clientes (view - backward compatibility)
    public async getAllClientes(): Promise<any[]> {
        const [rows] = await this.pool.query('SELECT * FROM clientes');
        return rows as any[];
    }

    // Get only titulares
    public async getAllTitulares(): Promise<any[]> {
        const [rows] = await this.pool.query('SELECT * FROM titulares');
        return rows as any[];
    }

    // Get only dependentes
    public async getAllDependentes(): Promise<any[]> {
        const [rows] = await this.pool.query('SELECT * FROM dependentes');
        return rows as any[];
    }

    // Get titular by id
    public async getTitularById(id: number): Promise<any | null> {
        const [rows]: any = await this.pool.query('SELECT * FROM titulares WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    // Get dependentes by titular_id
    public async getDependentesByTitularId(titularId: number): Promise<any[]> {
        const [rows] = await this.pool.query('SELECT * FROM dependentes WHERE titular_id = ?', [titularId]);
        return rows as any[];
    }

    // Add cliente (determines if titular or dependente based on titular_id)
    public async addCliente(cliente: any): Promise<void> {
        if (cliente.titular_id) {
            // It's a dependente
            await this.addDependente(cliente);
        } else {
            // It's a titular
            await this.addTitular(cliente);
        }
    }

    // Add titular
    public async addTitular(titular: any): Promise<void> {
        // Validate mandatory fields
        validateDadosPessoais(titular);

        const query = `
            INSERT INTO titulares (nome, nomeSocial, dataNascimento, dataCadastro, telefones, endereco, documentos)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            titular.nome,
            titular.nomeSocial || null,
            titular.dataNascimento,
            titular.dataCadastro || new Date().toISOString().split('T')[0],
            JSON.stringify(titular.telefones || []),
            JSON.stringify(titular.endereco || null),
            JSON.stringify(titular.documentos || [])
        ];
        await this.pool.execute(query, params);
    }

    // Add dependente (with automatic data inheritance from titular)
    public async addDependente(dependente: any): Promise<void> {
        // Validate mandatory fields
        validateDadosPessoais(dependente);

        // Get titular data to inherit from
        const titular = await this.getTitularById(dependente.titular_id);

        if (!titular) {
            throw new Error(`Titular with id ${dependente.titular_id} not found`);
        }

        // Deep clone titular data (parse JSON fields)
        const titularTelefones = JSON.parse(titular.telefones || '[]');
        const titularEndereco = JSON.parse(titular.endereco || 'null');
        const titularDocumentos = JSON.parse(titular.documentos || '[]');

        // Create dependente with inherited data
        // Inherit: telefones, endereco, documentos (deep cloned)
        // Keep unique: nome, nomeSocial, dataNascimento (from dependente param)
        const query = `
            INSERT INTO dependentes (nome, nomeSocial, dataNascimento, dataCadastro, telefones, endereco, documentos, titular_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            dependente.nome,
            dependente.nomeSocial || null,
            dependente.dataNascimento,
            dependente.dataCadastro || new Date().toISOString().split('T')[0],
            JSON.stringify(titularTelefones), // Inherited and cloned
            JSON.stringify(titularEndereco),   // Inherited and cloned
            JSON.stringify(titularDocumentos), // Inherited and cloned
            dependente.titular_id
        ];
        await this.pool.execute(query, params);
    }

    // Update cliente (determines table based on titular_id)
    public async updateCliente(cliente: any): Promise<void> {
        // Check if it's a titular or dependente by checking which table has this id
        const titular = await this.getTitularById(cliente.id);

        if (titular) {
            await this.updateTitular(cliente);
        } else {
            await this.updateDependente(cliente);
        }
    }

    // Update titular
    public async updateTitular(titular: any): Promise<void> {
        // Validate mandatory fields
        validateDadosPessoais(titular);

        const query = `
            UPDATE titulares 
            SET nome = ?, nomeSocial = ?, dataNascimento = ?, telefones = ?, endereco = ?, documentos = ?
            WHERE id = ?
        `;
        const params = [
            titular.nome,
            titular.nomeSocial || null,
            titular.dataNascimento,
            JSON.stringify(titular.telefones || []),
            JSON.stringify(titular.endereco || null),
            JSON.stringify(titular.documentos || []),
            titular.id
        ];
        await this.pool.execute(query, params);
    }

    // Update dependente
    public async updateDependente(dependente: any): Promise<void> {
        // Validate mandatory fields
        validateDadosPessoais(dependente);

        const query = `
            UPDATE dependentes 
            SET nome = ?, nomeSocial = ?, dataNascimento = ?, telefones = ?, endereco = ?, documentos = ?
            WHERE id = ?
        `;
        const params = [
            dependente.nome,
            dependente.nomeSocial || null,
            dependente.dataNascimento,
            JSON.stringify(dependente.telefones || []),
            JSON.stringify(dependente.endereco || null),
            JSON.stringify(dependente.documentos || []),
            dependente.id
        ];
        await this.pool.execute(query, params);
    }

    // Delete cliente (checks both tables)
    public async deleteCliente(id: number): Promise<void> {
        // Try to delete from titulares first (will cascade delete dependentes)
        const [result1]: any = await this.pool.execute('DELETE FROM titulares WHERE id = ?', [id]);

        // If not found in titulares, try dependentes
        if (result1.affectedRows === 0) {
            await this.pool.execute('DELETE FROM dependentes WHERE id = ?', [id]);
        }
    }
}
