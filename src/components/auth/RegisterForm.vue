<template>
  <div class="register-form">
    <h2 class="text-2xl font-bold mb-4">Register</h2>

    <div
      v-if="errorMessage"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label for="name" class="block text-gray-700 mb-2">Name</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label for="email" class="block text-gray-700 mb-2">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label for="password" class="block text-gray-700 mb-2">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="mb-4">
        <label for="password_confirmation" class="block text-gray-700 mb-2">Confirm Password</label>
        <input
          id="password_confirmation"
          v-model="form.password_confirmation"
          type="password"
          class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div class="flex justify-between items-center">
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? 'Registering...' : 'Register' }}
        </button>

        <router-link to="/login" class="text-blue-500 hover:underline">
          Already have an account? Login
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errorMessage = computed(() => authStore.error)

const handleRegister = async () => {
  try {
    await authStore.register(form.value)
    router.push('/tasks')
  } catch (error) {
    console.error('Registration error:', error)
  }
}
</script>
