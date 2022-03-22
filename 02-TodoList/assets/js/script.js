const todoItems = [
	{ id: 0, text: "Pull in This Data from Somewhere Else (LocalStorage?)" },
	{ id: 1, text: "Feed the Dog" },
	{ id: 2, text: "Water the Cat" },
	{ id: 3, text: "Flip the Table" },
	{ id: 4, text: "Kick a Tree" },
];

var idCounter = todoItems.length;

const listElement = document.querySelector("#todoList");

function addTodoItem() {
	const text = prompt("Enter your new to-do item!");

	if (text) {
		const newItem = { id: idCounter++, text };
		todoItems.push(newItem);
		addTodoElement(newItem);
	}
}

function addTodoElement(item) {
	let tmpChild;
	let tmpElement = document.createElement("li");
	tmpElement.className = "todo-item";
	tmpElement.setAttribute("data-id", item.id);

	tmpChild = document.createElement("div");
	tmpChild.textContent = item.text;
	tmpElement.appendChild(tmpChild);

	tmpChild = document.createElement("input");
	tmpChild.type = "button";
	tmpChild.value = "X";
	tmpChild.className = "btn btn--plain btn--highlight-red";
	tmpChild.addEventListener("click", () => {
		if (confirm(`Delete to-do item "${item.text}"?`))
		 deleteTodoElement(tmpElement);
	});
	tmpElement.appendChild(tmpChild);

	listElement.appendChild(tmpElement);
}

function deleteTodoElement(element) {
	const itemId = element.getAttribute("data-id");
	const itemIndex = todoItems.findIndex(item => item.id == itemId);

	if (itemIndex > -1) {
		todoItems.splice(itemIndex, 1);
	}

	listElement.removeChild(element);
}

todoItems.forEach((item, index) => addTodoElement(item, index));

document.querySelector("#btnAdd").addEventListener("click", addTodoItem);