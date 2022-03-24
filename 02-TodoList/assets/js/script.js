let todoItems = [];

const listElement = document.querySelector("#todoList");
const modalBG = document.querySelector("#modalBG");
const deleteForm = document.querySelector("#deleteForm");
const deleteText = document.querySelector("#deleteText");
const btnDeleteConfirm = document.querySelector("#btnDeleteConfirm");

/* TODO LIST FUNCTIONS */

function findTodoItemById(id) {
	return todoItems.find(item => item.id === id);
}

function findTodoIndexById(id) {
	return todoItems.findIndex(item => item.id === id);
}

function addTodoItem(title) {
	// TODO - Escape text?
	if (title) {
		const newItem = { title };

		todoAPI.addTodoItem(newItem).then(data => {
			todoItems = [...todoItems, data];
			renderTodoList();
		});
	}
}

function deleteTodoItem(id) {
	hideModal();

	todoAPI.deleteTodoItem(id).then(_ => {
		todoItems = todoItems.filter(item => item.id !== id);
		renderTodoList();
	});
}

function toggleTodoComplete(id) {
	if (!isNaN(id)) {
		const curItem = todoItems.find(item => item.id === id);

		if (curItem) {
			todoAPI.updateTodoItem({ ...curItem, completed: !curItem.completed}).then(data => {
				todoItems = todoItems.map(item => {
					if (item.id === id) {
						return data;
					} else {
						return item;
					}
				});

				renderTodoList();
			});
		}
	}
}

/* TODO LIST DOM GENERATION */

function generateTodoElement(item) {
	return `<li class="todo-list__item${(item.completed) ? " todo-list__item--complete" : ""}" data-id=${item.id}>
		<div>${item.title}</div>
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
	const id = +(e.target.dataset.id || e.target.parentElement.dataset.id);
	
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

		deleteText.innerHTML = `Delete <em>"${findTodoItemById(id).title}"</em> item?`;
		btnDeleteConfirm.dataset.id = id;
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
btnDeleteConfirm.addEventListener("click", e => { deleteTodoItem(+e.target.dataset.id); });
deleteForm.addEventListener("click", noPropagate);
modalBG.addEventListener("click", hideModal);

/* PAGE INITIALIZATION */
todoAPI.loadTodoList().then(data => {
	todoItems = data;
	renderTodoList()
});