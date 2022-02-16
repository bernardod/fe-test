//handlebars
const Handlebars = require("handlebars")

const source = document.querySelector('#templateFilm').innerHTML
const template = Handlebars.compile(source)

//other ref
const searchBtn = document.querySelector('#searchBtn')
const searchInput = document.querySelector('#searchInput')
const container = document.querySelector('.contents')
const pageTitleContainer = document.querySelector('.pageTitle')
const urlImg = 'https://image.tmdb.org/t/p/w342/'

const filmContainer =document.querySelector('.film')

//button event listner
searchBtn.addEventListener('click', 
    async function(){
        const query = searchInput.value.trim()
        emptyPage()
        pageTitle(query)

        if(query != ''){
            getFilm(query).then(data =>{
                appendResults(data)
            })
        }
        else {
            searchInput.focus()
        }
})



function emptyPage(){
    container.innerHTML = ''
    pageTitleContainer.innerHTML = ''
}

function pageTitle(query){
    const resultsTitle = document.createElement('p')
    resultsTitle.classList.add('pageTitle')
    resultsTitle.append('Risultati di ricerca per "' + query + '": ')
    pageTitleContainer.appendChild(resultsTitle)
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
            'overview': item.overview,
            'vote_average': item.vote_average,
            'lang': item.original_language,
            'release_date': date.toLocaleDateString('it-IT'),
        }

        const html = template(context)

        const film = document.createElement('div')
        film.classList.add('film')

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

/*
function tryFn(func, param){

    try{
        //func(param)
    } catch(error){
        console.log(error)
    }
}*/