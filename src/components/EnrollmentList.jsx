import { useEffect, useState } from 'react'

function EnrollmentList() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/enrollments`)
      if (!res.ok) throw new Error('No se pudieron cargar las inscripciones')
      const data = await res.json()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <p className="text-slate-300">Cargando inscripciones...</p>
  if (error) return <p className="text-red-400">{error}</p>

  return (
    <div className="space-y-3">
      {items.map(it => (
        <div key={it.id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">{it.student_name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded ${it.status === 'confirmed' ? 'bg-green-500/20 text-green-300' : it.status === 'cancelled' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{it.status}</span>
          </div>
          <p className="text-slate-300 text-sm mb-1">{it.email} • {it.phone || 'sin teléfono'}</p>
          <p className="text-slate-400 text-xs">Curso: {it.course_id}</p>
          {it.preferred_dates && <p className="text-slate-300 text-sm mt-2">Preferencias: {it.preferred_dates}</p>}
          {it.notes && <p className="text-slate-400 text-xs mt-1">Notas: {it.notes}</p>}
        </div>
      ))}
    </div>
  )
}

export default EnrollmentList
