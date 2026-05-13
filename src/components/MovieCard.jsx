import { useNavigate } from "react-router-dom";

function MovieCard({ movie }) {
    const navigate = useNavigate();

    const moviePlayer = () => {
        navigate("/Player", { state: { movie } });
    };

    return (
        <div
            onClick={moviePlayer}
            className="flex-shrink-0 w-40 sm:w-48 bg-[#1A1F2A] rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
        >
            <img
                className="w-full h-56 sm:h-64 object-cover"
                src={
                    movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://placehold.co/500x750?text=No+Image"
                }
                alt={movie.title || movie.name}
            />
            <div className="p-2">
                <h3 className="text-white text-sm font-semibold truncate">
                    {movie.title || movie.name}
                </h3>
                {movie.release_date && (
                    <p className="text-gray-400 text-xs">
                        {movie.release_date.split("-")[0]}
                    </p>
                )}
            </div>
        </div>
    );
}

export default MovieCard;