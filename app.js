const API_KEY = {
  access_token: "98c7be29c7b3672cd15e80fe1a74a4c6",
};
const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY.access_token}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=1`;

const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY.access_token}&query=`;

const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const form = document.getElementById("form");

const moviesContainer = document.getElementById("movies-container");
const container = document.querySelector(".container");

async function getMovies(api_url, query = "") {
  api_url = query === "" ? api_url : api_url + query;

  const res = await fetch(api_url);
  const data = await res.json();
  console.log(data);
  const moviesArray = await data.results;
  console.log(moviesArray.length);

  if (moviesArray.length < 1) renderNotfoundMessege(query);
  else
    moviesArray.forEach((movie) => {
      renderMovies(movie);
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = e.target.querySelector("#search").value;

  if (query && query !== "") {
    moviesContainer.innerHTML = "";

    getMovies(SEARCH_URL, query);
  } else reload();
});

function renderMovies(movie) {
  const { title, overview, poster_path, vote_average: rating } = movie;

  const movieEl = document.createElement("div");

  movieEl.classList.add("movie");
  const img_src = poster_path
    ? IMG_PATH + poster_path
    : "https://source.unsplash.com/random/1200";

  let movieHtml = `<figure class="movie-poster">
        <img src="${img_src}" alt="${title} Poster"  loading="lazy"/>
    <figcaption class="movie-info">
      <h3 class="movie-title">${title}</h3>
      <span class="rating ${rateMovie(rating)} ">${rating}</span>
    </figcaption>
  </figure>
  <div class="overview">
    <h4>overview</h4>
    <p class="overview__text">
    ${overview}
    </p>
    </div>`;
  movieEl.innerHTML = movieHtml;

  moviesContainer.appendChild(movieEl);
}

function renderNotfoundMessege(movieName) {
  const messageEl = document.createElement("div");
  messageEl.classList.add("not-found");

  const messageHTML = `
    <p >Can't Find a Movie Called: <b>${movieName}</b></p>
    <button class='btn reload'>Reload</button>
    `;
  messageEl.innerHTML = messageHTML;
  container.appendChild(messageEl);

  const btn = container.querySelector(".btn");
  btn.addEventListener("click", reload);
}

function rateMovie(rating) {
  let ratingClass;
  if (+rating >= 8) ratingClass = "good";
  else if (+rating < 8 && +rating >= 5) ratingClass = "average";
  else ratingClass = "bad";
  return ratingClass;
}

function reload() {
  window.location.reload();
}

window.addEventListener("load", () => {
  getMovies(API_URL);
});
