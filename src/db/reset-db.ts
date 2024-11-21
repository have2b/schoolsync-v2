import 'dotenv/config'
import { Client } from 'pg'

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env

const resetDatabase = async () => {
  const managementClient = new Client({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'postgres',
  })

  try {
    console.log('---- Resetting database...')
    console.log('---- Connecting to database...')
    // Connect to management database
    await managementClient.connect()

    console.log('---- Killing all database connections...')
    // Kill all connections to database
    await managementClient.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '${DB_NAME}';
    `)

    console.log('---- Dropping and creating database...')
    // Drop and create database
    await managementClient.query(`DROP DATABASE IF EXISTS ${DB_NAME};`)
    await managementClient.query(`CREATE DATABASE ${DB_NAME};`)

    console.log('---- Closing connection...')
    // Close management connection
    await managementClient.end()

    console.log('---- Reset database success!')
  } catch (error) {
    console.error('Database reset error:', error)
    throw error
  }
}

await resetDatabase()
  .then(() => process.exit())
  .catch(console.error)
