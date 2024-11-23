import { login } from '@/features/auth/server/actions/auth'
import { pipeline } from '@/lib/pipeline'

export async function POST(req: Request) {
  const loginReq = await req.json()
  const result = await pipeline({
    execFunc: () => login(loginReq),
  })
  return Response.json(result)
}
