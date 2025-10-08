<!-- src/components/EditTransactionModal.vue -->
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  transaction: Object
})
const emit = defineEmits(['save', 'close'])

const editTx = ref({ ...props.transaction })

watch(() => props.transaction, (newTx) => {
  editTx.value = { ...newTx }
})

function saveChanges() {
  emit('save', editTx.value)
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Edit Transaction</h2>

      <form @submit.prevent="saveChanges" class="space-y-4">
        <div>
          <label class="text-sm font-medium">Description</label>
          <input v-model="editTx.desc" type="text" class="w-full border px-3 py-2 rounded-lg" required />
        </div>
        <div>
          <label class="text-sm font-medium">Amount</label>
          <input v-model.number="editTx.amount" type="number" min="0" step="0.01" class="w-full border px-3 py-2 rounded-lg" required />
        </div>
        <div>
          <label class="text-sm font-medium">Type</label>
          <select v-model="editTx.type" class="w-full border px-3 py-2 rounded-lg">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label class="text-sm font-medium">Category</label>
          <input v-model="editTx.category" type="text" class="w-full border px-3 py-2 rounded-lg" required />
        </div>
        <div class="flex justify-end gap-2 pt-4">
          <button @click="$emit('close')" type="button" class="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>
