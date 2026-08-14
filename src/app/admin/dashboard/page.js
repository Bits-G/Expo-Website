'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const TABS = [
  { key: 'visitors', label: 'Visitors' },
  { key: 'exhibitor_inquiries', label: 'Exhibitor Inquiries' },
  { key: 'contact_messages', label: 'Contact Messages' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [activeTab, setActiveTab] = useState('visitors')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  // Check login on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/admin/login')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  // Fetch rows for active tab
  useEffect(() => {
    if (checking) return
    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from(activeTab)
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setRows(data)
      setLoading(false)
    }
    fetchData()
  }, [activeTab, checking])

  const updateStatus = async (id, status) => {
    await supabase.from('exhibitor_inquiries').update({ status }).eq('id', id)
    setRows(rows.map(r => r.id === id ? { ...r, status } : r))
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (checking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  const columns = rows.length > 0 ? Object.keys(rows[0]).filter(c => c !== 'id') : []

  return (
    <main className="min-h-screen bg-bg">
      <nav className="flex justify-between items-center px-6 py-4 bg-secondary text-white">
        <span className="font-heading font-bold">Admin Dashboard</span>
        <button onClick={logout} className="bg-primary px-4 py-2 rounded-full text-sm font-semibold">Logout</button>
      </nav>

      <div className="p-6">
        <div className="flex gap-3 mb-6 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full font-semibold text-sm ${
                activeTab === tab.key ? 'bg-primary text-white' : 'bg-white text-secondary border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          {loading ? (
            <p className="p-6 text-gray-500">Loading...</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-gray-500">No entries yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-secondary text-white">
                <tr>
                  {columns.map(col => (
                    <th key={col} className="text-left px-4 py-3 whitespace-nowrap capitalize">{col.replace('_', ' ')}</th>
                  ))}
                  {activeTab === 'exhibitor_inquiries' && <th className="px-4 py-3">Action</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.id} className="border-b last:border-0">
                    {columns.map(col => (
                      <td key={col} className="px-4 py-3 whitespace-nowrap">
                        {col === 'created_at' ? new Date(row[col]).toLocaleString() : String(row[col] ?? '-')}
                      </td>
                    ))}
                    {activeTab === 'exhibitor_inquiries' && (
                      <td className="px-4 py-3">
                        <select
                          value={row.status || 'New'}
                          onChange={e => updateStatus(row.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option>New</option>
                          <option>Contacted</option>
                          <option>Confirmed</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}
