
import React, { useState, useEffect } from 'react';

const Music = () => {
  const [videos, setVideos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const videosPerPage = 9;

  useEffect(() => {
    fetch('/videos_data.json')
      .then(response => response.json())
      .then(data => setVideos(data))
      .catch(error => console.error('Error loading videos data:', error));
  }, []);

  const toggleExpanded = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const totalPages = Math.ceil(videos.length / videosPerPage);
  const currentVideos = videos.slice(currentPage * videosPerPage, (currentPage + 1) * videosPerPage);

  return (
    <div>
      <header className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-center py-12 relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative">
          <h1 className="text-5xl font-bold">Music Collection</h1>
          <p className="mt-4 text-lg">Explore the melodies and stories behind the songs.</p>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentVideos.map(video => (
            <div key={video.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${video.id}`} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2"><a href={video.url} target="_blank" rel="noopener noreferrer">{video.title}</a></h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Uploaded: {video.formatted_date}</p>
                <div className="mt-4 text-gray-700 dark:text-gray-300 text-sm">
                  <p className={`description ${expanded === video.id ? '' : 'line-clamp-3'}`} style={{ whiteSpace: 'pre-wrap' }}>{video.description}</p>
                  <button className="text-purple-600 dark:text-purple-400 hover:underline focus:outline-none view-more-btn" onClick={() => toggleExpanded(video.id)}>
                    {expanded === video.id ? 'View less' : 'View more'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
          <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages - 1} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center py-8 mt-16">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://www.instagram.com/suvojeet__sengupta?igsh=MWhyMXE4YzhxaDVvNg==" className="hover:text-purple-400 transition-colors duration-300"><i className="fab fa-instagram fa-2x"></i></a>
          <a href="https://youtube.com/@suvojeetsengupta?si=xmXfnPFgxoYOzuzq" className="hover:text-purple-400 transition-colors duration-300"><i className="fab fa-youtube fa-2x"></i></a>
          <a href="https://www.facebook.com/suvojeetsengupta21" className="hover:text-purple-400 transition-colors duration-300"><i className="fab fa-facebook fa-2x"></i></a>
        </div>
        <p>&copy; 2025 Suvojeet Sengupta. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Music;
