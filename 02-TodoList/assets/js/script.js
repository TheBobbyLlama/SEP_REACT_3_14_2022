const storageToken = "Antra-Todo";

const todoItems = JSON.parse(localStorage.getItem(storageToken)) || [];

var idCounter = todoItems.length;

const listElement = document.querySelector("#todoList");
const modalBG = document.querySelector("#modalBG");
const deleteForm = document.querySelector("#deleteForm");
const deleteText = document.querySelector("#deleteText");

/* TODO LIST FUNCTIONS */

function saveTodoList() {
	// Clean up ids, only store complete flag if needed.
	const todoSave = todoItems.map((item, index) => {
		let result = { id: index, text: item.text };
		
		if (item.complete) result.complete = true;

		return result;
	});

	localStorage.setItem(storageToken, JSON.stringify(todoSave));
}

function findTodoItemById(id) {
	return todoItems.find(item => item.id == id);
}

function findTodoIndexById(id) {
	return todoItems.findIndex(item => item.id == id);
}

function toggleTodoComplete(id) {
	if (id !== undefined) {
		const item = findTodoItemById(id);
		
		item.complete = !item.complete;

		renderTodoList();
	}
}

function addTodoItem(text) {
	// TODO - Escape text?
	if (text) {
		const newItem = { id: idCounter++, text };
		todoItems.push(newItem);
		renderTodoList();
	}
}

function deleteTodoItem(id) {
	const itemIndex = findTodoIndexById(id);

	if (itemIndex > -1) {
		todoItems.splice(itemIndex, 1);
		renderTodoList();
	}

	hideModal();
}

/* TODO LIST DOM GENERATION */

function generateTodoElement(item) {
	return `<li class="todo-list__item${(item.complete) ? " todo-list__item--complete" : ""}" data-id=${item.id}>
		<div>${item.text}</div>
		<button class="btn btn--plain btn--highlight-red" data-action="delete">X</button>
	</li>`;
}

function generateAddForm() {
	return `<form class="todo-list__item todo-list__item--form">
		<input type="text" placeholder="Your Item Here" />
		<button type="submit" class="btn btn--standard" data-action="add" disabled>+</button>
	</form>`;
}

function generateTodoListElements(todos) {
	return todos.map(item => generateTodoElement(item)).join("");
}

function renderTodoList() {
	const content = generateTodoListElements(todoItems) + generateAddForm();
	render(listElement, content);
	const addText = listElement.querySelector(":last-child > input[type='text']")
	addText.addEventListener("change", setAddStatus);
	addText.addEventListener("keyup", setAddStatus);
}

/* EVENT HANDLERS */

function handleTodoClick(e) {
	const id = e.target.dataset.id || e.target.parentElement.dataset.id;
	
	switch (e.target.dataset.action) {
		case "add":
			e.preventDefault();
			const addText = e.target.parentElement.querySelector("input[type='text']");
			addTodoItem(addText.value);
			break;
		case "delete":
			showDeleteForm(id);
			break;
		default:
			toggleTodoComplete(id);
			break;
	}
}

function showDeleteForm(id) {
	if (id !== undefined) {
		modalBG.classList.remove("hide");
		deleteForm.classList.remove("hide");

		deleteForm.dataset.id = id;
		deleteText.innerHTML = `Delete <em>"${findTodoItemById(id).text}"</em> item?`;
	}
}

function noPropagate(e) {
	e.stopPropagation();
}

/* UTILITY */

function setAddStatus(e) {
	e.target.parentElement.children[e.target.parentElement.children.length - 1].disabled = !e.target.value;
}

function hideModal() {
	modalBG.classList.add("hide");
	document.querySelectorAll("#modalbg > *").forEach(item => item.classList.add("hide"));
}

function render(element, content) {
	element.innerHTML = content;
}

/* EVENT BINDINGS */
listElement.addEventListener("click", handleTodoClick);
document.querySelector("#deleteForm .btn--highlight-red").addEventListener("click", hideModal);
document.querySelector("#btnDeleteConfirm").addEventListener("click", e => { deleteTodoItem(e.target.parentElement.parentElement.dataset.id); });
deleteForm.addEventListener("click", noPropagate);
modalBG.addEventListener("click", hideModal);
window.addEventListener("beforeunload", saveTodoList);

/* PAGE INITIALIZATION */
renderTodoList(todoItems);