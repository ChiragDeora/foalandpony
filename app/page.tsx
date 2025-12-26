'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const collections = [
    { name: 'Adventure Series', age: '3-6 years', colors: ['Sky Blue', 'Coral', 'Mint'], icon: '🌈' },
    { name: 'Explorer Series', age: '6-9 years', colors: ['Navy', 'Orange', 'Purple'], icon: '🔭' },
    { name: 'Champion Series', age: '9-12 years', colors: ['Black', 'Red', 'Teal'], icon: '🏆' },
  ]

  const features = [
    { icon: '💪', title: 'Unbreakable Frames', desc: 'Flexible material that bends, not breaks. Designed for active kids.' },
    { icon: '🪶', title: 'Feather Light', desc: 'So comfortable, they\'ll forget they\'re wearing them.' },
    { icon: '🛡️', title: 'UV Protection', desc: '100% UV protection for growing eyes.' },
    { icon: '🎨', title: 'Fun Colors', desc: 'Shades kids actually want to wear.' },
    { icon: '👁️', title: 'Perfect Fit', desc: 'Designed specifically for children\'s facial structures.' },
    { icon: '✨', title: 'Easy Clean', desc: 'Smudge-resistant coating for clearer vision.' },
  ]

  const stores = [
    { city: 'Mumbai', count: 12 },
    { city: 'Delhi', count: 8 },
    { city: 'Bangalore', count: 6 },
    { city: 'Chennai', count: 5 },
    { city: 'Hyderabad', count: 4 },
    { city: 'Pune', count: 4 },
  ]

  return (
    <div>
      {/* Navbar */}
      <nav className={`navbar ${scrollY > 50 ? 'scrolled' : ''}`}>
        <a href="#home" className="logo">
          <Image 
            src="/assets/foalandpony_wordmark.png" 
            alt="Foal & Pony" 
            width={150}
            height={50}
            className="logo-image"
            priority
          />
        </a>
        
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#collection">Collection</a></li>
          <li><a href="#stores">Stores</a></li>
          <li><a href="#review" className="nav-cta">Review Us</a></li>
        </ul>
        
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-bg"></div>
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-label">Premium Kids Eyewear</div>
            <h1 className="hero-title">
              Eyewear Made for <span className="highlight">Little Adventurers</span>
            </h1>
            <p className="hero-subtitle">
              Fun, flexible, and virtually unbreakable frames designed specifically for children. Because every adventure deserves clear vision.
            </p>
            {/* <div className="hero-buttons">
              <a href="#collection" className="btn btn-primary">
                Explore Collection 👓
              </a>
              <a href="#stores" className="btn btn-secondary">
                Find a Store
              </a>
            </div> */}
          </div>
          
          <div className="hero-visual">
            <div className="hero-mascots">
              <div className="mascot-card foal">
                <Image 
                  src="/assets/foal.png" 
                  alt="Foal" 
                  width={200}
                  height={200}
                  className="mascot-image"
                  priority
                />
                <div className="mascot-name">Foal</div>
                <div className="mascot-role">The Little Explorer</div>
              </div>
              <div className="mascot-card pony">
                <Image 
                  src="/assets/pony.png" 
                  alt="Pony" 
                  width={200}
                  height={200}
                  className="mascot-image"
                  priority
                />
                <div className="mascot-name">Pony</div>
                <div className="mascot-role">The Big Sibling</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="section-container">
          <div className="about-grid">
            <div className="about-image">
              <Image 
                src="/assets/about_section_image.jpeg" 
                alt="Foal & Pony Characters" 
                width={600}
                height={500}
                className="about-image-main"
              />
            </div>
            <div className="about-content">
              <div className="section-label">Our Story</div>
              <h3>Born from a Parent&apos;s Frustration</h3>
              <p>
                Every parent knows the struggle—glasses that break within weeks, frames that kids refuse to wear, and endless trips to the optician.
              </p>
              <p>
                Foal & Pony was created to solve exactly that. We design eyewear that&apos;s as tough as your little ones, in colors they&apos;ll actually love wearing. Backed by Stallion Eyewear&apos;s decades of optical expertise.
              </p>
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-number">50K+</div>
                  <div className="stat-label">Happy Kids</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">100+</div>
                  <div className="stat-label">Frame Styles</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">40+</div>
                  <div className="stat-label">Cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Why Choose Us</div>
            <h2 className="section-title">Built Different. Built Better.</h2>
            <p className="section-subtitle">
              Every frame is engineered with one thing in mind—surviving childhood.
            </p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="collection" id="collection">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Our Range</div>
            <h2 className="section-title">Collections for Every Age</h2>
            <p className="section-subtitle">
              From tiny tots to tweens, we&apos;ve got the perfect frames for every stage.
            </p>
          </div>
          
          <div className="collection-grid">
            {collections.map((collection, index) => (
              <div key={index} className={`collection-card ${index === 2 ? 'featured' : ''}`}>
                <div className="collection-header">
                  <div className="collection-icon-wrapper">
                    <div className="collection-icon-text">{collection.icon}</div>
                  </div>
                  <div className="collection-info">
                    <h4 className="collection-name">{collection.name}</h4>
                    <div className="collection-age">{collection.age}</div>
                  </div>
                </div>
                <div className="collection-footer">
                  <div className="collection-colors-label">Available Colors</div>
                  <div className="collection-colors">
                    {collection.colors.map((color, i) => (
                      <span key={i} className="color-tag">{color}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stores Section */}
      <section className="stores" id="stores">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Find Us</div>
            <h2 className="section-title">Available Across India</h2>
            <p className="section-subtitle">
              Visit any of our partner stores for a free eye check-up and to explore our collection.
            </p>
          </div>
          
          <div className="stores-grid">
            {stores.map((store, index) => (
              <div key={index} className="store-card">
                <div className="store-city">{store.city}</div>
                <div className="store-count">{store.count} stores</div>
              </div>
            ))}
          </div>
          
          {/* <div className="stores-cta">
            <a href="#review" className="btn btn-light">
              📍 Find Nearest Store
            </a>
          </div> */}
        </div>
      </section>

      {/* Review Section */}
      <section className="contact" id="review">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Share Your Experience</div>
            <h2 className="section-title">We&apos;d Love to Hear Your Feedback</h2>
            <p className="section-subtitle">
              Your experience matters to us! Share your thoughts and help other parents make the right choice.
            </p>
          </div>
          
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Your Voice Matters</h3>
              <p>
                Whether you&apos;re a parent whose child loves their new frames, or you have suggestions to help us improve, we want to hear from you. Your reviews help us grow and serve families better.
              </p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">⭐</div>
                  <div>
                    <div className="contact-detail">Rate Your Experience</div>
                    <div className="contact-label">Tell us how we did</div>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">💬</div>
                  <div>
                    <div className="contact-detail">Share Your Story</div>
                    <div className="contact-label">Help other parents decide</div>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">💡</div>
                  <div>
                    <div className="contact-detail">Suggest Improvements</div>
                    <div className="contact-label">We&apos;re always listening</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input type="text" className="form-input" placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <select className="form-input form-select">
                  <option>⭐⭐⭐⭐⭐</option>
                  <option>⭐⭐⭐⭐</option>
                  <option>⭐⭐⭐</option>
                  <option>⭐⭐</option>
                  <option>⭐</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Your Review</label>
                <textarea className="form-input form-textarea" placeholder="Share your experience with Foal & Pony eyewear..."></textarea>
              </div>
              {/* <button className="btn-submit">Submit Review ⭐</button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-wordmark-container">
              <Image 
                src="/assets/foalandpony_wordmark.png" 
                alt="Foal & Pony" 
                width={120}
                height={45}
              />
            </div>
            <p>
              Premium eyewear designed for little adventurers. Fun, durable, and made with love by Stallion Eyewear.
            </p>
            <div className="footer-social">
              <a 
                href="https://www.instagram.com/foalandpony.eyewear?igsh=bmNsdXJxOHU0dDRq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon"
              >
                Instagram
              </a>
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#collection">Collections</a></li>
              <li><a href="#stores">Store Locator</a></li>
              <li><a href="#review">Review Us</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Collections</h4>
            <ul>
              <li><a href="#collection">Adventure Series</a></li>
              <li><a href="#collection">Explorer Series</a></li>
              <li><a href="#collection">Champion Series</a></li>
              <li><a href="#collection">Sunglasses</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#review">FAQs</a></li>
              <li><a href="#review">Warranty</a></li>
              <li><a href="#review">Care Guide</a></li>
              <li><a href="#review">Dealer Inquiry</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>©️ 2025 Foal & Pony. All rights reserved.</p>
          <div className="footer-stallion">
            A brand by <span>Stallion Eyewear</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

