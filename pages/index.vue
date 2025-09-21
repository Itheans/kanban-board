<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Enhanced Header with glass morphism -->
    <header class="glass backdrop-blur-xl sticky top-0 z-40 border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-6">
          <div class="flex items-center space-x-4">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold gradient-text">My Kanban Boards</h1>
              <p class="text-gray-600 mt-1">จัดการโปรเจคของคุณอย่างเป็นระบบ ✨</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="showCreateModal = true"
              class="btn-primary group"
            >
              <svg class="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              สร้าง Board ใหม่
            </button>
            <button
              @click="logout"
              class="btn-secondary group"
            >
              <svg class="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="pending" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600 font-medium">กำลังโหลดข้อมูล... ⏳</p>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="refresh()"
          class="btn-primary"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="boards.length === 0" class="text-center py-20">
        <div class="float mb-8">
          <div class="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
            <svg class="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-3">ยังไม่มี Board 📋</h3>
        <p class="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
          เริ่มต้นการจัดการงานของคุณด้วยการสร้าง Kanban Board แรก<br/>
          ง่าย สะดวก และมีประสิทธิภาพ
        </p>
        <button
          @click="showCreateModal = true"
          class="btn-primary text-lg px-8 py-4"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          สร้าง Board แรก 🚀
        </button>
      </div>
      
      <!-- Boards Grid -->
      <div v-else>
        <!-- Stats Header -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Boards ทั้งหมด</h2>
              <p class="text-gray-600 text-sm">คุณมี {{ boards.length }} boards</p>
            </div>
            <div class="glass rounded-xl px-4 py-2">
              <div class="flex items-center space-x-4 text-sm">
                <div class="flex items-center text-blue-600">
                  <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>{{ totalTasks }} Tasks</span>
                </div>
                <div class="flex items-center text-green-600">
                  <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>{{ totalMembers }} Members</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Boards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="board in boards"
            :key="board.id"
            class="group card p-6 cursor-pointer hover:scale-105 transition-all duration-300 relative overflow-hidden"
            @click="navigateTo(`/board/${board.id}`)"
          >
            <!-- Gradient overlay -->
            <div class="absolute top-0 right-0 w-24 h-24 opacity-10 group-hover:opacity-20 transition-opacity">
              <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full transform translate-x-8 -translate-y-8"></div>
            </div>
            
            <!-- Board Icon -->
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            
            <!-- Board Info -->
            <h2 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {{ board.title }}
            </h2>
            <p v-if="board.description" class="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">
              {{ board.description }}
            </p>
            
            <!-- Stats -->
            <div class="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <span class="font-medium">{{ board._count.tasks }}</span>
                <span>tasks</span>
              </div>
              <div class="flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"></path>
                </svg>
                <span class="font-medium">{{ board._count.members }}</span>
                <span>members</span>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
              <div class="flex items-center space-x-1">
                <div 
                  class="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  :class="getOwnerAvatarClass(board.owner.username)"
                >
                  {{ board.owner.username.charAt(0).toUpperCase() }}
                </div>
                <span>{{ board.owner.username }}</span>
              </div>
              <span>{{ formatDate(board.createdAt) }}</span>
            </div>
            
            <!-- Hover Effect -->
            <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-pink-400/5"></div>
          </div>
        </div>
      </div>
    </main>

    <!-- Enhanced Create Board Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="card max-w-md w-full">
        <div class="p-6">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800">สร้าง Board ใหม่</h3>
            </div>
            <button
              @click="showCreateModal = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="createBoard" class="space-y-5">
            <!-- Title Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">ชื่อ Board</label>
              <input
                v-model="boardForm.title"
                type="text"
                required
                maxlength="100"
                class="input-field"
                placeholder="เช่น My Awesome Project 🎯"
              />
            </div>
            
            <!-- Description Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">รายละเอียด (ไม่บังคับ)</label>
              <textarea
                v-model="boardForm.description"
                class="input-field resize-none"
                rows="3"
                maxlength="500"
                placeholder="อธิบายเกี่ยวกับ Board นี้... 📝"
              ></textarea>
            </div>
            
            <!-- Error Message -->
            <div v-if="createError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {{ createError }}
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showCreateModal = false"
                class="btn-secondary"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                :disabled="creating"
                class="btn-success"
                :class="creating ? 'opacity-50 cursor-not-allowed' : ''"
              >
                <svg v-if="creating" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{ creating ? 'กำลังสร้าง...' : 'สร้าง 🚀' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Check authentication
const token = useCookie('auth-token')
if (!token.value) {
  await navigateTo('/login')
}

const showCreateModal = ref(false)
const creating = ref(false)
const createError = ref('')

const boardForm = reactive({
  title: '',
  description: ''
})

// Fetch boards with better error handling
const { data: boardsData, pending, error, refresh } = await useFetch('/api/boards', {
  headers: {
    Authorization: `Bearer ${token.value}`
  },
  onResponseError({ response }) {
    if (response.status === 401) {
      token.value = null
      navigateTo('/login')
    }
  }
})

const boards = computed(() => boardsData.value?.boards || [])

// Computed stats
const totalTasks = computed(() => {
  return boards.value.reduce((sum, board) => sum + board._count.tasks, 0)
})

const totalMembers = computed(() => {
  return boards.value.reduce((sum, board) => sum + board._count.members, 0)
})

// Helper functions
const getOwnerAvatarClass = (username) => {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-emerald-600',
    'bg-gradient-to-br from-pink-500 to-rose-600',
    'bg-gradient-to-br from-yellow-500 to-orange-600',
    'bg-gradient-to-br from-indigo-500 to-purple-600',
    'bg-gradient-to-br from-red-500 to-pink-600'
  ]
  const index = username.length % colors.length
  return colors[index]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'วันนี้'
  } else if (diffDays === 1) {
    return 'เมื่อวาน'
  } else if (diffDays < 30) {
    return `${diffDays} วันที่แล้ว`
  } else {
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

const createBoard = async () => {
  creating.value = true
  createError.value = ''
  
  try {
    await $fetch('/api/boards', {
      method: 'POST',
      body: boardForm,
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    boardForm.title = ''
    boardForm.description = ''
    showCreateModal.value = false
    
    await refresh()
  } catch (err) {
    console.error('Create board error:', err)
    createError.value = err.data?.message || 'ไม่สามารถสร้าง Board ได้'
  }
  
  creating.value = false
}

const logout = async () => {
  token.value = null
  await navigateTo('/login')
}

// Set page meta
useHead({
  title: 'Dashboard - Kanban Board'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Float animation */
.float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
</style>