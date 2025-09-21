<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">{{ board.title }}</h1>
        <p v-if="board.description" class="text-gray-600 mt-1">{{ board.description }}</p>
      </div>
      <div class="flex space-x-4">
        <button
          @click="showInviteModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          เชิญสมาชิก
        </button>
        <button
          @click="openTaskModal()"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          เพิ่ม Task
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="column in columns"
        :key="column.id"
        class="bg-white rounded-lg shadow-md p-4 transition-all duration-200"
        :class="dragOverColumn === column.id ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ column.title }}
          </h2>
          <span class="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full">
            {{ getTasksByColumn(column.id).length }}
          </span>
        </div>
        
        <div
          class="space-y-3 min-h-[400px] pb-4"
          @drop="handleDrop($event, column.id)"
          @dragover.prevent
          @dragenter.prevent="handleDragEnter(column.id)"
          @dragleave="handleDragLeave"
        >
          <TaskCard
            v-for="task in getTasksByColumn(column.id)"
            :key="task.id"
            :task="task"
            @edit="editTask"
            @delete="deleteTask"
            @dragstart="handleDragStart"
          />
          
          <!-- Empty state -->
          <div
            v-if="getTasksByColumn(column.id).length === 0"
            class="text-gray-400 text-center py-8 text-sm"
          >
            <div class="text-4xl mb-2">📝</div>
            ไม่มี Task
          </div>
          
          <!-- Drop indicator -->
          <div 
            v-if="dragOverColumn === column.id && draggedTask"
            class="border-2 border-dashed border-blue-400 bg-blue-50 p-3 rounded-md text-blue-600 text-center text-sm"
          >
            วาง Task ที่นี่
          </div>
        </div>
      </div>
    </div>

    <!-- Task Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="closeTaskModal">
      <div class="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
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
              maxlength="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="เช่น ออกแบบหน้า Login"
            />
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">รายละเอียด</label>
            <textarea
              v-model="taskForm.description"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              maxlength="500"
              placeholder="อธิบายรายละเอียดของ Task..."
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
            <label class="block text-sm font-medium mb-2">Priority</label>
            <select
              v-model="taskForm.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium mb-2">Tags (คั่นด้วย ,)</label>
            <input
              v-model="tagInput"
              type="text"
              placeholder="urgent, bug, feature"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div v-if="taskError" class="mb-4 text-red-600 text-sm">
            {{ taskError }}
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
              :disabled="saving"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'กำลังบันทึก...' : (editingTask ? 'อัปเดต' : 'เพิ่ม') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Invite Modal -->
    <div v-if="showInviteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="showInviteModal = false">
      <div class="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">เชิญสมาชิกเข้า Board</h3>
        
        <form @submit.prevent="inviteMember">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">อีเมลของสมาชิก</label>
            <input
              v-model="inviteEmail"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>
          
          <div v-if="inviteError" class="mb-4 text-red-600 text-sm">
            {{ inviteError }}
          </div>
          
          <div v-if="inviteSuccess" class="mb-4 text-green-600 text-sm">
            {{ inviteSuccess }}
          </div>
          
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              @click="showInviteModal = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="inviting"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ inviting ? 'กำลังเชิญ...' : 'เชิญ' }}
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

const emit = defineEmits(['refresh'])

// Modal states
const showTaskModal = ref(false)
const showInviteModal = ref(false)
const editingTask = ref(null)

// Form data
const taskForm = reactive({
  title: '',
  description: '',
  columnId: '',
  priority: 'medium',
  tags: []
})

const tagInput = ref('')
const inviteEmail = ref('')

// Loading states
const saving = ref(false)
const inviting = ref(false)

// Error states
const taskError = ref('')
const inviteError = ref('')
const inviteSuccess = ref('')

// Drag & Drop state
const dragOverColumn = ref(null)
const draggedTask = ref(null)

// Local tasks state for immediate UI update
const localTasks = ref([...props.tasks])

// Watch for props changes
watch(() => props.tasks, (newTasks) => {
  localTasks.value = [...newTasks]
}, { deep: true })

const getTasksByColumn = (columnId) => {
  return localTasks.value.filter(task => task.columnId === columnId)
}

const handleDragStart = (task) => {
  draggedTask.value = task
}

const handleDragEnter = (columnId) => {
  if (draggedTask.value) {
    dragOverColumn.value = columnId
  }
}

const handleDragLeave = (event) => {
  // Only clear if we're leaving the drop zone entirely
  if (!event.currentTarget.contains(event.relatedTarget)) {
    dragOverColumn.value = null
  }
}

const handleDrop = async (event, columnId) => {
  event.preventDefault()
  dragOverColumn.value = null
  
  if (!draggedTask.value) return
  
  const taskId = draggedTask.value.id
  const originalColumnId = draggedTask.value.columnId
  
  // Don't move if dropping in the same column
  if (originalColumnId === columnId) {
    draggedTask.value = null
    return
  }
  
  try {
    // Update UI immediately for smooth experience
    const taskIndex = localTasks.value.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      localTasks.value[taskIndex] = { 
        ...localTasks.value[taskIndex], 
        columnId: columnId 
      }
    }
    
    // Make API call with proper authentication
    const token = useCookie('auth-token')
    await $fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: { columnId },
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Success feedback
    console.log('Task moved successfully!')
    
    // Emit refresh to parent component
    emit('refresh')
    
  } catch (error) {
    console.error('Failed to move task:', error)
    
    // Revert UI change if API call fails
    const taskIndex = localTasks.value.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      localTasks.value[taskIndex] = {
        ...localTasks.value[taskIndex],
        columnId: originalColumnId
      }
    }
    
    alert('ไม่สามารถย้าย Task ได้ กรุณาลองใหม่')
  } finally {
    draggedTask.value = null
  }
}

const openTaskModal = (column = null) => {
  if (column) {
    taskForm.columnId = column.id
  }
  showTaskModal.value = true
}

const saveTask = async () => {
  saving.value = true
  taskError.value = ''
  
  try {
    taskForm.tags = tagInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    
    const token = useCookie('auth-token')
    let result
    
    if (editingTask.value) {
      result = await $fetch(`/api/tasks/${editingTask.value.id}`, {
        method: 'PUT',
        body: taskForm,
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      // Update local state
      const taskIndex = localTasks.value.findIndex(t => t.id === editingTask.value.id)
      if (taskIndex !== -1) {
        localTasks.value[taskIndex] = { ...localTasks.value[taskIndex], ...result.task }
      }
    } else {
      result = await $fetch('/api/tasks', {
        method: 'POST',
        body: {
          ...taskForm,
          boardId: props.board.id
        },
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json'
        }
      })
      
      // Add to local state
      localTasks.value.push(result.task)
    }
    
    closeTaskModal()
    emit('refresh')
    
  } catch (error) {
    console.error('Failed to save task:', error)
    taskError.value = error.data?.message || 'ไม่สามารถบันทึก Task ได้'
  }
  
  saving.value = false
}

const editTask = (task) => {
  editingTask.value = task
  taskForm.title = task.title
  taskForm.description = task.description || ''
  taskForm.columnId = task.columnId
  taskForm.priority = task.priority
  tagInput.value = task.tags ? task.tags.join(', ') : ''
  showTaskModal.value = true
}

const deleteTask = async (taskId) => {
  if (!confirm('คุณแน่ใจว่าต้องการลบ Task นี้?')) return
  
  try {
    const token = useCookie('auth-token')
    await $fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    
    // Remove from local state
    localTasks.value = localTasks.value.filter(t => t.id !== taskId)
    emit('refresh')
    
  } catch (error) {
    console.error('Failed to delete task:', error)
    alert('ไม่สามารถลบ Task ได้ กรุณาลองใหม่')
  }
}

const inviteMember = async () => {
  inviting.value = true
  inviteError.value = ''
  inviteSuccess.value = ''
  
  try {
    const token = useCookie('auth-token')
    const result = await $fetch(`/api/boards/${props.board.id}/invite`, {
      method: 'POST',
      body: { email: inviteEmail.value },
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    inviteSuccess.value = result.message
    inviteEmail.value = ''
    
    setTimeout(() => {
      showInviteModal.value = false
      inviteSuccess.value = ''
    }, 2000)
    
  } catch (error) {
    console.error('Failed to invite member:', error)
    inviteError.value = error.data?.message || 'ไม่สามารถเชิญสมาชิกได้'
  }
  
  inviting.value = false
}

const closeTaskModal = () => {
  showTaskModal.value = false
  editingTask.value = null
  taskForm.title = ''
  taskForm.description = ''
  taskForm.columnId = ''
  taskForm.priority = 'medium'
  tagInput.value = ''
  taskError.value = ''
}
</script>

<style scoped>
/* Drag & Drop animations */
.task-dragging {
  opacity: 0.5;
  transform: rotate(5deg) scale(1.05);
}

.column-drag-over {
  background-color: #eff6ff;
  border: 2px dashed #3b82f6;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>