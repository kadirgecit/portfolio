import axios from 'axios'

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in development
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api'
  }
  
  // Check if we're in the OpenHands environment
  if (typeof window !== 'undefined' && window.location.hostname.includes('all-hands.dev')) {
    return 'http://localhost:3001/api'
  }
  
  // Production environment - use relative path for Vercel
  return '/api'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export interface Project {
  id: string
  title: string
  description: string
  category: string
  status: string
  features: string[]
  technologies: string[]
  imageUrl?: string
  projectUrl?: string
  isPublic: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface ContactStats {
  total: number
  unread: number
  read: number
  replied: number
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),
  
  verify: () =>
    api.get<{ user: User }>('/auth/verify'),
}

// Projects API
export const projectsAPI = {
  getPublic: () =>
    api.get<Project[]>('/projects/public'),
  
  getAll: () =>
    api.get<Project[]>('/projects'),
  
  getById: (id: string) =>
    api.get<Project>(`/projects/${id}`),
  
  create: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Project>('/projects', data),
  
  update: (id: string, data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.put<Project>(`/projects/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/projects/${id}`),
}

// Contacts API
export const contactsAPI = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post('/contacts/submit', data),
  
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get<{
      contacts: Contact[]
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }>('/contacts', { params }),
  
  getById: (id: string) =>
    api.get<Contact>(`/contacts/${id}`),
  
  updateStatus: (id: string, status: Contact['status']) =>
    api.patch<Contact>(`/contacts/${id}/status`, { status }),
  
  delete: (id: string) =>
    api.delete(`/contacts/${id}`),
  
  getStats: () =>
    api.get<ContactStats>('/contacts/stats/overview'),
}

export default api