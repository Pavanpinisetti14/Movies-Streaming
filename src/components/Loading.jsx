import React from "react";

function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0A0C10] to-[#14181F]">
      
      {/* Film Strip Animation */}
      <div className="relative mb-8">
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-8 bg-red-600 rounded-sm animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "1s" }}
            ></div>
          ))}
        </div>
        {/* Sprocket holes effect */}
        <div className="absolute -top-2 left-0 right-0 flex justify-between px-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
          ))}
        </div>
        <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
          ))}
        </div>
      </div>

      {/* Rotating Clapperboard */}
      <div className="relative w-20 h-20 mb-6 animate-spin-slow">
        <div className="absolute inset-0 bg-red-600 rounded-lg shadow-lg"></div>
        <div className="absolute inset-2 bg-white rounded-md"></div>
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-600 transform -translate-y-1/2"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-red-600 transform -translate-x-1/2"></div>
      </div>

      {/* Loading Text with Movie Quotes Style */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white tracking-wider animate-pulse">
          🎥 Loading Movies...
        </h2>
        <p className="text-gray-400 text-sm mt-2 animate-pulse">
          Getting the latest blockbusters
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-6">
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
      </div>
    </div>
  );
}

export default Loading;