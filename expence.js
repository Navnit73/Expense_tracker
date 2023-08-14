// Get DOM elements
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("money-plus");
const expenseEl = document.getElementById("money-minus");
const listEl = document.getElementById("list");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const form = document.getElementById("form");

// Initialize transactions array
let transactions = [];

// Function to add transaction to the list
function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = +amountInput.value;

  if (text === "" || amount === 0) {
    alert("Please enter a valid text and amount.");
    return;
  }

  const transaction = {
    id: generateID(),
    text,
    amount,
  };

  transactions.push(transaction);

  updateLocalStorage();
  updateUI();
  clearInputs();
}

// Function to generate a unique ID for each transaction
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

// Function to update local storage with transactions data
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to update the UI with transaction data
function updateUI() {
  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);

  const expense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2);

  const balance = (income - Math.abs(expense)).toFixed(2);

  balanceEl.textContent = `$${balance}`;
  incomeEl.textContent = `$${income}`;
  expenseEl.textContent = `-$${Math.abs(expense)}`;

  listEl.innerHTML = "";
  transactions.forEach((transaction) => {
    const sign = transaction.amount < 0 ? "-" : "+";
    const listItem = document.createElement("li");
    listItem.classList.add(transaction.amount < 0 ? "minus" : "plus");
    listItem.innerHTML = `
      ${transaction.text} 
      <span>${sign}$${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    listEl.appendChild(listItem);
  });
}

// Function to remove a transaction from the list
function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  updateUI();
}

// Function to clear the text and amount inputs
function clearInputs() {
  textInput.value = "";
  amountInput.value = "";
}

// Load transactions from local storage on page load
function init() {
  const storedTransactions = JSON.parse(localStorage.getItem("transactions"));
  if (storedTransactions) {
    transactions = storedTransactions;
  }
  updateUI();
}

// Event listener for form submission
form.addEventListener("submit", addTransaction);

// Initialize the application on page load
init();
