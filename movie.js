
const params = new URLSearchParams(window.location.search);
const jsonData = params.get('data');
const data = JSON.parse(decodeURIComponent(jsonData));

fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=3206e39e86eabbd67afc597cdeafe219")
.then(response => {
    return response.json();
})
.then(res => {
    let genres = res.genres;
    genres.forEach(genre => {
        const genreUl = document.querySelector("#genre");
        const li = document.createElement("li");
        data.genre_ids.forEach(id => {
            if(genre.id == id){
                li.textContent = genre.name;
                genreUl.appendChild(li);
            }
        })
    })
})

const poster = document.querySelector("#poster");
poster.src = data.poster_path !== null ? `https://image.tmdb.org/t/p/w440_and_h660_face/${data.poster_path}`: `./Images/360_F_374769082_EjmEBw7tarfjhwJ78Xxs05OjRBN4lwSp.webp`;

const title = document.querySelector("#movie-name");
title.textContent = data.title;

const overview = document.querySelector('#overview');
overview.textContent = data.overview;


const releaseDate = document.querySelector("#release-date");
releaseDate.textContent = `${data.release_date}`;

const voteAvg = document.querySelector("#vote-avg");
voteAvg.textContent = `${data.vote_average.toFixed(2)}`;

const genre = document.querySelector("#genre");
