<template>
  <div
    class="bg-gray-50 p-3 rounded-md border-l-4 cursor-move hover:shadow-md transition-shadow"
    :class="priorityColor"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div class="flex justify-between items-start mb-2">
      <h3 class="font-medium text-gray-900">{{ task.title }}</h3>
      <div class="flex space-x-1">
        <button
          @click="$emit('edit', task)"
          class="text-gray-400 hover:text-blue-600"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
          </svg>
        </button>
        <button
          @click="$emit('delete', task.id)"
          class="text-gray-400 hover:text-red-600"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
    
    <p v-if="task.description" class="text-sm text-gray-600 mb-2">
      {{ task.description }}
    </p>
    
    <div v-if="task.tags.length" class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="tag in task.tags"
        :key="tag"
        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
      >
        {{ tag }}
      </span>
    </div>
    
    <div class="flex justify-between items-center text-xs text-gray-500">
      <span>{{ formatDate(task.createdAt) }}</span>
      <span v-if="task.assignee" class="font-medium">{{ task.assignee }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  task: Object
})

const emit = defineEmits(['edit', 'delete'])

const priorityColor = computed(() => {
  switch (props.task.priority) {
    case 'high': return 'border-red-500'
    case 'medium': return 'border-yellow-500'
    case 'low': return 'border-green-500'
    default: return 'border-gray-300'
  }
})

const handleDragStart = (event) => {
  event.dataTransfer.setData('text/plain', props.task.id)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('th-TH')
}
</script>