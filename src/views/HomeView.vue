<template>
  <div class="home">
    <div class="hero bg-blue-100 py-16 px-4 text-center">
      <h1 class="text-4xl font-bold mb-4">Task Management Application</h1>
      <p class="text-xl mb-8">A simple and efficient way to manage your daily tasks.</p>

      <div v-if="!authStore.isAuthenticated">
        <router-link
          to="/login"
          class="inline-block mx-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Login
        </router-link>
        <router-link
          to="/register"
          class="inline-block mx-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
        >
          Register
        </router-link>
      </div>
      <div v-else>
        <router-link
          to="/tasks"
          class="inline-block mx-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
        >
          Go to Tasks
        </router-link>
      </div>
    </div>

    <div class="features py-12 px-4 max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-12">Features</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="feature text-center p-6">
          <div class="icon mb-4 text-blue-500 text-5xl">✓</div>
          <h3 class="text-xl font-semibold mb-2">Task Management</h3>
          <p>Create, edit, and delete tasks with ease.</p>
        </div>

        <div class="feature text-center p-6">
          <div class="icon mb-4 text-green-500 text-5xl">✓</div>
          <h3 class="text-xl font-semibold mb-2">Task Status</h3>
          <p>Mark tasks as completed when you're done.</p>
        </div>

        <div class="feature text-center p-6">
          <div class="icon mb-4 text-purple-500 text-5xl">✓</div>
          <h3 class="text-xl font-semibold mb-2">Filtering & Sorting</h3>
          <p>Find your tasks quickly with advanced filters.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
