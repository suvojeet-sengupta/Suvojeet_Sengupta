import React from 'react';

interface GenerativePlaceholderProps {
  title: string;
}

/**
 * A component that generates a placeholder image with a gradient based on the title.
 */
const GenerativePlaceholder: React.FC<GenerativePlaceholderProps> = ({ title }) => {
  const generateGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = hash % 360;
    const s = 60 + (hash % 10);
    const l1 = 30 + (hash % 10);
    const l2 = 40 + (hash % 10);

    return `linear-gradient(135deg, hsl(${h}, ${s}%, ${l1}%), hsl(${h + 40}, ${s}%, ${l2}%))`;
  };

  const gradient = generateGradient(title);

  return (
    <div
      className="w-full h-56 flex items-center justify-center rounded-sm"
      style={{ background: gradient }}
    >
      <h3 className="text-white text-2xl font-black text-center p-4 uppercase tracking-tighter">{title}</h3>
    </div>
  );
};

export default GenerativePlaceholder;
