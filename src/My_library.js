import './styles/main.css'
import FilmotekaInfo from './filmoteka'

class FilmotekaQueue {
    constructor(container) {
        this.container = container
        this.watchedBtn = document.getElementById('watchedBtn')
        this.queueBtn = document.getElementById('queueBtn')
        this.addedMovies = {}

        this.initializeLibrary()

        this.renderWatchedMovies()
    }

    initializeLibrary() {
        this.watchedBtn.addEventListener('click', () => {
            this.renderWatchedMovies()
        })

        this.queueBtn.addEventListener('click', () => {
            this.renderQueueMovies()
        })
    }

    renderQueueMovies() {
        this.clearContainer()
        const queueMovies = this.getQueueMovies()
        queueMovies.forEach(movie => {
            if (!this.addedMovies[movie.id]) {
                this.addFilm(movie)
                this.addedMovies[movie.id] = true
            }
        })
    }

    renderWatchedMovies() {
        this.clearContainer()
        const watchedMovies = this.getWatchedMovies()
        watchedMovies.forEach(movie => {
            if (!this.addedMovies[movie.id]) {
                this.addFilm(movie);
                this.addedMovies[movie.id] = true
            }
        })

    }

    clearContainer() {
        this.container.innerHTML = ''
        this.addedMovies = {}
    }

    getWatchedMovies() {
        return JSON.parse(localStorage.getItem('watched')) || []
    }

    getQueueMovies() {
        return JSON.parse(localStorage.getItem('queue')) || []
    }

    addFilm(movie) {

        this.column = document.createElement('div')
        this.column.className = 'col-sm-4'
        this.container.appendChild(this.column)

        this.mainDiv = document.createElement('div')
        this.mainDiv.className = 'card'
        this.column.appendChild(this.mainDiv)

        this.contentImage = document.createElement('img')
        this.contentImage.src = `https://image.tmdb.org/t/p/w500${movie.img}`
        this.contentImage.className = "card-img-top"
        this.contentImage.alt = "..."
        this.mainDiv.appendChild(this.contentImage)

        this.secondDiv = document.createElement('div')
        this.secondDiv.className = 'card-body'
        this.mainDiv.appendChild(this.secondDiv)

        this.title = document.createElement('h5')
        this.title.className = 'card-title'
        this.title.textContent = movie.title
        this.secondDiv.appendChild(this.title)

        this.releaseYear = movie.release ? new Date(movie.release).getFullYear() : ''

        this.ad = document.createElement('button')
        this.ad.className = 'btn btn-link'
        this.ad.type = 'button'
        const genreIds = movie.ganre__.map(genre => genre.name)
        this.ad.textContent = `${genreIds.join(', ')} | ${this.releaseYear}`
        this.secondDiv.appendChild(this.ad)

        movie.domElement = this.column

        this.deleteBtn = document.createElement('button')
        this.deleteBtn.className = 'btn btn-link delete-btn'
        this.secondDiv.appendChild(this.deleteBtn);
        this.deleteBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.removeFromDatabase(movie.id);
            this.container.removeChild(movie.domElement)
        });

        this.imageDeleteBtn = document.createElement('i')
        this.imageDeleteBtn.className = 'i-delete-btn fa-solid fa-trash'
        this.deleteBtn.appendChild(this.imageDeleteBtn)

        this.ad.addEventListener('click', (event) => {
            event.preventDefault()
            this.filmidss_ = movie.id
            const createModal = new FilmotekaInfo(this.filmidss_);
            createModal.loadData(this.filmidss_);
        });
    }

    removeFromDatabase(movieId) {
        let queueMovies = JSON.parse(localStorage.getItem('queue')) || []
        let watchedMovies = JSON.parse(localStorage.getItem('watched')) || []

        queueMovies = queueMovies.filter(movie => movie.id !== movieId)
        watchedMovies = watchedMovies.filter(movie => movie.id !== movieId)

        localStorage.setItem('queue', JSON.stringify(queueMovies))
        localStorage.setItem('watched', JSON.stringify(watchedMovies))
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const watchedBtn = document.getElementById('watchedBtn')
    const queueBtn = document.getElementById('queueBtn')
    watchedBtn.classList.add('active')

    watchedBtn.addEventListener('click', function () {
        if (queueBtn.classList.contains('active')) {
            queueBtn.classList.remove('active')
        } else {
            watchedBtn.classList.add('active')
        }
    });

    queueBtn.addEventListener('click', function () {
        if (watchedBtn.classList.contains('active')) {
            watchedBtn.classList.remove('active')
        } else {
            queueBtn.classList.add('active')
        }
    })
})

document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('filmContainer')
    const filmotekaQueue = new FilmotekaQueue(container)
})
