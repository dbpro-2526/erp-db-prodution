import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse){
  const cookie = serialize('erp_token', '', { path: '/', httpOnly: true, maxAge: 0 })
  res.setHeader('Set-Cookie', cookie)
  res.json({ ok:true })
}
