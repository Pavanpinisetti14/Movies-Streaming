import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Data from "./Data";
import { fetchMovies } from "../api";

function TVPlayer() {
    const loc = useLocation();
    // Accept tvShow from state (navigate with { state: { tvShow } })
    const tvShow = loc.state?.tvShow || loc.state;
    console.log("TV Show : ",tvShow);
    const navigate = useNavigate();

    const [showDetails, setShowDetails] = useState(null);
    const [credits, setCredits] = useState({ cast: [], crew: [] });
    const [seasons, setSeasons] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState([]);
    const [selectedEpisode, setSelectedEpisode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [creditsLoading, setCreditsLoading] = useState(true);
    const [episodesLoading, setEpisodesLoading] = useState(false);
    const [suggestedTV, setSuggestedTV] = useState([]);
    const [activeServer, setActiveServer] = useState("serverOne");
    const [error, setError] = useState(false);
    const [imdbId, setImdbId] = useState(null);
    const [isImdbReady, setIsImdbReady] = useState(false);

    const TMDB_API_KEY = "e14969396fc4891ca7b01a372713c8d6";

    // ✅ Get the ID from tvShow.movie.id (as in original)
    const tvId = tvShow?.movie?.id || tvShow?.id;
    if (!tvId) console.error("No TV show ID found", tvShow);

    // Fetch all data in one effect
    useEffect(() => {
        if (!tvId) return;

        const fetchAll = async () => {
            try {
                // 1. Show details
                const showRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tvId}?api_key=${TMDB_API_KEY}`
                );
                const showData = await showRes.json();
                setShowDetails(showData);

                // 2. Seasons – skip season 0 (specials)
                const allSeasons = showData.seasons || [];
                const regularSeasons = allSeasons.filter(s => s.season_number > 0);
                setSeasons(regularSeasons);
                if (regularSeasons.length) {
                    setSelectedSeason(regularSeasons[0].season_number);
                }

                // 3. Credits
                const creditsRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${TMDB_API_KEY}`
                );
                const creditsData = await creditsRes.json();
                setCredits(creditsData);

                // 4. IMDb ID
                const externalRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tvId}/external_ids?api_key=${TMDB_API_KEY}`
                );
                const externalData = await externalRes.json();
                setImdbId(externalData.imdb_id);
                setIsImdbReady(true);

                // 5. Recommendations
                const recRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tvId}/recommendations?api_key=${TMDB_API_KEY}`
                );
                const recData = await recRes.json();
                setSuggestedTV(recData.results || []);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(true);
            } finally {
                setCreditsLoading(false);
            }
        };

        fetchAll();
    }, [tvId]);

    // Fetch episodes when season changes
    useEffect(() => {
        if (!selectedSeason || !tvId) return;
        const fetchEpisodes = async () => {
            setEpisodesLoading(true);
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/tv/${tvId}/season/${selectedSeason}?api_key=${TMDB_API_KEY}`
                );
                const data = await res.json();
                setEpisodes(data.episodes || []);
                if (data.episodes?.length) {
                    setSelectedEpisode(data.episodes[0]);
                } else {
                    setSelectedEpisode(null);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setEpisodesLoading(false);
            }
        };
        fetchEpisodes();
    }, [selectedSeason, tvId]);

    // Timeout to hide loading spinner
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) {
                setLoading(false);
                if (!error) setError(true);
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, [loading, error]);

    const getCreatorOrDirector = () => {
        // For TV shows, often "Creator" is more appropriate
        const creator = credits.crew?.find(member => member.job === "Creator");
        if (creator) return creator.name;
        const director = credits.crew?.find(member => member.job === "Director");
        return director ? director.name : "Unknown";
    };

    const switchServer = (server) => {
        setActiveServer(server);
        setLoading(true);
        setError(false);
    };

    const handleIframeError = () => {
        setLoading(false);
        setError(true);
    };

    // Build video URL – use tvShow.movie.id or tvId
    const getVideoUrl = () => {
        if (!selectedEpisode) return "";
        const seasonNum = selectedSeason;
        const episodeNum = selectedEpisode.episode_number;
        const tmdbId = tvId;  // already the correct ID

        // Inside your getVideoUrl function for TV shows
        switch (activeServer) {
            case "serverOne": // VidKing
                return `https://www.vidking.net/embed/tv/${tmdbId}/${seasonNum}/${episodeNum}`;
            case "serverTwo": // VidSrc (vidsrc-embed.ru)
                return `https://vidsrc-embed.ru/embed/tv/${tmdbId}/${seasonNum}/${episodeNum}`;
            case "serverThree": // PrimeSrc
                return `https://primesrc.me/embed/tv?tmdb=${tmdbId}&season=${seasonNum}&episode=${episodeNum}`;
            case "serverFour": // Optional (e.g., vidsrc.xyz using IMDb)
                return imdbId ? `https://vidsrc-embed.ru/embed/tv/${imdbId}/${seasonNum}/${episodeNum}` : "";
            // ... rest of your servers
        }
    };

    const videoUrl = getVideoUrl();
    const showIframe = !error && videoUrl && (activeServer === "serverOne" || isImdbReady);

    if (!showDetails && !error) return <div className="text-white p-8">Loading show details...</div>;
    if (error && !showDetails) return <div className="text-white p-8 text-red-500">Failed to load TV show.</div>;

    return (
        <>
            {/* Navigation Bar (unchanged) */}
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
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* LEFT COLUMN */}
                        <div className="flex-1 flex flex-col gap-6">
                            {/* Video Player */}
                            <div className="relative rounded-xl overflow-hidden bg-black shadow-2xl">
                                {loading && (
                                    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/80 z-10">
                                        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-white mt-4 text-sm">Loading player...</p>
                                    </div>
                                )}
                                {!showIframe ? (
                                    <div className="w-full aspect-video flex flex-col items-center justify-center bg-[#1A1F2A] text-white">
                                        <p className="text-yellow-500 text-lg mb-4">⏳ Preparing video...</p>
                                        <p className="text-gray-400 text-sm">
                                            {activeServer !== "serverOne" && !imdbId
                                                ? "Fetching IMDb ID for this server..."
                                                : "Select an episode to start watching"}
                                        </p>
                                    </div>
                                ) : (
                                    <iframe
                                        key={`${activeServer}-${selectedSeason}-${selectedEpisode?.episode_number}`}
                                        className="w-full aspect-video rounded-xl"
                                        src={videoUrl}
                                        allowFullScreen
                                        onLoad={() => {
                                            setLoading(false);
                                            setError(false);
                                        }}
                                        onError={handleIframeError}
                                        title="TV Player"
                                    />
                                )}
                            </div>

                            {/* Server Buttons */}
                            <div className="flex flex-wrap justify-center gap-3">
                                {["serverOne", "serverTwo", "serverThree","serverFour"].map((server, idx) => (
                                    <button
                                        key={server}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                                            activeServer === server
                                                ? "bg-red-700 text-white"
                                                : "bg-[#2A2F36] text-gray-300 hover:bg-red-600"
                                        }`}
                                        onClick={() => switchServer(server)}
                                    >
                                        Server {idx + 1} {server === "serverOne" ? "" : server === "serverTwo" ? "" : server === "serverThree"?"":""}
                                    </button>
                                ))}
                            </div>

                            {/* Cast Credits Section */}
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
                                        {credits.cast?.slice(0, 10).map((actor, idx) => (
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

                            {/* EPISODES SECTION */}
                            <div className="bg-[#1A1F2A] rounded-xl p-5 shadow-lg">
                                <h3 className="text-red-500 font-semibold text-lg mb-4">📺 Episodes</h3>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    <select
                                        value={selectedSeason}
                                        onChange={(e) => setSelectedSeason(Number(e.target.value))}
                                        className="bg-[#2A2F36] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                                    >
                                        {seasons.map((season) => (
                                            <option key={season.season_number} value={season.season_number}>
                                                Season {season.season_number}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {episodesLoading ? (
                                    <div className="text-center py-4">Loading episodes...</div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {episodes.map((ep) => (
                                            <button
                                                key={ep.id}
                                                onClick={() => {
                                                    setSelectedEpisode(ep);
                                                    setLoading(true);
                                                    setError(false);
                                                }}
                                                className={`text-left p-2 rounded-lg transition-colors ${
                                                    selectedEpisode?.id === ep.id
                                                        ? "bg-red-600 text-white"
                                                        : "bg-[#2A2F36] text-gray-300 hover:bg-red-600/50"
                                                }`}
                                            >
                                                <div className="text-sm font-semibold">Ep {ep.episode_number}</div>
                                                <div className="text-xs truncate">{ep.name}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Show Details */}
                        <div className="lg:w-80 xl:w-96">
                            <div className="bg-[#1A1F2A] rounded-xl overflow-hidden shadow-lg sticky top-24">
                                <img
                                    className="w-full h-auto object-cover"
                                    src={showDetails?.poster_path ? `https://image.tmdb.org/t/p/w500${showDetails.poster_path}` : "https://placehold.co/500x750?text=No+Image"}
                                    alt={showDetails?.name}
                                />
                                <div className="p-5">
                                    <h2 className="text-white text-xl font-bold mb-2">{showDetails?.name}</h2>
                                    {showDetails?.first_air_date && (
                                        <p className="text-gray-400 text-sm mb-3">📅 {showDetails.first_air_date}</p>
                                    )}
                                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{showDetails?.overview}</p>
                                    <div className="border-t border-[#2A2F36] pt-3">
                                        <span className="text-red-500 font-semibold text-xs uppercase">Creator / Director</span>
                                        <p className="text-gray-300 text-sm mt-1">{getCreatorOrDirector()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Suggested TV Shows Section */}
                    <div className="mt-12">
                        <Data movies={suggestedTV} displayQuery="Suggested TV Shows" />
                    </div>
                </div>
            </main>
        </>
    );
}

export default TVPlayer;