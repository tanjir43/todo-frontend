import { defineStore } from 'pinia'
import authService from '../services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    loading: false,
    error: null,
  }),

  actions: {
    async register(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.register(credentials)
        authService.storeAuthData(response.data)
        this.user = response.data.user
        this.isAuthenticated = true
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null

      try {
        const response = await authService.login(credentials)
        authService.storeAuthData(response.data)
        this.user = response.data.user
        this.isAuthenticated = true
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true

      try {
        if (this.isAuthenticated) {
          await authService.logout()
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        authService.clearAuthData()
        this.user = null
        this.isAuthenticated = false
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.isAuthenticated) return

      this.loading = true

      try {
        const response = await authService.getUser()
        this.user = response.data
      } catch (error) {
        console.error('Fetch user error:', error)
        this.logout()
      } finally {
        this.loading = false
      }
    },

    initAuth() {
      this.user = authService.getCurrentUser()
      this.isAuthenticated = authService.isAuthenticated()

      if (this.isAuthenticated) {
        this.fetchUser()
      }
    },
  },
})
