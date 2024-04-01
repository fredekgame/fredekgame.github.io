import './styles/main.css'
import FilmotekaInfo from './filmoteka';

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOTQzZDU0YWQ3YjRlOTU2ZTM0ODc5NTdkODE0Y2VhZCIsInN1YiI6IjY1OGM1MDVmMzAzYzg1MDcxOGE1NGUyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l8WuJ13hO2VbApbmpEtMEuhAmw5eQdfXAdTyqDGoZYc'
    }
}

fetch('https://api.themoviedb.org/3/trending/all/day?language=en-US', options)
    .then(response => response.json())
    .then(response => {
        const films = response.results;
        const filmContainer = document.getElementsByClassName('row second');

        Array.from(filmContainer).forEach(container => {
            films.forEach(film => {
                new Filmoteka(film, container)
            })
        })
    })
    .catch(err => console.error(err));

class Filmoteka {
    constructor(film, container) {
        this.container = container
        this.filmidss_ = film.id

        this.column = document.createElement('div')
        this.column.className = 'col-sm-4'
        this.container.appendChild(this.column)

        this.mainDiv = document.createElement('div')
        this.mainDiv.className = 'card'
        this.column.appendChild(this.mainDiv)

        this.contentImage = document.createElement('img')
        this.contentImage.src = `https://image.tmdb.org/t/p/w500${film.poster_path}`
        this.contentImage.className = "card-img-top"
        this.contentImage.alt = "..."
        this.contentImage.type = 'button'
        this.mainDiv.appendChild(this.contentImage)
        this.contentImage.addEventListener('click', (event) => {
            event.preventDefault();
            const createModal = new FilmotekaInfo(this.filmidss_)
            createModal.loadData(this.filmidss_)
        });

        this.secondDiv = document.createElement('div')
        this.secondDiv.className = 'card-body'
        this.mainDiv.appendChild(this.secondDiv)

        this.title = document.createElement('h5')
        this.title.className = 'card-title'
        this.title.type = 'button'
        this.title.textContent = film.title || film.name
        this.secondDiv.appendChild(this.title)
        this.title.addEventListener('click', (event) => {
            event.preventDefault();
            const createModal = new FilmotekaInfo(this.filmidss_)
            createModal.loadData(this.filmidss_)
        });

        if (film.genre_ids && film.genre_ids.length > 0) {
            this.genres = film.genre_ids.map(genreId => getGenreName(genreId)).join(', ');
        } else {
            this.genres = 'No  available'
        }

        this.releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : '';
        this.airReleaseYear = film.first_air_date ? new Date(film.first_air_date).getFullYear() : '';

        this.ad = document.createElement('button')
        this.ad.className = 'btn btn-link'
        this.ad.type = 'button'
        this.ad.textContent = `${this.genres} | ${this.releaseYear || this.airReleaseYear}`
        this.secondDiv.appendChild(this.ad)
        this.ad.addEventListener('click', (event) => {
            event.preventDefault();
            const createModal = new FilmotekaInfo(this.filmidss_)
            createModal.loadData(this.filmidss_)
        });

        function getGenreName(genreId) {
            const genreMapping = {
                12: "Adventure",
                14: "Fantasy",
                16: "Animation",
                18: "Drama",
                27: "Horror",
                28: "Action",
                35: "Comedy",
                36: "History",
                37: "Western",
                53: "Thriller",
                80: "Crime",
                99: "Documentary",
                878: "Science Fiction",
                9648: "Mystery",
                10402: "Music",
                10749: "Romance",
                10751: "Family",
                10752: "War",
                10770: "TV Movie",
                10759: "Action & Adventure",
                10762: "Kids",
                10763: "News",
                10764: "Reality",
                10765: "Sci - Fi & Fantasy",
                10766: "Soap",
                10767: "Talk",
                10768: "War & Politics"
            };

            return genreMapping[genreId] || 'Unknown Genre';
        }
    }
}

const searchInput = document.getElementById('searchInput');
const errorMessage = document.getElementById('errorMessage');

searchInput.addEventListener('blur', function () {
    if (this.value.trim() === '') {
        errorMessage.style.display = 'block';
    } else {
        errorMessage.style.display = 'none';
    }
});