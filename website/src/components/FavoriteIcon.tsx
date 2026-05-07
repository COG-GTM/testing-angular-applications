import { useState } from 'react';

interface FavoriteIconProps {
  isFavorite: boolean;
  color?: string;
  onClick?: () => void;
}

export function FavoriteIcon({ isFavorite, color = 'gold', onClick }: FavoriteIconProps) {
  const [hovered, setHovered] = useState(false);

  const getClassName = () => {
    if (isFavorite) return 'fa fa-star fa-lg';
    if (hovered) return 'fa fa-star-o fa-lg';
    return 'fa fa-star fa-lg';
  };

  const getColor = () => {
    if (isFavorite) return color;
    if (hovered) return 'black';
    return 'white';
  };

  return (
    <i
      className={getClassName()}
      style={{ color: getColor(), cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    />
  );
}
