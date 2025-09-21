<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute bottom-1/3 left-1/4 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute top-2/3 right-1/2 w-56 h-56 bg-pink-200 rounded-full opacity-20 blur-3xl"></div>
    </div>

    <div class="max-w-md w-full relative z-10">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl float">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
        </div>
        <h2 class="text-3xl font-bold gradient-text mb-2">
          สร้างบัญชีใหม่ 🎉
        </h2>
        <p class="text-gray-600">
          เริ่มต้นใช้งาน Kanban Board วันนี้
        </p>
        <p class="text-sm text-gray-500 mt-2">
          มีบัญชีแล้ว?
          <NuxtLink to="/login" class="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
            เข้าสู่ระบบที่นี่ 🚀
          </NuxtLink>
        </p>
      </div>

      <!-- Register Form -->
      <div class="card">
        <div class="p-8">
          <form @submit.prevent="handleRegister" class="space-y-6">
            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-semibold text-gray-700 mb-2">
                ชื่อผู้ใช้
              </label>
              <div class="relative">
                <input
                  id="username"
                  v-model="form.username"
                  name="username"
                  type="text"
                  required
                  minlength="3"
                  maxlength="20"
                  class="input-field pl-12"
                  placeholder="ชื่อผู้ใช้ของคุณ"
                />
                <div class="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-1">3-20 ตัวอักษร</p>
            </div>

            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                อีเมล
              </label>
              <div class="relative">
                <input
                  id="email"
                  v-model="form.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  class="input-field pl-12"
                  placeholder="example@email.com"
                />
                <div class="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  minlength="6"
                  class="input-field pl-12 pr-12"
                  placeholder="••••••••"
                />
                <div class="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
              <div class="mt-2">
                <div class="flex items-center space-x-1 text-xs">
                  <div class="flex-1 h-1 rounded-full bg-gray-200">
                    <div 
                      class="h-1 rounded-full transition-all duration-300"
                      :class="passwordStrengthColor"
                      :style="`width: ${passwordStrength}%`"
                    ></div>
                  </div>
                  <span class="text-gray-500 text-xs">{{ passwordStrengthText }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">อย่างน้อย 6 ตัวอักษร</p>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">
                ยืนยันรหัสผ่าน
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  name="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="input-field pl-12 pr-12"
                  :class="passwordsMatch ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : form.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''"
                  placeholder="••••••••"
                />
                <div class="absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </button>
              </div>
              <div v-if="form.confirmPassword" class="mt-1 text-xs">
                <div v-if="passwordsMatch" class="text-green-600 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  รหัสผ่านตรงกัน
                </div>
                <div v-else class="text-red-600 flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  รหัสผ่านไม่ตรงกัน
                </div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                {{ error }}
              </div>
            </div>

            <!-- Success Message -->
            <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ success }}
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                :disabled="loading || !passwordsMatch || !form.username || !form.email || !form.password"
                class="w-full btn-success text-base py-3"
                :class="loading || !passwordsMatch ? 'opacity-50 cursor-not-allowed' : ''"
              >
                <div v-if="loading" class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  กำลังสมัครสมาชิก...
                </div>
                <div v-else class="flex items-center justify-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  สมัครสมาชิก
                </div>
              </button>
            </div>
          </form>

          <!-- Divider -->
          <div class="mt-6 pt-6 border-t border-gray-100">
            <div class="text-center">
              <p class="text-sm text-gray-600">
                มีบัญชีแล้ว?
                <NuxtLink 
                  to="/login" 
                  class="font-semibold text-purple-600 hover:text-purple-500 transition-colors ml-1"
                >
                  เข้าสู่ระบบที่นี่ 🔐
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-xs text-gray-500">
        <p>© 2024 Kanban Board. เริ่มต้นจัดการงานอย่างเป็นระบบ 🎯</p>
      </div>
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
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Password validation
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 6) strength += 25
  if (password.length >= 8) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password)) strength += 25
  
  return strength
})

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength < 50) return 'bg-red-500'
  if (strength < 75) return 'bg-yellow-500'
  return 'bg-green-500'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength < 50) return 'อ่อน'
  if (strength < 75) return 'ปานกลาง'
  return 'แข็งแกร่ง'
})

const passwordsMatch = computed(() => {
  return form.password && form.confirmPassword && form.password === form.confirmPassword
})

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  
  // Validate passwords match
  if (form.password !== form.confirmPassword) {
    error.value = 'รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง'
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
    
    success.value = 'สมัครสมาชิกสำเร็จ! กำลังเข้าสู่ระบบ... 🎉'
    
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
    }, 2000)
    
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.data?.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
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

// Set page meta
useHead({
  title: 'สมัครสมาชิก - Kanban Board'
})
</script>

<style scoped>
/* Float animation */
.float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
</style>