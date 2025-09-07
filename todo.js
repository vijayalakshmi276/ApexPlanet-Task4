// Utils
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
const YEAR = $("#year"); if (YEAR) YEAR.textContent = new Date().getFullYear();

const LS_KEYS = { todos: "app.todos.v1", notes: "app.notes.v1" };

// ---------- TO-DO ----------
const todoForm = $("#todoForm");
const todoInput = $("#todoInput");
const todoList = $("#todoList");
const todoCount = $("#todoCount");
const filterStatus = $("#filterStatus");
const clearCompletedBtn = $("#clearCompleted");

let todos = JSON.parse(localStorage.getItem(LS_KEYS.todos) || "[]");

function saveTodos() { localStorage.setItem(LS_KEYS.todos, JSON.stringify(todos)); }
function renderTodos() {
  const filter = filterStatus.value;
  const filtered = todos.filter(t => filter === "all" || (filter === "active" ? !t.done : t.done));

  todoList.innerHTML = "";
  filtered.forEach(t => {
    const li = document.createElement("li");
    li.className = `todo-item ${t.done ? "completed": ""}`;
    li.innerHTML = `
      <input type="checkbox" aria-label="mark done" ${t.done ? "checked": ""}/>
      <span class="title" contenteditable="true"></span>
      <div class="row">
        <button class="btn small edit">Save</button>
        <button class="btn small danger">Delete</button>
      </div>
    `;
    const checkbox = $("input[type=checkbox]", li);
    const title = $(".title", li);
    const editBtn = $(".edit", li);
    const delBtn = $(".danger", li);

    title.textContent = t.title;

    checkbox.addEventListener("change", () => {
      t.done = checkbox.checked; saveTodos(); renderTodos();
    });
    editBtn.addEventListener("click", () => {
      t.title = title.textContent.trim() || t.title; saveTodos(); renderTodos();
    });
    delBtn.addEventListener("click", () => {
      todos = todos.filter(x => x.id !== t.id); saveTodos(); renderTodos();
    });

    todoList.appendChild(li);
  });

  const remaining = todos.filter(t => !t.done).length;
  todoCount.textContent = `${remaining} item(s) remaining • ${todos.length} total`;
}
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = todoInput.value.trim();
  if (!title) return;
  todos.unshift({ id: crypto.randomUUID(), title, done: false, created: Date.now() });
  todoInput.value = ""; saveTodos(); renderTodos();
});
filterStatus.addEventListener("change", renderTodos);
clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.done); saveTodos(); renderTodos();
});
renderTodos();

// ---------- NOTES ----------
const noteForm = $("#noteForm");
const noteTitle = $("#noteTitle");
const noteContent = $("#noteContent");
const notesGrid = $("#notesGrid");

let notes = JSON.parse(localStorage.getItem(LS_KEYS.notes) || "[]");

function saveNotes() { localStorage.setItem(LS_KEYS.notes, JSON.stringify(notes)); }
function noteCard(n) {
  const div = document.createElement("div");
  div.className = "note";
  div.innerHTML = `
    <header>
      <strong contenteditable="true" class="title"></strong>
      <div class="row">
        <button class="btn small save">Save</button>
        <button class="btn small danger">Delete</button>
      </div>
    </header>
    <div contenteditable="true" class="content"></div>
    <p class="muted" style="margin-top:.4rem;">${new Date(n.updated).toLocaleString()}</p>
  `;
  $(".title", div).textContent = n.title;
  $(".content", div).textContent = n.content;

  $(".save", div).addEventListener("click", () => {
    n.title = $(".title", div).textContent.trim();
    n.content = $(".content", div).textContent.trim();
    n.updated = Date.now();
    saveNotes(); renderNotes();
  });
  $(".danger", div).addEventListener("click", () => {
    notes = notes.filter(x => x.id !== n.id);
    saveNotes(); renderNotes();
  });
  return div;
}
function renderNotes() {
  notesGrid.innerHTML = "";
  if (!notes.length) notesGrid.innerHTML = `<p class="muted">No notes yet. Create one!</p>`;
  notes.forEach(n => notesGrid.appendChild(noteCard(n)));
}
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = noteTitle.value.trim();
  const content = noteContent.value.trim();
  if (!title || !content) return;
  notes.unshift({ id: crypto.randomUUID(), title, content, updated: Date.now() });
  noteForm.reset(); saveNotes(); renderNotes();
});
renderNotes();
