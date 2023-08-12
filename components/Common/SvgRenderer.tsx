'use client'; //try a different approach later for server side rendering
import React, { useEffect, useState } from 'react';

const SvgRenderer = ({ url }) => {
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        const response = await fetch(url);
        const svgText = await response.text();
        setSvgContent(svgText);
      } catch (error) {
        console.error('Error fetching SVG:', error);
      }
    };

    fetchSvg();
  }, [url]);

  return (
    <div
      className="[&>*]:text-primary fill-current"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default SvgRenderer;
