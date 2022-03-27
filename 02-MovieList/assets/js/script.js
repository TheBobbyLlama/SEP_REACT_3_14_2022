const carouselCount = 4;

const movieAPI = new MovieAPI("http://localhost:3000");

const domLookup = {
	elementCarousel: document.querySelector("#movieCarousel"),
	elementCarouselBack: document.querySelector("#movieCarouselBack"),
	elementCarouselForward: document.querySelector("#movieCarouselForward"),
}

/* LIST SCROLLING LOGIC */
let scrollIndex = 0;

function hideScrollButtons() {
	if (scrollIndex <= 0) {
		domLookup.elementCarouselBack.classList.add("invisible");
	}

	if (scrollIndex + carouselCount >= movieAPI.data.length) {
		domLookup.elementCarouselForward.classList.add("invisible");
	}
}

function showScrollButtons() {
	if (scrollIndex > 0) {
		domLookup.elementCarouselBack.classList.remove("invisible");
	}

	if (scrollIndex + carouselCount < movieAPI.data.length) {
		domLookup.elementCarouselForward.classList.remove("invisible");
	}
}

// Shift the current position in the movie list.
function scrollMovies(direction) {
	scrollIndex += direction;
	renderMovieCarousel(scrollIndex, direction);

	// Disable buttons during animation to prevent herky jerky spam
	domLookup.elementCarouselBack.disabled = domLookup.elementCarouselForward.disabled = true;
	hideScrollButtons();

	setTimeout(() => {
		domLookup.elementCarouselBack.disabled = domLookup.elementCarouselForward.disabled = false;
		showScrollButtons();
	}, 500);
}

/* CONTENT GENERATION */

function generateMovieCardHtml(movie) {
	return `<div class="movie-card">
		<div class="movie-card__image" style="background-image: url('${movie.imgUrl}');"></div>
		<div class="movie-card__info">
			<h2>${movie.name} ${movie.id}</h2>
			<p>${movie.outlineInfo}</p>
		</div>
	</div>`;
}

function generateMovieCarouselHtml(start, direction) {
	// Prepare HTML - Include items that are left behind by the new position so they can be animated scrolling away.
	const movieCards = movieAPI.data.slice(
		(direction > 0) ? start - 1 : start,
		(direction < 0) ? start + carouselCount + 1 : start + carouselCount)
		.map(movie => generateMovieCardHtml(movie));

	// Set scroll animation if needed
	let scrollClass = "";

	if (direction < 0) {
		scrollClass = "carousel-content--scroll-left";
	} else if (direction > 0) {
		scrollClass = "carousel-content--scroll-right";
	}

	// Generate final HTML
	return `<div class="carousel-content ${scrollClass}">
		${movieCards.join("\n")}
	</div>`;
}

function showAPIError() {
	render(domLookup.elementCarousel,
		`<div class="simple-center">
			<h2>An error occurred loading the movie list.  Please try again later.</h2>
		</div>`
	);
}

/* DOM MANIPULATION */

function renderMovieCarousel(start, direction) {
	render(domLookup.elementCarousel, generateMovieCarouselHtml(start, direction));
}

function render(element, content) {
	element.innerHTML = content;
}

function bindDomEvents() {
	domLookup.elementCarouselBack.addEventListener("click", () => { scrollMovies(-1); });
	domLookup.elementCarouselForward.addEventListener("click", () => { scrollMovies(1); });
}

/* INIT */

movieAPI.loadData().then(_ => {
	renderMovieCarousel(0, 0);
	hideScrollButtons();
	showScrollButtons();
}, showAPIError);

bindDomEvents();