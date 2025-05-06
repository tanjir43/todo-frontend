<template>
  <div class="app min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold text-blue-600"> Todo App </router-link>

        <nav>
          <div v-if="authStore.isAuthenticated" class="flex items-center space-x-4">
            <span class="text-gray-600">Hello, {{ authStore.user?.name }}</span>
            <router-link to="/tasks" class="text-blue-500 hover:text-blue-700"> Tasks </router-link>
            <button @click="logout" class="text-red-500 hover:text-red-700">Logout</button>
          </div>
          <div v-else class="space-x-4">
            <router-link to="/login" class="text-blue-500 hover:text-blue-700"> Login </router-link>
            <router-link to="/register" class="text-blue-500 hover:text-blue-700">
              Register
            </router-link>
          </div>
        </nav>
      </div>
    </header>

    <main class="flex-grow">
      <router-view />
    </main>

    <footer class="bg-white py-6 mt-12">
      <div class="max-w-6xl mx-auto px-4 text-center text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} Todo App</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
