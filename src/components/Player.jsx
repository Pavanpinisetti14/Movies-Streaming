import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Data from "./Data";
import { fetchMovies } from "../api";

function Player() {
    const loc = useLocation();
    const movies = loc.state;
    const navigate = useNavigate();

    const [suggestedMovies, setSuggestedMovies] = useState([]);
    const [credits, setCredits] = useState({ cast: [], crew: [] });
    const [loading, setLoading] = useState(true);
    const [creditsLoading, setCreditsLoading] = useState(true);

    const fetchSuggestedMovies = async () => {
        const data = await fetchMovies.suggestedMovies({ id: movies.movie.id });
        setSuggestedMovies(data);
    };
    console.log("Movie Is : ",movies.movie.id)
    const fetchMovieCredits = async () => {
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/movie/${movies.movie.id}/credits?api_key=e14969396fc4891ca7b01a372713c8d6`
            );
            const data = await response.json();
            setCredits(data);
        } catch (error) {
            console.log("Error fetching credits:", error);
        } finally {
            setCreditsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestedMovies();
        fetchMovieCredits();
    },[credits]);

    const getDirector = () => {
        const director = credits.crew?.find(member => member.job === "Director");
        return director ? director.name : "Unknown";
    };

    return (
        <>
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-[#0A0C10]/95 backdrop-blur-md border-b border-[#2A2F36] px-4 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <svg width="36" height="36" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 sm:w-10">
                            <rect width="512" height="512" rx="96" fill="#E50914"/>
                            <rect x="80" y="96" width="40" height="320" rx="8" fill="white"/>
                            <circle cx="100" cy="160" r="8" fill="#E50914"/>
                            <circle cx="100" cy="240" r="8" fill="#E50914"/>
                            <circle cx="100" cy="320" r="8" fill="#E50914"/>
                            <circle cx="100" cy="400" r="8" fill="#E50914"/>
                            <rect x="392" y="96" width="40" height="320" rx="8" fill="white"/>
                            <circle cx="412" cy="160" r="8" fill="#E50914"/>
                            <circle cx="412" cy="240" r="8" fill="#E50914"/>
                            <circle cx="412" cy="320" r="8" fill="#E50914"/>
                            <circle cx="412" cy="400" r="8" fill="#E50914"/>
                            <polygon points="196,160 196,352 360,256" fill="white"/>
                        </svg>
                        <p className="text-2xl sm:text-3xl font-bold text-red-600 tracking-tight">MovieFlex</p>
                    </div>
                    <button
                        className="text-white font-semibold hover:text-red-500 transition-colors duration-200"
                        onClick={() => navigate("/", { replace: true })}
                    >
                        ← Home
                    </button>
                </div>
            </nav>

            <main className="bg-gradient-to-b from-[#0A0C10] to-[#14181F] min-h-screen">
                <div className="container mx-auto px-4 py-8">
                    {/* Two column layout */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* LEFT COLUMN: Video Player (top) + Credits (bottom) */}
                        <div className="flex-1 flex flex-col gap-6">
                            {/* Video Player */}
                            <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl">
                                {loading && (
                                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/80 z-10">
                                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-white mt-4 text-sm">Loading player...</p>
                                    </div>
                                )}
                                <iframe
                                    key={movies.movie.id}
                                    className="w-full aspect-video rounded-xl"
                                    src={`https://www.vidking.net/embed/movie/${movies.movie.id}`}
                                    allowFullScreen
                                    onLoad={() => setLoading(false)}
                                ></iframe>
                            </div>
                            {/* Cast Credits Section – Grid 5 columns */}
                            <div className="bg-[#1A1F2A] rounded-xl p-5 shadow-lg">
                                <h3 className="text-red-500 font-semibold text-lg mb-4 flex items-center gap-2">
                                    🎭 Top Cast
                                </h3>
                                {creditsLoading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="ml-3 text-gray-400">Loading cast...</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {credits.cast.slice(0, 10).map((actor, idx) => (
                                            <div key={idx} className="text-center">
                                                <img
                                                    src={actor.profile_path 
                                                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                                        : "https://placehold.co/185x278?text=No+Image"
                                                    }
                                                    alt={actor.name}
                                                    className="w-full aspect-square rounded-full object-cover border-2 border-red-600 shadow-md"
                                                />
                                                <p className="text-white text-xs font-semibold mt-2 truncate">{actor.name}</p>
                                                <p className="text-gray-400 text-[10px] truncate">as {actor.character}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            
                        </div>

                        {/* RIGHT COLUMN: Movie Details */}
                        <div className="lg:w-80 xl:w-96">
                            <div className="bg-[#1A1F2A] rounded-xl overflow-hidden shadow-lg sticky top-24">
                                <img
                                    className="w-full h-auto object-cover"
                                    src={`https://image.tmdb.org/t/p/w500${movies.movie.poster_path}`}
                                    alt={movies.movie.title}
                                />
                                <div className="p-5">
                                    <h2 className="text-white text-xl font-bold mb-2">
                                        {movies.movie.title}
                                    </h2>
                                    {movies.movie.release_date && (
                                        <p className="text-gray-400 text-sm mb-3">
                                            📅 {movies.movie.release_date}
                                        </p>
                                    )}
                                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                        {movies.movie.overview}
                                    </p>
                                    <div className="border-t border-[#2A2F36] pt-3">
                                        <span className="text-red-500 font-semibold text-xs uppercase">Director</span>
                                        <p className="text-gray-300 text-sm mt-1">{getDirector()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggested Movies Section */}
                    <div className="mt-12">
                        <Data movies={suggestedMovies} displayQuery={"Suggested Movies"} />
                    </div>
                </div>
            </main>
        </>
    );
}

export default Player;