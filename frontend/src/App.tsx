import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import UsersList from './pages/UsersList'
import UserForm from './pages/UserForm'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <div className="app">
      <NavBar />
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
