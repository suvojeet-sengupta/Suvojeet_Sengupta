import React from 'react';

const GenerativePlaceholder = ({ title }) => {
  const generateGradient = (str) => {
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
      className="w-full h-56 flex items-center justify-center"
      style={{ background: gradient }}
    >
      <h3 className="text-white text-2xl font-bold text-center p-4">{title}</h3>
    </div>
  );
};

export default GenerativePlaceholder;
