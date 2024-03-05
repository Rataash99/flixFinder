const retreivedData = localStorage.getItem("favMovieData");
let favoriteMovies = JSON.parse(retreivedData);

function createMovieDiv(movieData){
    const movies = document.querySelector("#movies");

    // edge case - if no movies found
    if(movieData.length == 0){
        const ele = document.createElement('div');
        ele.innerHTML = `<div class = "text-2xl mx-auto flex flex-col justify-center items-center p-2 gap-4 text-center w-[65vw] h-[85vh] rounded-md">
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
        const div = document.createElement('div');
        
        div.innerHTML = `
        <a class = " cursor-pointer w-[76vw] max-w-[12rem] md:max-w-[14rem] mx-auto text-xs flex flex-col gap-[1.4rem] justify-center mb-2 hover:opacity-80 hover:scale-105 duration-200 ease-linear relative" >
            <div class = " flex gap-[1rem] relative">
                <img src = ${item.poster_path !== null ? `https://image.tmdb.org/t/p/w440_and_h660_face/${item.poster_path}` : "/Images/360_F_374769082_EjmEBw7tarfjhwJ78Xxs05OjRBN4lwSp.webp"} class = "shadow-xl shadow-slate-800 w-full"/>
                <p id = "rating" class = "absolute bottom-5 -right-5 bg-gradient-to-r from-cyan-400 via-cyan-600 to-violet-700 rounded-full p-2 py-[0.8rem] shadow-xl shadow-black">${
                    item.vote_average.toFixed(2)}</p>
            </div>
            <div class = "flex justify-between">
                <div class = "flex flex-col gap-[4px]">
                    <p class = "font-extrabold truncate max-w-[9rem]">${item.title}</p>
                    <p class = "text-slate-400">${item.release_date !== "" ? item.release_date : "Upcoming"}
                </div>
                <div class = "flex w-20 justify-end flex-row gap-3 items-center ">
                    <i class="fa-solid fa-thumbs-up text-blue-600 scale-125"></i>                
                    <p>${item.vote_count}</p>
                </div>
                <i id = "${item.id}" class="fa-regular fa-circle-xmark absolute top-1 right-1 text-2xl hover:cursor-pointer opacity-70  hover:opacity-100 hover:text-red-600"></i>
            </div>
        </a>
        `
        movies.appendChild(div);

        // sending card data to movie.html 
        sendingDataToHTML(div, item);
    })
}

// appending to favorites 
createMovieDiv(favoriteMovies);

function sendingDataToHTML(element, item){
    element.addEventListener('click',(e) => {

        // sending data to movie.html
        if(!e.target.classList.contains('fa-circle-xmark')){
            const jsonData = JSON.stringify(item);
            window.location.href = `./movie.html?data=${encodeURIComponent(jsonData)}`
        }

        // removing movies from favorites
        if(e.target.classList.contains("fa-circle-xmark")){
            favoriteMovies = favoriteMovies.filter(obj => {
                return e.target.id != obj.id;
            })
            console.log(favoriteMovies);
            movies.innerHTML = "";
            createMovieDiv(favoriteMovies);

            // making changes for deleted favorites to localStorage 
            const favData = JSON.stringify(favoriteMovies);
            localStorage.setItem('favMovieData', favData);
        }
    })
}

// adding to localStorage