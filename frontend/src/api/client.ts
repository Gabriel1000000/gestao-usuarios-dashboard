import axios from 'axios'

// usa same-origin; o Nginx do frontend fará o proxy para o backend
const baseURL = '/api'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

