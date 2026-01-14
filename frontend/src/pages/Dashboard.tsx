import { useEffect, useMemo, useState } from 'react'
import { StatsResponse } from '../types'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { getStats } from '../api/userApi'
import '../styles/dashboard.css'

const COLORS = ['#8B5CF6', '#10B981', '#ffbb28', '#ff8042', '#a66bff']

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])

  return isMobile
}

function truncateLabel(value: string, maxChars: number) {
  if (!value) return ''
  return value.length > maxChars ? `${value.slice(0, maxChars - 1)}…` : value
}

function CustomXAxisTick(props: any) {
  const { x, y, payload, isMobile, rotateDeg, maxChars } = props
  const raw = String(payload?.value ?? '')
  const label = truncateLabel(raw, maxChars)

  const rotate = rotateDeg !== 0

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor={rotate ? 'end' : 'middle'}
        transform={rotate ? `rotate(${rotateDeg})` : undefined}
        fontSize={isMobile ? 10 : 10}
        fill="#FFFFFF"
      >
        {label}
      </text>
    </g>
  )
}

function renderPieLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.65
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)

  const pct = Math.round((percent ?? 0) * 100)
  if (pct < 8) return null

  return (
    <text
      x={x}
      y={y}
      fill="#FFFFFF"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      style={{ pointerEvents: 'none' }}
    >
      {`${name} ${pct}%`}
    </text>
  )
}

function ChartLegend({ items }: { items: Array<{ label: string; color: string }> }) {
  return (
    <div className="chart-legend" aria-label="Legenda do gráfico">
      {items.map((it) => (
        <div className="chart-legend-item" key={it.label}>
          <span className="chart-legend-swatch" style={{ backgroundColor: it.color }} />
          <span className="chart-legend-label">{it.label}</span>
        </div>
      ))}
    </div>
  )
}

function computeXAxisLayout(count: number, isMobile: boolean) {
  // Quanto mais categorias, mais agressivo precisamos ser.
  // Objetivo: NÃO sobrepor. Tooltip cobre o nome completo.
  if (isMobile) {
    if (count <= 4) return { interval: 0 as const, rotateDeg: 0, maxChars: 14, xHeight: 38, bottom: 44 }
    if (count <= 6) return { interval: 0 as const, rotateDeg: -55, maxChars: 12, xHeight: 66, bottom: 72 }
    return { interval: 'preserveStartEnd' as const, rotateDeg: -55, maxChars: 11, xHeight: 66, bottom: 72 }
  }

  // Desktop
  if (count <= 6) return { interval: 0 as const, rotateDeg: -45, maxChars: 14, xHeight: 58, bottom: 64 }
  if (count <= 8) return { interval: 1 as const, rotateDeg: -55, maxChars: 12, xHeight: 70, bottom: 76 }
  return { interval: 2 as const, rotateDeg: -55, maxChars: 12, xHeight: 70, bottom: 76 }
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch((e) => {
        console.error(e)
        setError('Falha ao carregar estatísticas.')
      })
  }, [])

  const jobTitleData = useMemo(() => {
    const byJobTitle = stats?.byJobTitle ?? stats?.byRole ?? {}
    return Object.entries(byJobTitle)
      .map(([jobTitle, value]) => ({ jobTitle, value: Number(value) }))
      .sort((a, b) => b.value - a.value)
  }, [stats])

  const systemRoleData = useMemo(() => {
    const bySystemRole = stats?.bySystemRole ?? {}
    return Object.entries(bySystemRole)
      .map(([systemRole, value]) => ({ systemRole, value: Number(value) }))
      .sort((a, b) => b.value - a.value)
  }, [stats])

  const activeData = useMemo(() => {
    const active = Number(stats?.byActive?.active ?? 0)
    const inactive = Number(stats?.byActive?.inactive ?? 0)
    return [
      { status: 'Ativo', value: active },
      { status: 'Inativo', value: inactive },
    ]
  }, [stats])

  const totalAtivos = stats?.byActive?.active ?? 0
  const totalInativos = stats?.byActive?.inactive ?? 0
  const totalUsuarios = totalAtivos + totalInativos

  if (error) return <div className="card">{error}</div>
  if (!stats) return <div className="card">Carregando estatísticas…</div>

  const barChartHeight = isMobile ? 360 : 330
  const pieChartHeight = isMobile ? 340 : 320

  const shouldScrollJobTitle = isMobile && jobTitleData.length > 6
  const shouldScrollSystemRole = isMobile && systemRoleData.length > 6

  const jobTitleMinWidth = shouldScrollJobTitle ? Math.max(900, jobTitleData.length * 140) : undefined
  const systemRoleMinWidth = shouldScrollSystemRole ? Math.max(900, systemRoleData.length * 140) : undefined

  const jobAxis = computeXAxisLayout(jobTitleData.length, isMobile)
  const roleAxis = computeXAxisLayout(systemRoleData.length, isMobile)

  // Tooltip: fundo branco + texto preto
  const tooltipContentStyle = {
    backgroundColor: '#FFFFFF',
    border: '1px solid rgba(0,0,0,0.15)',
    borderRadius: 10,
    color: '#000000',
  } as const
  const tooltipLabelStyle = { color: '#000000', fontWeight: 700 } as const
  const tooltipItemStyle = { color: '#000000' } as const

  return (
    <div className="dashboard-grid">
      <div className="summary-card">
        <h2>Resumo</h2>
        <p>
          Total de usuários: <strong>{totalUsuarios}</strong>
        </p>
        <p>
          Total de usuários ativos: <strong>{totalAtivos}</strong>
        </p>
        <p>
          Total de usuários inativos: <strong>{totalInativos}</strong>
        </p>
      </div>

      <div className="chart-card">
        <h3>Usuários por Cargo</h3>

        <div style={{ width: '100%', overflowX: shouldScrollJobTitle ? 'auto' : 'hidden' }}>
          <div style={{ width: '100%', minWidth: jobTitleMinWidth }}>
            <div style={{ width: '100%', height: barChartHeight }}>
              <ResponsiveContainer>
                <BarChart
                  data={jobTitleData}
                  margin={{ top: 12, right: 14, left: 6, bottom: jobAxis.bottom }}
                  barCategoryGap={isMobile ? '20%' : '18%'}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="jobTitle"
                    interval={jobAxis.interval as any}
                    height={jobAxis.xHeight}
                    tick={(p) => (
                      <CustomXAxisTick
                        {...p}
                        isMobile={isMobile}
                        rotateDeg={jobAxis.rotateDeg}
                        maxChars={jobAxis.maxChars}
                      />
                    )}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis allowDecimals={false} width={isMobile ? 32 : 44} tick={{ fill: '#FFFFFF' }} />
                  <Tooltip
                    contentStyle={tooltipContentStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                    labelFormatter={(label) => `Cargo: ${label}`}
                    formatter={(value: any) => [value, 'Quantidade']}
                  />
                  <Bar
                    dataKey="value"
                    name="Cargos"
                    maxBarSize={isMobile ? 56 : 42}
                    barSize={isMobile ? 38 : undefined}
                    radius={[6, 6, 0, 0]}
                  >
                    {jobTitleData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <ChartLegend items={[{ label: 'Cargos', color: '#FFFFFF' }]} />
      </div>

      {!!systemRoleData.length && (
        <div className="chart-card">
          <h3>Usuários por Perfil (RBAC)</h3>

          <div style={{ width: '100%', overflowX: shouldScrollSystemRole ? 'auto' : 'hidden' }}>
            <div style={{ width: '100%', minWidth: systemRoleMinWidth }}>
              <div style={{ width: '100%', height: barChartHeight }}>
                <ResponsiveContainer>
                  <BarChart
                    data={systemRoleData}
                    margin={{ top: 12, right: 14, left: 6, bottom: roleAxis.bottom }}
                    barCategoryGap={isMobile ? '20%' : '18%'}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="systemRole"
                      interval={roleAxis.interval as any}
                      height={roleAxis.xHeight}
                      tick={(p) => (
                        <CustomXAxisTick
                          {...p}
                          isMobile={isMobile}
                          rotateDeg={roleAxis.rotateDeg}
                          maxChars={roleAxis.maxChars}
                        />
                      )}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis allowDecimals={false} width={isMobile ? 32 : 44} tick={{ fill: '#FFFFFF' }} />
                    <Tooltip
                      contentStyle={tooltipContentStyle}
                      labelStyle={tooltipLabelStyle}
                      itemStyle={tooltipItemStyle}
                      labelFormatter={(label) => `System Role: ${label}`}
                      formatter={(value: any) => [value, 'Quantidade']}
                    />
                    <Bar
                      dataKey="value"
                      name="System Role"
                      maxBarSize={isMobile ? 56 : 42}
                      barSize={isMobile ? 38 : undefined}
                      radius={[6, 6, 0, 0]}
                    >
                      {systemRoleData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <ChartLegend items={[{ label: 'System Roles', color: '#FFFFFF' }]} />
        </div>
      )}

      <div className="chart-card">
        <h3>Ativos vs Inativos</h3>

        <div style={{ width: '100%', height: pieChartHeight }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                data={activeData}
                nameKey="status"
                outerRadius={isMobile ? 120 : 105}
                labelLine={false}
                label={renderPieLabel}
              >
                {activeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip
                contentStyle={tooltipContentStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                formatter={(value: any, name: any) => [value, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ChartLegend
          items={[
            { label: 'Ativo', color: COLORS[0] },
            { label: 'Inativo', color: COLORS[1] },
          ]}
        />
      </div>
    </div>
  )
}
