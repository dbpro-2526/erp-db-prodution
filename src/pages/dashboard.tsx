import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getUserFromReq } from '@/lib/auth'

export default function Dashboard({ user }: any){
  return (
    <div style={{padding:24,fontFamily:'Inter, sans-serif'}}>
      <Head><title>Dashboard — ERP</title></Head>
      <h1>Welcome, {user?.name || user?.email}</h1>
      <p>Role: {user?.role?.name}</p>
      <p>This is a protected dashboard. Implement role-based UI here.</p>
      <p><a href="/api/auth/logout">Sign out</a></p>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getUserFromReq(context.req)
  if(!user){
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  // remove password before sending to client
  if(user && (user as any).password) delete (user as any).password
  return { props: { user } }
}
