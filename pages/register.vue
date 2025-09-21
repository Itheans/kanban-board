<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          สมัครสมาชิก Kanban Board
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          หรือ
          <NuxtLink to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
            เข้าสู่ระบบที่มีอยู่
          </NuxtLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">ชื่อผู้ใช้</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="ชื่อผู้ใช้"
            />
          </div>
          <div>
            <label for="email" class="sr-only">อีเมล</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="อีเมล"
            />
          </div>
          <div>
            <label for="password" class="sr-only">รหัสผ่าน</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              minlength="6"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
            />
          </div>
          <div>
            <label for="confirmPassword" class="sr-only">ยืนยันรหัสผ่าน</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="ยืนยันรหัสผ่าน"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div v-if="success" class="text-green-600 text-sm text-center">
          {{ success }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
                />
              </svg>
            </span>
            {{ loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  // Validate passwords match
  if (form.password !== form.confirmPassword) {
    error.value = 'รหัสผ่านไม่ตรงกัน'
    loading.value = false
    return
  }
  
  try {
    const data = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: form.username,
        email: form.email,
        password: form.password
      }
    })
    
    success.value = 'สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ...'
    
    // Set token in cookie
    const token = useCookie('auth-token', {
      default: () => null,
      httpOnly: false,
      secure: false,
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    token.value = data.token
    
    // Redirect to home after a short delay
    setTimeout(() => {
      navigateTo('/')
    }, 1500)
    
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.data?.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่'
  }
  
  loading.value = false
}

// Check if already logged in
onMounted(() => {
  const token = useCookie('auth-token')
  if (token.value) {
    navigateTo('/')
  }
})
</script>