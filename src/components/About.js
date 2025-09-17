import React, { useEffect } from 'react';
import suvojeet from '../assets/suvojeet.jpg';
import { motion } from 'framer-motion';

const About = () => {
  useEffect(() => {
    document.title = "About | Suvojeet Sengupta";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Learn more about Suvojeet Sengupta, a passionate singer and composer from India. Discover his musical journey, inspirations, and the story behind his music.";
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-dark text-white pt-20">
      {/* Page Header */}
      <motion.header
        className="py-20 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold font-montserrat">About Me</h1>
        <p className="mt-4 text-lg text-grey">The story behind the music.</p>
      </motion.header>

      <main className="w-full max-w-7xl mx-auto p-8">
        {/* Introduction Section */}
        <motion.div
          className="bg-dark rounded-lg shadow-xl p-8 md:p-12 mb-16 shadow-primary/10"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            <motion.div className="md:col-span-1" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <img src={suvojeet} alt="Suvojeet Sengupta" className="rounded-lg shadow-lg w-full h-auto mx-auto" />
            </motion.div>
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-primary mb-4 font-montserrat">About Me</h2>
              <p className="text-grey">
                Suvojeet Sengupta is a passionate singer, music lover, and dedicated performer with a unique ability to bring emotions alive through music. A student of History (BA Honours, Semester 3), he balances academics with his deep commitment to music, practicing daily and constantly refining his vocal style.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Details Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* My Musical Journey */}
          <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
            <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">My Musical Journey</h3>
            <ul className="space-y-4 text-grey">
              <li><strong>🎤 Regular practice and continuous vocal training</strong></li>
              <li><strong>🎶 Genres:</strong> Romantic ballads, soulful covers, and contemporary Hindi & Bengali tracks</li>
              <li><strong>🎸 Performances:</strong> Small shows, studio recordings, and online showcases</li>
              <li><strong>⭐ Influences:</strong> Arijit Singh, with a focus on developing a personalized style</li>
            </ul>
          </motion.div>

          {/* Beyond Music */}
          <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
            <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Beyond Music</h3>
            <p className="text-grey">
              Alongside his singing career, Suvojeet works part-time as a Customer Care Executive at DishTV, managing his professional responsibilities while keeping his passion for music at the forefront.
            </p>
          </motion.div>
        </motion.div>

        {/* Vision & Fun Facts Section */}
        <motion.div
          className="grid md:grid-cols-2 gap-12 mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Vision */}
          <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
            <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Vision</h3>
            <p className="text-grey">
              For me, music is not just about singing—it’s about creating an emotional connection. My dream is to continue growing as an artist, perform on bigger stages, and create original music that inspires people the same way music inspires me.
            </p>
          </motion.div>
          {/* Quick Facts */}
          <motion.div className="bg-dark rounded-lg shadow-xl p-8 shadow-primary/10" variants={cardVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }}>
            <h3 className="text-2xl font-bold text-primary mb-4 font-montserrat">Quick Facts</h3>
            <ul className="space-y-2 text-grey list-disc list-inside">
              <li><strong>Name:</strong> Suvojeet Sengupta</li>
              <li><strong>Profession:</strong> Singer | Student | Content Creator</li>
              <li><strong>Languages:</strong> Hindi & Bengali</li>
              <li><strong>Inspiration:</strong> Arijit Singh</li>
              <li><strong>Platform:</strong> YouTube channel “Suvojeet Sengupta”</li>
              <li><strong>Personality:</strong> Tech-savvy, disciplined, and music-focused</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          className="bg-dark rounded-lg shadow-xl p-8 md:p-12 mt-16 shadow-primary/10 text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-primary mb-4 font-montserrat">Get in Touch</h2>
          <p className="text-grey mb-8">
            Follow Suvojeet’s journey on YouTube to explore his latest covers and performances. For bookings, collaborations, or special song requests, he is available through professional contact and social media channels.
          </p>
          <a href="https://youtube.com/@suvojeetsengupta?si=Fsp9wzuki9PzwXk4" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 font-bold text-dark bg-primary rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 shadow-primary">
            Visit YouTube Channel
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default About;