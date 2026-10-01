let todos = JSON.parse(localStorage.getItem('my_todos')) || [];
let currentFilter = 'all';

// Set Current Date in Header
document.getElementById('current-date').innerText = new Date().toLocaleDateString('en-US', { 
  weekday: 'short', month: 'short', day: 'numeric' 
});

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    todos.push({ id: Date.now(), text, completed: false });
    input.value = '';
    saveAndRender();
  }
});

function toggleTask(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveAndRender();
}

function deleteTask(id) {
  todos = todos.filter(t => t.id !== id);
  saveAndRender();
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  saveAndRender();
}

function filterTasks(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('bg-indigo-600', 'text-white');
    btn.classList.add('bg-gray-100', 'text-gray-600');
  });
  event.target.classList.remove('bg-gray-100', 'text-gray-600');
  event.target.classList.add('bg-indigo-600', 'text-white');
  render();
}

function saveAndRender() {
  localStorage.setItem('my_todos', JSON.stringify(todos));
  render();
}

function render() {
  todoList.innerHTML = '';
  
  let filtered = todos;
  if (currentFilter === 'pending') filtered = todos.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = todos.filter(t => t.completed);

  if (filtered.length === 0) {
    todoList.innerHTML = `<li class="text-center py-6 text-gray-400 text-sm">No tasks found!</li>`;
  } else {
    filtered.forEach(todo => {
      const li = document.createElement('li');
      li.className = `flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition border border-gray-100 ${todo.completed ? 'opacity-60' : ''}`;
      
      li.innerHTML = `
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <input 
            type="checkbox" 
            ${todo.completed ? 'checked' : ''} 
            onclick="toggleTask(${todo.id})"
            class="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
          />
          <span class="text-sm text-gray-700 truncate ${todo.completed ? 'line-through text-gray-400' : ''}">
            ${todo.text}
          </span>
        </div>
        <button onclick="deleteTask(${todo.id})" class="text-gray-400 hover:text-red-500 px-2 transition font-semibold">
          ✕
        </button>
      `;
      todoList.appendChild(li);
    });
  }

  // Update Task Counters
  const pending = todos.filter(t => !t.completed).length;
  const completed = todos.filter(t => t.completed).length;
  document.getElementById('pending-count').innerText = `${pending} Pending`;
  document.getElementById('completed-stats').innerText = `${completed} completed`;
}

// Initial Call
render();
