import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiPhone,
  FiUser,
  FiCpu,
  FiMonitor,
  FiSmartphone,
  FiHardDrive,
  FiPrinter,
  FiServer,
  FiWatch,
  FiTv,
  FiShield,
  FiSettings,
  FiTruck,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import "./LandingPage.css";

// Import existing assets from the project
import AboutSection from "../components/UserDashboard/AboutSection";
import ContactCard from "../components/UserDashboard/ContactCard";
import TestimonialSection from "../components/UserDashboard/TestimonialSection";
import logoImg from "../assets/img/Logo.jpeg";
import heroImg from "../assets/img/h1.jpg"; // Using existing hero as fallback
import itemImg from "../assets/img/h2.jpg";
import msi_M from "../assets/img/2024 MSI Vector.jpg";
import msi_katana from "../assets/img/MSI Katana 15_6_ Gaming Laptop.jpg";
import Lenovo_l from "../assets/img/Lenovo Loq 15.jpg";
import ASUS_ROG from "../assets/img/Gaming laptops.jpg";
import Acer_Predator from "../assets/img/ACER Predator Helios Neo 16.jpg";
import backgroundImage from "../assets/img/h3.jpg";
import Hero1 from "../assets/img/hero.jpg";

const LandingPage = () => {
  const heroImages = [heroImg, backgroundImage, itemImg];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { name: "PGA Systems", icon: <FiServer /> },
    { name: "Apple", icon: <FiSmartphone /> },
    { name: "All in One Systems", icon: <FiMonitor /> },
    { name: "Desktop Workstations", icon: <FiCpu /> },
    { name: "Television (TV)", icon: <FiTv /> },
    { name: "Console & Handheld", icon: <FiSettings /> },
    { name: "Graphics Tablets", icon: <FiMonitor /> },
    { name: "Laptop", icon: <FiSmartphone /> },
    { name: "Power Banks / Accessories", icon: <FiHardDrive /> },
    { name: "Processor", icon: <FiCpu /> },
    { name: "Motherboards", icon: <FiCpu /> },
    { name: "Memory (RAM)", icon: <FiHardDrive /> },
    { name: "Graphics Card", icon: <FiMonitor /> },
    { name: "Power Supply", icon: <FiCpu /> },
    { name: "Cooling & Lighting", icon: <FiSettings /> },
    { name: "Storage & NAS", icon: <FiHardDrive /> },
    { name: "Casings", icon: <FiMonitor /> },
    { name: "Monitors", icon: <FiMonitor /> },
    { name: "Projectors", icon: <FiTv /> },
  ];

  const featuredProducts = [
    {
      id: 1,
      title: "MSI Modern 15 H AI C1MG 14th Gen Ultra 7+ ARC Graphics",
      category: "- Laptop -",
      price: "295,000 LKR",
      oldPrice: "347,000",
      image: msi_M,
      tag: "15%"
    },
    {
      id: 2,
      title: "MSI Katana 15 B14VFK Intel i7 14650HX RTX 4060",
      category: "- Laptop -",
      price: "575,000 LKR",
      oldPrice: "638,000",
      image: msi_katana,
      tag: "10%"
    },
    {
      id: 3,
      title: "Lenovo LOQ 15IRX9 i5 13th GEN HX + RTX 4050 6GB",
      category: "- Laptop -",
      price: "332,000 LKR",
      oldPrice: "342,000",
      image: Lenovo_l,
      tag: "3%"
    },
    {
      id: 4,
      title: "ASUS ROG Strix G16 i7 13th Gen RTX 4060",
      category: "- Laptop -",
      price: "645,000 LKR",
      oldPrice: "733,000",
      image: ASUS_ROG,
      tag: "12%"
    },
    {
      id: 5,
      title: "Acer Predator Helios Neo 16 i7 13th Gen",
      category: "- Laptop -",
      price: "585,000 LKR",
      oldPrice: "610,000",

      image: Acer_Predator,
      tag: "4%"
    }
  ];

  const [currentFeatured, setCurrentFeatured] = useState(0);

  const nextFeatured = () => {
    setCurrentFeatured((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevFeatured = () => {
    setCurrentFeatured((prev) => (prev === 0 ? featuredProducts.length - 1 : prev - 1));
  };

  const getDisplayedFeaturedProducts = () => {
    const visibleCount = Math.min(3, featuredProducts.length);
    const displayed = [];
    for (let i = 0; i < visibleCount; i++) {
      displayed.push(featuredProducts[(currentFeatured + i) % featuredProducts.length]);
    }
    return displayed;
  };

  return (
    <div className="landing-page-container">
      {/* Header */}
      {/* <header className="lp-header">
        <div className="lp-logo-group">
          <img src={logoImg} alt="Logo" style={{ height: '40px' }} />
          <div className="lp-nav-links">
            <Link to="/about">About</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        
        <div className="lp-header-tools">
          <Link to="/login" className="lp-login-link">Login</Link>
          <div className="lp-phone">
            <FiPhone />
            <span>0777 292 272</span>
          </div>
          <div className="lp-user-cart">
             <FiShoppingCart />
            <span>OLKR</span>
          </div>
          <div className="lp-search-btn">
            <FiSearch color="black" />
          </div>
        </div>
      </header> */}

      <div className="lp-main-layout">
        {/* Sidebar */}
        <aside className="lp-sidebar">
          {categories.map((cat, index) => (
            <div key={index} className="lp-sidebar-item">
              <span className="lp-sidebar-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="lp-content">
          {/* Hero */}
          <section className="lp-hero" style={{ position: 'relative' }}>
            <div className="lp-hero-graphic" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <FiChevronLeft
                size={40}
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  left: '10px',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '50%',
                  padding: '5px',
                  zIndex: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
              <img
                src={heroImages[currentSlide]}
                alt={`Hero Banner ${currentSlide + 1}`}
                style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px', transition: 'all 0.3s ease' }}
              />
              <FiChevronRight
                size={40}
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  right: '10px',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '50%',
                  padding: '5px',
                  zIndex: 2,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              />
            </div>
            <div className="lp-hero-dots">
              {heroImages.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`lp-dot ${i === currentSlide ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                ></div>
              ))}
            </div>
          </section>

          {/* Special Offers Section */}
          <section className="lp-offers">
            <div className="lp-section-header">
              <span className="lp-tag" style={{ backgroundColor: '#ff9800' }}>SPECIAL OFFERS %</span>
              <span style={{ color: '#909095' }}>★</span>
              <span>FEATURED</span>
            </div>

            <div className="lp-product-grid">
              <FiChevronLeft size={40} className="lp-nav-arrow" onClick={prevFeatured} style={{ alignSelf: 'center', cursor: 'pointer' }} />
              {getDisplayedFeaturedProducts().map((product) => (
                <div key={product.id} className="lp-product-card">
                  <div className="lp-card-tag">{product.tag}</div>
                  <img src={product.image} alt={product.title} className="lp-card-image" />
                  <div className="lp-card-info">
                    <div className="lp-card-title">{product.title}</div>
                    <div className="lp-card-category">{product.category}</div>
                    <div className="lp-card-price">
                      {product.oldPrice && <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', marginRight: '10px', opacity: 0.5 }}>{product.oldPrice}</span>}
                      {product.price}
                    </div>
                    <div className="lp-stock-status">In Stock</div>
                  </div>
                </div>
              ))}
              <FiChevronRight size={40} className="lp-nav-arrow" onClick={nextFeatured} style={{ alignSelf: 'center', cursor: 'pointer' }} />
            </div>

            <div className="lp-hero-dots" style={{ justifyContent: 'center', marginTop: '2rem' }}>
              {featuredProducts.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentFeatured(i)}
                  className={`lp-dot ${i === currentFeatured ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                ></div>
              ))}
            </div>
          </section>

          <section className="lp-offers mt-10">
            {/* <div className="lp-section-header">
              <span className="lp-tag" style={{ backgroundColor: '#ff9800' }}>SPECIAL OFFERS %</span>
              <span style={{ color: '#909095' }}>★</span>
              <span>FEATURED</span>
            </div> */}

            <div className="lp-product-grid">
              <FiChevronLeft size={40} className="lp-nav-arrow" onClick={prevFeatured} style={{ alignSelf: 'center', cursor: 'pointer' }} />
              {getDisplayedFeaturedProducts().map((product) => (
                <div key={product.id} className="lp-product-card">
                  <div className="lp-card-tag">{product.tag}</div>
                  <img src={product.image} alt={product.title} className="lp-card-image" />
                  <div className="lp-card-info">
                    <div className="lp-card-title">{product.title}</div>
                    <div className="lp-card-category">{product.category}</div>
                    <div className="lp-card-price">
                      {product.oldPrice && <span style={{ textDecoration: 'line-through', fontSize: '0.8rem', marginRight: '10px', opacity: 0.5 }}>{product.oldPrice}</span>}
                      {product.price}
                    </div>
                    <div className="lp-stock-status">In Stock</div>
                  </div>
                </div>
              ))}
              <FiChevronRight size={40} className="lp-nav-arrow" onClick={nextFeatured} style={{ alignSelf: 'center', cursor: 'pointer' }} />
            </div>

            <div className="lp-hero-dots" style={{ justifyContent: 'center', marginTop: '2rem' }}>
              {featuredProducts.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentFeatured(i)}
                  className={`lp-dot ${i === currentFeatured ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                ></div>
              ))}
            </div>
          </section>

          {/* Awards Section */}
          {/* <section className="lp-awards">
            <div className="lp-awards-grid">
              <FiChevronLeft size={40} style={{ alignSelf: 'center', cursor: 'pointer', opacity: 0.5 }} />
              {[
                "Master of Performance ANTEC Award 2025",
                "ACER Elite Top 10 Performer Award 2025",
                "Acer Authorized Retailer 2025/26",
                "Asus Highest Sales Achiever PC & Gaming Award 2025"
              ].map((award, i) => (
                <div key={i} className="lp-award-item">
                  <img src={itemImg} alt="Award" className="lp-award-image" style={{ filter: 'grayscale(100%) brightness(1.2)' }} />
                  <div className="lp-award-title">{award}</div>
                </div>
              ))}
              <FiChevronRight size={40} style={{ alignSelf: 'center', cursor: 'pointer', opacity: 0.5 }} />
            </div>
            <div className="lp-hero-dots" style={{ justifyContent: 'center', marginBottom: '4rem' }}>
              {[...Array(30)].map((_, i) => (
                <div key={i} className={`lp-dot ${i === 2 ? 'active' : ''}`}></div>
              ))}
            </div>
          </section> */}




          <div
            className="min-h-screen bg-cover bg-center bg-fixed"
          // style={{
          //   backgroundImage: `url(${backgroundImage})`,
          //   backgroundSize: "cover",
          //   backgroundPosition: "center",
          //   backgroundRepeat: "no-repeat",
          //   backgroundAttachment: "fixed",
          // }}
          >
            <div className="min-h-screen  bg-opacity-50">
              <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">

                  <div className="md:w-full mb-8 md:mb-0 p-0 md:p-8">
                    <h2 className="text-blue-600 font-medium text-4xl mb-2">
                      Become a Sharper
                    </h2>
                    <h1 className="text-white font-bold text-6xl mb-4">
                      Customer
                    </h1>
                    <p className="text-white mb-10 text-lg max-w-full">
                      Discover investing with Us to trusted electronic wholesale
                      market App
                    </p>
                  </div>


                  {/* <div className="md:w-1/2">
                    <div className="rounded-3xl overflow-hidden shadow-lg">
                      <img
                        src={Hero1}
                        alt="Investment Growth Visualization"
                        className="w-full h-auto"
                      />
                    </div>
                  </div> */}
                </div>
              </div>
              <AboutSection />
              <ContactCard />
              <TestimonialSection />
            </div>
          </div>

          {/* Service Banner */}
          <section className="lp-service-banner">
            <div className="lp-service-item">
              <FiShield className="lp-service-icon" />
              <div className="lp-service-title">WARRANTY ASSURED</div>
              <div className="lp-service-desc">In case of faulty products, we have an upstanding warranty and claim procedures to make sure that your requirements are met in minimum time loss as possible.</div>
              <div className="lp-conditions">*Conditions Applied</div>
            </div>
            <div className="lp-service-item">
              <FiSettings className="lp-service-icon" />
              <div className="lp-service-title">CUSTOM ORDERS</div>
              <div className="lp-service-desc">In case your requirements surpass what the local market has to offer, we will provide you with assistance to meet those requirements.</div>
              <div className="lp-conditions">*Conditions Applied</div>
            </div>
            <div className="lp-service-item">
              <FiTruck className="lp-service-icon" />
              <div className="lp-service-title">HOME DELIVERY</div>
              <div className="lp-service-desc">To further facilitate your access to your needs, we offer to deliver your requirements straight to where you live within Sri Lankan borders.</div>
              <div className="lp-conditions">*Conditions Applied</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
