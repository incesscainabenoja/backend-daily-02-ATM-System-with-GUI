// Login
document.getElementById("login-btn").addEventListener("click", async () => {
  const pin = document.getElementById("pin").value;
  if (!pin) return alert("⚠️ Please enter your PIN.");

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin }),
  });

  const data = await res.json();
  if (data.success) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("atm-section").style.display = "block";
    document.getElementById("welcome").innerText = `👋 Welcome, ${data.name}!`;
    loadAccount();
  } else {
    alert("❌ Invalid PIN");
  }

  // clear PIN input
  document.getElementById("pin").value = "";
});

// Load account info
async function loadAccount() {
  const res = await fetch("/api/account");
  const data = await res.json();
  document.getElementById("balance").innerText = `₱${data.balance.toFixed(2)}`;
}

// Deposit
document.getElementById("deposit-btn").addEventListener("click", async () => {
  const amount = parseFloat(document.getElementById("amount").value);
  if (!amount) return alert("⚠️ Please enter an amount.");

  const res = await fetch("/api/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  const data = await res.json();
  if (data.success) {
    showNotification(`✅ Successfully deposited ₱${amount.toFixed(2)}`);
    loadAccount();
  } else {
    alert(data.error);
  }

  // Clear input
  document.getElementById("amount").value = "";
});

// Withdraw
document.getElementById("withdraw-btn").addEventListener("click", async () => {
  const amount = parseFloat(document.getElementById("amount").value);
  if (!amount) return alert("⚠️ Please enter an amount.");

  const res = await fetch("/api/withdraw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  const data = await res.json();
  if (data.success) {
    showNotification(`✅ Successfully withdrew ₱${amount.toFixed(2)}`);
    loadAccount();
  } else {
    alert(data.error);
  }

  // Clear input
  document.getElementById("amount").value = "";
});

// Logout
document.getElementById("logout-btn").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST" });
  document.getElementById("login-section").style.display = "block";
  document.getElementById("atm-section").style.display = "none";
});

// Notification popup
function showNotification(message) {
  const notif = document.getElementById("notification");
  notif.innerText = message;
  notif.style.display = "block";

  setTimeout(() => {
    notif.style.display = "none";
  }, 3000);
}
