//more video players https://vidsrcme.ru/api/

export const fetchMovies = {
    byQuery: ({ query, year }) => fetchMoviesByQuery({ query, year }),
    latestMovies: () => fetchLatestMovies(),
    suggestedMovies: ({ id }) => fetchSuggestedMovies({ id }),
    getTopRated: () => fetchTopRated(),
    getNowPlaying: () => fetchNowPlaying(),
    getPopularMovies: () => fetchPopularMovies(),
    getTrending: () => fetchTrending(),
    getPopularTV: () => fetchPopularTV(), 
    getImdbIdFromTmdb: ({ tmdbId }) => fetchImdbIdFromTmdb({ tmdbId }),
}

async function fetchLatestMovies() {
    const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=e14969396fc4891ca7b01a372713c8d6`
    );
    const data = await response.json();
    return data.results || [];
}

// Main search function that merges two APIs and filters by year
async function fetchMoviesByQuery({ query, year }) {
    const moviesData1 = await fetchMoviesByNameOne({ query, year });
    const moviesData2 = await fetchMovieByNameTwo({ query });

    let mergedData = [...moviesData1, ...moviesData2];

    // If year is provided, filter both results by release year
    if (year && year.trim()) {
        const targetYear = parseInt(year);
        mergedData = mergedData.filter(movie => {
            // TMDb uses 'release_date', flixer.su may use 'release_date' or 'first_air_date'
            const releaseDate = movie.release_date || movie.first_air_date;
            if (releaseDate) {
                const movieYear = new Date(releaseDate).getFullYear();
                return movieYear === targetYear;
            }
            return false;
        });
    }

    // Remove duplicates by movie id
    const uniqueMovies = Array.from(
        new Map(mergedData.map(movie => [movie.id, movie])).values()
    );
    return uniqueMovies;
}

// First API – TMDb (supports year directly)
async function fetchMoviesByNameOne({ query, year }) {
    try {
        let url = `https://api.themoviedb.org/3/search/movie?api_key=e14969396fc4891ca7b01a372713c8d6&query=${encodeURIComponent(query)}`;
        if (year && year.trim()) {
            url += `&primary_release_year=${year}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.log("Error in Fetch One : ", error);
        return [];
    }
}

// Second API – flixer.su (no year param, so we filter later)
async function fetchMovieByNameTwo({ query }) {
    try {
        const response = await fetch(
            `https://plsdontscrapemelove.flixer.su/api/tmdb/search/multi?language=en-US&query=${encodeURIComponent(query)}&page=1`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.log("Error in Fetch Two : ", error);
        return [];
    }
}

async function fetchSuggestedMovies({ id }) {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=e14969396fc4891ca7b01a372713c8d6`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.log("Error in Fetch Suggested Movies : ", error);
        return [];
    }
}

async function fetchTopRated() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=e14969396fc4891ca7b01a372713c8d6`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.log("Error fetching top-rated movies:", error);
        return [];
    }
}

async function fetchNowPlaying() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/now_playing?api_key=e14969396fc4891ca7b01a372713c8d6`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.log("Error fetching now-playing movies:", error);
        return [];
    }
}

async function fetchPopularMovies() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=e14969396fc4891ca7b01a372713c8d6`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.log("Error fetching popular movies:", error);
        return [];
    }
}

async function fetchTrending() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=e14969396fc4891ca7b01a372713c8d6`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.log("Error fetching trending movies:", error);
        return [];
    }
}

// Optional – popular TV shows
async function fetchPopularTV() {
    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/tv/popular?api_key=e14969396fc4891ca7b01a372713c8d6`
        );
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.log("Error fetching popular TV shows:", error);
        return [];
    }
}

// New function to get the IMDB ID from a TMDb ID
async function fetchImdbIdFromTmdb({ tmdbId }) {
    try {
        // Call the TMDb API to get external IDs for the movie
        const response = await fetch(
            `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=e14969396fc4891ca7b01a372713c8d6`
        );
        const data = await response.json();
        
        // The response includes an 'imdb_id' field (e.g., "tt1375666")
        return data.imdb_id;
    } catch (error) {
        console.log("Error fetching IMDB ID:", error);
        return null;
    }
}