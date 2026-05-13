

export const fetchMovies = {
    byQuery : ({query}) => fetchMoviesByQuery({query}),
    latestMovies : () => fetchLatestMovies(),
    suggestedMovies: ({id}) => fetchSuggestedMovies({id}),
}

async function fetchLatestMovies(){
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=e14969396fc4891ca7b01a372713c8d6`
    );
    const data = await response.json();
    return data.results || [];
}
async function fetchMoviesByQuery ({query}){

    const moviesData1 = await fetchMoviesByNameOne({query});
    const moviesData2 = await fetchMovieByNameTwo({query});
    // console.log("Movies Data 1 : ",moviesData1);
    // console.log("Movies Data 2 : ",moviesData2);
    // console.log("Movies Data 3 : ",moviesData3);    
    const mergedData = [
        ...moviesData1,
        ...moviesData2,
    ];
    // console.log("Merged dat ",mergedData);
    const uniqueMovies = Array.from(
        new Map(
            mergedData.map(movie => [
                movie.id, movie 
            ])
        ).values()
    );
    // console.log("Unique Movies : ",uniqueMovies);
    return uniqueMovies;
}

async function fetchMoviesByNameOne({query}){


    try {
        
        const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=e14969396fc4891ca7b01a372713c8d6&query=${query.replace(" ","%20")}`
      );

      const data = await response.json();
      
      return data.results || [];

    } catch (error) {
        console.log("Error in Fetch One : ",error);
        const err = ["Fetching Movies Failed"];
        return err;
    }
}

async function fetchMovieByNameTwo({query}){

    try {
        const response = await fetch(
            `https://plsdontscrapemelove.flixer.su/api/tmdb/search/multi?language=en-US&query=${query.replace(" ","%20")}&page=1`
        );
        const data = await response.json();
        return data.results || [];



    } catch (error) {
        console.log("Error in Fetch Two : ",error);
        const err = ["Fetching Movies Failed"];
        return err;
    }
}

async function fetchSuggestedMovies({id}){


    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=e14969396fc4891ca7b01a372713c8d6`
        );
        const data = await response.json();
        return data.results || [];  
    } catch (error) {
        console.log("Error in Fetch Suggested Movies : ",error);
        const err = ["Fetching Suggested Movies Failed"];
        return err;
    }
}


