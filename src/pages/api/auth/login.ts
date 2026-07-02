import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'replace_me_with_secure_random'

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).json({message:'Method not allowed'})
  const { email, password } = req.body
  if(!email || !password) return res.status(400).json({message:'Email and password required'})

  try{
    const user = await prisma.user.findUnique({where:{email}})
    if(!user) return res.status(401).json({message:'Invalid credentials'})

    const match = await bcrypt.compare(password, user.password)
    if(!match) return res.status(401).json({message:'Invalid credentials'})

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
    const cookie = serialize('erp_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
    res.setHeader('Set-Cookie', cookie)
    // Don't send password back
    const { password: _p, ...safeUser } = user as any
    res.json({ ok:true, user: safeUser })
  }catch(e){
    console.error(e)
    res.status(500).json({message:'Server error'})
  }
}
