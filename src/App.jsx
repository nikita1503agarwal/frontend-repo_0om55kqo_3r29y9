import { useEffect, useState } from 'react'
import AdminHeader from './components/AdminHeader'
import CourseForm from './components/CourseForm'
import CourseList from './components/CourseList'
import EnrollmentForm from './components/EnrollmentForm'
import EnrollmentList from './components/EnrollmentList'

function App() {
  const [activeTab, setActiveTab] = useState('courses')

  // Seed default courses hint (optional UX helper)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [seeded, setSeeded] = useState(false)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/courses`)
        const data = await res.json()
        if (Array.isArray(data) && data.length === 0 && !seeded) {
          setSeeded(true)
          const defaults = [
            { name: 'Licencia de Navegación', code: 'LN', description: 'Curso básico para iniciación.', modality: 'Motor', duration_hours: 6, price: 120, seats: 8, is_published: true, tags: ['básico','licencia'] },
            { name: 'PNB', code: 'PNB', description: 'Patrón de Navegación Básica.', modality: 'Teoría + Prácticas', duration_hours: 12, price: 280, seats: 8, is_published: true, tags: ['pnb','básico'] },
            { name: 'PER', code: 'PER', description: 'Patrón de Embarcaciones de Recreo.', modality: 'Teoría + Vela/Motor', duration_hours: 24, price: 550, seats: 10, is_published: true, tags: ['per','avanzado'] },
            { name: 'Prácticas a vela', code: 'VELA', description: 'Prácticas específicas de navegación a vela.', modality: 'Vela', duration_hours: 16, price: 220, seats: 6, is_published: true, tags: ['vela','prácticas'] },
            { name: 'Prácticas a motor', code: 'MOTOR', description: 'Prácticas de maniobra y navegación a motor.', modality: 'Motor', duration_hours: 8, price: 180, seats: 6, is_published: true, tags: ['motor','prácticas'] },
          ]
          await Promise.all(defaults.map(d => fetch(`${baseUrl}/api/courses`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d)
          })))
        }
      } catch (e) {}
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {activeTab === 'courses' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-white text-xl font-semibold mb-2">Crear nuevo curso</h2>
              <p className="text-slate-300 text-sm">Añade cursos como Licencia de Navegación, PNB, PER o prácticas de vela y motor.</p>
            </div>
            <CourseForm onCreated={() => {}} />
            <div>
              <h2 className="text-white text-xl font-semibold mb-2">Cursos existentes</h2>
              <CourseList />
            </div>
          </section>
        )}

        {activeTab === 'enrollments' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-white text-xl font-semibold mb-2">Crear nueva inscripción</h2>
              <p className="text-slate-300 text-sm">Registra alumnos y gestiona su estado.</p>
            </div>
            <EnrollmentForm onCreated={() => {}} />
            <div>
              <h2 className="text-white text-xl font-semibold mb-2">Inscripciones recientes</h2>
              <EnrollmentList />
            </div>
          </section>
        )}
      </main>

      <style>{`
        .input { @apply w-full bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40; }
      `}</style>
    </div>
  )
}

export default App
