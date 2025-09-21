<template>
  <div>
    <div v-if="pending || refreshing" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-gray-600">{{ refreshing ? 'กำลังอัปเดต...' : 'กำลังโหลด Board...' }}</p>
      </div>
    </div>
    
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">ไม่พบ Board</h2>
        <p class="text-gray-600 mb-4">{{ error?.data?.message || 'Board ที่คุณค้นหาไม่พบ หรือคุณไม่มีสิทธิ์เข้าถึง' }}</p>
        <div class="space-x-2">
          <button
            @click="forceRefresh()"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ลองใหม่
          </button>
          <NuxtLink
            to="/"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 inline-block"
          >
            กลับหน้าแรก
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <KanbanBoard
      v-else-if="boardData"
      :board="boardData.board"
      :columns="boardData.columns"
      :tasks="boardData.tasks"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const boardId = route.params.id
const token = useCookie('auth-token')
const refreshing = ref(false)

// Fetch board data with proper error handling
const { data: boardData, pending, error, refresh } = await useFetch(`/api/boards/${boardId}`, {
  key: `board-${boardId}`,
  headers: {
    Authorization: `Bearer ${token.value}`
  },
  onResponseError({ response }) {
    console.error('Board fetch error:', response)
    if (response.status === 401) {
      // Token is invalid, redirect to login
      token.value = null
      navigateTo('/login')
    }
  }
})

const handleRefresh = async () => {
  if (refreshing.value) return // Prevent multiple simultaneous refreshes
  
  refreshing.value = true
  try {
    console.log('Refreshing board data...')
    await refresh()
    console.log('Board data refreshed successfully')
  } catch (err) {
    console.error('Failed to refresh board data:', err)
  } finally {
    refreshing.value = false
  }
}

const forceRefresh = async () => {
  await clearNuxtData(`board-${boardId}`)
  await handleRefresh()
}

// Set page title
useHead({
  title: computed(() => {
    if (boardData.value?.board) {
      return `${boardData.value.board.title} - Kanban Board`
    }
    return 'Loading... - Kanban Board'
  })
})

// Auto refresh every 30 seconds (optional - can be disabled if not needed)
let refreshInterval
onMounted(() => {
  // Uncomment if you want auto-refresh
  // refreshInterval = setInterval(() => {
  //   if (!refreshing.value && !pending.value) {
  //     handleRefresh()
  //   }
  // }, 30000) // 30 seconds
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// Watch for route changes
watch(() => route.params.id, async (newBoardId) => {
  if (newBoardId !== boardId) {
    await navigateTo(`/board/${newBoardId}`)
  }
})
</script>