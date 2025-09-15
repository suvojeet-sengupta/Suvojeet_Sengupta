import React, { useState } from 'react';
import videos from '../data/videos.json';

const Music = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;

  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = videos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(videos.length / videosPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-dark text-white pt-20">
      <header className="py-20 text-center">
        <h1 className="text-5xl font-bold font-montserrat text-white">My Music</h1>
        <p className="mt-4 text-lg text-grey px-4">Explore the melodies and stories behind the songs.</p>
      </header>

      <main className="w-full max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentVideos.map((video) => (
            <div key={video.id} className="bg-dark-2 rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-primary/10">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2 font-montserrat">{video.title}</h3>
                <p className="text-grey text-sm">{video.description}</p>
                <p className="text-xs text-gray-400 mt-2">Published on: {new Date(video.publishedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center mt-12 space-x-4">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-6 py-3 font-bold rounded-lg transition-all duration-300 bg-primary text-dark hover:bg-primary-dark shadow-primary transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
          >
            Previous
          </button>
          <div className="text-lg font-semibold text-grey">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-6 py-3 font-bold rounded-lg transition-all duration-300 bg-primary text-dark hover:bg-primary-dark shadow-primary transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default Music;