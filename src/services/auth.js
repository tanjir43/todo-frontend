import api from './api'

export default {
  register(credentials) {
    return api.post('/register', credentials)
  },

  login(credentials) {
    return api.post('/login', credentials)
  },

  logout() {
    return api.post('/logout')
  },

  getUser() {
    return api.get('/user')
  },

  storeAuthData(data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  },

  clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}
