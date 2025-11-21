import { useState } from 'react'

function CourseForm({ onCreated }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    modality: '',
    duration_hours: '',
    price: '',
    seats: 8,
    is_published: true,
    tags: 'navegación,prácticas'
  })
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        duration_hours: form.duration_hours ? Number(form.duration_hours) : null,
        price: Number(form.price),
        seats: Number(form.seats),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      }
      const res = await fetch(`${baseUrl}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Error creando curso')
      const data = await res.json()
      onCreated && onCreated(data)
      setForm({ name: '', code: '', description: '', modality: '', duration_hours: '', price: '', seats: 8, is_published: true, tags: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <form onSubmit={submit} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="input" placeholder="Nombre (PER, PNB, Licencia)" value={form.name} onChange={e => update('name', e.target.value)} required />
        <input className="input" placeholder="Código (PER, PNB, LN)" value={form.code} onChange={e => update('code', e.target.value)} required />
        <input className="input" placeholder="Modalidad (Vela, Motor, Teoría)" value={form.modality} onChange={e => update('modality', e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input type="number" className="input" placeholder="Duración (h)" value={form.duration_hours} onChange={e => update('duration_hours', e.target.value)} />
        <input type="number" step="0.01" className="input" placeholder="Precio (€)" value={form.price} onChange={e => update('price', e.target.value)} required />
        <input type="number" className="input" placeholder="Plazas" value={form.seats} onChange={e => update('seats', e.target.value)} />
      </div>
      <textarea className="input h-24" placeholder="Descripción" value={form.description} onChange={e => update('description', e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <input className="input" placeholder="Etiquetas (coma)" value={form.tags} onChange={e => update('tags', e.target.value)} />
        <label className="text-sm text-slate-200 flex items-center gap-2">
          <input type="checkbox" checked={form.is_published} onChange={e => update('is_published', e.target.checked)} />
          Publicado
        </label>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button disabled={loading} className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg">{loading ? 'Guardando...' : 'Crear curso'}</button>
    </form>
  )
}

export default CourseForm
