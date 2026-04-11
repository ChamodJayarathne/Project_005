import React from "react";
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
import logoImg from "../assets/img/Logo.jpeg";
import heroImg from "../assets/img/hero.jpg"; // Using existing hero as fallback
import itemImg from "../assets/img/Item.jpg";

const LandingPage = () => {
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
      image: itemImg,
      tag: "%"
    },
    {
      id: 2,
      title: "MSI Katana 15 B14VFK Intel i7 14650HX RTX 4060",
      category: "- Laptop -",
      price: "575,000 LKR",
      image: itemImg,
      tag: "%"
    },
    {
      id: 3,
      title: "Lenovo LOQ 15IRX9 i5 13th GEN HX + RTX 4050 6GB",
      category: "- Laptop -",
      price: "332,000 LKR",
      oldPrice: "342,000",
      image: itemImg,
      tag: "%"
    }
  ];

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
          <section className="lp-hero">
            <div className="lp-hero-graphic">
              {/* In a real scenario, we'd use the generated image here */}
              <img src={heroImg} alt="Hero Banner" style={{ width: '100%', borderRadius: '12px' }} />
            </div>
            <div className="lp-hero-dots">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`lp-dot ${i === 3 ? 'active' : ''}`}></div>
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
              <FiChevronLeft size={40} className="lp-nav-arrow" style={{ alignSelf: 'center', cursor: 'pointer', opacity: 0.5 }} />
              {featuredProducts.map((product) => (
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
              <FiChevronRight size={40} className="lp-nav-arrow" style={{ alignSelf: 'center', cursor: 'pointer', opacity: 0.5 }} />
            </div>

            <div className="lp-hero-dots" style={{ justifyContent: 'center', marginTop: '2rem' }}>
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`lp-dot ${i === 0 ? 'active' : ''}`}></div>
              ))}
            </div>
          </section>

          {/* Awards Section */}
          <section className="lp-awards">
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
          </section>

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
