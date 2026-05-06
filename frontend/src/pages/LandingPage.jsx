import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiCpu,
  FiMonitor,
  FiSmartphone,
  FiHardDrive,
  FiServer,
  FiTv,
  FiShield,
  FiSettings,
  FiTruck,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX,
  FiGrid
} from "react-icons/fi";
import "./LandingPage.css";

import AboutSection from "../components/UserDashboard/AboutSection";
import ContactCard from "../components/UserDashboard/ContactCard";
import TestimonialSection from "../components/UserDashboard/TestimonialSection";
import heroImg from "../assets/img/h1.jpg";
import itemImg from "../assets/img/h2.jpg";
import msi_M from "../assets/img/2024 MSI Vector.jpg";
import msi_katana from "../assets/img/MSI Katana 15_6_ Gaming Laptop.jpg";
import Lenovo_l from "../assets/img/Lenovo Loq 15.jpg";
import ASUS_ROG from "../assets/img/Gaming laptops.jpg";
import Acer_Predator from "../assets/img/ACER Predator Helios Neo 16.jpg";
import backgroundImage from "../assets/img/h3.jpg";

const LandingPage = () => {
  /* ── Hero carousel state ── */
  const heroImages = [heroImg, backgroundImage, itemImg];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((p) => (p === 0 ? heroImages.length - 1 : p - 1));

  useEffect(() => {
    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, []);

  /* ── Mobile category drawer ── */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (drawerOpen && drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [drawerOpen]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  /* ── Categories ── */
  const categories = [
    { name: "PGA Systems",            icon: <FiServer /> },
    { name: "Apple",                  icon: <FiSmartphone /> },
    { name: "All in One Systems",     icon: <FiMonitor /> },
    { name: "Desktop Workstations",   icon: <FiCpu /> },
    { name: "Television (TV)",        icon: <FiTv /> },
    { name: "Console & Handheld",     icon: <FiSettings /> },
    { name: "Graphics Tablets",       icon: <FiMonitor /> },
    { name: "Laptop",                 icon: <FiSmartphone /> },
    { name: "Power Banks/Accessories",icon: <FiHardDrive /> },
    { name: "Processor",              icon: <FiCpu /> },
    { name: "Motherboards",           icon: <FiCpu /> },
    { name: "Memory (RAM)",           icon: <FiHardDrive /> },
    { name: "Graphics Card",          icon: <FiMonitor /> },
    { name: "Power Supply",           icon: <FiCpu /> },
    { name: "Cooling & Lighting",     icon: <FiSettings /> },
    { name: "Storage & NAS",          icon: <FiHardDrive /> },
    { name: "Casings",                icon: <FiMonitor /> },
    { name: "Monitors",               icon: <FiMonitor /> },
    { name: "Projectors",             icon: <FiTv /> },
  ];

  /* ── Featured products ── */
  const featuredProducts = [
    { id: 1, title: "MSI Modern 15 H AI C1MG 14th Gen Ultra 7+ ARC Graphics", category: "- Laptop -", price: "295,000 LKR", oldPrice: "347,000", image: msi_M,       tag: "15%" },
    { id: 2, title: "MSI Katana 15 B14VFK Intel i7 14650HX RTX 4060",         category: "- Laptop -", price: "575,000 LKR", oldPrice: "638,000", image: msi_katana,   tag: "10%" },
    { id: 3, title: "Lenovo LOQ 15IRX9 i5 13th GEN HX + RTX 4050 6GB",        category: "- Laptop -", price: "332,000 LKR", oldPrice: "342,000", image: Lenovo_l,     tag: "3%"  },
    { id: 4, title: "ASUS ROG Strix G16 i7 13th Gen RTX 4060",                category: "- Laptop -", price: "645,000 LKR", oldPrice: "733,000", image: ASUS_ROG,     tag: "12%" },
    { id: 5, title: "Acer Predator Helios Neo 16 i7 13th Gen",                category: "- Laptop -", price: "585,000 LKR", oldPrice: "610,000", image: Acer_Predator,tag: "4%"  },
  ];

  const [currentFeatured, setCurrentFeatured] = useState(0);
  const nextFeatured = () => setCurrentFeatured((p) => (p + 1) % featuredProducts.length);
  const prevFeatured = () => setCurrentFeatured((p) => (p === 0 ? featuredProducts.length - 1 : p - 1));

  /* ── Responsive: how many product cards to show ── */
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);
  useEffect(() => {
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getDisplayedProducts = () => {
    const count = Math.min(visibleCount, featuredProducts.length);
    return Array.from({ length: count }, (_, i) =>
      featuredProducts[(currentFeatured + i) % featuredProducts.length]
    );
  };

  /* ── Shared sidebar list ── */
  const SidebarList = () => (
    <>
      {categories.map((cat, i) => (
        <div key={i} className="lp-sidebar-item" onClick={() => setDrawerOpen(false)}>
          <span className="lp-sidebar-icon">{cat.icon}</span>
          <span>{cat.name}</span>
        </div>
      ))}
    </>
  );

  return (
    <div className="landing-page-container">

      {/* ════════════════════════════════════════
          MOBILE CATEGORY BAR  (hidden ≥1024px)
          A slim "Browse Categories" bar that sits
          below the main Navbar on small screens.
          ════════════════════════════════════════ */}
      <div className="lp-cat-bar">
        <button
          className="lp-cat-bar__btn"
          onClick={() => setDrawerOpen(true)}
          aria-label="Browse categories"
        >
          <FiGrid size={16} />
          <span>Browse Categories</span>
          <FiChevronRight size={14} className="lp-cat-bar__chevron" />
        </button>
      </div>

      {/* ── Overlay behind drawer ── */}
      {drawerOpen && (
        <div className="lp-overlay" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      )}

      {/* ── Off-canvas category drawer (mobile / tablet) ── */}
      <aside
        ref={drawerRef}
        className={`lp-drawer ${drawerOpen ? "lp-drawer--open" : ""}`}
        aria-label="Category menu"
      >
        <div className="lp-drawer__header">
          <span className="lp-drawer__title">Categories</span>
          <button
            className="lp-drawer__close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close categories"
          >
            <FiX size={20} />
          </button>
        </div>
        <SidebarList />
      </aside>

      {/* ════════════════════════════════════════
          MAIN LAYOUT
          Desktop : sidebar | content  (2-col grid)
          ≤1023px  : content only      (1-col)
          ════════════════════════════════════════ */}
      <div className="lp-main-layout">

        {/* ── Desktop persistent sidebar ── */}
        <aside className="lp-sidebar--desktop" aria-label="Product categories">
          <SidebarList />
        </aside>

        {/* ── Main content column ── */}
        <main className="lp-content">

          {/* ── Hero carousel ── */}
          <section className="lp-hero">
            <div className="lp-hero-graphic">
              <button className="lp-arrow lp-arrow--left" onClick={prevSlide} aria-label="Previous slide">
                <FiChevronLeft size={24} />
              </button>

              <img
                src={heroImages[currentSlide]}
                alt={`Hero Banner ${currentSlide + 1}`}
                className="lp-hero-img"
              />

              <button className="lp-arrow lp-arrow--right" onClick={nextSlide} aria-label="Next slide">
                <FiChevronRight size={24} />
              </button>
            </div>

            <div className="lp-hero-dots" role="tablist" aria-label="Hero slides">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === currentSlide}
                  onClick={() => setCurrentSlide(i)}
                  className={`lp-dot${i === currentSlide ? " active" : ""}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </section>

          {/* ── Special Offers ── */}
          <section className="lp-offers">
            <div className="lp-section-header">
              <span className="lp-tag">SPECIAL OFFERS %</span>
              <span className="lp-section-star">★</span>
              <span className="lp-section-label">FEATURED</span>
            </div>

            <div className="lp-carousel-wrapper">
              <button className="lp-nav-arrow" onClick={prevFeatured} aria-label="Previous product">
                <FiChevronLeft size={28} />
              </button>

              <div className="lp-product-grid">
                {getDisplayedProducts().map((product) => (
                  <div key={product.id} className="lp-product-card">
                    <span className="lp-card-tag">{product.tag}</span>
                    <img src={product.image} alt={product.title} className="lp-card-image" />
                    <div className="lp-card-info">
                      <div className="lp-card-title">{product.title}</div>
                      <div className="lp-card-category">{product.category}</div>
                      <div className="lp-card-price">
                        {product.oldPrice && <span className="lp-old-price">{product.oldPrice}</span>}
                        {product.price}
                      </div>
                      <span className="lp-stock-status">In Stock</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="lp-nav-arrow" onClick={nextFeatured} aria-label="Next product">
                <FiChevronRight size={28} />
              </button>
            </div>

            <div className="lp-hero-dots lp-featured-dots" role="tablist" aria-label="Featured products">
              {featuredProducts.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === currentFeatured}
                  onClick={() => setCurrentFeatured(i)}
                  className={`lp-dot${i === currentFeatured ? " active" : ""}`}
                  aria-label={`Product ${i + 1}`}
                />
              ))}
            </div>
          </section>

          {/* ── About / Contact / Testimonials ── */}
          <section className="lp-info-section">
            <div className="lp-info-intro">
              <p className="lp-info-sub">Become a Sharper</p>
              <h2 className="lp-info-title">Customer</h2>
              <p className="lp-info-desc">
                Discover investing with Us — your trusted electronic wholesale market.
              </p>
            </div>
            <AboutSection />
            <ContactCard />
            <TestimonialSection />
          </section>

          {/* ── Service Banner ── */}
          <section className="lp-service-banner">
            <div className="lp-service-item">
              <FiShield className="lp-service-icon" />
              <div className="lp-service-title">WARRANTY ASSURED</div>
              <div className="lp-service-desc">
                In case of faulty products, we have an upstanding warranty and claim
                procedures to make sure your requirements are met with minimum time loss.
              </div>
              <div className="lp-conditions">*Conditions Applied</div>
            </div>

            <div className="lp-service-item">
              <FiSettings className="lp-service-icon" />
              <div className="lp-service-title">CUSTOM ORDERS</div>
              <div className="lp-service-desc">
                When your requirements surpass what the local market offers, we will
                provide assistance to meet those requirements.
              </div>
              <div className="lp-conditions">*Conditions Applied</div>
            </div>

            <div className="lp-service-item">
              <FiTruck className="lp-service-icon" />
              <div className="lp-service-title">HOME DELIVERY</div>
              <div className="lp-service-desc">
                To further facilitate your access, we deliver straight to your door
                within Sri Lankan borders.
              </div>
              <div className="lp-conditions">*Conditions Applied</div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default LandingPage;
