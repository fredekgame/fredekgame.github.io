import './styles/main.css'
import FilmotekaInfo from './filmoteka'

document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname === '/paginats.html') {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOTQzZDU0YWQ3YjRlOTU2ZTM0ODc5NTdkODE0Y2VhZCIsInN1YiI6IjY1OGM1MDVmMzAzYzg1MDcxOGE1NGUyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l8WuJ13hO2VbApbmpEtMEuhAmw5eQdfXAdTyqDGoZYc`
            }
        }

        const filmsPerPage = 18
        let currentPage = 1
        const maxDisplayedPages = 5

        document.addEventListener('DOMContentLoaded', () => {
            fetchMovies(currentPage)
        });


        const paginationContainer = document.createElement('div')
        paginationContainer.className = 'pagination-container pag-nav justify-content-center'
        document.body.insertBefore(paginationContainer, document.getElementById('footer'));

        const searchButton = document.getElementById('searchButton');
        searchButton.addEventListener('submit', () => {
            paginationContainer.style.display = 'none';
        });

        const prevButton = createPaginationButton('Previous', () => {
            if (currentPage > 1) {
                currentPage--
                fetchMovies(currentPage)
            }
        })

        paginationContainer.appendChild(prevButton)

        const pageNumbersContainer = document.createElement('div')
        pageNumbersContainer.className = 'pagination-page-numbers'
        paginationContainer.appendChild(pageNumbersContainer)

        const nextButton = createPaginationButton('Next', () => {
            currentPage++
            fetchMovies(currentPage)
        })

        paginationContainer.appendChild(nextButton)

        function createPaginationButton(label, onClick) {
            const button = document.createElement('button')
            button.className = 'btn btn-sm'
            if (label === 'Previous') {
                button.className += ' btn-primary'
            } else if (label === 'Next') {
                button.className += ' btn-primary'
            }

            button.textContent = label
            button.addEventListener('click', onClick)
            return button
        }

        function updatePageNumbers() {
            pageNumbersContainer.innerHTML = ''

            let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2))
            let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1)

            if (endPage - startPage < maxDisplayedPages - 1) {
                startPage = Math.max(1, endPage - maxDisplayedPages + 1)
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageNumberButton = createPaginationButton(`${i}`, () => {
                    currentPage = i
                    fetchMovies(currentPage)
                });

                if (i === currentPage) {
                    pageNumberButton.classList.add('btn-primary')
                } else {
                    pageNumberButton.classList.add('btn-secondary')
                }

                pageNumbersContainer.appendChild(pageNumberButton)
            }
        }

        function fetchMovies(page) {
            const url = `https://api.themoviedb.org/3/trending/all/day?language=en-US&page=${page}`

            fetch(url, options)
                .then(response => response.json())
                .then(response => {
                    const films = response.results;
                    const filmContainer = document.getElementsByClassName('row second')[0];

                    filmContainer.innerHTML = ''

                    films.forEach(film => {
                        new AllFilmoteka(film, filmContainer)
                    });

                    totalPages = response.total_pages
                    updatePageNumbers()
                    scrollToTop()
                })
                .catch(err => console.error(err))
        }

        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }

        let totalPages = 1
        updatePageNumbers()

        class AllFilmoteka {
            constructor(film, container) {
                this.filmidss_ = film.id
                this.container = container

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

                this.genres = film.genre_ids.map(genreId => getGenreName(genreId)).join(', ')
                this.releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : ''
                this.airReleaseYear = film.first_air_date ? new Date(film.first_air_date).getFullYear() : ''

                this.a = document.createElement('button')
                this.a.className = 'btn btn-link'
                this.a.type = 'button'
                this.a.textContent = `${this.genres} | ${this.releaseYear || this.airReleaseYear}`
                this.secondDiv.appendChild(this.a)
                this.a.addEventListener('click', (event) => {
                    event.preventDefault();
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
                        10770: "TV Movie",
                        10759: "Action & Adventure",
                        10762: "Kids",
                        10763: "News",
                        10764: "Reality",
                        10765: "Sci - Fi & Fantasy",
                        10766: "Soap",
                        10767: "Talk",
                        10768: "War & Politics"
                    }

                    return genreMapping[genreId] || 'Unknown Genre'
                }
            }
        }
    }
})

