<template>
  <div class="task-list">
    <div class="border-b border-gray-200 p-4">
      <TaskFilter :filters="taskStore.filters" @filter-change="handleFilterChange" />
    </div>

    <div v-if="taskStore.loading" class="text-center py-12">
      <div class="spinner mb-2"></div>
      <p class="text-gray-500">Loading your tasks...</p>
    </div>

    <div v-else-if="!taskStore.tasks.length" class="text-center py-12">
      <div class="mb-4 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>
      <p class="text-gray-600 text-lg mb-2">No tasks found</p>
      <p class="text-gray-500">Create a new task to get started!</p>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <TaskItem
        v-for="task in taskStore.tasks"
        :key="task.id"
        :task="task"
        @toggle-complete="toggleComplete"
        @edit="editTask"
        @delete="confirmDelete"
        class="hover:bg-gray-50 transition-colors duration-150"
      />
    </div>

    <div v-if="totalPages > 1" class="bg-gray-50 px-4 py-3 border-t border-gray-200">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500">
          Showing
          <span class="font-medium">{{
            (currentPage - 1) * taskStore.pagination.perPage + 1
          }}</span>
          to
          <span class="font-medium">{{
            Math.min(currentPage * taskStore.pagination.perPage, taskStore.pagination.totalItems)
          }}</span>
          of <span class="font-medium">{{ taskStore.pagination.totalItems }}</span> tasks
        </div>

        <nav class="flex items-center space-x-1">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md border text-sm"
            :class="
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-700'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <div class="px-3 py-1 text-sm font-medium text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-md border text-sm"
            :class="
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-700'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="showDeleteModal = false"></div>
      <div class="bg-white p-6 rounded-lg shadow-xl z-10 max-w-md w-full mx-4">
        <div class="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-center mb-4">Delete Task?</h3>
        <p class="text-gray-600 text-center mb-6">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
        <div class="flex justify-center gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            @click="deleteTask"
            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-150"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'
import TaskItem from './TaskItem.vue'
import TaskFilter from './TaskFilter.vue'

const taskStore = useTaskStore()
const showDeleteModal = ref(false)
const taskToDelete = ref(null)

const currentPage = computed(() => taskStore.pagination.currentPage)
const totalPages = computed(() => taskStore.pagination.totalPages)

onMounted(() => {
  taskStore.fetchTasks()
})

const toggleComplete = async (taskId) => {
  try {
    await taskStore.toggleTaskCompletion(taskId)
  } catch (error) {
    console.error('Error toggling task completion:', error)
  }
}

const editTask = (taskId) => {
  emit('edit', taskId)
}

const confirmDelete = (taskId) => {
  taskToDelete.value = taskId
  showDeleteModal.value = true
}

const deleteTask = async () => {
  if (!taskToDelete.value) return

  try {
    await taskStore.deleteTask(taskToDelete.value)
    showDeleteModal.value = false
    taskToDelete.value = null
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

const handleFilterChange = (filter, value) => {
  taskStore.setFilter(filter, value)
}

const prevPage = () => {
  if (currentPage.value > 1) {
    taskStore.setPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    taskStore.setPage(currentPage.value + 1)
  }
}

const emit = defineEmits(['edit'])
</script>

<style scoped>
.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 3px solid #3498db;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
