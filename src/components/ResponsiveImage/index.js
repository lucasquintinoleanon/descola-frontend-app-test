import React from 'react';

// RESPONSIVE IMAGES RESOLUTION
const MOBILE_WIDTH = 280;
const MOBILE_HEIGHT = 160;

const ResponsiveImage = ({ img, alt, loading }) => {
  const src = `${img}?w=${MOBILE_WIDTH}&h=${MOBILE_HEIGHT}`;
  const src2x = `${img}?w=${MOBILE_WIDTH * 2}&h=${MOBILE_HEIGHT * 2}`;
  return (
    <picture>
      <source srcSet={`${src}, ${src2x} 2x`} media="(min-width: 768px)" />
      <img srcSet={`${src}, ${src2x} 2x`} alt={alt} loading={loading} width={280} height={160} />
    </picture>
  );
};

export default ResponsiveImage;
