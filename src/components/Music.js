import React from 'react';
import videos from '../data/videos.json';

const Music = () => {
  return (
    <div className="bg-dark text-white pt-20">
      {/* Page Header */}
      <header className="py-20 text-center">
        <h1 className="text-5xl font-bold font-montserrat">Music Collection</h1>
        <p className="mt-4 text-lg text-grey">Explore the melodies and stories behind the songs.</p>
      </header>

      <main className="w-full max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="bg-dark rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-primary/10">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-2 font-montserrat">{video.title}</h3>
                <p className="text-grey">{video.description}</p>
                <p className="text-xs text-gray-400 mt-2">Published on: {new Date(video.publishedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Music;