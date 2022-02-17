//handlebars
const Handlebars = require("handlebars")

const source = document.querySelector('#templateFilm').innerHTML
const template = Handlebars.compile(source)

//other ref
const searchBtn = document.querySelector('#searchBtn')
const searchInput = document.querySelector('#searchInput')
const container = document.querySelector('.contents')
const pageTitleContainer = document.querySelector('.main__title')
const urlImg = 'https://image.tmdb.org/t/p/w342/'


const request = async function(){
    const query = searchInput.value.trim()
    emptyPage()
    
    if(query != ''){
        pageTitle(query)
        getFilm(query).then(data =>{
            appendResults(data)
        })
    }
    else {
        searchInput.focus()
    }
}

//event listners
searchBtn.addEventListener('click', request)

searchInput.addEventListener('keypress', (event) => {
        if(event.code =='Enter'){
            request()
        }
})

function emptyPage(){
    container.innerHTML = ''
    pageTitleContainer.innerHTML = ''
}

function pageTitle(query){
    const resultsTitle = document.createElement('p')
    resultsTitle.classList.add('pageTitle')
    resultsTitle.append('Risultati per "' + query + '". ')
    pageTitleContainer.appendChild(resultsTitle)

    const line = document.createElement('div')
    line.classList.add('main__line')
    pageTitleContainer.appendChild(line)
}

function posterPath(imgPath){
    if(imgPath==null){
        return 'no-poster.png'
    }
    else {
        return urlImg + imgPath
    }
}

function appendResults(data) {
    for ( let item of data.results ){
        let date=new Date(item.release_date) 
        const context = {
            'poster_path': posterPath(item.poster_path),
            'title': item.title,
            'popularity': item.popularity,
            'overview': item.overview.substr(0, 200) + '...',
            'vote_average': item.vote_average,
            'lang': item.original_language,
            'release_date': date.toLocaleDateString('it-IT'),
        }

        const html = template(context)

        const film = document.createElement('div')
        film.classList.add('film')
        film.classList.add('scaleEffect')

        film.innerHTML = html 
        container.appendChild(film)
    }
    
}

async function getFilm(query){
    try{
        const url = 'https://api.themoviedb.org/3/search/movie?query=' + query + '&language=it_IT&api_key=26864016a30e377316e6a20d4e37109e'

        const response = await fetch(url)
        if(!response.ok) throw new Error('${response.status} - ${response.statusText}')
    
        const data = await response.json()

        return data
    }
    catch(error){
        console.log(error)
    }
}