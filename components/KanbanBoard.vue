<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header with glass morphism -->
    <div class="glass backdrop-blur-xl rounded-3xl mx-6 mt-6 mb-8 p-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold gradient-text">{{ board.title }}</h1>
            <p v-if="board.description" class="text-gray-600 mt-1">{{ board.description }}</p>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button
            @click="showInviteModal = true"
            class="btn-secondary group"
          >
            <svg class="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            เชิญสมาชิก
          </button>
          <button
            @click="openTaskModal()"
            class="btn-primary group"
          >
            <svg class="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            เพิ่ม Task
          </button>
        </div>
      </div>
    </div>

    <!-- Kanban Columns -->
    <div class="px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="column in columns"
          :key="column.id"
          class="kanban-column rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
          :class="dragOverColumn === column.id ? 'drag-over scale-105' : ''"
        >
          <!-- Column Header -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center space-x-3">
              <div 
                class="w-3 h-3 rounded-full"
                :class="getColumnColor(column.id)"
              ></div>
              <h2 class="text-lg font-bold text-gray-800">
                {{ column.title }}
              </h2>
            </div>
            <div 
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getColumnBadgeColor(column.id)"
            >
              {{ getTasksByColumn(column.id).length }}
            </div>
          </div>
          
          <!-- Tasks Container -->
          <div
            class="space-y-4 min-h-[500px] pb-4 custom-scrollbar overflow-y-auto max-h-[70vh]"
            @drop="handleDrop($event, column.id)"
            @dragover.prevent
            @dragenter.prevent="handleDragEnter(column.id)"
            @dragleave="handleDragLeave"
          >
            <div>
              <TaskCard
                v-for="task in getTasksByColumn(column.id)"
                :key="task.id"
                :task="task"
                @edit="editTask"
                @delete="deleteTask"
                @dragstart="handleDragStart"
                class="task-move"
              />
            </div>
            
            <!-- Empty state with cute illustration -->
            <div
              v-if="getTasksByColumn(column.id).length === 0"
              class="text-center py-12 opacity-50"
            >
              <div class="text-6xl mb-4 float">
                {{ getEmptyIcon(column.id) }}
              </div>
              <p class="text-gray-500 text-sm font-medium">{{ getEmptyText(column.id) }}</p>
            </div>
            
            <!-- Drop indicator -->
            <div 
              v-if="dragOverColumn === column.id && draggedTask"
              class="border-2 border-dashed border-blue-400 bg-blue-50 p-6 rounded-2xl text-blue-600 text-center text-sm font-medium backdrop-blur-sm animate-pulse"
            >
              <div class="text-2xl mb-2">✨</div>
              วาง Task ที่นี่
            </div>
          </div>
          
          <!-- Quick add button -->
          <button
            @click="openTaskModal(column)"
            class="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-gray-500 hover:text-blue-600 text-sm font-medium group"
          >
            <svg class="w-4 h-4 inline mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            เพิ่ม Task
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Task Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeTaskModal">
      <div class="card max-w-md w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div class="p-6">
          <!-- Modal Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-800">
                {{ editingTask ? 'แก้ไข Task' : 'เพิ่ม Task ใหม่' }}
              </h3>
            </div>
            <button
              @click="closeTaskModal"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="saveTask" class="space-y-5">
            <!-- Title Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">ชื่อ Task</label>
              <input
                v-model="taskForm.title"
                type="text"
                required
                maxlength="100"
                class="input-field"
                placeholder="เช่น ออกแบบหน้า Login ✨"
              />
            </div>
            
            <!-- Description Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">รายละเอียด</label>
              <textarea
                v-model="taskForm.description"
                class="input-field resize-none"
                rows="3"
                maxlength="500"
                placeholder="อธิบายรายละเอียดของ Task... 📝"
              ></textarea>
            </div>
            
            <!-- Column Selection -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Column</label>
              <select
                v-model="taskForm.columnId"
                required
                class="input-field"
              >
                <option value="">เลือก Column</option>
                <option v-for="column in columns" :key="column.id" :value="column.id">
                  {{ column.title }}
                </option>
              </select>
            </div>
            
            <!-- Priority Selection -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  v-for="priority in priorities"
                  :key="priority.value"
                  @click="taskForm.priority = priority.value"
                  class="p-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium"
                  :class="taskForm.priority === priority.value ? 
                    `${priority.selectedClass} scale-105` : 
                    `${priority.defaultClass} hover:scale-105`"
                >
                  <div class="text-lg mb-1">{{ priority.icon }}</div>
                  {{ priority.label }}
                </button>
              </div>
            </div>
            
            <!-- Tags Field -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
              <input
                v-model="tagInput"
                type="text"
                placeholder="urgent, bug, feature 🏷️"
                class="input-field"
              />
              <p class="text-xs text-gray-500 mt-1">คั่นด้วยเครื่องหมายจุลภาค (,)</p>
            </div>
            
            <!-- Error Message -->
            <div v-if="taskError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {{ taskError }}
            </div>
            
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeTaskModal"
                class="btn-secondary"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="btn-success"
                :class="saving ? 'opacity-50 cursor-not-allowed' : ''"
              >
                <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{ saving ? 'กำลังบันทึก...' : (editingTask ? 'อัปเดต ✨' : 'เพิ่ม 🚀') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Enhanced Invite Modal -->
    <div v-if="showInviteModal" class="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showInviteModal = false">
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
              <h3 class="text-xl font-bold text-gray-800">เชิญสมาชิกเข้า Board</h3>
            </div>
            <button
              @click="showInviteModal = false"
              class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form @submit.prevent="inviteMember" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">อีเมลของสมาชิก</label>
              <input
                v-model="inviteEmail"
                type="email"
                required
                class="input-field"
                placeholder="example@email.com 📧"
              />
            </div>
            
            <div v-if="inviteError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {{ inviteError }}
            </div>
            
            <div v-if="inviteSuccess" class="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
              {{ inviteSuccess }}
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="showInviteModal = false"
                class="btn-secondary"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                :disabled="inviting"
                class="btn-primary"
                :class="inviting ? 'opacity-50 cursor-not-allowed' : ''"
              >
                <svg v-if="inviting" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                {{ inviting ? 'กำลังเชิญ...' : 'เชิญ 💌' }}
              </button>
            </div>
          </form>
        </div>
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

// Priority options with enhanced styling
const priorities = [
  {
    value: 'high',
    label: 'สูง',
    icon: '🔥',
    defaultClass: 'border-red-200 text-red-700 hover:bg-red-50',
    selectedClass: 'border-red-500 bg-red-100 text-red-800 shadow-lg'
  },
  {
    value: 'medium',
    label: 'กลาง',
    icon: '⚡',
    defaultClass: 'border-yellow-200 text-yellow-700 hover:bg-yellow-50',
    selectedClass: 'border-yellow-500 bg-yellow-100 text-yellow-800 shadow-lg'
  },
  {
    value: 'low',
    label: 'ต่ำ',
    icon: '🌱',
    defaultClass: 'border-green-200 text-green-700 hover:bg-green-50',
    selectedClass: 'border-green-500 bg-green-100 text-green-800 shadow-lg'
  }
]

// Watch for props changes
watch(() => props.tasks, (newTasks) => {
  localTasks.value = [...newTasks]
}, { deep: true })

// Helper functions
const getTasksByColumn = (columnId) => {
  return localTasks.value.filter(task => task.columnId === columnId)
}

const getColumnColor = (columnId) => {
  const index = props.columns.findIndex(col => col.id === columnId)
  const colors = ['bg-blue-500', 'bg-yellow-500', 'bg-green-500']
  return colors[index] || 'bg-gray-500'
}

const getColumnBadgeColor = (columnId) => {
  const index = props.columns.findIndex(col => col.id === columnId)
  const colors = ['bg-blue-100 text-blue-800', 'bg-yellow-100 text-yellow-800', 'bg-green-100 text-green-800']
  return colors[index] || 'bg-gray-100 text-gray-800'
}

const getEmptyIcon = (columnId) => {
  const index = props.columns.findIndex(col => col.id === columnId)
  const icons = ['📋', '⚡', '✨']
  return icons[index] || '📝'
}

const getEmptyText = (columnId) => {
  const index = props.columns.findIndex(col => col.id === columnId)
  const texts = ['ไม่มี Task ที่ต้องทำ', 'ไม่มี Task ที่กำลังทำ', 'ไม่มี Task ที่เสร็จแล้ว']
  return texts[index] || 'ไม่มี Task'
}

// Drag & Drop handlers
const handleDragStart = (task) => {
  draggedTask.value = task
}

const handleDragEnter = (columnId) => {
  if (draggedTask.value) {
    dragOverColumn.value = columnId
  }
}

const handleDragLeave = (event) => {
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
  
  if (originalColumnId === columnId) {
    draggedTask.value = null
    return
  }
  
  try {
    const taskIndex = localTasks.value.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      localTasks.value[taskIndex] = { 
        ...localTasks.value[taskIndex], 
        columnId: columnId 
      }
    }
    
    const token = useCookie('auth-token')
    await $fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: { columnId },
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      }
    })
    
    emit('refresh')
    
  } catch (error) {
    console.error('Failed to move task:', error)
    
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

// Modal handlers
const openTaskModal = (column = null) => {
  if (column) {
    taskForm.columnId = column.id
  }
  showTaskModal.value = true
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
</script>

<style scoped>
/* Task transition animations */
.task-enter-active,
.task-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.task-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.task-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.task-move {
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
