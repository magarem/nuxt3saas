<template>
  <span class="text-[20px] mr-3">Relatórios</span>
  <div class="grid grid-cols-2 ">
    <div class="p-2">
      <SuperCard title="Filtros" class="w-full">
       <div class="my-4 flex flex-col gap-4">
  <DatePicker
    v-model="startDate"
    placeholder="Data início"
    showIcon
    dateFormat="dd/mm/yy"
   
    class="mr-3"
  />
  <DatePicker
    v-model="endDate"
    placeholder="Data fim"
    showIcon
    dateFormat="dd/mm/yy"
    
    class="mr-3"
  />
  <Dropdown
    v-model="selectedCategory"
    :options="categories"
    optionLabel="value"
    optionValue="key"
    placeholder="Filtrar por categoria"
    class="min-w-[200px] mr-3"
  />
  
  <!-- Wrap buttons in a flex container -->
  <div class="flex gap-4">
    <Button
      label="Limpar Filtros"
      @click="selectedCategory = null; startDate = null; endDate = null; transactions = []; load_data()"
      class="w-1/2 p-button-raised p-button-secondary"
    />
    <Button
      label="Carregar Transações"
      @click="load_data"
      class="w-1/2 p-button-raised p-button-success"
    />
  </div>
</div>

      </SuperCard>
    </div>
    <div class="p-2">
      <SuperCard title="Resumo Financeiro" class="w-full">
        <LabelValueTable :data="noticeDetails" />
      </SuperCard>
    </div>
    <div class="col-span-2 p-2 my-2">
      <SuperCard title="Lançamentos">
        <FinancialTransactionDatatable
          :transactions="transactions"
          @view="row_view"
        />
      </SuperCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import FinancialTransactionDatatable from "@/components/FinancialTransactionDatatable.vue";
import FinanceCard from '@/components/FinanceCard.vue'
import SuperCard from '@/components/SuperCard.vue'
import {
  executeQuery,
  executeQueryRun,
  formatCurrency,
  formatDateForSQL
} from "@/utils/db";
import LabelValueTable from '@/components/LabelValueTable.vue'

const route = useRoute();
const domain = route.params.domain;
const categories = ref([]);
const selectedCategory = ref();
const transactions = ref([]);
const totals = ref([]);
const startDate = ref(null);
const endDate = ref(null);
const noticeDetails = ref([]);

// Localização em português do Brasil
const brLocale = {
  firstDayOfWeek: 0,
  dayNames: ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"],
  dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
  dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
  monthNames: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
  monthNamesShort: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  today: 'Hoje',
  clear: 'Limpar'
};


async function load_data() {
  transactions.value = await load_transactions();
  totals.value = await load_totais()
  categories.value = await load_categories();
  noticeDetails.value = {
    title: 'Resumo Financeiro',
    subtitle: 'Dados financeiros do período selecionado',
    icon: 'pi pi-chart-line',
    items:[
    { label: 'Total de transações', value: transactions.value.length },
    { label: 'Total de categorias', value: totals.value[0].total_categories },
    { label: 'Total de entradas', value: formatCurrency(totals.value[0]?.entradas || 0) },
    { label: 'Total de saídas', value: formatCurrency(totals.value[0]?.saidas || 0) },
    { label: 'Saldo', value: formatCurrency(totals.value[0]?.saldo || 0)}
  ]}
}

function row_view(row) {
  console.log("Row view clicked:", row);
  alert(`Viewing transaction: ${row.id}`);
  // Implement the logic to view the transaction details
}

const load_categories = async () => {
  const res = await $fetch(`/api/${domain}/categories`);
  return [{ key: "", value: "Limpar filtro" }, ...res];
};

const load_transactions = async () => {
  const params = {
    start_date: formatDateForSQL(startDate.value),
    end_date: formatDateForSQL(endDate.value)
  };

  console.log("Loading transactions with params:", params);

  let sql = `
   WITH RECURSIVE category_path AS (
  SELECT id, parent_id, name, type, name AS full_path
  FROM financial_categories
  WHERE parent_id IS NULL

  UNION ALL

  SELECT fc.id, fc.parent_id, fc.name, fc.type, cp.full_path || ' › ' || fc.name
  FROM financial_categories fc
  JOIN category_path cp ON fc.parent_id = cp.id
)
SELECT
  ft.id,
  ft.amount,
  ft.doc,
  ft.description,
  ft.type,
  fpm.name AS payment_method,
  ft.obs,
  ft.date,
  fc.id AS category_id,
  cp.full_path AS category,
  u.nome AS user,
  c.id AS related_id,
  c.name AS contact_name,
  c.type AS contact_type,          -- New: Contact type (e.g., 1=Person, 2=Company)
  c.doc AS contact_doc,            -- New: CPF/CNPJ
  c.email AS contact_email,        -- New: Email
  c.fone1 AS contact_phone,        -- New: Primary phone
  c.address AS contact_address,    -- New: Address
  fpm.description AS payment_method_description
FROM financial_transactions ft
LEFT JOIN financial_categories fc ON ft.category_id = fc.id
LEFT JOIN category_path cp ON fc.id = cp.id
LEFT JOIN users u ON ft.created_by = u.id
LEFT JOIN contacts c ON ft.related_id = c.id
LEFT JOIN financial_payment_methods fpm ON ft.payment_method = fpm.id
WHERE ft.date BETWEEN
  CASE WHEN ${params.start_date} IS NULL THEN '1970-01-01' ELSE '${params.start_date}' END
  AND
  CASE WHEN ${params.end_date} IS NULL THEN '2100-01-01' ELSE '${params.end_date}' END
`;

 if (selectedCategory.value) {
  sql += `
  AND ft.category_id IN (
  SELECT id FROM category_path
  WHERE full_path LIKE (
    SELECT full_path || '%' FROM category_path WHERE id = ${selectedCategory.value}
  )
  )`
    // sql += ` AND ft.category_id = ${selectedCategory.value}`;
  }

  sql += ` ORDER BY ft.date DESC;`;

  console.log("SQL Query:", sql);
  const res = await executeQuery(domain, sql);
  return res;
};

const load_totais = async () => {
  const params = {
    start_date: formatDateForSQL(startDate.value),
    end_date: formatDateForSQL(endDate.value)
  };

  console.log("totals Loading transactions with params:", params);

  const category_id = selectedCategory.value ?? null

  let sql = `
 WITH RECURSIVE category_path AS (
  -- Build the category tree
  SELECT id, parent_id, name, type, name AS full_path
  FROM financial_categories
  WHERE parent_id IS NULL

  UNION ALL

  SELECT fc.id, fc.parent_id, fc.name, fc.type, cp.full_path || ' › ' || fc.name
  FROM financial_categories fc
  JOIN category_path cp ON fc.parent_id = cp.id
),

filtered_categories AS (
  -- Return categories to filter or all if no category selected
  SELECT id FROM category_path
  WHERE ${category_id} IS NULL
     OR full_path LIKE (
        SELECT full_path || '%' FROM category_path WHERE id = ${category_id}
     )
)

SELECT
  COUNT(*) AS total_operations,
  COUNT(DISTINCT category_id) AS total_categories,
  SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END) AS entradas,
  SUM(CASE WHEN type = 'saída' THEN amount ELSE 0 END) AS saidas,
  SUM(amount) AS saldo
FROM financial_transactions
WHERE date BETWEEN
  CASE WHEN ${params.start_date} IS NULL THEN '1970-01-01' ELSE '${params.start_date}' END
  AND
  CASE WHEN ${params.end_date} IS NULL THEN '2100-01-01' ELSE '${params.end_date}' END
  AND (
    ${category_id} IS NULL
    OR category_id IN (SELECT id FROM filtered_categories)
  );


`;


  // if (selectedCategory.value) {
  //   sql += ` AND category_id IN (SELECT id FROM filtered_categories)`;
  // }


  // if (selectedCategory.value) {
  //   sql += `
  //   AND category_id IN (
  //   SELECT id FROM category_path
  //   WHERE full_path LIKE (
  //     SELECT full_path || '%' FROM category_path WHERE id = ${selectedCategory.value}
  //   )
  //   )`
  //   // sql += ` AND ft.category_id = ${selectedCategory.value}`;
  // }




  console.log("totais - SQL Query:", sql);
  const res = await executeQuery(domain, sql);
  return res;
};

load_data()
</script>
