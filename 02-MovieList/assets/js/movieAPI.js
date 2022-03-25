class MovieAPI {
	constructor(source) {
		this._data = [];
		this.source = source;
	}
	get data() {
		return this._data;
	}
	loadData() {
		return new Promise((res,) => {
			fetch(`${this.source}/movies`)
			.then(response => response.json())
			.then(json => {
				this._data = json;
				res(json);
			});
		});
	}
}