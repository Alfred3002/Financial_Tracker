<!-- <script setup>
defineProps({
  transactions: Array
})
</script>

<template>
  <div>
    <h2 class="fas fa-list text-lg font-semibold mb-2">Recent Transactions</h2>
    <ul v-if="transactions.length" class="divide-y divide-gray-200">
      <li v-for="t in transactions" :key="t.id" class="py-2 flex justify-between">
        <span>{{ t.desc }} ({{ t.category }})</span>
        <span :class="t.type === 'income' ? 'text-green-600' : 'text-red-600'">₱{{ t.amount }}</span>
      </li>
    </ul>
    <p v-else class="text-gray-500 text-sm">No transactions yet.</p>
  </div>
</template> -->

<!-- TransactionList.vue -->
<script setup>
defineProps({
  transactions: Array,
  onDelete: Function
})
</script>

<template>
  <div class="bg-white p-4 rounded-xl shadow-md">
    <h2 class="text-lg font-bold mb-3">Transactions</h2>
    <ul v-if="transactions.length" class="divide-y divide-gray-200">
      <li v-for="tx in transactions" :key="tx.id" class="flex justify-between py-2">
        <div>
          <p class="font-semibold">{{ tx.desc }}</p>
          <p class="text-xs text-gray-500">{{ tx.category }} | {{ tx.type }}</p>
        </div>
        <div class="flex gap-2 items-center">
          <span :class="tx.type === 'income' ? 'text-green-600' : 'text-red-600'">
            ₱{{ tx.amount }}
          </span>
          <button @click="onDelete(tx.id)" class="text-red-600"><i class="fas fa-trash"></i></button>
        </div>
      </li>
    </ul>
    <p v-else class="text-gray-500 text-sm">No transactions yet.</p>
  </div>
</template>
