// AboutSection.jsx
import React from "react";
import Director from "../../assets/img/Chinthaka.jpg";

const AboutSection = () => {
  return (
    <div className="w-full  py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-12">WHO WE ARE?</h1>

        <div className="space-y-6">
          {/* <h2 className="text-2xl font-semibold">About Us</h2> */}

          <p className="text-base sm:text-lg">
            Wonder Choice has been your trusted partner in the world of
            technology since 2019. We specialize in buying and selling computer
            parts, digital assets, and a wide range of electronic devices.
            Whether you're upgrading your system, trading in old tech, or
            searching for reliable digital solutions, Wonder Choice is your
            go-to destination.
          </p>

          <p className="text-base sm:text-lg">
            Built on a foundation of quality, transparency, and customer
            satisfaction, we connect tech enthusiasts, gamers, businesses, and
            everyday users with the products they need—at the right price.
          </p>

          <p className="text-base sm:text-lg">
            With years of industry experience and a growing network, Wonder
            Choice continues to evolve with the digital age, always putting
            value and trust at the center of every transaction.
          </p>

          <div className="py-2">
            <h2 className="text-2xl font-semibold mb-4">Vision</h2>
            <p className="text-base sm:text-lg">
              To become the most trusted and innovative global hub for wholesale
              technology and digital lifestyle products, empowering businesses
              with seamless access to quality, value, and digital excellence.
              Mission.
            </p>
          </div>

          <div className="py-2">
            <h2 className="text-2xl font-semibold mb-4">Mission</h2>
            <p className="text-base sm:text-lg">
              At Wonder Choice, our mission is to provide reliable, efficient,
              and affordable wholesale solutions for computer parts, gift items,
              digital goods, and digital assets. We strive to build lasting
              partnerships by delivering exceptional service, fostering
              innovation, and staying ahead of industry trends—enabling our
              clients to grow and thrive in a digitally-driven world.
            </p>
          </div>

          <div className="py-2">
            <h2 className="text-2xl font-semibold mb-4">
              Director’s Statement
            </h2>

            <div className=" p-5 rounded-lg text-center mb-5 flex flex-col items-center">
              {/* Profile Image Container */}
              <div className="mb-3">
                <img
                  src={Director}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-2 border-white shadow-md"
                />
              </div>
            </div>
            <p className="text-base sm:text-lg mb-4">
              Since its humble beginnings in 2019 as a small online retail shop,
              Wonder Choice has grown into a dynamic and forward-thinking
              wholesale platform. What started as a passion project to serve
              customers with quality products has evolved into a thriving
              business with over 10 million in assets and a rapidly expanding
              global footprint.
            </p>
            <p className="text-base sm:text-lg mb-4">
              Our journey has been built on trust, innovation, and a relentless
              focus on meeting the evolving needs of our clients. Over the
              years, we expanded our offerings beyond retail to wholesale, and
              today we proudly serve a diverse portfolio—ranging from computer
              parts and digital goods to gift items and digital assets.
            </p>
            <p className="text-base sm:text-lg mb-4">
              At Wonder Choice, we believe in the power of choice, efficiency,
              and technology to transform the wholesale experience. Every
              product we source, every partnership we build, and every
              innovation we implement is driven by our core mission: to deliver
              value and create a smarter, simpler way for businesses to thrive.
            </p>
            <p className="text-base sm:text-lg mb-4">
              Looking ahead, our vision is clear—we aim to become the world’s
              largest online wholesale platform. We are committed to continuous
              improvement, global outreach, and maintaining the highest
              standards of service and reliability.
            </p>
            <p className="text-base sm:text-lg mb-4">
              I am deeply grateful to our partners, suppliers, and loyal
              customers who have supported our journey. As we continue to grow,
              we remain grounded in our values and focused on delivering
              excellence at every step.
            </p>

            <h6>L.R.Chinthaka Wijesinghe<br/> Founder & Director, <br/>Wonder Choice</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
