<template>
  <div
    class="bg-white p-3 rounded-md border-l-4 cursor-move hover:shadow-lg transition-all duration-200 group"
    :class="[
      priorityColor, 
      isDragging ? 'opacity-50 rotate-2 scale-105 shadow-xl' : 'hover:shadow-md'
    ]"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-medium text-gray-900 flex-1 mr-2 leading-tight">{{ task.title }}</h3>
      <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click.stop="$emit('edit', task)"
          class="text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
          title="แก้ไข"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
          </svg>
        </button>
        <button
          @click.stop="handleDelete"
          class="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
          title="ลบ"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <p v-if="task.description" class="text-sm text-gray-600 mb-3 line-clamp-2">
      {{ task.description }}
    </p>
    
    <!-- Priority Badge & Drag Handle -->
    <div class="flex items-center justify-between mb-2">
      <span 
        class="px-2 py-1 text-xs font-medium rounded-full"
        :class="priorityBadgeColor"
      >
        {{ priorityText }}
      </span>
      
      <!-- Drag Handle -->
      <div class="text-gray-400 cursor-grab active:cursor-grabbing">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
        </svg>
      </div>
    </div>
    
    <!-- Tags -->
    <div v-if="task.tags && task.tags.length" class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="tag in task.tags.slice(0, 3)"
        :key="tag"
        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
      >
        {{ tag }}
      </span>
      <span 
        v-if="task.tags.length > 3"
        class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
      >
        +{{ task.tags.length - 3 }}
      </span>
    </div>
    
    <!-- Footer -->
    <div class="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
      <span>{{ formatDate(task.createdAt) }}</span>
      <div v-if="task.user" class="flex items-center space-x-1">
        <div class="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
          {{ task.user.username.charAt(0).toUpperCase() }}
        </div>
        <span class="font-medium">{{ task.user.username }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: Object
})

const emit = defineEmits(['edit', 'delete', 'dragstart'])

const isDragging = ref(false)

const priorityColor = computed(() => {
  switch (props.task.priority) {
    case 'high': return 'border-red-500 bg-red-50'
    case 'medium': return 'border-yellow-500 bg-yellow-50'
    case 'low': return 'border-green-500 bg-green-50'
    default: return 'border-gray-300 bg-white'
  }
})

const priorityBadgeColor = computed(() => {
  switch (props.task.priority) {
    case 'high': return 'bg-red-100 text-red-800 border border-red-200'
    case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'low': return 'bg-green-100 text-green-800 border border-green-200'
    default: return 'bg-gray-100 text-gray-800 border border-gray-200'
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

const handleDragStart = (event) => {
  isDragging.value = true
  event.dataTransfer.setData('text/plain', props.task.id)
  event.dataTransfer.effectAllowed = 'move'
  
  // Add drag image
  const dragImage = event.target.cloneNode(true)
  dragImage.style.transform = 'rotate(5deg) scale(0.95)'
  dragImage.style.opacity = '0.8'
  
  emit('dragstart', props.task)
}

const handleDragEnd = () => {
  isDragging.value = false
}

const handleDelete = () => {
  if (confirm(`คุณแน่ใจว่าต้องการลบ "${props.task.title}"?`)) {
    emit('delete', props.task.id)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Drag handle cursor states */
.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

/* Enhanced hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

/* Dragging animation */
.task-card {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>