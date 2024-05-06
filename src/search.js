import './styles/main.css'
import FilmotekaInfo from './filmoteka'

let currentPage = 1
const moviesPerPage = 18
let totalMovies = 0

document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('searchForm')
    searchForm.addEventListener('submit', function (event) {
        event.preventDefault()
        const searchInput = document.getElementById('searchInput').value
        const filmContainer = document.querySelector('.row.second')
        if (searchInput.trim() === '') {
            window.location.href = '/'
        } else {
            while (filmContainer.firstChild) {
                filmContainer.removeChild(filmContainer.firstChild)
            }
            searchMovies(searchInput, filmContainer, currentPage)
        }
    });

    searchMovies('', filmContainer, currentPage)

    addPagination('', filmContainer, 0, currentPage)
});

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOTQzZDU0YWQ3YjRlOTU2ZTM0ODc5NTdkODE0Y2VhZCIsInN1YiI6IjY1OGM1MDVmMzAzYzg1MDcxOGE1NGUyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l8WuJ13hO2VbApbmpEtMEuhAmw5eQdfXAdTyqDGoZYc'
    }
};

function addPagination(searchInput, filmContainer, totalPages, currentPage) {
    const existingPagination = document.getElementById('pagination')
    if (existingPagination) {
        existingPagination.parentNode.removeChild(existingPagination)
    }

    const paginationContainer = document.createElement('nav')
    paginationContainer.setAttribute('aria-label', 'Page navigation')
    paginationContainer.id = 'pagination'
    paginationContainer.classList.add('pag-nav', 'justify-content-center')

    const paginationList = document.createElement('div')
    paginationList.classList.add('btn-group')

    const previousLink = document.createElement('button')
    previousLink.classList.add('btn', 'btn-primary')
    previousLink.textContent = 'Previous';

    previousLink.addEventListener('click', (event) => {
        event.preventDefault()
        if (currentPage > 1) {
            currentPage--
            searchMovies(searchInput, filmContainer, currentPage, options)
            searchForm.dispatchEvent(new Event('submit'))
        }
    });

    paginationList.appendChild(previousLink)

    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, startPage + 4)

    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('button')
        pageLink.classList.add('btn', i === currentPage ? 'btn-primary' : 'btn-secondary')
        pageLink.textContent = i

        pageLink.addEventListener('click', (event) => {
            event.preventDefault()
            currentPage = i
            searchMovies(searchInput, filmContainer, currentPage, options)
            scrollToTop()
        });
        paginationList.appendChild(pageLink)
    }

    const nextLink = document.createElement('button')
    nextLink.classList.add('btn', 'btn-primary')
    nextLink.textContent = 'Next'

    nextLink.addEventListener('click', (event) => {
        event.preventDefault()
        if (currentPage < totalPages) {
            currentPage++
            searchMovies(searchInput, filmContainer, currentPage, options)
            scrollToTop()
        }
    });

    paginationList.appendChild(nextLink)

    paginationContainer.appendChild(paginationList)

    const filmContainer_ = document.getElementsByClassName('row second')[0]
    filmContainer_.insertAdjacentElement('afterend', paginationContainer)

    if (totalMovies < 2) {
        paginationList.style.display = 'none'
    } else {
        paginationList.style.display = 'block'
    }
}


function searchMovies(searchInput, filmContainer, currentPage) {
    fetch(`https://api.themoviedb.org/3/search/movie?query=${searchInput}&include_adult=false&language=en-US&page=${currentPage}`, options)
        .then(response => response.json())
        .then(response => {
            const films = response.results

            filmContainer.innerHTML = ''

            films.forEach(film => {
                new SearchFilmoteka(film, filmContainer)
            })
            totalMovies = response.total_pages
            addPagination(searchInput, filmContainer, totalMovies, currentPage)
            scrollToTop()
        })
        .catch(err => console.error(err))
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

class SearchFilmoteka {
    constructor(film, filmContainer) {
        this.container = filmContainer
        this.filmidss_ = film.id
        this.created(film)
    }

    created(film) {
        this.column = document.createElement('div')
        this.column.className = 'col-sm-4'
        this.container.appendChild(this.column)

        this.mainDiv = document.createElement('div')
        this.mainDiv.className = 'card'
        this.column.appendChild(this.mainDiv)

        this.contentImage = document.createElement('img')
        console.log(options.title)
        if (film.poster_path) {
            this.contentImage.src = `https://image.tmdb.org/t/p/w500${film.poster_path}`
        } else {
            this.contentImage.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg'
        }
        this.contentImage.className = "card-img-top"
        this.contentImage.alt = "No Image"
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
        this.title.textContent = film.title || film.name
        this.secondDiv.appendChild(this.title)

        if (film.genre_ids && film.genre_ids.length > 0) {
            this.genres = film.genre_ids.map(genreId => getGenreName(genreId)).join(', ');
        } else {
            this.genres = 'Unknown Genre'
        }
        if (film.release_date && film.release_date.length > 0) {
            this.releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : ''
        } else {
            this.releaseYear = 'Unknown Year'
        }

        this.airReleaseYear = film.first_air_date ? new Date(film.first_air_date).getFullYear() : ''

        this.aT = document.createElement('button')
        this.aT.className = 'btn btn-link'
        this.aT.type = "button"
        this.aT.textContent = `${this.genres} | ${this.releaseYear || this.airReleaseYear}`
        this.secondDiv.appendChild(this.aT)
        this.aT.addEventListener('click', (event) => {
            event.preventDefault()
            const createModal = new FilmotekaInfo(this.filmidss_)
            createModal.loadData(this.filmidss_)
        })

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
                10770: "TV Movie"
            }

            return genreMapping[genreId] || 'Unknown Genre'
        }
    }
}