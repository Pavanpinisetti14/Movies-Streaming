
import React, { useState } from "react";

function Header({query, setQuery, searchMovies, year, setYear}) {

    const [searchHide, setSearchHide] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const SerachBar = () => {
        setSearchHide(true);
        setMobileMenuOpen(false);
    }

    return(
        <>
            {/* Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-[#0A0C10]/95 backdrop-blur-md border-b border-[#2A2F36]">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    
                    <div className="flex items-center gap-2">
                        {/* SVG Icon */}
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
                        
                        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 tracking-tight">
                            MovieFlex
                        </p>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <button
                            className="text-white font-semibold hover:text-red-500 transition-colors duration-200"
                            onClick={() => {
                                setQuery("");
                                setSearchHide(false);
                            }}
                        >
                            Home
                        </button>

                        <button
                            className="text-white font-semibold hover:text-red-500 transition-colors duration-200"
                            onClick={() => SerachBar()}
                        >
                            Search
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-white focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#0A0C10] border-t border-[#2A2F36] py-4 px-4 flex flex-col gap-4">
                        <button
                            className="text-white font-semibold hover:text-red-500 transition-colors duration-200 text-left py-2"
                            onClick={() => {
                                setQuery("");
                                setSearchHide(false);
                                setMobileMenuOpen(false);
                            }}
                        >
                            Home
                        </button>
                        <button
                            className="text-white font-semibold hover:text-red-500 transition-colors duration-200 text-left py-2"
                            onClick={() => {
                                SerachBar();
                                setMobileMenuOpen(false);
                            }}
                        >
                            Search
                        </button>
                    </div>
                )}
            </nav>

            {/* Search Panel */}
            {searchHide && (
                <div className="bg-[#14181F] border-b border-[#2A2F36] py-6 px-4">
                    <div className="container mx-auto max-w-3xl">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Enter Exact Movie Name..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 px-5 py-3 bg-[#1E242C] border border-[#2A2F36] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Enter Movie Year (optional)"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="flex-1 px-5 py-3 bg-[#1E242C] border border-[#2A2F36] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                            />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={searchMovies}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                            >
                                 Search
                            </button>
                            <button
                                onClick={() => setSearchHide(false)}
                                className="flex-1 bg-[#2A2F36] hover:bg-[#3A3F4A] text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                            >
                                ✕ Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
export default Header;