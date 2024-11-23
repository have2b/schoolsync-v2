import { db } from '@/db/connection'
import { Account } from '@/db/schema'
import { logger } from '@/lib/logger'
import { eq } from 'drizzle-orm'

export async function findAccountByUsername({ username }: { username: string }) {
  try {
    const [account] = await db.select().from(Account).where(eq(Account.username, username)).limit(1)
    return account
  } catch (error) {
    logger.error(error)
    return null
  }
}
