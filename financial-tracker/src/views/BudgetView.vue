<script setup>
import { ref, onMounted } from 'vue'
import { useTransactionStore } from '../stores/transactionStore'
import { useBudgetStore } from '../stores/budgetStore'
import EditModal from '../components/EditModal.vue'

const txStore = useTransactionStore()
const budgetStore = useBudgetStore()

const category = ref('')
const limit = ref('')
const showEditModal = ref(false)
const selectedBudget = ref(null)

onMounted(() => {
  txStore.loadTransactions()
  budgetStore.loadBudgets()
})

const addBudget = async () => {
  if (!category.value || !limit.value) return
  await budgetStore.addBudget({ category: category.value, limit: parseFloat(limit.value) })
  category.value = ''
  limit.value = ''
}

const spent = (cat) => {
  return txStore.transactions
    .filter(t => t.category === cat && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
}

const progressWidth = (cat, limit) => {
  const total = spent(cat)
  const pct = (total / limit) * 100
  return pct > 100 ? 100 : pct
}

const openEditModal = (budget) => {
  selectedBudget.value = { ...budget }
  showEditModal.value = true
}

const handleEditSave = async (updatedBudget) => {
  await budgetStore.updateBudget(updatedBudget)
  showEditModal.value = false
  selectedBudget.value = null
}
</script>

<template>
  <div class="p-6 bg-white rounded-xl shadow-md max-w-4xl mx-auto mt-6">
    <header class="flex justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          <i class="fas fa-wallet mr-2"></i> Budget Management
        </h1>
        <p class="text-sm text-gray-600">
          <i class="fas fa-coins mr-1"></i> Set and track your spending limits
        </p>
      </div>
      <router-link to="/dashboard" class="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center">
        <i class="fas fa-arrow-left mr-2"></i> Back to Dashboard
      </router-link>
    </header>

    <div class="bg-gray-50 p-4 rounded-xl mb-6">
      <h2 class="text-lg font-bold mb-3">
        <i class="fas fa-plus-circle mr-2"></i> Add Budget
      </h2>
      <form @submit.prevent="addBudget" class="grid grid-cols-2 gap-3">
        <select v-model="category" class="border px-3 py-2 rounded-lg">
          <option disabled value="">Select category</option>
          <option v-for="cat in txStore.categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <input v-model.number="limit" type="number" placeholder="Amount limit" class="border px-3 py-2 rounded-lg justify-center" required>
        <button type="submit" class="col-span-2 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center">
          Add Budget
        </button>
      </form>
    </div>

    <div>
      <h2 class="text-lg font-bold mb-3">
        <i class="fas fa-list-alt mr-2"></i> Your Budgets
      </h2>
      <div v-if="budgetStore.budgets.length === 0" class="text-gray-600 text-center py-4">
        <i class="fas fa-info-circle mr-2"></i> No budgets set yet.
      </div>

      <ul v-else class="space-y-4">
        <li v-for="b in budgetStore.budgets" :key="b.id" class="p-4 border rounded-xl">
          <div class="flex justify-between mb-2">
            <h3 class="font-semibold">
              <i class="fas fa-tag mr-1"></i>{{ b.category }}
            </h3>
            <div class="flex gap-2">
              <button @click="openEditModal(b)" class="text-blue-600">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="budgetStore.deleteBudget(b.id)" class="text-red-600">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <div class="h-4 bg-gray-200 rounded-lg overflow-hidden">
            <div
              class="h-4 bg-blue-600"
              :style="{ width: progressWidth(b.category, b.limit) + '%' }">
            </div>
          </div>
          <div class="text-sm text-gray-700 mt-2">
            <i class="fas fa-coins mr-1"></i> ₱{{ (spent(b.category) || 0).toFixed(2) }}
            of ₱{{ (b.limit || 0).toFixed(2) }}
          </div>
        </li>
      </ul>
    </div>

    <!-- Edit Modal -->
    <EditModal
      v-if="showEditModal"
      :budget="selectedBudget"
      @save="handleEditSave"
      @close="showEditModal = false"
    />
  </div>
</template>