import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ADD THIS
import Data from "./Data.jsx";
import Header from "./Header.jsx";
import { fetchMovies } from "../api";
import Loading from "./Loading.jsx";
import Row from "./Row.jsx";

function App() {

    const location = useLocation();

    const [query, setQuery] = useState("");
    const [year, setYear] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [latestMovies, setLatestMovies] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);
    const [trending, setTrending] = useState([]);
    const [trendingTvShows , setTrendingTvShows] = useState([])
    const [latestMoviesTvShows, setLatestMoviesTvShows] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [mergedData, setMergedData] =useState([]);
    // console.log("Year : ",year);



    useEffect(() => {
        const fetchAllCategories = async () => {
            setLoadingCategories(true);
            const [top, now, popular, trend,tvShows] = await Promise.all([
                fetchMovies.getTopRated(),
                fetchMovies.getNowPlaying(),
                fetchMovies.getPopularMovies(),
                fetchMovies.getTrending(),
                fetchMovies.getTrendingTvShows(),
            ]);
            setTopRated(top);
            setNowPlaying(now);
            setPopularMovies(popular);
            setTrending(trend);
            setTrendingTvShows(tvShows)
            setLoadingCategories(false);

            let merged =[...trend, ...tvShows]
            let shuffled = merged.sort(() => Math.random() - 0.5);
            setMergedData(shuffled);
            // console.log("Populat Movies ",tvShows);
        };
        fetchAllCategories();
        fetchLatestMovies(); // fetch now-playing again? Keep if you want "Latest Releases" row
    }, []);


    useEffect(() => {
        if (location.pathname === "/") {
        // Push a dummy state so that "back" stays on the same page
        window.history.pushState(null, "", window.location.href);
        
        const handlePopState = (event) => {
            // When back is pressed, push again to stay on home
            window.history.pushState(null, "", window.location.href);
        };
        
        window.addEventListener("popstate", handlePopState);
        
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
        }
    }, [location.pathname]);



    const searchMovies = async () => {

        if (!query.trim()) {
            return;
        }

        try {

            setLoading(true);

            const result =
            await fetchMovies.byQuery({ query,year });
            // setCurrentPage(1);
            setMovies(result);

        } catch (error) {

            console.log("Error :", error);

        } finally {

            setLoading(false);
        }
    };

    const fetchLatestMovies = async () => {

        try {

            const latest =
            await fetchMovies.latestMovies();

            setLatestMovies(latest);

        } catch (error) {

            console.log(error);
        }
    };

    useEffect(() => {

        fetchLatestMovies();

    }, []);

    return (
    <div className="...">
        <Header
            query={query}
            setQuery={setQuery}
            searchMovies={searchMovies}
            year={year}
            setYear={setYear}
        />
        
        {loading && <Loading />}
        
        {query.trim() ? (
            // Search results mode
            <Data movies={movies} displayQuery={`Search Results for "${query}"`} />
        ) : (
            // Homepage mode – multiple rows
            <>
                <Row title="🆕 Latest Movies and TV Shows" movies={mergedData} isLoading={loadingCategories} type={"ms"} />
                <Row title="🆕 Latest Releases" movies={latestMovies} isLoading={loadingCategories} type={"Movies"} />
                <Row title="Latest Tv Shows" movies={trendingTvShows} isLoading={loadingCategories} type={"tv"} />
                <Row title="🔥 Trending Now" movies={trending} isLoading={loadingCategories} type={"movies"} />
                <Row title="⭐ Top Rated Movies" movies={topRated} isLoading={loadingCategories} type={"movies"} />
                <Row title="🎬 Now Playing" movies={nowPlaying} isLoading={loadingCategories} type={"movies"} />
                <Row title="📈 Popular Movies" movies={popularMovies} isLoading={loadingCategories} type={"movies"} />
                
            </>
        )}
    </div>
);
}

export default App;