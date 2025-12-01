const form = document.getElementById("expense-form");
const listEl = document.getElementById("expense-list");
const emptyStateEl = document.getElementById("empty-state");
const clearBtn = document.getElementById("clear-btn");
const totalAmountEl = document.getElementById("total-amount");

const STORAGE_KEY = "expenses-v1";

let expenses = [];
let chartInstance = null;

function loadExpenses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function renderList() {
  listEl.innerHTML = "";

  if (expenses.length === 0) {
    emptyStateEl.style.display = "block";
    totalAmountEl.textContent = "";
    return;
  }

  emptyStateEl.style.display = "none";

  expenses
    .slice()
    .reverse()
    .forEach((exp) => {
      const li = document.createElement("li");
      li.className = "expense-item";

      const main = document.createElement("div");
      main.className = "expense-main";
      const desc = document.createElement("div");
      desc.className = "expense-description";
      desc.textContent = exp.description;
      main.appendChild(desc);

      const meta = document.createElement("div");
      meta.className = "expense-meta";

      const amount = document.createElement("div");
      amount.className = "amount";
      amount.textContent = `${exp.amount.toFixed(2)} €`;

      const cat = document.createElement("span");
      cat.className = "category-pill";
      cat.textContent = exp.category;

      meta.appendChild(amount);
      meta.appendChild(cat);

      const delBtn = document.createElement("button");
      delBtn.className = "ghost-btn danger";
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteExpense(exp.id);

      li.appendChild(main);
      li.appendChild(meta);
      li.appendChild(delBtn);

      listEl.appendChild(li);
    });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalAmountEl.textContent = `Total: ${total.toFixed(2)} €`;
}

function renderChart() {
  const ctx = document.getElementById("categoryChart").getContext("2d");

  const byCategory = {};
  expenses.forEach((e) => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  });

  const labels = Object.keys(byCategory);
  const data = Object.values(byCategory);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "€ per category",
          data,
          borderWidth: 1
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "#e5e7eb"
          }
        }
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(148, 163, 184, 0.2)" }
        },
        y: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(148, 163, 184, 0.2)" }
        }
      }
    }
  });
}

function updateUI() {
  renderList();
  renderChart();
  saveExpenses();
}

function addExpense(description, amount, category) {
  expenses.push({
    id: Date.now(),
    description,
    amount,
    category
  });
  updateUI();
}

function deleteExpense(id) {
  expenses = expenses.filter((e) => e.id !== id);
  updateUI();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const description = document.getElementById("description").value.trim();
  const amountVal = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;

  if (!description || isNaN(amountVal) || amountVal <= 0) return;

  addExpense(description, amountVal, category);
  form.reset();
});

clearBtn.addEventListener("click", () => {
  if (!confirm("Clear all expenses?")) return;
  expenses = [];
  updateUI();
});

expenses = loadExpenses();
updateUI();
