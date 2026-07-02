import { useState } from 'react'
import Head from 'next/head'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e:any){
    e.preventDefault();
    setLoading(true); setError('')
    try{
      const res = await fetch('/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email,password})})
      const data = await res.json()
      if(!res.ok) throw new Error(data?.message || 'Login failed')
      // success
      window.location.href = '/dashboard'
    }catch(err:any){
      setError(err.message)
    }finally{setLoading(false)}
  }

  return (
    <div style={{maxWidth:480,margin:'48px auto',padding:20,fontFamily:'Inter, sans-serif'}}>
      <Head><title>Login — ERP</title></Head>
      <h2>Sign in</h2>
      <form onSubmit={submit} style={{display:'grid',gap:12}}>
        <label>
          Email
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required style={{width:'100%',padding:8}} />
        </label>
        <label>
          Password
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required style={{width:'100%',padding:8}} />
        </label>
        <div>
          <button type="submit" disabled={loading} style={{padding:'8px 14px'}}> {loading ? 'Signing in...' : 'Sign in'} </button>
        </div>
        {error && <div style={{color:'red'}}>{error}</div>}
      </form>
    </div>
  )
}
