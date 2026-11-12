"use client"
import React from 'react';
import YouTube from 'react-youtube';

const YouTubeVideo = ({ videoId }:{videoId:string}) => {
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
    },
  };

  return (
    <div className="relative pb-[56.25%] h-0 w-full overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <YouTube
          videoId={videoId}
          opts={opts}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default YouTubeVideo;