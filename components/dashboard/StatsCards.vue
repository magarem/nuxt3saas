<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <Card v-for="(stat, index) in data" :key="index" class="shadow-sm">
      <template #content>
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-full" :class="stat.color + ' bg-opacity-10'">
            <i :class="stat.icon" class="text-xl"></i>
          </div>
          <div>
            <p class="text-gray-500 mb-1">{{ stat.title }}</p>
            <h3 class="text-2xl font-semibold">{{ stat.value }}</h3>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>