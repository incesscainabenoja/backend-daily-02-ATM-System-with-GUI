💳 Day 2 – ATM System with GUI

A simple Node.js + Express project that simulates an ATM system with a clean black-themed user interface.  
Users can log in with a demo PIN, check their balance, deposit, withdraw, and view recent transactions.  

Features
- Login with PIN
- Deposit money
- Withdraw money (with insufficient funds check)
- View Balance anytime
- Transaction History
- Modern black sleek UI with notifications


🛠 Technologies Used
- Node.js
- Express.js
- Express-Session
- UUID
- Vanilla JS (Frontend)
- HTML + CSS (Custom UI)



🚀 How to Run

1. Clone the repository
```git clone
https://github.com/incesscainabenoja/backend-daily-02-ATM-System-with-GUI
cd day-02-atm-gui
```

2. Install dependencieds
```
npm install
```

4. Set up environment variables
Create a .env file in the root:
env
```
SESSION_SECRET=your_secret_key
PORT=port
```
4. Start the server
```
npm run dev
```
Server will run at:
```
http://localhost:3000
```

Future Improvements
- Add multi-user support (each with own balance + PIN)  
- Add savings goals or budgeting features  
- Connect to a database (SQLite / MongoDB)  
- Add ATM card animation UI  
- Deploy on Vercel / Render for live demo  
- Add Login & Register system (user authentication + new account creation)
  

By: https://github.com/incesscainabenoja
