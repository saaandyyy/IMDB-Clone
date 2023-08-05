const apiKey = 'fa5739c3';
const apiUrl = 'http://www.omdbapi.com';

const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const moviePage = document.getElementById('movie-page');
const movieTitle = document.getElementById('movie-title');
const movieImage = document.getElementById('movie-image');
const moviePlot = document.getElementById('movie-plot');
const favoritesList = document.getElementById('favorites-list');
const favoritesPage = document.getElementById('favorites-page');

let favorites = [];

// Function to fetch movie details from the OMDB API
async function fetchMovieDetails(movieId) {
  const response = await fetch(`${apiUrl}?i=${movieId}&apikey=${apiKey}`);
  const data = await response.json();
  return data;
}

// Function to display search results
function displaySearchResults(results) {
  searchResults.innerHTML = '';

  results.forEach((result) => {
    const resultItem = document.createElement('div');
    resultItem.innerHTML = `
      <h3>${result.Title} (${result.Year})</h3>
      <button class="add-to-favorites">Add to Favorites</button>
    `;

    const addToFavoritesBtn = resultItem.querySelector('.add-to-favorites');
    addToFavoritesBtn.addEventListener('click', () => addToFavorites(result.imdbID));

    resultItem.addEventListener('click', () => showMoviePage(result.imdbID));

    searchResults.appendChild(resultItem);
  });
}

// Function to update the favorites list
function updateFavoritesList() {
  favoritesList.innerHTML = '';

  favorites.forEach((favorite) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <h3>${favorite.Title} (${favorite.Year})</h3>
      <button class="remove-from-favorites">Remove from Favorites</button>
    `;

    const removeFromFavoritesBtn = listItem.querySelector('.remove-from-favorites');
    removeFromFavoritesBtn.addEventListener('click', () => removeFromFavorites(favorite.imdbID));

    favoritesList.appendChild(listItem);
  });
}

// Function to add a movie to favorites
// Function to add a movie to favorites
function addToFavorites(movieId) {
  const movieExists = favorites.some((favorite) => favorite.imdbID === movieId);
  if (!movieExists) {
    fetchMovieDetails(movieId).then((movie) => {
      favorites.push(movie);
      updateFavoritesList();
      saveFavoritesToLocalStorage();
    });
  }
}


// Function to remove a movie from favorites
function removeFromFavorites(movieId) {
  favorites = favorites.filter((favorite) => favorite.imdbID !== movieId);
  updateFavoritesList();
  saveFavoritesToLocalStorage();
}

// Function to show movie page
function showMoviePage(movieId) {
  fetchMovieDetails(movieId).then((movie) => {
    movieTitle.textContent = `${movie.Title} (${movie.Year})`;
    movieImage.src = movie.Poster;
    moviePlot.textContent = movie.Plot;
    moviePage.style.display = 'block';
    favoritesPage.style.display = 'none';
  });
}

// Function to show favorites page
function showFavoritesPage() {
  moviePage.style.display = 'none';
  favoritesPage.style.display = 'block';
}

// Function to save favorites to local storage
function saveFavoritesToLocalStorage() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Function to load favorites from local storage
function loadFavoritesFromLocalStorage() {
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    favorites = JSON.parse(storedFavorites);
    updateFavoritesList();
  }
}

// Event listener for search input
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetch(`${apiUrl}?s=${searchTerm}&apikey=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.Search) {
          displaySearchResults(data.Search);
        } else {
          searchResults.innerHTML = '<p>No results found.</p>';
        }
      });
  } else {
    searchResults.innerHTML = '';
  }
});

// Event listener for favorite movies link
favoritesList.addEventListener('click', showFavoritesPage);

// Load favorites from local storage on page load
loadFavoritesFromLocalStorage();
