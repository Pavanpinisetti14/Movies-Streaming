import React, { useState } from "react";
import {Routes,Route} from "react-router-dom";
import Home from "./components/App"
import Player from "./components/Player.jsx"
import TVShowPlayer from "./components/TvShowPlayer.jsx";
function App() {

  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  return(
 
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/player" element={<Player query={query} setQuery={setQuery} year={year} setYear={setYear}/>} />
      <Route path="/TvShowPayer" element={<TVShowPlayer/>} />
    </Routes>  

  )
  
}

export default App;