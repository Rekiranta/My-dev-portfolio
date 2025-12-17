# Expense Tracker Dashboard

A personal finance tracker with real-time chart visualization. Built with vanilla JavaScript and Chart.js for interactive expense analytics.

## Features

- **Add expenses** - Log expenses with description, amount, and category
- **Category breakdown** - Visual bar chart showing spending per category
- **Running totals** - See total spending at a glance
- **Delete expenses** - Remove individual entries
- **Persistent storage** - Data saved to localStorage
- **No backend required** - Runs entirely in the browser

## Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Dashboard styling |
| Vanilla JavaScript | Logic & DOM manipulation |
| Chart.js | Data visualization |
| localStorage | Data persistence |

## Run Locally

Simply open `index.html` in your browser:

```powershell
cd expense-tracker-charts

# Option 1: Direct file open
start index.html

# Option 2: Use a simple HTTP server
python -m http.server 8000
# Then open http://localhost:8000
```

## Project Structure

```
expense-tracker-charts/
├── index.html      # Main HTML file
├── style.css       # Dashboard styles
├── app.js          # JavaScript logic
└── README.md
```

## Data Structure

Expenses are stored as JSON in localStorage:

```javascript
[
  { "id": 1702345678901, "description": "Groceries", "amount": 45.50, "category": "Food" },
  { "id": 1702345679123, "description": "Bus ticket", "amount": 2.80, "category": "Transport" }
]
```

## Key Concepts Demonstrated

- DOM manipulation without frameworks
- Chart.js integration for data visualization
- Event handling (form submit, click)
- localStorage for client-side persistence
- Responsive dashboard layout
- Clean code organization

## Categories

Default expense categories:
- Food
- Transport
- Entertainment
- Utilities
- Shopping
- Other

