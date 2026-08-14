'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { UploadCloud, ImageIcon, Trash2, ArrowLeft, X, CheckCircle2, Loader2 } from 'lucide-react'

export default function AdminGallery() {
  const router = useRouter()
  const fileInputRef = useRef(null)

  const [checking, setChecking] = useState(true)
  const [images, setImages] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login')
      else setChecking(false)
    })
  }, [router])

  const loadImages = async () => {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    setImages(data || [])
  }

  useEffect(() => {
    if (!checking) loadImages()
  }, [checking])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const pickFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleFileSelect = (e) => pickFile(e.target.files[0])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    pickFile(e.dataTransfer.files[0])
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setCaption('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    try {
      const url = await uploadToCloudinary(selectedFile)
      const { error } = await supabase.from('gallery').insert([{ image_url: url, caption }])
      if (error) throw error
      clearSelection()
      await loadImages()
      showToast('Image uploaded — now live in the Gallery section.')
    } catch (err) {
      showToast('Upload failed, please try again.')
    }
    setUploading(false)
  }

  const deleteImage = async (id) => {
    if (!confirm('Delete this image?')) return
    await supabase.from('gallery').delete().eq('id', id)
    loadImages()
    showToast('Image removed.')
  }

  if (checking) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <main className="min-h-screen bg-bg">
      <nav className="flex justify-between items-center px-6 py-4 bg-secondary text-white">
        <div className="flex items-center gap-3">
          <a href="/admin/dashboard" className="hover:opacity-80">
            <ArrowLeft size={20} />
          </a>
          <span className="font-heading font-bold">Gallery Manager</span>
        </div>
        <span className="text-xs text-gray-300">{images.length} photo{images.length !== 1 ? 's' : ''}</span>
      </nav>

      <div className="p-6 max-w-5xl mx-auto">
        {/* UPLOAD CARD */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-10">
          <h2 className="font-heading font-semibold text-secondary mb-5 flex items-center gap-2 text-lg">
            <ImageIcon size={20} className="text-primary" /> Upload New Image
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="fileInput"
          />

          {!selectedFile ? (
            <label
              htmlFor="fileInput"
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-12 cursor-pointer text-center transition ${
                dragActive ? 'border-primary bg-primary/10' : 'border-primary/30 hover:bg-primary/5'
              }`}
            >
              <UploadCloud size={32} className="text-primary" />
              <p className="font-semibold text-secondary">Drag & drop an image here</p>
              <p className="text-sm text-gray-400">or click to browse — JPG, PNG, WEBP</p>
            </label>
          ) : (
            <div className="grid md:grid-cols-[220px_1fr] gap-6 items-start">
              <div className="relative">
                <img src={previewUrl} alt="preview" className="w-full aspect-square object-cover rounded-xl border" />
                <button
                  onClick={clearSelection}
                  className="absolute -top-2 -right-2 bg-secondary text-white rounded-full p-1.5 shadow hover:bg-red-600 transition"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-secondary truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary block mb-1">Caption (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Inauguration ceremony, Day 1"
                    className="w-full border p-3 rounded-lg"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    onClick={clearSelection}
                    disabled={uploading}
                    className="px-5 py-3 rounded-lg font-semibold text-secondary border hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* GRID */}
        <h3 className="font-heading font-semibold text-secondary mb-4">All Images</h3>
        {images.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400">
            <ImageIcon size={32} className="mx-auto mb-2 opacity-40" />
            No images uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map(img => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden">
                <img src={img.image_url} alt={img.caption || ''} className="aspect-square object-cover w-full" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex flex-col justify-between p-2">
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="self-end bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                  {img.caption && (
                    <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition truncate">{img.caption}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-secondary text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm z-50">
          <CheckCircle2 size={16} className="text-accent" /> {toast}
        </div>
      )}
    </main>
  )
}
