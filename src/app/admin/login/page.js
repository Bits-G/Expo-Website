'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Invalid email or password')
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bg px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-heading font-bold text-secondary text-center mb-2">Admin Login</h1>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <input
          type="email" required placeholder="Email"
          className="w-full border p-3 rounded-lg"
          value={email} onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password" required placeholder="Password"
          className="w-full border p-3 rounded-lg"
          value={password} onChange={e => setPassword(e.target.value)}
        />
        <button disabled={loading} className="w-full bg-primary text-white p-3 rounded-lg font-semibold hover:brightness-110 transition disabled:opacity-60">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  )
}
