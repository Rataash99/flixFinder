const favourites = document.querySelector("#favourites");

let movieData = [];
const retreivedData = localStorage.getItem("favMovieData");
let favoriteMovies = JSON.parse(retreivedData);
console.log(typeof(favoriteMovies));

// api call returning movie array
const movieApi = (query) => {
    if(query){
        movies.innerHTML = "";
        createMovieDiv(movieData);
        return;
    }
    let url = 'https://api.themoviedb.org/3/discover/movie?api_key=3206e39e86eabbd67afc597cdeafe219';
    fetch(url)
    .then(response => {
        return response.json();
    })
    .then(res => {
        movieData = res.results;
        createMovieDiv(movieData);
    })
    .catch(err => {
        console.error('Fetch Error', err);
    })
}
movieApi(false);

// creating div for movies
function createMovieDiv(movieData){
    const movies = document.querySelector("#movies");

    // edge case - if no movies found
    if(movieData.length == 0){
        const ele = document.createElement('div');
        ele.innerHTML = `<div class = "text-2xl mx-auto flex flex-col justify-center items-center p-2 gap-4 text-center w-[65vw] h-[85vh]  rounded-md">
            <div class = "flex flex-col sm:flex-row gap-3 items-center"> 
                <h1>No Movies Found!</h1> 
                <i class="fa-solid fa-face-grin-tongue text-yellow-500  text-4xl lg:text-6xl text-center"></i>
            </div>
            <a href = "./index.html" class = " rounded-md p-3 px-6 bg-blue-600 text-base hover:scale-105 duration-300 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600">Back To Home</a>
        </div>`
        movies.appendChild(ele);
        return;
    }
    // adding movies to div
    movieData.forEach(item => {
        let isPresent = false;
        if(favoriteMovies != null){
            favoriteMovies.forEach(card => {
                if(card.id == item.id){
                    isPresent = true;
                }
            })
        }
        const div = document.createElement('div');
        
        div.innerHTML = `
        <a class = " cursor-pointer w-[76vw] max-w-[12rem] md:max-w-[14rem] mx-auto text-xs flex flex-col gap-[1.4rem] justify-center mb-2 hover:opacity-80 hover:scale-105 duration-200 ease-linear" >
            <div class = " flex gap-[1rem] relative">
                <img src = ${item.poster_path !== null ? `https://image.tmdb.org/t/p/w440_and_h660_face/${item.poster_path}` : "./Images/360_F_374769082_EjmEBw7tarfjhwJ78Xxs05OjRBN4lwSp.webp"} class = "shadow-xl shadow-slate-800 w-full"/>
                <p id = "rating" class = "absolute bottom-5 -right-5 bg-gradient-to-r from-cyan-400 via-cyan-600 to-violet-700 rounded-full p-2 py-[0.8rem] shadow-xl shadow-black">${
                    item.vote_average.toFixed(2)}</p>
            </div>
            <div class = "relative">
                <div class = "flex flex-col gap-[4px]">
                    <p class = "font-extrabold truncate max-w-[70%]">${item.title}</p>
                    <p class = "text-slate-400">${item.release_date !== "" ? item.release_date : "Upcoming"}
                </div>
                <i id = "${item.id}" class=" fa-heart absolute right-0 bottom-[1.1rem] text-lg hover:cursor-pointer hover:text-red-600 ${isPresent ? 'marked fa-solid' : 'fa-regular'}"></i>
            </div>
        </a>
        `
        movies.appendChild(div);

        // sending card data to movie.html 
        sendingDataToHTML(div, item);
    })
}
// adding and removing favorites to array
movies.addEventListener('click', (e) => {
    if(e.target.classList.contains('fa-heart')){
        if(e.target.classList.contains("marked")){
            e.target.classList.add("fa-regular");
            e.target.classList.remove("fa-solid");
            e.target.classList.remove("marked");
        }
        else {
            e.target.classList.add("marked");
            e.target.classList.remove("fa-regular");
            e.target.classList.add("fa-solid");
        }
        // adding and removing favourites 
        movieData.forEach(item => {
            if(e.target.id == item.id){
                if(e.target.classList.contains("marked")){
                    favoriteMovies.push(item);
                }
                else{
                    favoriteMovies = favoriteMovies.filter(obj => {
                        return e.target.id != obj.id;
                    })
                }
            }
        })
        // saving favorites to local Storage 
        const favData = JSON.stringify(favoriteMovies);
        localStorage.setItem('favMovieData', favData);
    }
});

    // handling favorite.html
    const favBtn = document.querySelector('#go-to-fav');
    favBtn.addEventListener('click', handleFavBtn);
    function handleFavBtn(){
        const jsonData = JSON.stringify(favoriteMovies);
        window.location.href = `./favorite.html?favorites=${encodeURIComponent(jsonData)}`
    }
    
    // handling favoriteBtn for aside section
    const arrow = document.querySelector('#arrow');
    const favorites = document.querySelector('#favorites');

    arrow.addEventListener('click', () => {

        if(arrow.classList.contains("fa-chevron-right")){
            arrow.classList.add('fa-chevron-left');
            arrow.classList.remove("fa-chevron-right");
            favorites.classList.remove("-translate-x-[8.3rem]");
            favorites.classList.add("-translate-x-1");
        }
        else{
            arrow.classList.add("fa-chevron-right");
            arrow.classList.remove('fa-chevron-left');
            favorites.classList.add("-translate-x-[8.3rem]");
            favorites.classList.remove("-translate-x-1");
        }
    })

    // handling search bar 
    const searchInput = document.querySelector("input");
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('keypress', (e) => handleSearch(e))
    
    // handling searchInput 
    function handleSearch(e){
        const searchQuery = searchInput.value.trim();
        const url = `https://api.themoviedb.org/3/search/movie?api_key=3206e39e86eabbd67afc597cdeafe219&query=${searchQuery}`;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            handleSearchList(data.results, e);// Process the response data
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    // handling search list 
    function handleSearchList(searchMovie, e){
        const searchList = document.querySelector("#search-list");
        const magnifyingGlass = document.querySelector("#magnifying-glass");

        // showing movies when search icon is clicked
        magnifyingGlass.addEventListener('click', (e) => {
            movieData = searchMovie;
            movieApi(true);
            searchInput.value = "";
            searchList.innerHTML = "";
            return;
        });

        // showing movies when enter is clicked
        if(e.key === "Enter"){
            movieData = searchMovie;
            movieApi(true);
            searchInput.value = "";
            searchList.innerHTML = "";
            return;
        }
        searchList.hidden = false;
        searchList.innerHTML = "";
        searchMovie.forEach((movie, idx) => {
            const li = document.createElement('li');
            li.innerHTML = `<div class = " flex flex-row justify-between items-center p-3 gap-3 text-xs cursor-pointer duration-300 hover:bg-opacity-10  hover:bg-white hover:translate-x-1">
                <img src = ${movie.poster_path !== null ? `https://image.tmdb.org/t/p/w440_and_h660_face/${movie.poster_path}` : "./Images/360_F_374769082_EjmEBw7tarfjhwJ78Xxs05OjRBN4lwSp.webp"} class = "size-12 rounded-full"/>
                <p class = "text-right"> <span class = " text-right ">${movie.title}</span> (${movie.release_date !== "" ? movie.release_date.substring(0, 4): "Upcoming"})</p>
            </div>`
            if(idx != searchMovie.length - 1){
                const hr = document.createElement('hr');
                hr.classList.add('w-[97%]', 'mx-auto', 'border-s', 'border-blue-500');
                li.appendChild(hr);
            }
            searchList.appendChild(li);

            // sending search selection to movie.html 
            sendingDataToHTML(li, movie);
        })
    }

    // sending individual movie data to movie.html
function sendingDataToHTML(element, item){
    element.addEventListener('click',(e) => {
        if(!e.target.classList.contains('fa-heart')){
            const jsonData = JSON.stringify(item);
            window.location.href = `./movie.html?data=${encodeURIComponent(jsonData)}`
        }
    })
}