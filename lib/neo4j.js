import neo4j from 'neo4j-driver'

if (!process.env.NEO4J_URI || !process.env.NEO4J_USER || !process.env.NEO4J_PASSWORD) {
    throw new Error('Les variables d\'environnement Neo4j ne sont pas définies')
}

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(
        process.env.NEO4J_USER,
        process.env.NEO4J_PASSWORD
    ),
    {
        maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 heures
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 2000 // 2 secondes
    }
)

// Vérifier la connexion au démarrage
try {
    await driver.verifyConnectivity()
    console.log('Connexion à Neo4j établie avec succès')
} catch (error) {
    console.error('Erreur de connexion à Neo4j:', error)
    throw error
}

export default driver 