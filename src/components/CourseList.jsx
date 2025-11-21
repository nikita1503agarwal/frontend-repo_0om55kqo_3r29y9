import { useEffect, useState } from 'react'

function CourseList() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/courses`)
      if (!res.ok) throw new Error('No se pudieron cargar los cursos')
      const data = await res.json()
      setCourses(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <p className="text-slate-300">Cargando cursos...</p>
  if (error) return <p className="text-red-400">{error}</p>

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {courses.map(c => (
        <div key={c.id} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold">{c.name} <span className="text-xs text-blue-300/80">({c.code})</span></h3>
            <span className={`text-xs px-2 py-0.5 rounded ${c.is_published ? 'bg-green-500/20 text-green-300' : 'bg-slate-600 text-slate-300'}`}>{c.is_published ? 'Publicado' : 'Borrador'}</span>
          </div>
          {c.description && <p className="text-slate-300 text-sm mb-2">{c.description}</p>}
          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            {c.modality && <span>Modalidad: <b className="text-white">{c.modality}</b></span>}
            {c.duration_hours != null && <span>Duración: <b className="text-white">{c.duration_hours} h</b></span>}
            <span>Precio: <b className="text-white">{c.price} €</b></span>
            {c.seats != null && <span>Plazas: <b className="text-white">{c.seats}</b></span>}
          </div>
          {c.tags && c.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {c.tags.map(t => <span key={t} className="text-xs bg-slate-700 text-slate-200 px-2 py-0.5 rounded">#{t}</span>)}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default CourseList
