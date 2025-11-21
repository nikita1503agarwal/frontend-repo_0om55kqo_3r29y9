import { useState } from 'react'

function AdminHeader({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'courses', label: 'Cursos' },
    { key: 'enrollments', label: 'Inscripciones' },
  ]

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-slate-900/70 border-b border-slate-700/40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
            <span className="text-blue-300 font-bold">⛵</span>
          </div>
          <div>
            <h1 className="text-white font-semibold leading-tight">Administración Escuela Náutica</h1>
            <p className="text-xs text-blue-300/70">Gestión de cursos y reservas</p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`${activeTab === tab.key ? 'bg-blue-500 text-white' : 'bg-slate-800/60 text-slate-200 hover:bg-slate-700/60'} px-3 py-1.5 rounded-md text-sm border border-slate-700/60 transition`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default AdminHeader
