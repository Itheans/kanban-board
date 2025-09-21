<template>
  <div
    class="group relative task-card cursor-move overflow-hidden"
    :class="[
      priorityCardClass,
      isDragging ? 'dragging' : 'hover:shadow-xl'
    ]"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- Priority indicator line -->
    <div 
      class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r"
      :class="priorityGradient"
    ></div>
    
    <!-- Card content -->
    <div class="p-4">
      <!-- Header with title and actions -->
      <div class="flex justify-between items-start mb-3">
        <h3 class="font-semibold text-gray-900 flex-1 mr-2 leading-tight text-base group-hover:text-gray-700 transition-colors">
          {{ task.title }}
        </h3>
        
        <!-- Action buttons -->
        <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
          <button
            @click.stop="$emit('edit', task)"
            class="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
            title="แก้ไข"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button
            @click.stop="handleDelete"
            class="w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
            title="ลบ"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Description -->
      <p v-if="task.description" class="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
        {{ task.description }}
      </p>
      
      <!-- Tags -->
      <div v-if="task.tags && task.tags.length" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="(tag, index) in task.tags.slice(0, 3)"
          :key="tag"
          class="tag"
          :class="getTagClass(index)"
        >
          {{ tag }}
        </span>
        <span 
          v-if="task.tags.length > 3"
          class="tag tag-gray text-xs"
        >
          +{{ task.tags.length - 3 }} เพิ่มเติม
        </span>
      </div>
      
      <!-- Priority and drag handle row -->
      <div class="flex items-center justify-between mb-3">
        <!-- Priority badge -->
        <div class="flex items-center space-x-2">
          <span 
            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shadow-sm"
            :class="priorityBadgeClass"
          >
            <span class="mr-1">{{ priorityIcon }}</span>
            {{ priorityText }}
          </span>
        </div>
        
        <!-- Drag handle -->
        <div class="drag-handle p-1 rounded-md hover:bg-gray-100 transition-colors">
          <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM8.5 17a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM18.5 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM18.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM18.5 17a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
          </svg>
        </div>
      </div>
      
      <!-- Footer with date and assignee -->
      <div class="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-3">
        <div class="flex items-center space-x-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span>{{ formatDate(task.createdAt) }}</span>
        </div>
        
        <div v-if="task.user" class="flex items-center space-x-2">
          <div 
            class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm"
            :class="getUserAvatarClass(task.user.username)"
            :title="task.user.username"
          >
            {{ task.user.username.charAt(0).toUpperCase() }}
          </div>
          <span class="font-medium text-gray-600">{{ task.user.username }}</span>
        </div>
      </div>
    </div>
    
    <!-- Hover glow effect -->
    <div class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-blue-400/5 via-purple-400/5 to-pink-400/5"></div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: Object
})

const emit = defineEmits(['edit', 'delete', 'dragstart'])

const isDragging = ref(false)

// Priority styling
const priorityCardClass = computed(() => {
  switch (props.task.priority) {
    case 'high': return 'bg-white border border-red-100 shadow-md hover:shadow-red-100'
    case 'medium': return 'bg-white border border-yellow-100 shadow-md hover:shadow-yellow-100'
    case 'low': return 'bg-white border border-green-100 shadow-md hover:shadow-green-100'
    default: return 'bg-white border border-gray-200 shadow-md hover:shadow-gray-100'
  }
})

const priorityGradient = computed(() => {
  switch (props.task.priority) {
    case 'high': return 'from-red-500 to-pink-500'
    case 'medium': return 'from-yellow-500 to-orange-500'
    case 'low': return 'from-green-500 to-emerald-500'
    default: return 'from-gray-400 to-gray-500'
  }
})

const priorityBadgeClass = computed(() => {
  switch (props.task.priority) {
    case 'high': return 'bg-red-100 text-red-800 border border-red-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'low': return 'bg-green-100 text-green-800 border border-green-200'
    default: return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
})

const priorityIcon = computed(() => {
  switch (props.task.priority) {
    case 'high': return '🔥'
    case 'medium': return '⚡'
    case 'low': return '🌱'
    default: return '📝'
  }
})

const priorityText = computed(() => {
  switch (props.task.priority) {
    case 'high': return 'สูง'
    case 'medium': return 'กลาง'
    case 'low': return 'ต่ำ'
    default: return 'กลาง'
  }
})

// Tag styling
const getTagClass = (index) => {
  const tagClasses = [
    'tag-blue',
    'tag-purple', 
    'tag-pink',
    'tag-green',
    'tag-yellow',
    'tag-indigo'
  ]
  return tagClasses[index % tagClasses.length]
}

// User avatar colors
const getUserAvatarClass = (username) => {
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

// Drag & Drop handlers
const handleDragStart = (event) => {
  isDragging.value = true
  event.dataTransfer.setData('text/plain', props.task.id)
  event.dataTransfer.effectAllowed = 'move'
  
  // Create a custom drag image with some styling
  const dragImage = event.target.cloneNode(true)
  dragImage.style.transform = 'rotate(3deg) scale(0.95)'
  dragImage.style.opacity = '0.9'
  
  emit('dragstart', props.task)
}

const handleDragEnd = () => {
  isDragging.value = false
}

const handleDelete = () => {
  // Show a more friendly confirmation
  const confirmMessage = `คุณต้องการลบ "${props.task.title}" ใช่หรือไม่? 🗑️`
  if (confirm(confirmMessage)) {
    emit('delete', props.task.id)
  }
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
  } else if (diffDays < 7) {
    return `${diffDays} วันที่แล้ว`
  } else {
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short'
    })
  }
}
</script>

<style scoped>
.task-card {
  border-radius: 1rem;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced dragging state */
.dragging {
  opacity: 0.8;
  transform: rotate(3deg) scale(1.05);
  z-index: 1000;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Tag styles */
.tag {
  @apply inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 cursor-default;
}

.tag-blue {
  @apply bg-blue-100 text-blue-800 hover:bg-blue-200;
}

.tag-purple {
  @apply bg-purple-100 text-purple-800 hover:bg-purple-200;
}

.tag-pink {
  @apply bg-pink-100 text-pink-800 hover:bg-pink-200;
}

.tag-green {
  @apply bg-green-100 text-green-800 hover:bg-green-200;
}

.tag-yellow {
  @apply bg-yellow-100 text-yellow-800 hover:bg-yellow-200;
}

.tag-indigo {
  @apply bg-indigo-100 text-indigo-800 hover:bg-indigo-200;
}

.tag-gray {
  @apply bg-gray-100 text-gray-800 hover:bg-gray-200;
}

/* Smooth hover animations */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:translate-x-0 {
  transform: translateX(0);
}
</style>