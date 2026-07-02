import { parse } from 'cookie'
import jwt from 'jsonwebtoken'
import prisma from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'replace_me_with_secure_random'

export async function getUserFromReq(req:any){
  try{
    const cookie = req.headers?.cookie
    if(!cookie) return null
    const parsed = parse(cookie)
    const token = parsed.erp_token
    if(!token) return null
    const decoded:any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.userId
    if(!userId) return null
    const user = await prisma.user.findUnique({where:{id:userId}, include:{role:true}})
    return user
  }catch(e){
    return null
  }
}
