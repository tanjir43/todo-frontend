import { defineStore } from 'pinia'
import taskService from '../services/task'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    currentTask: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      perPage: 10,
    },
    filters: {
      search: '',
      completed: null,
      sort_by: 'created_at',
      sort_direction: 'desc',
    },
    loading: false,
    error: null,
  }),

  getters: {
    taskById: (state) => (id) => {
      return state.tasks.find((task) => task.id === id)
    },

    completedTasks: (state) => {
      return state.tasks.filter((task) => task.completed)
    },

    incompleteTasks: (state) => {
      return state.tasks.filter((task) => !task.completed)
    },
  },

  actions: {
    async fetchTasks() {
      this.loading = true
      this.error = null

      try {
        const params = {
          ...this.filters,
          page: this.pagination.currentPage,
          per_page: this.pagination.perPage,
        }

        if (params.completed === 'true') {
          params.completed = true
        } else if (params.completed === 'false') {
          params.completed = false
        }

        const response = await taskService.getTasks(params)
        this.tasks = response.data.data

        this.pagination.currentPage = response.data.meta.current_page
        this.pagination.totalPages = response.data.meta.last_page
        this.pagination.totalItems = response.data.meta.total

        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch tasks'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchTask(id) {
      this.loading = true
      this.error = null

      try {
        const response = await taskService.getTask(id)
        this.currentTask = response.data.data
        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch task'
        throw error
      } finally {
        this.loading = false
      }
    },

    async createTask(task) {
      this.loading = true
      this.error = null

      try {
        const response = await taskService.createTask(task)

        await this.fetchTasks()

        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create task'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTask(id, task) {
      this.loading = true
      this.error = null

      try {
        const response = await taskService.updateTask(id, task)

        const index = this.tasks.findIndex((t) => t.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data.data
        }

        if (this.currentTask && this.currentTask.id === id) {
          this.currentTask = response.data.data
        }

        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update task'
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleTaskCompletion(id) {
      this.loading = true
      this.error = null

      try {
        const response = await taskService.toggleTaskCompletion(id)

        const index = this.tasks.findIndex((t) => t.id === id)
        if (index !== -1) {
          this.tasks[index] = response.data.data
        }

        if (this.currentTask && this.currentTask.id === id) {
          this.currentTask = response.data.data
        }

        return response
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to toggle task completion'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTask(id) {
      this.loading = true
      this.error = null

      try {
        await taskService.deleteTask(id)

        this.tasks = this.tasks.filter((task) => task.id !== id)

        if (this.currentTask && this.currentTask.id === id) {
          this.currentTask = null
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete task'
        throw error
      } finally {
        this.loading = false
      }
    },

    setFilter(filter, value) {
      if (filter === 'completed') {
        if (value === 'true') {
          this.filters[filter] = true
        } else if (value === 'false') {
          this.filters[filter] = false
        } else {
          this.filters[filter] = value
        }
      } else {
        this.filters[filter] = value
      }

      this.pagination.currentPage = 1
      this.fetchTasks()
    },

    setPage(page) {
      this.pagination.currentPage = page
      this.fetchTasks()
    },
  },
})
