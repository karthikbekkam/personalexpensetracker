/* ---------- LOGIN ---------- */
function login() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  const user = JSON.parse(localStorage.getItem(email));
  if (!user || user.password !== password) {
    alert("Invalid email or password");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "index.html";
}

/* ---------- SIGNUP ---------- */
function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirm = document.getElementById("confirm").value.trim();

  if (name === "" || email === "" || password === "" || confirm === "") {
    alert("All fields are required");
    return;
  }

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  if (localStorage.getItem(email)) {
    alert("User already exists");
    return;
  }

  const user = {
    name: name,
    email: email,
    password: password
  };

  localStorage.setItem(email, JSON.stringify(user));

  alert("Signup successful! Please login.");
  window.location.href = "login.html";
}

/* ---------- DASHBOARD ---------- */
let totalIncome = 0;
let balance = 0;

if (location.pathname.includes("dashboard.html")) 
 {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (!user) window.location.href = "login.html";

  pName.innerText = user.name;
  pEmail.innerText = user.email;

  profileIcon.onclick = () => {
    profileBox.style.display =
      profileBox.style.display === "block" ? "none" : "block";
  };
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

/* ---------- SET INCOME ---------- */
function setIncome() {
  const val = Number(incomeInput.value);
  if (!val || val <= 0) {
    alert("Enter valid income");
    return;
  }

  totalIncome = val;
  balance = val;

  totalIncomeEl.innerText = totalIncome;
  balanceEl.innerText = balance;

  incomeInput.value = "";
}

/* ---------- ADD EXPENSE ---------- */
function addExpense() {
  const descVal = desc.value.trim();
  const amtVal = Number(amt.value);

  if (!/^[a-zA-Z\s]+$/.test(descVal)) {
    alert("Description must contain letters only");
    return;
  }

  if (!amtVal || amtVal <= 0) {
    alert("Enter valid amount");
    return;
  }

  if (amtVal > balance) {
    alert("Insufficient balance");
    return;
  }

  balance -= amtVal;
  balanceEl.innerText = balance;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${new Date().toLocaleDateString()}</td>
    <td>${descVal}</td>
    <td>₹ ${amtVal}</td>
    <td><button class="btn-green" onclick="deleteRow(this, ${amtVal})">Delete</button></td>
  `;
  table.appendChild(row);

  desc.value = "";
  amt.value = "";
}

function deleteRow(btn, amt) {
  btn.closest("tr").remove();
  balance += amt;
  balanceEl.innerText = balance;
}

/* ---------- CLEAR ---------- */
function clearAll() {
  if (!confirm("Clear all expenses?")) return;
  table.innerHTML = "";
  balance = totalIncome;
  balanceEl.innerText = balance;
}

/* ---------- EXPORT PDF ---------- */
function exportPDF() {
  if (table.rows.length === 0) {
    alert("No data to export");
    return;
  }
  html2pdf().from(document.querySelector("table"))
    .save("Expense_History.pdf");
}
