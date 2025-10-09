import { useEffect, useState } from 'react'
import { StatsResponse } from '../types'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { getStats } from '../api/userApi'
import '../styles/dashboard.css'

const COLORS = ['#8B5CF6', '#10B981', '#ffbb28', '#ff8042', '#a66bff']

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getStats().then(setStats).catch((e) => {
        console.error(e)
        setError('Falha ao carregar estatísticas.')
      })
  }, [])

  if (error) return <div className="card">{error}</div>
  if (!stats) return <div className="card">Carregando estatísticas…</div>

  const roleData = Object.entries(stats.byRole).map(([role, value]) => ({ role, value }))
  const activeData = Object.entries(stats.byActive).map(([k, v]) => ({ status: k, value: v as number }))

  const totalAtivos = stats.byActive.active || 0
  const totalInativos = stats.byActive.inactive || 0
  const totalUsuarios = totalAtivos + totalInativos

  return (
    <div className="dashboard-grid">
      <div className="summary-card">
        <h2>Resumo</h2>
        <p>Total de usuários: <strong>{totalUsuarios}</strong></p>
        <p>Total de usuários ativos: <strong>{totalAtivos}</strong></p>
        <p>Total de usuários inativos: <strong>{totalInativos}</strong></p>
      </div>

      <div className="chart-card">
        <h3>Usuários por Função</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend/>
              <Bar dataKey="value" name="Quantidade">
                {roleData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Ativos vs Inativos</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={activeData} nameKey="status" outerRadius={100} label>
                {activeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
