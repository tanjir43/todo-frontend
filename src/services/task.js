import api from './api'

export default {
  getTasks(filters = {}) {
    const processedFilters = { ...filters }

    if (processedFilters.completed !== undefined && processedFilters.completed !== null) {
      if (typeof processedFilters.completed === 'string') {
        processedFilters.completed = processedFilters.completed === 'true'
      }
    }

    return api.get('/tasks', { params: processedFilters })
  },

  getTask(id) {
    return api.get(`/tasks/${id}`)
  },

  createTask(task) {
    return api.post('/tasks', task)
  },

  updateTask(id, task) {
    return api.put(`/tasks/${id}`, task)
  },

  toggleTaskCompletion(id) {
    return api.patch(`/tasks/${id}/toggle-complete`)
  },

  deleteTask(id) {
    return api.delete(`/tasks/${id}`)
  },
}
