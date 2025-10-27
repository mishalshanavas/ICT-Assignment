import React, { useState } from 'react';

const ImageWithFallback = ({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23FC8019'/%3E%3Ctext x='50%25' y='50%25' font-family='Inter, Arial, sans-serif' font-size='48' fill='white' text-anchor='middle' dy='.3em'%3E🍽️%3C/text%3E%3C/svg%3E",
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If no src provided, use fallback immediately
  if (!src || src === '' || src === '#') {
    return (
      <img
        src={fallbackSrc}
        alt={alt || 'Food item'}
        className={className}
        {...props}
      />
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt || 'Food item'}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      data-loading={isLoading}
      {...props}
    />
  );
};

export default ImageWithFallback;