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
        กำลังโหลด...
      </div>
      
      <div v-else-if="boards.length === 0" class="text-center py-12">
        <p class="text-gray-500 mb-4">คุณยังไม่มี Board</p>
        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          สร้าง Board แรก
        </button>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="board in boards"
          :key="board.id"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="navigateTo(`/board/${board.id}`)"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ board.title }}</h2>
          <p v-if="board.description" class="text-gray-600 mb-4">{{ board.description }}</p>
          
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>{{ board._count.tasks }} tasks</span>
            <span>{{ board._count.members }} members</span>
          </div>
          
          <div class="mt-4 text-xs text-gray-400">
            สร้างโดย: {{ board.owner.username }}
          </div>
        </div>
      </div>
    </main>

    <!-- Create Board Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96">
        <h3 class="text-lg font-semibold mb-4">สร้าง Board ใหม่</h3>
        
        <form @submit.prevent="createBoard">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">ชื่อ Board</label>
            <input
              v-model="boardForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">รายละเอียด</label>
            <textarea
              v-model="boardForm.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              สร้าง
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const showCreateModal = ref(false)
const boardForm = reactive({
  title: '',
  description: ''
})

// Fetch boards
const { data: boardsData, pending } = await useFetch('/api/boards')
const boards = computed(() => boardsData.value?.boards || [])

const createBoard = async () => {
  try {
    await $fetch('/api/boards', {
      method: 'POST',
      body: boardForm
    })
    
    boardForm.title = ''
    boardForm.description = ''
    showCreateModal.value = false
    
    // Refresh boards
    await refresh()
  } catch (error) {
    alert('ไม่สามารถสร้าง Board ได้')
  }
}

const logout = async () => {
  const token = useCookie('auth-token')
  token.value = null
  await navigateTo('/login')
}
</script>