<template>
  <div class="task-filter">
    <div class="md:hidden">
      <button
        @click="isFilterOpen = !isFilterOpen"
        class="flex items-center justify-between w-full px-4 py-2 bg-gray-50 border rounded-md text-left"
      >
        <span class="font-medium">Filters & Sorting</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 transition-transform duration-200"
          :class="isFilterOpen ? 'transform rotate-180' : ''"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <div v-if="isFilterOpen" class="mt-2 space-y-3 p-2 border rounded-md">
        <div>
          <label for="mobile-search" class="block text-sm font-medium text-gray-700 mb-1"
            >Search</label
          >
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <input
              id="mobile-search"
              v-model="searchValue"
              type="text"
              placeholder="Search tasks..."
              class="pl-10 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @input="debounceSearch"
            />
          </div>
        </div>

        <div>
          <label for="mobile-statusFilter" class="block text-sm font-medium text-gray-700 mb-1"
            >Status</label
          >
          <select
            id="mobile-statusFilter"
            v-model="statusValue"
            class="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="handleStatusChange"
          >
            <option :value="null">All Tasks</option>
            <option :value="true">Completed</option>
            <option :value="false">Incomplete</option>
          </select>
        </div>

        <div>
          <label for="mobile-sortBy" class="block text-sm font-medium text-gray-700 mb-1"
            >Sort By</label
          >
          <div class="flex space-x-2">
            <select
              id="mobile-sortBy"
              v-model="sortByValue"
              class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="handleSortChange"
            >
              <option value="created_at">Date Created</option>
              <option value="updated_at">Date Updated</option>
              <option value="title">Title</option>
            </select>

            <select
              id="mobile-sortDirection"
              v-model="sortDirectionValue"
              class="w-24 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="handleSortDirectionChange"
            >
              <option value="desc">↓ Desc</option>
              <option value="asc">↑ Asc</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden md:flex md:flex-wrap md:items-end md:gap-4">
      <div class="w-60">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            id="search"
            v-model="searchValue"
            type="text"
            placeholder="Search tasks..."
            class="pl-10 px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="debounceSearch"
          />
        </div>
      </div>

      <div class="w-40">
        <label for="statusFilter" class="block text-sm font-medium text-gray-700 mb-1"
          >Status</label
        >
        <select
          id="statusFilter"
          v-model="statusValue"
          class="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="handleStatusChange"
        >
          <option :value="null">All Tasks</option>
          <option :value="true">Completed</option>
          <option :value="false">Incomplete</option>
        </select>
      </div>

      <div class="w-40">
        <label for="sortBy" class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
        <select
          id="sortBy"
          v-model="sortByValue"
          class="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="handleSortChange"
        >
          <option value="created_at">Date Created</option>
          <option value="updated_at">Date Updated</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div class="w-24">
        <label for="sortDirection" class="block text-sm font-medium text-gray-700 mb-1"
          >Order</label
        >
        <select
          id="sortDirection"
          v-model="sortDirectionValue"
          class="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          @change="handleSortDirectionChange"
        >
          <option value="desc">↓ Desc</option>
          <option value="asc">↑ Asc</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['filter-change'])

const searchValue = ref('')
const statusValue = ref(null)
const sortByValue = ref('created_at')
const sortDirectionValue = ref('desc')
const isFilterOpen = ref(false)
let searchTimeout = null

onMounted(() => {
  searchValue.value = props.filters.search || ''

  if (props.filters.completed === true) {
    statusValue.value = true
  } else if (props.filters.completed === false) {
    statusValue.value = false
  } else {
    statusValue.value = null
  }

  sortByValue.value = props.filters.sort_by || 'created_at'
  sortDirectionValue.value = props.filters.sort_direction || 'desc'
})

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('filter-change', 'search', searchValue.value)
  }, 300)
}

const handleStatusChange = () => {
  emit('filter-change', 'completed', statusValue.value)
}

const handleSortChange = () => {
  emit('filter-change', 'sort_by', sortByValue.value)
}

const handleSortDirectionChange = () => {
  emit('filter-change', 'sort_direction', sortDirectionValue.value)
}
</script>
