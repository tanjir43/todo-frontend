<template>
  <div class="task-form p-6 bg-white border rounded-lg shadow-sm">
    <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Task' : 'Create New Task' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="title" class="block text-gray-700 mb-2">Title *</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.title }"
          required
        />
        <p v-if="errors.title" class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
      </div>

      <div class="mb-4">
        <label for="description" class="block text-gray-700 mb-2">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': errors.description }"
        ></textarea>
        <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
      </div>

      <div class="mb-4">
        <label class="flex items-center">
          <input v-model="form.completed" type="checkbox" class="mr-2" />
          <span>Mark as completed</span>
        </label>
      </div>

      <div class="flex justify-end space-x-2">
        <button type="button" @click="$emit('cancel')" class="px-4 py-2 border rounded-lg">
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          :disabled="loading"
        >
          {{
            loading
              ? isEditing
                ? 'Updating...'
                : 'Creating...'
              : isEditing
                ? 'Update Task'
                : 'Create Task'
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/task'

const props = defineProps({
  taskId: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['submit', 'cancel'])
const taskStore = useTaskStore()

const loading = ref(false)
const errors = ref({})

const form = ref({
  title: '',
  description: '',
  completed: false,
})

const isEditing = computed(() => !!props.taskId)

onMounted(async () => {
  if (isEditing.value) {
    loading.value = true
    try {
      let task = taskStore.taskById(props.taskId)

      if (!task) {
        await taskStore.fetchTask(props.taskId)
        task = taskStore.currentTask
      }

      if (task) {
        form.value = {
          title: task.title,
          description: task.description || '',
          completed: task.completed,
        }
      }
    } catch (error) {
      console.error('Error loading task:', error)
    } finally {
      loading.value = false
    }
  }
})

const validate = () => {
  const newErrors = {}

  if (!form.value.title.trim()) {
    newErrors.title = 'Title is required'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  loading.value = true

  try {
    if (isEditing.value) {
      await taskStore.updateTask(props.taskId, form.value)
    } else {
      await taskStore.createTask(form.value)
    }

    emit('submit')
  } catch (error) {
    console.error('Error submitting form:', error)

    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    }
  } finally {
    loading.value = false
  }
}
</script>
