import Head from 'next/head'
import Link from 'next/link'

export default function Home(){
  return (
    <div style={{fontFamily:'Inter, sans-serif',padding:24}}>
      <Head>
        <title>ERP Inventory — Scaffold</title>
      </Head>
      <h1>ERP Inventory — Scaffold</h1>
      <p>This is a minimal scaffold. Use API routes (under <code>/api</code>) and Prisma for DB.</p>
      <ul>
        <li><Link href="/api/health">/api/health</Link></li>
        <li>Run Prisma migrations and seed to create roles and admin.</li>
      </ul>
    </div>
  )
}
