// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDFeV4uPGpbajUAGoxSbrLET3BPM4-BR-A",
    authDomain: "todo-app-adnan.firebaseapp.com",
    databaseURL: "https://todo-app-adnan-default-rtdb.firebaseio.com",
    projectId: "todo-app-adnan",
    storageBucket: "todo-app-adnan.appspot.com",
    messagingSenderId: "287818362090",
    appId: "1:287818362090:web:d8584efacc33cbd4ef3b93"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Get elements
const input = document.getElementById('input');
const list = document.getElementById('list');

// Load todos when page loads
window.onload = loadTodos;

// 1. First show in console, then send to Firebase
function addTodo() {
    const task = input.value.trim();
    
    if (!task) {
        alert("Please enter a task!");
        return;
    }
    
    // Show in console first
    console.log("Adding task:", task);
    
    // Then add to Firebase
    const newTaskRef = db.ref('todos').push();
    newTaskRef.set({
        text: task,
        timestamp: Date.now()
    });
    
    input.value = "";
}

// 2. Load todos from Firebase
function loadTodos() {
    db.ref('todos').orderByChild('timestamp').on('value', (snapshot) => {
        list.innerHTML = "";
        
        snapshot.forEach(child => {
            const task = child.val().text;
            const id = child.key;
            showTask(task, id);
        });
    });
}

// 3. Show task in UI
function showTask(task, id) {
    const li = document.createElement('li');
    li.setAttribute('data-id', id);
    li.textContent = task;
    
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'dltBtn';
    delBtn.onclick = () => deleteTodo(id);
    
    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'editBtn';
    editBtn.onclick = () => editTodo(id, li);
    
    li.append(delBtn, editBtn);
    list.prepend(li);
}

// 4. Delete todo
function deleteTodo(id) {
    db.ref('todos/' + id).remove();
}

// 5. Edit todo
function editTodo(id, li) {
    const currentText = li.firstChild.textContent;
    const newText = prompt("Edit your task:", currentText);
    
    if (newText && newText !== currentText) {
        db.ref('todos/' + id).update({
            text: newText,
            timestamp: Date.now()
        });
    }
}

// 6. Clear all
function clearAll() {
    if (confirm("Delete all tasks?")) {
        db.ref('todos').remove();
    }
}