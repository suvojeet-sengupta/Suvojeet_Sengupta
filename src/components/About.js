import React from 'react';
import suvojeet from '../assets/suvojeet.jpg';

const About = () => {
  return (
    <div className="bg-dark text-white pt-20">
      {/* Page Header */}
      <header className="py-20 text-center">
        <h1 className="text-5xl font-bold font-montserrat">About Me</h1>
        <p className="mt-4 text-lg text-grey">The story behind the music.</p>
      </header>

      <main className="w-full max-w-7xl mx-auto p-8">
        {/* Introduction Section */}
        <div className="bg-dark rounded-lg shadow-xl p-8 md:p-12 mb-16 shadow-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            <div className="md:col-span-1">
              <img src={suvojeet} alt="Suvojeet Sengupta" className="rounded-lg shadow-lg w-full h-auto mx-auto" />
            </div>
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-primary mb-4 font-montserrat">About Me</h2>
              <p className="text-grey">
                Hi, I’m Suvojeet Sengupta – a passionate singer, performer, and music enthusiast from India. Music has been a part of my life since childhood, and I believe it’s the purest way to connect with people’s hearts. Whether it’s performing live, recording covers, or experimenting with new compositions, I always try to bring emotions alive through melodies.
              </p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* My Musical Journey */}
          <div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10">
            <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">My Musical Journey</h3>
            <ul className="space-y-4 text-grey">
              <li><strong>🎤 Inspiration:</strong> Inspired deeply by Arijit Singh, I admire his ability to blend soul with simplicity. While I look up to him, I’ve developed my own unique style that reflects my personality and emotions.</li>
              <li><strong>🌍 Languages:</strong> I enjoy singing in Hindi and Bengali, and. I often explore songs across genres to challenge myself as an artist.</li>
              <li><strong>📺 YouTube Journey:</strong> I also share my music through my YouTube channel – Suvojeet Sengupta, where I upload covers and performances to reach a wider audience.</li>
            </ul>
          </div>

          {/* Beyond Music */}
          <div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10">
            <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Beyond Music</h3>
            <p className="text-grey">
              Apart from music, I’m pursuing my Bachelor’s in History Honours with a Minor in Political Science. Balancing academics and passion hasn’t always been easy, but it has shaped me into someone disciplined and focused.
            </p>
          </div>
        </div>

        {/* Vision & Fun Facts Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Vision */}
          <div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10">
            <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Vision</h3>
            <p className="text-grey">
              For me, music is not just about singing—it’s about creating an emotional connection. My dream is to continue growing as an artist, perform on bigger stages, and create original music that inspires people the same way music inspires me.
            </p>
          </div>
          {/* Fun Facts */}
          <div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10">
            <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Fun Facts</h3>
            <ul className="space-y-2 text-grey list-disc list-inside">
              <li>First stage performance at a young age built my confidence.</li>
              <li>A history student who finds stories not only in books but also in songs.</li>
              <li>Coffee + Music = My perfect creative combo.</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;