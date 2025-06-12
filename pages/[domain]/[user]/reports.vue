<template>
  <span class="text-[28px] mr-3">Relatórios</span>
  <div class="my-4">
    
   <Calendar
        v-model="startDate"
        placeholder="Data início"
        showIcon
        dateFormat="dd/mm/yy"
        locale="brLocale"
        class="mr-3"
      />
      <Calendar
        v-model="endDate"
        placeholder="Data fim"
        showIcon
        dateFormat="dd/mm/yy"
        locale="brLocale"
        class="mr-3"
      />
  <Button label="Carregar Transações" @click="load_transactions" class="p-button-raised p-button-success" />
 </div>
  <FinancialTransactionDatatable :transactions="transactions" @view="row_view"/>

<!-- <pre>
  {{ transactions }}
</pre> -->

</template>

<script setup lang="ts">
import FinancialTransactionDatatable from "@/components/FinancialTransactionDatatable.vue";

const route = useRoute();
const domain = route.params.domain;
const transactions = ref([])
const startDate = ref(null)
const endDate = ref(null)

function row_view(row) {
  console.log("Row view clicked:", row);
  alert(`Viewing transaction: ${row.id}`);
  // Implement the logic to view the transaction details
}

function formatDateForSQL(date) {
  if (!date) return null; // Handle null or undefined dates
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months start at 0
  const dd = String(date.getDate()).padStart(2, '0');
  
  // Optional: add time if needed
  return `${yyyy}-${mm}-${dd}`;
}

async function executeQuery(domain, sql) {
  try {
    const response = await fetch(`/api/${domain}/query`, {
      // Changed URL
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sql })
    });
    // Handle errors like before
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle error
  }
}

const load_transactions = async () => {
  const params = {
    start_date: formatDateForSQL(startDate.value),
    end_date: formatDateForSQL(endDate.value)
  };

  console.log("Loading transactions with params:", params);
  

  const sql = `
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
ORDER BY ft.date DESC;`;
  console.log("SQL Query:", sql);
  const res = await executeQuery(domain, sql);
  transactions.value = res
};

load_transactions()

// transactions.value = await load_transactions();
</script>
