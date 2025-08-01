/* eslint-disable no-unused-vars */

import React from "react";
import Hero from "../components/UserDashboard/Hero";
import AboutSection from "../components/UserDashboard/AboutSection";
import TestimonialSection from "../components/UserDashboard/TestimonialSection";
import backgroundImage from "../assets/img/bg_img.jpg";
import ContactCard from "../components/UserDashboard/ContactCard";

function UserDashboard({ onLogout }) {
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
        {/* Optional overlay to improve text readability over the background */}
        <div className="min-h-screen  bg-opacity-50">
          <Hero />
          <AboutSection />
          <ContactCard />
          <TestimonialSection />
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
