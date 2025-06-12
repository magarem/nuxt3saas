<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="header">
      <h1>Financial Controller Dashboard</h1>
      <Calendar v-model="dateRange" selectionMode="range" :manualInput="false" dateFormat="dd/mm/yy" />
    </div>

    <!-- KPI Cards -->
    <div class="card-container">
      <Card class="kpi-card">
        <template #title>Total Revenue</template>
        <template #content>
          <h2>{{ formatCurrency(kpis.totalRevenue) }}</h2>
          <span :class="['trend', kpis.revenueTrend >= 0 ? 'positive' : 'negative']">
            <i :class="kpis.revenueTrend >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
            {{ Math.abs(kpis.revenueTrend) }}%
          </span>
        </template>
      </Card>

      <Card class="kpi-card">
        <template #title>Total Expenses</template>
        <template #content>
          <h2>{{ formatCurrency(kpis.totalExpenses) }}</h2>
          <span :class="['trend', kpis.expenseTrend >= 0 ? 'negative' : 'positive']">
            <i :class="kpis.expenseTrend >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
            {{ Math.abs(kpis.expenseTrend) }}%
          </span>
        </template>
      </Card>

      <Card class="kpi-card">
        <template #title>Net Profit</template>
        <template #content>
          <h2>{{ formatCurrency(kpis.netProfit) }}</h2>
          <span :class="['trend', kpis.profitTrend >= 0 ? 'positive' : 'negative']">
            <i :class="kpis.profitTrend >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
            {{ Math.abs(kpis.profitTrend) }}%
          </span>
        </template>
      </Card>

      <Card class="kpi-card">
        <template #title>Cash Flow</template>
        <template #content>
          <h2>{{ formatCurrency(kpis.cashFlow) }}</h2>
          <span :class="['trend', kpis.cashFlowTrend >= 0 ? 'positive' : 'negative']">
            <i :class="kpis.cashFlowTrend >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
            {{ Math.abs(kpis.cashFlowTrend) }}%
          </span>
        </template>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="chart-row">
      <Card class="chart-card">
        <template #title>Revenue vs Expenses</template>
        <template #content>
          <Bar :chart-data="revenueExpenseChartData" :options="chartOptions" />
        </template>
      </Card>

      <Card class="chart-card">
        <template #title>Profit by Category</template>
        <template #content>
          <Pie :chart-data="profitCategoryChartData" :options="pieChartOptions" />
        </template>
      </Card>
    </div>

    <!-- Transactions Table -->
    <Card class="table-card">
      <template #title>Recent Transactions</template>
      <template #content>
        <DataTable :value="transactions" :paginator="true" :rows="10" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
          <Column field="date" header="Date" :sortable="true"></Column>
          <Column field="description" header="Description" :sortable="true"></Column>
          <Column field="category" header="Category" :sortable="true"></Column>
          <Column field="amount" header="Amount" :sortable="true">
            <template #body="{data}">
              <span :class="data.type === 'entrada' ? 'positive' : 'negative'">
                {{ formatCurrency(data.amount) }}
              </span>
            </template>
          </Column>
          <Column field="payment_method" header="Payment Method" :sortable="true"></Column>
        </DataTable>
      </template>
    </Card>

    <!-- Aging Reports -->
    <div class="chart-row">
      <Card class="chart-card">
        <template #title>Accounts Receivable Aging</template>
        <template #content>
          <Bar :chart-data="receivableAgingData" :options="chartOptions" />
        </template>
      </Card>

      <Card class="chart-card">
        <template #title>Accounts Payable Aging</template>
        <template #content>
          <Bar :chart-data="payableAgingData" :options="chartOptions" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

// Sample data - in a real app this would come from an API
const transactions = ref([
  { id: 1, date: '2023-05-01', description: 'Product Sales', category: 'Sales Revenue', amount: 15000, type: 'entrada', payment_method: 'Credit Card' },
  { id: 2, date: '2023-05-02', description: 'Office Supplies', category: 'Operating Expenses', amount: 450, type: 'saida', payment_method: 'Bank Transfer' },
  // More transactions...
]);

const dateRange = ref([new Date(), new Date()]);

// KPI data
const kpis = ref({
  totalRevenue: 125000,
  revenueTrend: 12.5,
  totalExpenses: 75000,
  expenseTrend: 8.2,
  netProfit: 50000,
  profitTrend: 15.3,
  cashFlow: 35000,
  cashFlowTrend: 5.7
});

// Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

// Chart data
const revenueExpenseChartData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      backgroundColor: '#4CAF50',
      data: [12000, 19000, 15000, 18000, 16000, 20000]
    },
    {
      label: 'Expenses',
      backgroundColor: '#F44336',
      data: [8000, 12000, 10000, 11000, 9500, 13000]
    }
  ]
}));

const profitCategoryChartData = computed(() => ({
  labels: ['Product Sales', 'Services', 'Investments', 'Other Income'],
  datasets: [{
    backgroundColor: ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B'],
    data: [65000, 35000, 20000, 5000]
  }]
}));

const receivableAgingData = computed(() => ({
  labels: ['Current', '1-30 Days', '31-60 Days', '61-90 Days', 'Over 90 Days'],
  datasets: [{
    label: 'Receivables',
    backgroundColor: '#2196F3',
    data: [25000, 15000, 8000, 5000, 3000]
  }]
}));

const payableAgingData = computed(() => ({
  labels: ['Current', '1-30 Days', '31-60 Days', '61-90 Days', 'Over 90 Days'],
  datasets: [{
    label: 'Payables',
    backgroundColor: '#FF9800',
    data: [18000, 12000, 6000, 4000, 2000]
  }]
}));

// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return context.dataset.label + ': ' + formatCurrency(context.raw);
        }
      }
    }
  }
});

const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right'
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${formatCurrency(value)} (${percentage}%)`;
        }
      }
    }
  }
});

// In a real app, you would fetch data here
onMounted(() => {
  // fetchData();
});
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.kpi-card {
  text-align: center;
}

.kpi-card h2 {
  margin: 10px 0;
  font-size: 1.8rem;
}

.trend {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
}

.positive {
  color: #4CAF50;
}

.negative {
  color: #F44336;
}

.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
}

.table-card {
  margin-bottom: 20px;
}
</style>