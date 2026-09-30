import React from 'react';

const LINKS = [
  { name: 'GitHub', href: 'https://github.com/suvojeet-sengupta' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/suvojeet-sengupta' },
  { name: 'YouTube', href: 'https://youtube.com/@suvojeetsengupta' },
  { name: 'Instagram', href: 'https://instagram.com/suvojeet__sengupta' },
];

interface SocialLinksProps {
  className?: string;
}

const SocialLinks: React.FC<SocialLinksProps> = ({ className = '' }) => (
  <ul className={`flex flex-wrap gap-x-6 gap-y-3 text-[15px] ${className}`}>
    {LINKS.map((link) => (
      <li key={link.name}>
        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-link">
          {link.name} <span aria-hidden="true">↗</span>
        </a>
      </li>
    ))}
  </ul>
);

export default SocialLinks;
