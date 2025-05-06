<template>
  <div class="tasks-page min-h-screen bg-gray-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Your Tasks</h1>
            <p class="text-gray-500 mt-1">Manage your tasks efficiently</p>
          </div>
          <button
            @click="showNewTaskForm = true"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center shadow-sm transition-all duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            New Task
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <h3 class="text-sm font-semibold text-gray-500 uppercase">Total Tasks</h3>
          <p class="text-2xl font-bold">{{ taskStore.tasks.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <h3 class="text-sm font-semibold text-gray-500 uppercase">Completed</h3>
          <p class="text-2xl font-bold">{{ taskStore.completedTasks.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-orange-500">
          <h3 class="text-sm font-semibold text-gray-500 uppercase">Pending</h3>
          <p class="text-2xl font-bold">{{ taskStore.incompleteTasks.length }}</p>
        </div>
      </div>

      <div v-if="showNewTaskForm" class="mb-6 animate-fadeIn">
        <div class="bg-white rounded-lg shadow-md border-l-4 border-green-500">
          <TaskForm @submit="handleTaskSubmit" @cancel="showNewTaskForm = false" />
        </div>
      </div>

      <div v-if="selectedTaskId !== null" class="mb-6 animate-fadeIn">
        <div class="bg-white rounded-lg shadow-md border-l-4 border-blue-500">
          <TaskForm
            :task-id="selectedTaskId"
            @submit="handleTaskSubmit"
            @cancel="selectedTaskId = null"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="border-b border-gray-200 px-6 py-4 bg-gray-50">
          <h2 class="text-lg font-semibold text-gray-800">Task List</h2>
        </div>
        <TaskList @edit="handleEditTask" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TaskList from '@/components/tasks/TaskList.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import { useTaskStore } from '@/stores/task'

const taskStore = useTaskStore()
const showNewTaskForm = ref(false)
const selectedTaskId = ref(null)

onMounted(() => {
  taskStore.fetchTasks()
})

const handleTaskSubmit = () => {
  showNewTaskForm.value = false
  selectedTaskId.value = null
}

const handleEditTask = (taskId) => {
  selectedTaskId.value = taskId
  showNewTaskForm.value = false
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
