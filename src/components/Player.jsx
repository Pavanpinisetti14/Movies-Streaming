
// import {useEffect, useState} from "react";;
// import { useLocation, useNavigate } from "react-router-dom";
// import Header from "./Header";
// import Data from "./Data";
// import { fetchMovies } from "../api";
// function Player({query, setQuery}){

//     const loc = useLocation();
//     const movies = loc.state;
//     console.log("Movie Player Data : ",movies.movie.id);

//     const navigate = useNavigate();
//     const [suggestedMovies, setSuggestedMovies] = useState([]);

//     const fetchSuggestedMovies = async () => {
//         const data = await fetchMovies.suggestedMovies({id:movies.movie.id});
//         setSuggestedMovies(data);
//     }

//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchSuggestedMovies();
//     },[]);

//     return (
//         <>
//             <nav className="flex items-center justify-between gap-20 p-8">

//                 <p className="text-4xl font-bold text-center mb-8">
//                     Movie Search App
//                 </p>

//                 <div className="flex items-center gap-10">

//                     <button
//                         className="text-4xl font-bold text-center mb-8"
//                         onClick={() => {
//                             navigate("/",{replace:true});
//                         }}
//                     >
//                         Home
//                     </button>

//                 </div>

//             </nav>
//             <main>
//                 <div className="flex items-center justify-between gap-20 p-8">
//                     <div className="flex flex-column items-center gap-10">
//                         <div className="relative">

//                             {
//                                 loading && (

//                                     <div className="absolute inset-0 flex flex-column justify-center items-center bg-black rounded-lg">

//                                         <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
//                                         {/* <br></br><br></br><div><p className="text-white" >Wait a mintue...</p></div> */}
//                                     </div>
//                                 )
//                             }

//                             <iframe
//                                 key={movies.movie.id}
//                                 className="w-[800px] h-[600px] rounded-lg"
//                                 src={`https://www.vidking.net/embed/movie/${movies.movie.id}`}
//                                 allowFullScreen
//                                 onLoad={() => setLoading(false)}
//                             ></iframe>

//                         </div>

//                     </div>
//                     <div className="bg-white p-5 rounded-xl shadow-md">

//                         <img
//                             className="w-full h-[350px] object-contains rounded-lg"
//                             src={`https://image.tmdb.org/t/p/w500${movies.movie.poster_path}`}
//                             alt={movies.title}
//                         />

//                         <h2 className="text-black text-xl font-bold mt-3">
//                             {movies.movie.title}
//                         </h2>

//                         {
//                             movies.movie.release_date &&
//                             <p className="mt-2">
//                             <b>Relase Date :</b> {movies.movie.release_date}
//                             </p>
//                         }
//                         <p className="mt-2">
//                             {movies.movie.overview}
//                         </p>

//                     </div>
//                 </div>
//                 <div>
//                     <Data movies={suggestedMovies} displayQuery={"Suggested Movies"} />
//                 </div>
//             </main>
            
        
//         </>
//     )
    
// }
// export default Player;


import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Data from "./Data";
import { fetchMovies } from "../api";

function Player({ query, setQuery }) {

    const loc = useLocation();
    const movies = loc.state;
    console.log("Movie Player Data : ", movies.movie.id);

    const navigate = useNavigate();
    const [suggestedMovies, setSuggestedMovies] = useState([]);

    const fetchSuggestedMovies = async () => {
        const data = await fetchMovies.suggestedMovies({ id: movies.movie.id });
        setSuggestedMovies(data);
    }

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSuggestedMovies();
    }, []);

    return (
        <>
            {/* Navigation Bar - Redesigned */}
            <nav className="sticky top-0 z-50 bg-[#0A0C10]/95 backdrop-blur-md border-b border-[#2A2F36] px-4 py-4">
                <div className="container mx-auto flex items-center justify-between">
                    <p className="text-2xl sm:text-3xl font-bold text-red-600 tracking-tight">
                        MovieFlex
                    </p>
                    <div className="flex items-center gap-6">
                        <button
                            className="text-white font-semibold hover:text-red-500 transition-colors duration-200"
                            onClick={() => {
                                navigate("/", { replace: true });
                            }}
                        >
                            ← Home
                        </button>
                    </div>
                </div>
            </nav>

            <main className="bg-gradient-to-b from-[#0A0C10] to-[#14181F] min-h-screen">
                {/* Main Content - Responsive Grid */}
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        
                        {/* Video Player Section */}
                        <div className="flex-1">
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
                        </div>

                        {/* Movie Info Card */}
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
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {movies.movie.overview}
                                    </p>
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
    )
}

export default Player;