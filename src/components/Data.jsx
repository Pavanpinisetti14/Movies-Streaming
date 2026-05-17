
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Data({movies,loading,displayQuery}) {

  const [currentPage, setCurrentPage] = useState(1);

  const movieperpage = 15;
  const lastindex = currentPage * movieperpage;

  const firstindex = lastindex - movieperpage;
  const currentmovies = movies.slice(firstindex, lastindex);

  const navigate = useNavigate();

  const moviePlayer = (movie) => {
     movie.media_type === "tv" ? navigate("TvShowPayer",{state:{movie}})
    :navigate("/Player", {state : {movie}});
  }

  // console.log("Movies & shows ",movies);
    
   return (
    <div className="container mx-auto px-4 py-8">
      {
        movies.length > 0 ? (

          <>
             {
                displayQuery ? (
                  
                  <div className="mb-8 pb-2 border-b border-red-600 inline-block">
                    <span className="text-2xl font-semibold text-white tracking-tight">
                      {displayQuery}
                    </span>
                    <span className="ml-3 text-sm text-gray-400">
                      ({movies.length} movies)
                    </span>
                  </div>

                ) : (

                  <div className="mb-8 pb-2 border-b border-red-600 inline-block">
                    <span className="text-2xl font-semibold text-white tracking-tight">
                      Latest Movies From Our Side
                    </span>
                  </div>

                )
              }
              
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
           
              {
                currentmovies.map((movie, index) => (

                  <div
                    key={index}
                    className="bg-[#1A1F2A] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                    onClick={() => moviePlayer(movie)}
                  >

                    <div className="relative overflow-hidden">
                      <img
                        className="w-full h-[280px] object-cover transition-transform duration-300 group-hover:scale-105"
                        src={
                          movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "https://placehold.co/500x750?text=No+Image"
                        }
                        alt={movie.title}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          ▶ Watch Now
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h2 className="text-white font-bold text-lg truncate">
                        {movie.title}
                      </h2>

                      {
                        movie.release_date &&
                        <p className="mt-2 text-gray-400 text-sm">
                          📅 {movie.release_date.split("-")[0]}
                        </p>
                      }
                      <p className="mt-2 text-gray-400 text-sm">Type : { movie.media_type === "tv" ? "Tv Show" : "Movie"}</p>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          moviePlayer(movie);
                        }}
                        className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-colors duration-200"
                      >
                        Watch Movie
                      </button>
                    </div>

                  </div>
                ))
              }

            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-center items-center gap-3 mt-12">

              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-[#2A2F36] hover:bg-red-600 text-white px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#2A2F36] transition-colors duration-200"
              >
                ← Previous
              </button>

              <span className="text-gray-300 font-medium">
                Page {currentPage} of {Math.ceil(movies.length / movieperpage)}
              </span>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={lastindex >= movies.length}
                className="bg-[#2A2F36] hover:bg-red-600 text-white px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#2A2F36] transition-colors duration-200"
              >
                Next →
              </button>

            </div>

          </>

        ) : (

          !loading && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No movies found</p>
            </div>
          )

        )
      }
    </div>
  );
}
export default Data;