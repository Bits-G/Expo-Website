'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  Users, Building2, Mail, Images, LogOut, LayoutDashboard,
  Handshake, Settings, ChevronLeft, ChevronRight, Menu
} from 'lucide-react'

const LEAD_TABS = [
  { key: 'visitors', label: 'Visitors', icon: Users },
  { key: 'exhibitor_inquiries', label: 'Exhibitor Inquiries', icon: Building2 },
  { key: 'contact_messages', label: 'Contact Messages', icon: Mail },
]

const SIDEBAR_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard, type: 'section' },
  { key: 'leads', label: 'Leads', icon: Users, type: 'section' },
  { key: 'gallery', label: 'Gallery Manager', icon: Images, type: 'link', href: '/admin/gallery' },
  { key: 'sponsors', label: 'Sponsors', icon: Handshake, type: 'soon' },
  { key: 'settings', label: 'Settings', icon: Settings, type: 'soon' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [section, setSection] = useState('overview')
  const [activeTab, setActiveTab] = useState('visitors')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [counts, setCounts] = useState({ visitors: 0, exhibitor_inquiries: 0, contact_messages: 0, gallery: 0 })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login')
      else setChecking(false)
    })
  }, [router])

  // Overview counts
  useEffect(() => {
    if (checking || section !== 'overview') return
    const loadCounts = async () => {
      const tables = ['visitors', 'exhibitor_inquiries', 'contact_messages', 'gallery']
      const results = await Promise.all(
        tables.map(t => supabase.from(t).select('*', { count: 'exact', head: true }))
      )
      setCounts({
        visitors: results[0].count || 0,
        exhibitor_inquiries: results[1].count || 0,
        contact_messages: results[2].count || 0,
        gallery: results[3].count || 0,
      })
    }
    loadCounts()
  }, [checking, section])

  // Leads table data
  useEffect(() => {
    if (checking || section !== 'leads') return
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
  }, [activeTab, checking, section])

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

  const STAT_CARDS = [
    { label: 'Visitors', value: counts.visitors, icon: Users, color: 'bg-primary' },
    { label: 'Exhibitor Inquiries', value: counts.exhibitor_inquiries, icon: Building2, color: 'bg-secondary' },
    { label: 'Contact Messages', value: counts.contact_messages, icon: Mail, color: 'bg-accent' },
    { label: 'Gallery Images', value: counts.gallery, icon: Images, color: 'bg-success' },
  ]

  return (
    <div className="min-h-screen bg-bg flex">
      {/* SIDEBAR */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-secondary text-white flex flex-col shrink-0 transition-all duration-300`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {!collapsed && (
            <div>
              <p className="font-heading font-bold text-lg leading-tight">Admin Panel</p>
              <p className="text-xs text-gray-300">Business Expo 2026</p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition ml-auto"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {SIDEBAR_ITEMS.map(item => {
            const Icon = item.icon

            if (item.type === 'link') {
              return (
                <a
                  key={item.key}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-200 hover:bg-white/10 transition"
                  title={collapsed ? item.label : ''}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </a>
              )
            }

            if (item.type === 'soon') {
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-500 cursor-not-allowed"
                  title={collapsed ? `${item.label} — coming soon` : ''}
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <span className="flex-1 flex items-center justify-between">
                      {item.label}
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">Soon</span>
                    </span>
                  )}
                </div>
              )
            }

            return (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  section === item.key ? 'bg-primary text-white' : 'text-gray-200 hover:bg-white/10'
                }`}
                title={collapsed ? item.label : ''}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-5 py-4 border-t border-white/10 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition"
        >
          <LogOut size={18} className="shrink-0" /> {!collapsed && 'Logout'}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-8 overflow-x-auto">
        {section === 'overview' && (
          <>
            <h1 className="text-2xl font-heading font-bold text-secondary mb-1">Overview</h1>
            <p className="text-gray-500 mb-6 text-sm">Quick snapshot of everything happening on your site.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {STAT_CARDS.map(card => {
                const Icon = card.icon
                return (
                  <div key={card.label} className="bg-white rounded-2xl shadow-sm p-5">
                    <div className={`${card.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3`}>
                      <Icon size={18} />
                    </div>
                    <p className="text-3xl font-bold text-secondary">{card.value}</p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                  </div>
                )
              })}
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-heading font-semibold text-secondary mb-2">Quick Actions</h2>
              <div className="flex flex-wrap gap-3 mt-3">
                <button onClick={() => setSection('leads')} className="px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:brightness-110 transition">
                  View Leads
                </button>
                <a href="/admin/gallery" className="px-5 py-2.5 rounded-full bg-secondary text-white text-sm font-semibold hover:brightness-125 transition">
                  Manage Gallery
                </a>
              </div>
            </div>
          </>
        )}

        {section === 'leads' && (
          <>
            <h1 className="text-2xl font-heading font-bold text-secondary mb-6">Leads</h1>
            <div className="flex gap-3 mb-6 flex-wrap">
              {LEAD_TABS.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition ${
                      activeTab === tab.key ? 'bg-primary text-white' : 'bg-white text-secondary border'
                    }`}
                  >
                    <Icon size={16} /> {tab.label}
                  </button>
                )
              })}
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
          </>
        )}
      </main>
    </div>
  )
}
