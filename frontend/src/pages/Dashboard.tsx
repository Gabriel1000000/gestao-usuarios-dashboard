import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { StatsResponse } from '../types'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'

const COLORS = ['#2d6cdf', '#00c49f', '#ffbb28', '#ff8042', '#a66bff']

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null)

  useEffect(() => {
    api.get('/users/stats').then(r => setStats(r.data)).catch(console.error)
  }, [])

  if (!stats) return <div className="card">Carregando estatísticas…</div>

  const roleData = Object.entries(stats.byRole).map(([role, value]) => ({ role, value }))
  const activeData = Object.entries(stats.byActive).map(([k, v]) => ({ status: k, value: v as number }))

  return (
    <>
      <div className="card">
        <h2>Resumo</h2>
        <p>Total de usuários: <strong>{roleData.reduce((a, b) => a + b.value, 0)}</strong></p>
      </div>

      <div className="card">
        <h3>Usuários por Função</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Quantidade">
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3>Ativos vs Inativos</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={activeData} nameKey="status" outerRadius={100} label>
                {activeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}
