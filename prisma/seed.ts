import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main(){
  const roles = ['Super Admin','Admin','State Manager','State Office','Region Manager','Division Manager','Warehouse Manager','Production Manager','Accountant','Regular User']
  for(const r of roles){
    await prisma.role.upsert({where:{name:r}, update:{}, create:{name:r}})
  }

  const adminEmail = 'dbprodhind@gmail.com'
  const existing = await prisma.user.findUnique({where:{email:adminEmail}})
  if(!existing){
    const role = await prisma.role.findUnique({where:{name:'Super Admin'}})
    const hashed = await bcrypt.hash('dbpr@2526', 10)
    await prisma.user.create({data:{email:adminEmail, password:hashed, name:'Super Admin', roleId:role!.id}})
    console.log('Seeded Super Admin:', adminEmail)
  } else {
    console.log('Admin already exists')
  }
}

main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>process.exit())
