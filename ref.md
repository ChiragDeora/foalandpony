<!-- /* import React, { useState, useEffect } from 'react';

const FoalPonyWebsite = () => {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const collections = [
    { name: 'Adventure Series', age: '3-6 years', colors: ['Sky Blue', 'Coral', 'Mint'], icon: '🌈' },
    { name: 'Explorer Series', age: '6-9 years', colors: ['Navy', 'Orange', 'Purple'], icon: '🔭' },
    { name: 'Champion Series', age: '9-12 years', colors: ['Black', 'Red', 'Teal'], icon: '🏆' },
  ];

  const features = [
    { icon: '💪', title: 'Unbreakable Frames', desc: 'Flexible material that bends, not breaks. Designed for active kids.' },
    { icon: '🪶', title: 'Feather Light', desc: 'So comfortable, they\'ll forget they\'re wearing them.' },
    { icon: '🛡️', title: 'UV Protection', desc: '100% UV protection for growing eyes.' },
    { icon: '🎨', title: 'Fun Colors', desc: 'Shades kids actually want to wear.' },
    { icon: '👁️', title: 'Perfect Fit', desc: 'Designed specifically for children\'s facial structures.' },
    { icon: '✨', title: 'Easy Clean', desc: 'Smudge-resistant coating for clearer vision.' },
  ];

  const stores = [
    { city: 'Mumbai', count: 12 },
    { city: 'Delhi', count: 8 },
    { city: 'Bangalore', count: 6 },
    { city: 'Chennai', count: 5 },
    { city: 'Hyderabad', count: 4 },
    { city: 'Pune', count: 4 },
  ];

  return (
    <div style={{ 
      fontFamily: '"Nunito", "Quicksand", sans-serif',
      overflowX: 'hidden',
      background: '#FFFCF7',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        :root {
          --sky-blue: #7EC8E3;
          --deep-blue: #1E3A5F;
          --orange: #FF8C42;
          --coral: #FF6B6B;
          --cream: #FFFCF7;
          --soft-pink: #FFD4D4;
          --mint: #98E4C9;
          --yellow: #FFE156;
        }
        
        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 16px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }
        
        .navbar.scrolled {
          background: rgba(255, 252, 247, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 30px rgba(0,0,0,0.08);
          padding: 12px 40px;
        }
        
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        
        .logo-icon {
          font-size: 36px;
          animation: bounce 2s ease-in-out infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .logo-text {
          font-family: 'Fredoka', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: var(--deep-blue);
        }
        
        .logo-text span {
          color: var(--orange);
        }
        
        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }
        
        .nav-links a {
          text-decoration: none;
          color: var(--deep-blue);
          font-weight: 600;
          font-size: 15px;
          position: relative;
          padding: 8px 0;
          transition: color 0.3s;
        }
        
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 3px;
          background: var(--orange);
          border-radius: 2px;
          transition: width 0.3s ease;
        }
        
        .nav-links a:hover::after {
          width: 100%;
        }
        
        .nav-links a:hover {
          color: var(--orange);
        }
        
        .nav-cta {
          background: var(--orange);
          color: white !important;
          padding: 12px 24px !important;
          border-radius: 50px;
          font-weight: 700 !important;
          transition: transform 0.3s, box-shadow 0.3s !important;
        }
        
        .nav-cta::after {
          display: none !important;
        }
        
        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 140, 66, 0.4);
          color: white !important;
        }
        
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: var(--deep-blue);
        }
        
        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 40px 80px;
          position: relative;
          overflow: hidden;
        }
        
        .hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--cream) 0%, #E8F4F8 50%, #FFF5E6 100%);
          z-index: -2;
        }
        
        .hero-shapes {
          position: absolute;
          inset: 0;
          z-index: -1;
          overflow: hidden;
        }
        
        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.5;
        }
        
        .shape-1 {
          width: 400px;
          height: 400px;
          background: var(--sky-blue);
          top: -100px;
          right: -100px;
          animation: float 8s ease-in-out infinite;
        }
        
        .shape-2 {
          width: 300px;
          height: 300px;
          background: var(--soft-pink);
          bottom: -50px;
          left: -50px;
          animation: float 6s ease-in-out infinite reverse;
        }
        
        .shape-3 {
          width: 150px;
          height: 150px;
          background: var(--yellow);
          top: 30%;
          right: 20%;
          animation: float 5s ease-in-out infinite;
        }
        
        .shape-4 {
          width: 100px;
          height: 100px;
          background: var(--mint);
          bottom: 30%;
          left: 15%;
          animation: float 7s ease-in-out infinite reverse;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        
        .hero-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          width: 100%;
        }
        
        .hero-text {
          animation: slideInLeft 1s ease-out;
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(126, 200, 227, 0.2);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 600;
          color: var(--deep-blue);
          margin-bottom: 24px;
        }
        
        .hero-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 64px;
          font-weight: 700;
          color: var(--deep-blue);
          line-height: 1.1;
          margin-bottom: 24px;
        }
        
        .hero-title .highlight {
          color: var(--orange);
          position: relative;
        }
        
        .hero-title .highlight::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 0;
          right: 0;
          height: 12px;
          background: var(--yellow);
          z-index: -1;
          border-radius: 4px;
          opacity: 0.6;
        }
        
        .hero-subtitle {
          font-size: 20px;
          color: #5A6C7D;
          line-height: 1.7;
          margin-bottom: 40px;
          max-width: 500px;
        }
        
        .hero-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 16px 32px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .btn-primary {
          background: var(--orange);
          color: white;
          border: none;
          box-shadow: 0 8px 25px rgba(255, 140, 66, 0.35);
        }
        
        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(255, 140, 66, 0.45);
        }
        
        .btn-secondary {
          background: white;
          color: var(--deep-blue);
          border: 2px solid var(--deep-blue);
        }
        
        .btn-secondary:hover {
          background: var(--deep-blue);
          color: white;
        }
        
        .hero-visual {
          position: relative;
          animation: slideInRight 1s ease-out;
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .hero-mascots {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 20px;
        }
        
        .mascot-card {
          background: white;
          border-radius: 30px;
          padding: 30px;
          box-shadow: 0 20px 60px rgba(30, 58, 95, 0.12);
          text-align: center;
          transition: transform 0.3s ease;
        }
        
        .mascot-card:hover {
          transform: translateY(-10px);
        }
        
        .mascot-card.foal {
          transform: rotate(-5deg);
        }
        
        .mascot-card.pony {
          transform: rotate(5deg);
        }
        
        .mascot-card.foal:hover {
          transform: rotate(-5deg) translateY(-10px);
        }
        
        .mascot-card.pony:hover {
          transform: rotate(5deg) translateY(-10px);
        }
        
        .mascot-emoji {
          font-size: 80px;
          margin-bottom: 16px;
        }
        
        .mascot-name {
          font-family: 'Fredoka', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: var(--deep-blue);
        }
        
        .mascot-role {
          font-size: 14px;
          color: #8892A0;
          margin-top: 4px;
        }
        
        /* About Section */
        .about {
          padding: 120px 40px;
          background: white;
          position: relative;
        }
        
        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .section-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(126, 200, 227, 0.15);
          padding: 8px 20px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          color: var(--sky-blue);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 16px;
        }
        
        .section-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 48px;
          font-weight: 700;
          color: var(--deep-blue);
          margin-bottom: 16px;
        }
        
        .section-subtitle {
          font-size: 18px;
          color: #6B7C8F;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }
        
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }
        
        .about-image {
          position: relative;
        }
        
        .about-image-main {
          width: 100%;
          height: 500px;
          background: linear-gradient(135deg, var(--sky-blue), var(--mint));
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 150px;
          position: relative;
          overflow: hidden;
        }
        
        .about-image-main::before {
          content: '👓';
          position: absolute;
          font-size: 80px;
          top: 20px;
          right: 30px;
          animation: float 4s ease-in-out infinite;
        }
        
        .about-image-main::after {
          content: '✨';
          position: absolute;
          font-size: 40px;
          bottom: 30px;
          left: 30px;
          animation: float 3s ease-in-out infinite reverse;
        }
        
        .about-content h3 {
          font-family: 'Fredoka', sans-serif;
          font-size: 36px;
          color: var(--deep-blue);
          margin-bottom: 24px;
        }
        
        .about-content p {
          font-size: 17px;
          color: #5A6C7D;
          line-height: 1.8;
          margin-bottom: 20px;
        }
        
        .about-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 40px;
        }
        
        .stat-item {
          text-align: center;
          padding: 24px;
          background: var(--cream);
          border-radius: 20px;
        }
        
        .stat-number {
          font-family: 'Fredoka', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: var(--orange);
        }
        
        .stat-label {
          font-size: 14px;
          color: #6B7C8F;
          margin-top: 4px;
        }
        
        /* Features Section */
        .features {
          padding: 120px 40px;
          background: linear-gradient(180deg, var(--cream) 0%, #E8F4F8 100%);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        
        .feature-card {
          background: white;
          padding: 40px 30px;
          border-radius: 24px;
          text-align: center;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(30, 58, 95, 0.1);
          border-color: var(--sky-blue);
        }
        
        .feature-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--sky-blue), var(--mint));
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          margin: 0 auto 24px;
        }
        
        .feature-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--deep-blue);
          margin-bottom: 12px;
        }
        
        .feature-desc {
          font-size: 15px;
          color: #6B7C8F;
          line-height: 1.6;
        }
        
        /* Collection Section */
        .collection {
          padding: 120px 40px;
          background: white;
        }
        
        .collection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }
        
        .collection-card {
          background: var(--cream);
          border-radius: 30px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .collection-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(30, 58, 95, 0.15);
        }
        
        .collection-image {
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 100px;
          position: relative;
        }
        
        .collection-card:nth-child(1) .collection-image {
          background: linear-gradient(135deg, var(--sky-blue), #A8E6CF);
        }
        
        .collection-card:nth-child(2) .collection-image {
          background: linear-gradient(135deg, var(--orange), var(--yellow));
        }
        
        .collection-card:nth-child(3) .collection-image {
          background: linear-gradient(135deg, var(--coral), var(--soft-pink));
        }
        
        .collection-content {
          padding: 30px;
        }
        
        .collection-name {
          font-family: 'Fredoka', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: var(--deep-blue);
          margin-bottom: 8px;
        }
        
        .collection-age {
          font-size: 14px;
          color: var(--orange);
          font-weight: 600;
          margin-bottom: 16px;
        }
        
        .collection-colors {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .color-tag {
          padding: 6px 14px;
          background: white;
          border-radius: 20px;
          font-size: 13px;
          color: #5A6C7D;
          font-weight: 600;
        }
        
        /* Stores Section */
        .stores {
          padding: 120px 40px;
          background: var(--deep-blue);
          position: relative;
          overflow: hidden;
        }
        
        .stores::before {
          content: '';
          position: absolute;
          width: 500px;
          height: 500px;
          background: rgba(126, 200, 227, 0.1);
          border-radius: 50%;
          top: -200px;
          right: -200px;
        }
        
        .stores .section-title {
          color: white;
        }
        
        .stores .section-subtitle {
          color: rgba(255,255,255,0.7);
        }
        
        .stores-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 20px;
          margin-bottom: 50px;
        }
        
        .store-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 30px 20px;
          border-radius: 20px;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .store-card:hover {
          background: rgba(255,255,255,0.15);
          transform: translateY(-5px);
        }
        
        .store-city {
          font-family: 'Fredoka', sans-serif;
          font-size: 18px;
          font-weight: 600;
          color: white;
          margin-bottom: 8px;
        }
        
        .store-count {
          font-size: 14px;
          color: var(--sky-blue);
        }
        
        .stores-cta {
          text-align: center;
        }
        
        .btn-light {
          background: white;
          color: var(--deep-blue);
          border: none;
          padding: 18px 40px;
        }
        
        .btn-light:hover {
          background: var(--sky-blue);
          color: white;
          transform: translateY(-3px);
        }
        
        /* Contact Section */
        .contact {
          padding: 120px 40px;
          background: linear-gradient(180deg, white 0%, var(--cream) 100%);
        }
        
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: start;
        }
        
        .contact-info h3 {
          font-family: 'Fredoka', sans-serif;
          font-size: 32px;
          color: var(--deep-blue);
          margin-bottom: 24px;
        }
        
        .contact-info p {
          font-size: 17px;
          color: #5A6C7D;
          line-height: 1.8;
          margin-bottom: 32px;
        }
        
        .contact-methods {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .contact-method {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .contact-icon {
          width: 56px;
          height: 56px;
          background: var(--sky-blue);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .contact-detail {
          font-size: 16px;
          color: var(--deep-blue);
          font-weight: 600;
        }
        
        .contact-label {
          font-size: 13px;
          color: #8892A0;
          margin-top: 2px;
        }
        
        .contact-form {
          background: white;
          padding: 50px;
          border-radius: 30px;
          box-shadow: 0 20px 60px rgba(30, 58, 95, 0.08);
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: var(--deep-blue);
          margin-bottom: 8px;
        }
        
        .form-input {
          width: 100%;
          padding: 16px 20px;
          border: 2px solid #E8ECF0;
          border-radius: 12px;
          font-size: 16px;
          font-family: 'Nunito', sans-serif;
          transition: border-color 0.3s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--sky-blue);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }
        
        .form-select {
          appearance: none;
          background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231E3A5F' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat right 16px center;
          cursor: pointer;
        }
        
        .btn-submit {
          width: 100%;
          padding: 18px;
          background: var(--orange);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Nunito', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .btn-submit:hover {
          background: #E67A35;
          transform: translateY(-2px);
        }
        
        /* Footer */
        .footer {
          background: var(--deep-blue);
          padding: 80px 40px 40px;
        }
        
        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px;
          margin-bottom: 60px;
        }
        
        .footer-brand .logo-text {
          color: white;
          font-size: 28px;
          margin-bottom: 16px;
        }
        
        .footer-brand p {
          color: rgba(255,255,255,0.6);
          line-height: 1.7;
          font-size: 15px;
        }
        
        .footer-social {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        
        .social-icon {
          width: 44px;
          height: 44px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.3s;
          cursor: pointer;
        }
        
        .social-icon:hover {
          background: var(--orange);
          transform: translateY(-3px);
        }
        
        .footer-column h4 {
          font-family: 'Fredoka', sans-serif;
          font-size: 18px;
          color: white;
          margin-bottom: 24px;
        }
        
        .footer-column ul {
          list-style: none;
        }
        
        .footer-column li {
          margin-bottom: 14px;
        }
        
        .footer-column a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 15px;
          transition: color 0.3s;
        }
        
        .footer-column a:hover {
          color: var(--sky-blue);
        }
        
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .footer-bottom p {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
        }
        
        .footer-stallion {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.5);
          font-size: 14px;
        }
        
        .footer-stallion span {
          color: var(--orange);
          font-weight: 600;
        }
        
        /* Mobile Responsive */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          
          .hero-subtitle {
            margin: 0 auto 40px;
          }
          
          .hero-buttons {
            justify-content: center;
          }
          
          .about-grid {
            grid-template-columns: 1fr;
          }
          
          .features-grid,
          .collection-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .stores-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          
          .contact-grid {
            grid-template-columns: 1fr;
          }
          
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .navbar {
            padding: 16px 20px;
          }
          
          .nav-links {
            display: none;
          }
          
          .mobile-menu-btn {
            display: block;
          }
          
          .hero {
            padding: 100px 20px 60px;
          }
          
          .hero-title {
            font-size: 40px;
          }
          
          .section-title {
            font-size: 36px;
          }
          
          .features-grid,
          .collection-grid {
            grid-template-columns: 1fr;
          }
          
          .stores-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .footer-bottom {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav className={`navbar ${scrollY > 50 ? 'scrolled' : ''}`}>
        <a href="#home" className="logo">
          <span className="logo-icon">🐴</span>
          <span className="logo-text">Foal <span>&</span> Pony</span>
        </a>
        
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#collection">Collection</a></li>
          <li><a href="#stores">Stores</a></li>
          <li><a href="#contact" className="nav-cta">Contact Us</a></li>
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
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              ✨ Premium Kids Eyewear
            </div>
            <h1 className="hero-title">
              Eyewear Made for <span className="highlight">Little Adventurers</span>
            </h1>
            <p className="hero-subtitle">
              Fun, flexible, and virtually unbreakable frames designed specifically for children. Because every adventure deserves clear vision.
            </p>
            <div className="hero-buttons">
              <a href="#collection" className="btn btn-primary">
                Explore Collection 👓
              </a>
              <a href="#stores" className="btn btn-secondary">
                Find a Store
              </a>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-mascots">
              <div className="mascot-card foal">
                <div className="mascot-emoji">🐴</div>
                <div className="mascot-name">Foal</div>
                <div className="mascot-role">The Little Explorer</div>
              </div>
              <div className="mascot-card pony">
                <div className="mascot-emoji">🐎</div>
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
              <div className="about-image-main">🐴👓</div>
            </div>
            <div className="about-content">
              <div className="section-badge">Our Story</div>
              <h3>Born from a Parent's Frustration</h3>
              <p>
                Every parent knows the struggle—glasses that break within weeks, frames that kids refuse to wear, and endless trips to the optician.
              </p>
              <p>
                Foal & Pony was created to solve exactly that. We design eyewear that's as tough as your little ones, in colors they'll actually love wearing. Backed by Stallion Eyewear's decades of optical expertise.
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
            <div className="section-badge">Why Choose Us</div>
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
            <div className="section-badge">Our Range</div>
            <h2 className="section-title">Collections for Every Age</h2>
            <p className="section-subtitle">
              From tiny tots to tweens, we've got the perfect frames for every stage.
            </p>
          </div>
          
          <div className="collection-grid">
            {collections.map((collection, index) => (
              <div key={index} className="collection-card">
                <div className="collection-image">{collection.icon}</div>
                <div className="collection-content">
                  <h4 className="collection-name">{collection.name}</h4>
                  <div className="collection-age">{collection.age}</div>
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
            <div className="section-badge" style={{ background: 'rgba(126, 200, 227, 0.2)', color: 'var(--sky-blue)' }}>
              Find Us
            </div>
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
          
          <div className="stores-cta">
            <a href="#contact" className="btn btn-light">
              📍 Find Nearest Store
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">Get in Touch</div>
            <h2 className="section-title">We'd Love to Hear From You</h2>
            <p className="section-subtitle">
              Questions about our products? Want to become a dealer? Let's talk.
            </p>
          </div>
          
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Let's Connect</h3>
              <p>
                Whether you're a parent looking for the perfect frames, or a retailer interested in partnering with us, we're here to help.
              </p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">📧</div>
                  <div>
                    <div className="contact-detail">hello@foalandpony.com</div>
                    <div className="contact-label">Email us anytime</div>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">📞</div>
                  <div>
                    <div className="contact-detail">+91 98765 43210</div>
                    <div className="contact-label">Mon-Sat, 10am-6pm</div>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="contact-icon">📍</div>
                  <div>
                    <div className="contact-detail">Mumbai, India</div>
                    <div className="contact-label">Headquarters</div>
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
                <label className="form-label">I am a...</label>
                <select className="form-input form-select">
                  <option>Parent looking for kids' glasses</option>
                  <option>Retailer / Dealer</option>
                  <option>Optician / Eye Care Professional</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-input form-textarea" placeholder="How can we help you?"></textarea>
              </div>
              <button className="btn-submit">Send Message 🚀</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo-text" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              Foal <span style={{ color: 'var(--orange)' }}>&</span> Pony
            </div>
            <p>
              Premium eyewear designed for little adventurers. Fun, durable, and made with love by Stallion Eyewear.
            </p>
            <div className="footer-social">
              <div className="social-icon">📸</div>
              <div className="social-icon">📘</div>
              <div className="social-icon">🐦</div>
              <div className="social-icon">▶️</div>
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#collection">Collections</a></li>
              <li><a href="#stores">Store Locator</a></li>
              <li><a href="#contact">Contact</a></li>
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
              <li><a href="#contact">FAQs</a></li>
              <li><a href="#contact">Warranty</a></li>
              <li><a href="#contact">Care Guide</a></li>
              <li><a href="#contact">Dealer Inquiry</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>©️ 2025 Foal & Pony. All rights reserved.</p>
          <div className="footer-stallion">
            A brand by <span>Stallion Eyewear</span> 🐴
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FoalPonyWebsite; */ -->