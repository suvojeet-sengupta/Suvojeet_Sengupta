import React from 'react';
import { motion } from 'framer-motion';
import {
  CloudIcon,
  NotePencilIcon,
  BriefcaseIcon,
  GlobeHemisphereWestIcon,
  DeviceMobileCameraIcon,
} from '@heroicons/react/24/solid';

const iconMap = {
  cloud: CloudIcon,
  note: NotePencilIcon,
  briefcase: BriefcaseIcon,
  globe: GlobeHemisphereWestIcon,
  android: DeviceMobileCameraIcon,
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

/**
 * A card component to display a single project.
 * @param {object} project - The project object.
 */
const ProjectCard = ({ project }) => {
  const IconComponent = iconMap[project.icon] || GlobeHemisphereWestIcon;

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-dark-2 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-primary transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
      variants={cardVariants}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <IconComponent className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-sm text-gray-400 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1 rounded-full bg-gray-700 text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default ProjectCard;
