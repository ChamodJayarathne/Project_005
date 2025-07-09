import React from 'react';
import { Link } from 'react-router-dom';
import AboutSection from './UserDashboard/AboutSection';
import TestimonialSection from './UserDashboard/TestimonialSection';
import Hero1 from "../assets/img/hero.jpg";
import backgroundImage from "../assets/img/bg_img.jpg";

export default function GuestHome() {
  return (
  <>
  <div
        className="min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="min-h-screen  bg-opacity-50">
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left side content */}
        <div className="md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-8">
          <h2 className="text-blue-600 font-medium text-2xl mb-2">
            Become a Sharper
          </h2>
          <h1 className="text-gray-900 font-bold text-4xl mb-4">Investor</h1>
          <p className="text-gray-700 mb-10 max-w-md">
          Discover investing with Us to trusted Stock market App
          </p>

        </div>

        {/* Right side image */}
        <div className="md:w-1/2">
          <div className="rounded-3xl overflow-hidden shadow-lg">
            <img
              src={Hero1}
              alt="Investment Growth Visualization"
              className="w-full h-auto"
       
            />
          </div>
        </div>
      </div>
    </div>
          <AboutSection />
          <TestimonialSection />
          </div>
          </div>
        </>
  );
}
