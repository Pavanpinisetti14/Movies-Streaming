import MovieCard from "./MovieCard";
import Loading from "./Loading";
function Row({ title, movies, isLoading }) {
    if (isLoading) return <div className="text-white px-4"><Loading/></div>;
    if (!movies.length) return null;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-red-600 mb-2 px-4">{title}</h2>
            <div className="flex overflow-x-auto gap-3 px-4 scrollbar-thin scrollbar-thumb-red-600 pb-2">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}

export default Row;