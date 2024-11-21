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
    // Connect to management database
    await managementClient.connect()

    // Kill all connections to database
    await managementClient.query(`
      SELECT pg_terminate_backend(pid) 
      FROM pg_stat_activity 
      WHERE datname = ${DB_NAME};
    `)

    // Drop and create database
    await managementClient.query(`DROP DATABASE IF EXISTS ${DB_NAME};`)
    await managementClient.query(`CREATE DATABASE ${DB_NAME};`)

    // Close management connection
    await managementClient.end()
  } catch (error) {
    console.error('Database reset error:', error)
    throw error
  }
}

resetDatabase()
  .then(() => process.exit())
  .catch(console.error)
