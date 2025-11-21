import { useState, useEffect } from 'react'

function EnrollmentForm({ onCreated }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState({
    course_id: '',
    student_name: '',
    email: '',
    phone: '',
    preferred_dates: '',
    status: 'pending',
    notes: ''
  })
  const [error, setError] = useState('')

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/courses`)
      const data = await res.json()
      setCourses(data)
      if (data.length > 0) setForm(prev => ({ ...prev, course_id: data[0].id }))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => { fetchCourses() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { ...form }
      const res = await fetch(`${baseUrl}/api/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Error creando inscripción')
      const data = await res.json()
      onCreated && onCreated(data)
      setForm({ course_id: courses[0]?.id || '', student_name: '', email: '', phone: '', preferred_dates: '', status: 'pending', notes: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <form onSubmit={submit} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select className="input" value={form.course_id} onChange={e => update('course_id', e.target.value)}>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
        </select>
        <input className="input" placeholder="Nombre del alumno" value={form.student_name} onChange={e => update('student_name', e.target.value)} required />
        <input type="email" className="input" placeholder="Email" value={form.email} onChange={e => update('email', e.target.value)} required />
        <input className="input" placeholder="Teléfono" value={form.phone} onChange={e => update('phone', e.target.value)} />
      </div>
      <textarea className="input h-24" placeholder="Fechas preferidas / notas" value={form.preferred_dates} onChange={e => update('preferred_dates', e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <select className="input" value={form.status} onChange={e => update('status', e.target.value)}>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmada</option>
          <option value="cancelled">Cancelada</option>
        </select>
        <input className="input" placeholder="Notas internas" value={form.notes} onChange={e => update('notes', e.target.value)} />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button disabled={loading} className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg">{loading ? 'Guardando...' : 'Crear inscripción'}</button>
    </form>
  )
}

export default EnrollmentForm
