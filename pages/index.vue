<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-bold text-gray-900">My Kanban Boards</h1>
          <div class="flex space-x-4">
            <button
              @click="showCreateModal = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              สร้าง Board ใหม่
            </button>
            <button
              @click="logout"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Boards Grid -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="pending" class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">กำลังโหลด...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button
          @click="refresh()"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ลองใหม่
        </button>
      </div>
      
      <div v-else-if="boards.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-6">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">ยังไม่มี Board</h3>
        <p class="text-gray-500 mb-4">เริ่มต้นด้วยการสร้าง Kanban Board แรกของคุณ</p>
        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          สร้าง Board แรก
        </button>
      </div>
      
      <div v-else>
        <div class="mb-6">
          <h2 class="text-lg font-medium text-gray-900">Boards ทั้งหมด ({{ boards.length }})</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="board in boards"
            :key="board.id"
            class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            @click="navigateTo(`/board/${board.id}`)"
          >
            <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ board.title }}</h2>
            <p v-if="board.description" class="text-gray-600 mb-4 line-clamp-2">{{ board.description }}</p>
            
            <div class="flex justify-between items-center text-sm text-gray-500 mb-3">
              <div class="flex items-center space-x-4">
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  {{ board._count.tasks }} tasks
                </span>
                <span class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  {{ board._count.members }} members
                </span>
              </div>
            </div>
            
            <div class="text-xs text-gray-400 border-t pt-3">
              สร้างโดย: {{ board.owner.username }} • {{ formatDate(board.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create Board Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">สร้าง Board ใหม่</h3>
        
        <form @submit.prevent="createBoard">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-gray-700">ชื่อ Board</label>
            <input
              v-model="boardForm.title"
              type="text"
              required
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="เช่น My Project"
            />
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium mb-2 text-gray-700">รายละเอียด (ไม่บังคับ)</label>
            <textarea
              v-model="boardForm.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              maxlength="500"
              placeholder="อธิบายเกี่ยวกับ Board นี้..."
            ></textarea>
          </div>
          
          <div v-if="createError" class="mb-4 text-red-600 text-sm">
            {{ createError }}
          </div>
          
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {{ creating ? 'กำลังสร้าง...' : 'สร้าง' }}
            </button>
          </div>
        </form>
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
      // Token is invalid, redirect to login
      token.value = null
      navigateTo('/login')
    }
  }
})

const boards = computed(() => boardsData.value?.boards || [])

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
    
    // Refresh boards list
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Set page meta
useHead({
  title: 'Kanban Board - Dashboard'
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>