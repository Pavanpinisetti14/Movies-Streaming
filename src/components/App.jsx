// import React, { useEffect, useState } from "react";
// import Data from "./Data.jsx";
// import Header from "./Header.jsx";
// import { fetchMovies } from "../api";

// function App() {

//     const [query, setQuery] = useState("");
//     const [year, setYear] = useState("");
//     const [movies, setMovies] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [latestMovies, setLatestMovies] = useState([]);

//     const searchMovies = async () => {

//         if (!query.trim()) {
//             return;
//         }

//         try {

//             setLoading(true);

//             const result =
//             await fetchMovies.byQuery({ query });
//             // setCurrentPage(1);
//             setMovies(result);

//         } catch (error) {

//             console.log("Error :", error);

//         } finally {

//             setLoading(false);
//         }
//     };

//     const fetchLatestMovies = async () => {

//         try {

//             const latest =
//             await fetchMovies.latestMovies();

//             setLatestMovies(latest);

//         } catch (error) {

//             console.log(error);
//         }
//     };

//     useEffect(() => {

//         fetchLatestMovies();

//     }, []);

//     return (

//         <div className="min-h-screen bg-black text-white">

//             <Header
//                 query={query}
//                 setQuery={setQuery}
//                 searchMovies={searchMovies}
//                 year={year}
//                 setYear={setYear}
//             />

//             {
//                 loading && (
//                     <h2 className="text-center text-2xl">
//                         Loading...
//                     </h2>
//                 )
//             }

//             <Data
//                 movies={
//                     query.trim()
//                     ? movies
//                     : latestMovies
//                 }
//                 loading={loading}
//                 displayQuery={query.trim()? `Search Results for "${query}"` : null}
//             />

//         </div>
//     );
// }

// export default App;



import React, { useEffect, useState } from "react";
import Data from "./Data.jsx";
import Header from "./Header.jsx";
import { fetchMovies } from "../api";
import Loading from "./Loading.jsx";

function App() {

    const [query, setQuery] = useState("");
    const [year, setYear] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [latestMovies, setLatestMovies] = useState([]);

    const searchMovies = async () => {

        if (!query.trim()) {
            return;
        }

        try {

            setLoading(true);

            const result =
            await fetchMovies.byQuery({ query });
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

        <div className="min-h-screen bg-gradient-to-b from-[#0A0C10] to-[#14181F] text-white">

            <Header
                query={query}
                setQuery={setQuery}
                searchMovies={searchMovies}
                year={year}
                setYear={setYear}
            />

            {
                loading && (
                    <Loading/>
                )
            }

            <Data
                movies={
                    query.trim()
                    ? movies
                    : latestMovies
                }
                loading={loading}
                displayQuery={query.trim()? `Search Results for "${query}"` : null}
            />

        </div>
    );
}

export default App;