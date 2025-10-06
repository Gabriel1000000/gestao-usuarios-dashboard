import { Link, NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import UsersList from './pages/UsersList'
import UserForm from './pages/UserForm'

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="logo">Users Dashboard</Link>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/users">Usuários</NavLink>
          <NavLink to="/users/new">Novo</NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id" element={<UserForm />} />
        </Routes>
      </main>
    </div>
  )
}
