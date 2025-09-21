<template>
  <div>
    <KanbanBoard
      v-if="boardData"
      :board="boardData.board"
      :columns="boardData.columns"
      :tasks="boardData.tasks"
    />
    <div v-else class="flex items-center justify-center min-h-screen">
      กำลังโหลด...
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const boardId = route.params.id

const { data: boardData } = await useFetch(`/api/boards/${boardId}`)
</script>