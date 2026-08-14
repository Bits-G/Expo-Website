'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { uploadToCloudinary } from '@/lib/cloudinary'

export default function AdminGallery() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login')
      else setChecking(false)
    })
  }, [router])

  const loadImages = async () => {
    const { data } = await supabase.from('gallery').select('*').order('display_order', { ascending: true })
    setImages(data || [])
  }

  useEffect(() => {
    if (!checking) loadImages()
  }, [checking])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      await supabase.from('gallery').insert([{ image_url: url, caption }])
      setCaption('')
      await loadImages()
    } catch (err) {
      alert('Upload failed, try again.')
    }
    setUploading(false)
  }

  const deleteImage = async (id) => {
    if (!confirm('Delete this image?')) return
    await supabase.from('gallery').delete().eq('id', id)
    loadImages()
  }

  if (checking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <main className="min-h-screen bg-bg">
      <nav className="flex justify-between items-center px-6 py-4 bg-secondary text-white">
        <span className="font-heading font-bold">Gallery Manager</span>
        <a href="/admin/dashboard" className="text-sm underline">Back to Dashboard</a>
      </nav>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="font-heading font-semibold text-secondary mb-4">Upload New Image</h2>
          <input
            type="text" placeholder="Caption (optional)"
            className="w-full border p-3 rounded-lg mb-3"
            value={caption} onChange={e => setCaption(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
          {uploading && <p className="text-primary mt-2 text-sm">Uploading...</p>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative group">
              <img src={img.image_url} alt={img.caption || ''} className="rounded-xl aspect-square object-cover w-full" />
              <button
                onClick={() => deleteImage(img.id)}
                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
