# Task Manager Web App

A lightweight task management application built with vanilla HTML, CSS, and JavaScript. No frameworks, no build tools - just clean, simple code with localStorage persistence.

## Features

- **Add tasks** - Create new tasks with a simple form
- **Complete tasks** - Click to mark tasks as done
- **Delete tasks** - Remove tasks you no longer need
- **Persistent storage** - Tasks saved to localStorage
- **No backend required** - Runs entirely in the browser
- **Responsive design** - Works on desktop and mobile

## Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling |
| Vanilla JavaScript | Logic & DOM manipulation |
| localStorage | Data persistence |

## Run Locally

Simply open `index.html` in your browser:

```powershell
cd task-manager-web

# Option 1: Direct file open
start index.html

# Option 2: Use a simple HTTP server
python -m http.server 8080
# Then open http://localhost:8080
```

## Project Structure

```
task-manager-web/
├── index.html      # Main HTML file
├── style.css       # Styles
├── script.js       # JavaScript logic
└── README.md
```

## localStorage API

Tasks are stored as JSON in localStorage:

```javascript
// Data structure
[
  { "id": 1, "text": "Learn JavaScript", "completed": false },
  { "id": 2, "text": "Build a project", "completed": true }
]
```

## Key Concepts Demonstrated

- DOM manipulation without frameworks
- Event handling (click, submit)
- localStorage for client-side persistence
- CSS styling and responsive design
- Clean code organization

## Why Vanilla JS?

This project demonstrates that you don't always need heavy frameworks. For simple applications, vanilla JavaScript is:
- Faster to load
- Easier to understand
- No build step required
- Great for learning fundamentals
