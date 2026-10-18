// DOM Elements
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const totalCountEl = document.getElementById('total-count');
const completedCountEl = document.getElementById('completed-count');

// Local Storage se Tasks Load Karein
let tasks = JSON.parse(localStorage.getItem('todo_tasks')) || [];

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
});

// Local Storage me Save
function saveTasks() {
  localStorage.setItem('todo_tasks', JSON.stringify(tasks));
}

// Stats Update
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;

  totalCountEl.textContent = total;
  completedCountEl.textContent = completed;

  if (total === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
  }
}

// Add New Task
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();

  if (text !== '') {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = '';
  }
});

// Complete / Uncomplete Toggle
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Render Tasks to UI
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="task-left">
        <button 
          onclick="toggleTask(${task.id})" 
          class="btn-check ${task.completed ? 'checked' : ''}"
        >
          ${task.completed ? '<i class="fa-solid fa-check"></i>' : ''}
        </button>
        <span class="task-text">${escapeHtml(task.text)}</span>
      </div>
      <button 
        onclick="deleteTask(${task.id})" 
        class="btn-delete"
        title="Delete Task"
      >
        <i class="fa-regular fa-trash-can"></i>
      </button>
    `;

    taskList.appendChild(li);
  });

  updateStats();
}

// Prevent XSS Injection
function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}