import React from 'react';

const videos = [
  { id: 't7zF5Ye0JwE', title: 'Heeriye (Cover)', description: 'A soulful rendition of the popular track.' },
  { id: 'Uuv-GwwNhGY', title: 'Tum Hi Ho (Acoustic)', description: 'An acoustic cover of the classic love anthem.' },
  { id: 'qFovu9M41UE', title: 'Channa Mereya (Unplugged)', description: 'A heartfelt unplugged version.' },
  { id: 'Ka-jwAbw1E4', title: 'Bekhayali (Cover)', description: 'A powerful cover of the rock ballad.' },
  { id: 'iXIu2_dF42w', title: 'Shayad (Cover)', description: 'A melodious take on the romantic song.' },
  { id: 'bzstfhq1a4M', title: 'Kalank (Title Track)', description: 'A soulful cover of the title track from Kalank.' },
];

const Music = () => {
  return (
    <div className="dark:bg-dark bg-light text-white pt-20">
      {/* Page Header */}
      <header className="py-20 text-center">
        <h1 className="text-5xl font-bold font-montserrat">Music Collection</h1>
        <p className="mt-4 text-lg text-grey">Explore the melodies and stories behind the songs.</p>
      </header>

      <main className="w-full max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="bg-dark rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
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
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Music;