/* "API" FUNCTIONS */
let idCounter;

const todoAPI = {
	loadTodoList: function() {
		return fetch("https://jsonplaceholder.typicode.com/todos")
  		.then(response => response.json()).then(data => {
			// For demonstration purposes - save length for custom id generation; resize array to be more manageable.
			const result = data.slice(0, 25);
			idCounter = result.length;
			return result;
		});
	},
	addTodoItem: function(newItem) {
		return fetch("https://jsonplaceholder.typicode.com/todos", {
			method: "post",
			body: JSON.stringify(newItem),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			}
		}).then(response => response.json()).then(data => {
			data = {...data, id: idCounter++ }; // Give our items a correct id.  Only for demonstration purposes!
			return data;
		});
	},
	deleteTodoItem: function(id) {
		return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
			method: "delete"
		}).then(response => response.json());
	},
	updateTodoItem: function(item) {
		return fetch(`https://jsonplaceholder.typicode.com/todos/${item.id}`, {
			method: "put",
			body: JSON.stringify(item),
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			}
		}).then(response => response.json());
	}
};