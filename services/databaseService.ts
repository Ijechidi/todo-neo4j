import neo4j, { Driver, Session } from 'neo4j-driver'

export class DatabaseService {
    private static instance: DatabaseService;
    private driver: Driver;

    constructor() {
        if (!process.env.NEO4J_URI || !process.env.NEO4J_USER || !process.env.NEO4J_PASSWORD) {
            throw new Error('Database configuration missing');
        }

        this.driver = neo4j.driver(
            process.env.NEO4J_URI,
            neo4j.auth.basic(
                process.env.NEO4J_USER,
                process.env.NEO4J_PASSWORD
            )
        );
    }

    public getSession(): Session {
        return this.driver.session();
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    async verifyConnectivity(): Promise<void> {
        await this.driver.verifyConnectivity();
    }

    async close(): Promise<void> {
        await this.driver.close();
    }
} 