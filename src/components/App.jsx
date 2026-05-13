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
    const [loadingCategories, setLoadingCategories] = useState(true);
    // console.log("Year : ",year);



    useEffect(() => {
        const fetchAllCategories = async () => {
            setLoadingCategories(true);
            const [top, now, popular, trend] = await Promise.all([
                fetchMovies.getTopRated(),
                fetchMovies.getNowPlaying(),
                fetchMovies.getPopularMovies(),
                fetchMovies.getTrending(),
            ]);
            setTopRated(top);
            setNowPlaying(now);
            setPopularMovies(popular);
            setTrending(trend);
            setLoadingCategories(false);
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
                <Row title="🔥 Trending Now" movies={trending} isLoading={loadingCategories} />
                <Row title="⭐ Top Rated Movies" movies={topRated} isLoading={loadingCategories} />
                <Row title="🎬 Now Playing" movies={nowPlaying} isLoading={loadingCategories} />
                <Row title="📈 Popular Movies" movies={popularMovies} isLoading={loadingCategories} />
                <Row title="🆕 Latest Releases" movies={latestMovies} isLoading={loadingCategories} />
            </>
        )}
    </div>
);
}

export default App;