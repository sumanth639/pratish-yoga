import React, { useState } from "react";
import { FaYoutube, FaPlay } from "react-icons/fa";
import logo from "../assets/images/logo-new.png"; 

// If you want to keep particles, uncomment these lines:
// import { FloatingParticles } from './ui/FloatingParticles'; 
// import './ui/FloatingParticles.css';

const YouTubeSection = () => {
  // Data Configuration
  const channelInfo = {
    name: "YOGA WITH PRATISH",
    handle: "@yogawithpratish2509",
    stats: "40 subscribers • 13 videos",
    description:
      "I have created this channel to upload videos about yoga and its benefits. Join me for authentic yoga practices and wellness guidance.",
    channelUrl: "https://www.youtube.com/channel/UCBBxIfTOUMkUDL-vm4kdJhA",
    website: "yogawithpratish.com",
    avatar: logo, // Using the imported logo here
  };

  const youtubeVideos = [
    {
      id: "1",
      title: "Yoga for all kinds of health issues",
      thumbnail: "https://img.youtube.com/vi/W8LMHFerAC4/maxresdefault.jpg",
      duration: "0:41",
      views: "152 views",
      uploadTime: "2 years ago",
      videoId: "W8LMHFerAC4",
    },
    {
      id: "3",
      title: "What is Yoga? | Meaning and Origin | Traditional Yoga",
      thumbnail: "https://img.youtube.com/vi/dT63aLZygW4/maxresdefault.jpg",
      duration: "3:22",
      views: "169 views",
      uploadTime: "3 years ago",
      videoId: "dT63aLZygW4",
    },
    {
      id: "4",
      title: "Anulom Vilom | You may be doing it wrong! | Yogic Breathing",
      thumbnail: "https://img.youtube.com/vi/Z3MD0HvcR3M/maxresdefault.jpg",
      duration: "6:32",
      views: "117 views",
      uploadTime: "3 years ago",
      videoId: "Z3MD0HvcR3M",
    },
    {
      id: "5",
      title: "How a yoga session must be practiced | Correct way to practice yoga",
      thumbnail: "https://img.youtube.com/vi/vzvVX-8Dnfk/maxresdefault.jpg",
      duration: "46:27",
      views: "85 views",
      uploadTime: "3 years ago",
      videoId: "vzvVX-8Dnfk",
    },
    {
      id: "6",
      title: "Yoga With Pratish | Join Yoga Classes Online | Learn Traditional Art of Yoga",
      thumbnail: "https://img.youtube.com/vi/0p3VLYhW7Wk/maxresdefault.jpg",
      duration: "3:22",
      views: "206 views",
      uploadTime: "3 years ago",
      videoId: "0p3VLYhW7Wk",
    },
  ];

  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div className="relative bg-[#FAFAFA] min-h-screen">
      
      <section className="py-16 px-4 md:px-8 relative z-10 max-w-7xl mx-auto font-sans">
        
        {/* 1. HEADER SECTION */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-2">
            YouTube <span className="text-red-600">Videos</span>
          </h2>
          {/* Red Underline */}
          <div className="w-16 h-1 bg-red-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">
            Visit our YouTube channel for yoga tutorials and wellness content
          </p>
        </div>

        {/* 2. CHANNEL CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-3xl mx-auto mb-16 text-center">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border border-gray-100 shadow-sm relative">
             <img 
               src={channelInfo.avatar} 
               alt="Channel Logo" 
               className="w-full h-full object-cover"
             />
          </div>

          {/* Channel Details */}
          <h3 className="text-2xl font-serif text-gray-800 mb-1 tracking-wide">
            {channelInfo.name}
          </h3>
          <div className="text-gray-500 text-sm mb-4">
            <span className="font-medium text-gray-700">{channelInfo.handle}</span>
            <span className="mx-2">•</span>
            <span>{channelInfo.stats}</span>
          </div>

          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto mb-6 leading-relaxed">
            {channelInfo.description}
          </p>

          {/* Links */}
          <div className="flex justify-center gap-4 text-sm mb-8">
             <a href={`https://${channelInfo.website}`} className="text-red-600 hover:underline font-medium">
               {channelInfo.website}
             </a>
             <span className="text-gray-400">and 3 more links</span>
          </div>

          {/* Subscribe / Visit Button */}
          <a
            href={channelInfo.channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#CC0000] hover:bg-[#FF0000] text-white px-8 py-3 rounded-full font-medium transition-colors shadow-sm"
          >
            <FaYoutube className="text-xl" />
            Visit YouTube Channel
          </a>
        </div>


        {/* 3. VIDEO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          {youtubeVideos.map((video) => (
            <div
              key={video.id}
              className="group cursor-pointer flex flex-col gap-3"
              onClick={() => setSelectedVideo(video.videoId)}
            >
              {/* Thumbnail Container */}
              <div className="relative w-full aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to hqdefault if maxresdefault fails
                    const fallbackUrl = video.thumbnail.replace('maxresdefault.jpg', 'hqdefault.jpg');
                    if (e.target.src !== fallbackUrl) {
                      e.target.src = fallbackUrl;
                    } else {
                      // If hqdefault also fails, use a placeholder
                      e.target.src = 'https://via.placeholder.com/640x360?text=Video+Thumbnail';
                    }
                  }}
                />
                
                {/* Duration Badge */}
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded-[4px]">
                  {video.duration}
                </div>

                {/* Red Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-all duration-300">
                  <div className="w-12 h-12 bg-[#FF0000] rounded-full flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform shadow-lg">
                    <FaPlay className="text-white text-sm ml-1" />
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="flex flex-col px-1">
                <h4 className="text-gray-900 font-semibold text-lg leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                  {video.title}
                </h4>
                <div className="text-gray-600 text-sm mt-1">
                  <span>{video.views}</span>
                  <span className="mx-1">•</span>
                  <span>{video.uploadTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* 4. VIDEO MODAL */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-black/50 rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeSection;