import YouTubePlayer from 'youtube-player'

export default class FilmotekaInfo {
    constructor() {
    }

    loadData(filmId) {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOTQzZDU0YWQ3YjRlOTU2ZTM0ODc5NTdkODE0Y2VhZCIsInN1YiI6IjY1OGM1MDVmMzAzYzg1MDcxOGE1NGUyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l8WuJ13hO2VbApbmpEtMEuhAmw5eQdfXAdTyqDGoZYc'
            }
        }

        fetch(`https://api.themoviedb.org/3/movie/${filmId}?language=en-US`, options)
            .then(response => response.json())
            .then(response => {
                this.createMOdal(response)
                const genres = response.genres
                const genreIds = genres.map(genre => genre.id)
                this.displayGenres(genreIds)


            })

            .catch(err => console.error(err))


        fetch(`https://api.themoviedb.org/3/movie/${filmId}/videos?language=en-US`, options)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                this.playerVideo(response)
            })
            .catch(err => console.error(err))

        this.checkFilmInLists(filmId)
    }

    createMOdal(filmData) {
        this.modal = document.createElement('div')
        this.modal.classList.add('modalBody')
        this.modal.style.display = 'block'

        this.closeButton = document.createElement('buttonModal')
        this.closeButton.innerHTML = 'X'
        this.closeButton.className = 'clossrdBTN'
        this.closeButton.addEventListener('click', (event) => {
            this.closeModal()
        });
        this.closeButton.style.position = 'absolute'
        this.closeButton.style.top = '10px'
        this.closeButton.style.right = '10px'
        this.modal.appendChild(this.closeButton)


        this.footerbuddy = document.createElement('div')
        this.footerbuddy.className = 'row'
        this.modal.appendChild(this.footerbuddy)

        this.imageBody = document.createElement('div')
        this.imageBody.className = "col"
        this.footerbuddy.appendChild(this.imageBody)

        this.imageMovies = document.createElement('img')
        this.imageMovies.className = "rounded mx-auto d-block imageMovies"
        this.imageMovies.src = 'https://image.tmdb.org/t/p/w500' + filmData.poster_path
        this.imageMovies.style.maxWidth = '100%';
        this.imageMovies.style.height = 'auto';
        this.imageBody.appendChild(this.imageMovies)

        this.buttonYT = document.createElement('button')
        this.buttonYT.className = 'btn btn-outline-dark WT'
        this.buttonYT.type = 'button'
        this.buttonYT.textContent = 'WATCH TRAILER'
        this.imageBody.appendChild(this.buttonYT)

        this.playerContainer = document.createElement('div')
        this.playerContainer.id = 'playerContainer'
        this.playerContainer.classList.add('hidden')

        this.youtubePlayer = document.createElement('div')
        this.youtubePlayer.id = 'youtubePlayer'

        this.closePlayerBtn = document.createElement('button')
        this.closePlayerBtn.id = 'closePlayerBtn'
        this.closePlayerBtn.textContent = 'Close player'

        this.playerContainer.appendChild(this.youtubePlayer)
        this.playerContainer.appendChild(this.closePlayerBtn)
        document.body.appendChild(this.playerContainer)

        this.informBody = document.createElement('div')
        this.informBody.className = "col"
        this.footerbuddy.appendChild(this.informBody)

        this.font = document.createElement('h2')
        this.font.className = "fs-5"
        this.font.textContent = filmData.original_title
        this.informBody.appendChild(this.font)

        this.aboutBlock = document.createElement('div')
        this.aboutBlock.className = 'row'
        this.informBody.appendChild(this.aboutBlock)

        this.aboutBlockTitle = document.createElement('div')
        this.aboutBlockTitle.className = 'col'
        this.aboutBlock.appendChild(this.aboutBlockTitle)

        this.vote = document.createElement('p')
        this.vote.textContent = 'Vote/Votes'
        this.aboutBlockTitle.appendChild(this.vote)

        this.popularity = document.createElement('p')
        this.popularity.textContent = 'Popularity'
        this.aboutBlockTitle.appendChild(this.popularity)

        this.originalTitle = document.createElement('p')
        this.originalTitle.textContent = 'Original Title'
        this.aboutBlockTitle.appendChild(this.originalTitle)

        this.genre = document.createElement('p')
        this.genre.textContent = 'Genre'
        this.aboutBlockTitle.appendChild(this.genre)

        this.aboutBlockInform = document.createElement('div')
        this.aboutBlockInform.className = 'col aboutBlockInform'
        this.aboutBlock.appendChild(this.aboutBlockInform)

        this.voteCount = document.createElement('div')
        this.aboutBlockInform.appendChild(this.voteCount)

        this.voteCountAv = document.createElement('p')
        this.voteCountAv.textContent = `${filmData.vote_average} `
        this.voteCountAv.className = 'voteCountAv'
        this.voteCount.appendChild(this.voteCountAv)

        this.voteCountbK = document.createElement('p')
        this.voteCountbK.textContent = `/`
        this.voteCountbK.className = 'voteCountbK'
        this.voteCount.appendChild(this.voteCountbK)

        this.voteCountVt = document.createElement('p')
        this.voteCountVt.textContent = ` ${filmData.vote_count}`
        this.voteCountVt.className = 'voteCountVt'
        this.voteCount.appendChild(this.voteCountVt)

        this.popularityCount = document.createElement('p')
        this.popularityCount.textContent = `${filmData.popularity}`
        this.aboutBlockInform.appendChild(this.popularityCount)

        this.originalTitleCount = document.createElement('p')
        this.originalTitleCount.className = 'originalTitleCount'
        this.originalTitleCount.textContent = `${filmData.original_title}`
        this.aboutBlockInform.appendChild(this.originalTitleCount)

        this.aboutTitle = document.createElement('p')
        this.aboutTitle.textContent = `About`
        this.aboutTitle.style = 'margin: 0; font-weight: 600;'
        this.informBody.appendChild(this.aboutTitle)

        this.aboutBlank = document.createElement('p')
        this.aboutBlank.className = 'about-blank'
        this.aboutBlank.textContent = `${filmData.overview}`
        this.informBody.appendChild(this.aboutBlank)

        this.genreCount = document.createElement('p')
        const genreIds = filmData.genres.map(genre => genre.name)
        this.genreCount.textContent = `${genreIds.join(', ')}`
        this.aboutBlockInform.appendChild(this.genreCount)

        this.buttonBlock = document.createElement('div')
        this.footerbuddy.appendChild(this.buttonBlock)

        this.buttonWT = document.createElement('button')
        this.buttonWT.className = 'btn btn-warning watched'
        this.buttonWT.type = 'button'
        this.buttonWT.textContent = 'ADD TO WATCHED'
        this.informBody.appendChild(this.buttonWT)

        this.buttonQE = document.createElement('button')
        this.buttonQE.className = 'btn btn-outline-dark queue'
        this.buttonQE.type = 'button'
        this.buttonQE.textContent = 'ADD TO QUEUE'
        this.informBody.appendChild(this.buttonQE)

        const filmInfo = {
            id: filmData.id,
            title: filmData.original_title,
            img: filmData.poster_path,
            ganre__: filmData.genres,
            release: filmData.release_date,
        }

        this.buttonQE.addEventListener('click', function (event) {
            this.buttonQE.textContent = 'ADDED TO QUEUE'
            let queueMovies = JSON.parse(localStorage.getItem('queue')) || []
            queueMovies.push(filmInfo)
            this.isInQueue = queueMovies.some(movie => movie.id === filmData.id)
            localStorage.setItem('queue', JSON.stringify(queueMovies))
        }.bind(this))

        this.buttonWT.addEventListener('click', function (event) {
            this.buttonWT.textContent = 'ADDED TO WATHED'
            let watchedMovies = JSON.parse(localStorage.getItem('watched')) || []
            watchedMovies.push(filmInfo)
            console.log(filmInfo)
            this.isInWatched = watchedMovies.some(movie => movie.id === filmData.id)
            localStorage.setItem('watched', JSON.stringify(watchedMovies))
        }.bind(this))

        document.body.appendChild(this.modal)
        return this.modal
    }

    playerVideo(videoId) {
        const playerContainer = document.getElementById('youtubePlayer')
        const newPlayer = document.createElement('div')
        newPlayer.id = 'player'

        playerContainer.appendChild(newPlayer)

        function containsOfficialAndTrailer(name) {
            return name.toLowerCase().indexOf("official") !== -1 && name.toLowerCase().indexOf("trailer") !== -1
        }

        const trailerResult = videoId.results.find(result => containsOfficialAndTrailer(result.name))
        const key = trailerResult ? trailerResult.key : null

        if (key) {
            console.log(key);
            const player = YouTubePlayer(newPlayer, {
                width: 640,
                height: 360,
                videoId: `${key}`,
            })

            this.buttonYT.addEventListener('click', function () {
                document.getElementById('playerContainer').classList.remove('hidden')
                document.getElementById('playerContainer').classList.add('show')
                player.playVideo()
            })

            this.closePlayerBtn.addEventListener('click', function () {
                document.getElementById('playerContainer').classList.remove('show')
                document.getElementById('playerContainer').classList.add('hidden')
                player.stopVideo()

                while (playerContainer.firstChild) {
                    playerContainer.removeChild(playerContainer.firstChild)
                }
            })
        } else {
            this.buttonYT.addEventListener('click', (event) => {
                this.modalYT = document.createElement('div')
                this.modalYT.className = 'modal'
                this.modalYT.style.display = 'none'
                this.modalYT.style.position = 'fixed'
                this.modalYT.style.zIndex = '1'
                this.modalYT.style.left = '0'
                this.modalYT.style.top = '0'
                this.modalYT.style.width = '100%'
                this.modalYT.style.height = '100%'
                this.modalYT.style.overflow = 'auto'
                this.modalYT.style.backgroundColor = 'rgba(0,0,0,0.4)'
                document.body.appendChild(this.modalYT)
                this.modalYT.addEventListener('click', (event) => {
                    this.modalYT.style.display = 'none'
                })

                this.modalContentYT = document.createElement('div')
                this.modalContentYT.className = 'modal-content'
                this.modalContentYT.style.backgroundColor = '#fefefe'
                this.modalContentYT.style.margin = '15% auto'
                this.modalContentYT.style.padding = '20px'
                this.modalContentYT.style.border = '1px solid #888'
                this.modalContentYT.style.width = '80%'
                this.modalYT.appendChild(this.modalContentYT)

                this.message = document.createElement('p')
                this.message.textContent = 'Trailer not found.'
                this.message.style.textAlign = 'center'
                this.modalContentYT.appendChild(this.message)
                this.modalYT.style.display = 'block'
            })

        }

    }

    displayGenres(genreIds) {
        const genresContainer = document.querySelector('.genres-container')
        genresContainer.innerHTML = ''

        genreIds.forEach(genreId => {
            const genreElement = document.createElement('span')
            genreElement.textContent = genreId
            genresContainer.appendChild(genreElement)
        })
    }

    closeModal() {
        this.modal.style.display = 'none'
    }

    checkFilmInLists(filmId) {
        const queueMovies = JSON.parse(localStorage.getItem('queue')) || []
        const watchedMovies = JSON.parse(localStorage.getItem('watched')) || []
        const isInQueue = queueMovies.some(movie => movie.id === filmId)
        const isInWatched = watchedMovies.some(movie => movie.id === filmId)

        if (isInQueue || isInWatched) {
            const deleteButton = document.querySelector('.btn-danger')
            if (deleteButton) {
                deleteButton.style.display = 'block'
            }
        }
    }
}