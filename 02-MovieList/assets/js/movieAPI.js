class MovieAPI {
	constructor(source) {
		this._data = [];
		this.source = source;
	}
	get data() {
		return this._data;
	}
	loadData() {
		return new Promise((res, rej) => {
			fetch(`${this.source}/movies`)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					rej(false)
				}
			}, rej)
			.then(json => {
				this._data = json;
				res(true);
			});
		});
	}
}