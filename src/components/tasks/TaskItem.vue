<template>
  <div class="task-item p-4" :class="{ 'bg-green-50': task.completed }">
    <div class="flex items-start gap-4">
      <div class="pt-1">
        <div
          @click="$emit('toggle-complete', task.id)"
          class="cursor-pointer w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
          :class="
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-blue-500'
          "
        >
          <svg
            v-if="task.completed"
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <div>
            <h3
              class="text-lg font-medium transition-all duration-200"
              :class="task.completed ? 'line-through text-gray-500' : 'text-gray-800'"
            >
              {{ task.title }}
            </h3>

            <p
              v-if="task.description"
              class="mt-1 transition-all duration-200"
              :class="task.completed ? 'text-gray-400' : 'text-gray-600'"
            >
              {{ task.description }}
            </p>

            <div class="mt-3 flex items-center gap-3 text-xs">
              <span
                class="px-2 py-1 rounded-full capitalize"
                :class="
                  task.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                "
              >
                {{ task.completed ? 'Completed' : 'Active' }}
              </span>

              <span class="text-gray-500 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {{ formatDate(task.created_at) }}
              </span>
            </div>
          </div>

          <div class="flex space-x-2 ml-4">
            <button
              @click="$emit('edit', task.id)"
              class="p-2 rounded-full hover:bg-gray-100 text-blue-500 transition-colors duration-150"
              title="Edit task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>

            <button
              @click="$emit('delete', task.id)"
              class="p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors duration-150"
              title="Delete task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle-complete', 'edit', 'delete'])

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
</script>
