<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold text-gray-900">{{ board.title }}</h1>
      <div class="flex space-x-4">
        <button
          @click="showInviteModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          เชิญสมาชิก
        </button>
        <button
          @click="showTaskModal = true"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          เพิ่ม Task
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="column in columns"
        :key="column.id"
        class="bg-white rounded-lg shadow-md p-4"
      >
        <h2 class="text-lg font-semibold mb-4 text-gray-800">
          {{ column.title }}
        </h2>
        
        <div
          class="space-y-3 min-h-[400px]"
          @drop="handleDrop($event, column.id)"
          @dragover.prevent
        >
          <TaskCard
            v-for="task in getTasksByColumn(column.id)"
            :key="task.id"
            :task="task"
            @edit="editTask"
            @delete="deleteTask"
          />
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingTask ? 'แก้ไข Task' : 'เพิ่ม Task ใหม่' }}
        </h3>
        
        <form @submit.prevent="saveTask">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">ชื่อ Task</label>
            <input
              v-model="taskForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">รายละเอียด</label>
            <textarea
              v-model="taskForm.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Column</label>
            <select
              v-model="taskForm.columnId"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">เลือก Column</option>
              <option v-for="column in columns" :key="column.id" :value="column.id">
                {{ column.title }}
              </option>
            </select>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Tags (คั่นด้วย ,)</label>
            <input
              v-model="tagInput"
              type="text"
              placeholder="urgent, bug, feature"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="closeTaskModal"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {{ editingTask ? 'อัปเดต' : 'เพิ่ม' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  board: Object,
  columns: Array,
  tasks: Array
})

const showTaskModal = ref(false)
const showInviteModal = ref(false)
const editingTask = ref(null)
const tagInput = ref('')

const taskForm = reactive({
  title: '',
  description: '',
  columnId: '',
  tags: []
})

const getTasksByColumn = (columnId) => {
  return props.tasks.filter(task => task.columnId === columnId)
}

const handleDrop = async (event, columnId) => {
  const taskId = event.dataTransfer.getData('text/plain')
  
  try {
    await $fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: { columnId }
    })
    
    // Refresh data
    await refreshCookie('board-data')
  } catch (error) {
    console.error('Failed to move task:', error)
  }
}

const saveTask = async () => {
  try {
    taskForm.tags = tagInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    
    if (editingTask.value) {
      await $fetch(`/api/tasks/${editingTask.value.id}`, {
        method: 'PUT',
        body: taskForm
      })
    } else {
      await $fetch('/api/tasks', {
        method: 'POST',
        body: {
          ...taskForm,
          boardId: props.board.id
        }
      })
    }
    
    closeTaskModal()
    await refreshCookie('board-data')
  } catch (error) {
    console.error('Failed to save task:', error)
  }
}

const editTask = (task) => {
  editingTask.value = task
  taskForm.title = task.title
  taskForm.description = task.description
  taskForm.columnId = task.columnId
  tagInput.value = task.tags.join(', ')
  showTaskModal.value = true
}

const deleteTask = async (taskId) => {
  if (confirm('คุณแน่ใจว่าต้องการลบ Task นี้?')) {
    try {
      await $fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      })
      await refreshCookie('board-data')
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
}

const closeTaskModal = () => {
  showTaskModal.value = false
  editingTask.value = null
  taskForm.title = ''
  taskForm.description = ''
  taskForm.columnId = ''
  tagInput.value = ''
}
</script>