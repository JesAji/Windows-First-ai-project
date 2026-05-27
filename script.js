document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const list = document.getElementById('todo-list');
    const counter = document.getElementById('task-counter');

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Initialize
    renderTasks();

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        
        if (text !== '') {
            addTask(text);
            input.value = '';
            input.focus();
        }
    });

    function addTask(text) {
        const task = {
            id: Date.now().toString(),
            text,
            completed: false
        };
        
        tasks.push(task);
        saveTasks();
        renderTasks();
    }

    function toggleTask(id) {
        tasks = tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        // Find the element and animate it out before removing
        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.style.transform = 'scale(0.95)';
            element.style.opacity = '0';
            
            setTimeout(() => {
                tasks = tasks.filter(task => task.id !== id);
                saveTasks();
                renderTasks();
            }, 300); // Wait for transition
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateCounter() {
        const count = tasks.length;
        const pendingCount = tasks.filter(t => !t.completed).length;
        
        if (count === 0) {
            counter.textContent = 'No tasks';
        } else if (pendingCount === 0) {
            counter.textContent = 'All done!';
        } else {
            counter.textContent = `${pendingCount} task${pendingCount !== 1 ? 's' : ''} remaining`;
        }
    }

    function renderTasks() {
        // Clear list
        list.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.setAttribute('data-id', task.id);
            // Ensuring smooth removal transition
            li.style.transition = 'all 0.3s ease';

            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${escapeHTML(task.text)}</span>
                <button class="delete-btn" aria-label="Delete task">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;

            // Event Listeners for the generated elements
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTask(task.id));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            list.appendChild(li);
        });

        updateCounter();
    }

    // Utility function to prevent XSS
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
