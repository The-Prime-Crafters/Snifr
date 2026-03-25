"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Counter animation component
function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting) {
          // Reset count to 0
          setCount(0);
          
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-quart)
            const easeOut = 1 - Math.pow(1 - progress, 4);
            
            setCount(Math.floor(easeOut * end));
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [end, duration]);

  // Format number with k suffix for thousands
  const displayValue = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;

  return (
    <div ref={counterRef}>
      <div className="stat-num">{displayValue}{suffix}</div>
    </div>
  );
}

export default function Home() {
  const [activeCity, setActiveCity] = useState<"isb" | "khi" | "lhr">("isb");
  const [scrolled, setScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Testimonials data
  const testimonials = [
    {
      stars: "★★★★★",
      text: "\"My German Shepherd Bruno had zero friends. Within a week on Snifr he had three regular playdate partners at F9. Genuinely life changing.\"",
      avatar: "👩",
      avatarBg: "#FFE8D0",
      name: "Sara Ahmed",
      pet: "Bruno's human · F-7, Islamabad",
    },
    {
      stars: "★★★★★",
      text: "\"The Live Map alone is worth it. I open Snifr before heading to Clifton Beach and know exactly which dogs are there. Perfect for my Labrador Coco.\"",
      avatar: "👨",
      avatarBg: "#E8DEFF",
      name: "Usman Malik",
      pet: "Coco's dad · DHA, Karachi",
    },
    {
      stars: "★★★★★",
      text: "\"Found three Golden Retriever owners near Jilani Park within days. Now we do weekend group walks every Sunday. Snifr is huge in Lahore already.\"",
      avatar: "👩",
      avatarBg: "#D4F5E9",
      name: "Amna Riaz",
      pet: "Mochi's mum · DHA, Lahore",
    },
  ];

  // Autoplay carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* NAV */}
      <nav style={{ background: scrolled ? "rgba(255,240,232,0.97)" : "rgba(255,240,232,0.85)" }}>
        <a href="#" className="nav-logo">
          <span>🐾</span> snifr
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#parks">3 Cities</a>
          <a href="#testimonials">Stories</a>
        </div>
        <a href="#download" className="nav-cta">
          Get the App
        </a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span>
              Now live in Islamabad, Karachi & Lahore 🇵🇰
            </div>
            <h1 className="hero-title">
              Find the <span className="highlight">perfect</span>
              <br />
              friends for
              <br />
              your pet.
            </h1>
            <p className="hero-sub">
              Snifr connects dogs and cats with their ideal playmates nearby.
              Swipe, match, and book playdates across Islamabad, Karachi and
              Lahore.
            </p>
            <div className="hero-actions">
              <a href="#download" className="btn-primary">
                🐾 Download Snifr
              </a>
              <a href="#how" className="btn-ghost">
                See how it works →
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <Counter end={2400} suffix="k+" />
                <div className="stat-label">Pets registered</div>
              </div>
              <div className="stat-item">
                <Counter end={840} suffix="+" />
                <div className="stat-label">Playdates booked</div>
              </div>
              <div className="stat-item">
                <Counter end={12} suffix="+" />
                <div className="stat-label">Parks covered</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="phone-wrap">
              <div className="float-badge badge-1">
                <span className="badge-icon">📍</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#3D2C24" }}>
                    F9 Park
                  </div>
                  <div style={{ fontSize: "10px", color: "#9E7B6A" }}>
                    12 dogs nearby
                  </div>
                </div>
              </div>
              <div className="float-badge badge-2">
                <span className="badge-icon">✨</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#3D2C24" }}>
                    New Match!
                  </div>
                  <div style={{ fontSize: "10px", color: "#9E7B6A" }}>
                    94% compatible
                  </div>
                </div>
              </div>
              <div className="float-badge badge-3">
                <span className="badge-icon">🗓️</span>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#3D2C24" }}>
                    Playdate Set
                  </div>
                  <div style={{ fontSize: "10px", color: "#9E7B6A" }}>
                    Today at 5pm
                  </div>
                </div>
              </div>

              <div className="phone">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  <div className="phone-topbar">
                    <div className="phone-logo">snifr 🐾</div>
                    <div className="phone-map-pill">
                      <span className="map-dot"></span> Live Map
                    </div>
                  </div>
                  <div className="phone-card">
                    <span className="phone-pet-emoji">🐶</span>
                    <div className="phone-pet-name">Max</div>
                    <div className="phone-pet-info">
                      Husky · 1.5 yrs · F9 Park
                    </div>
                    <div className="phone-tags">
                      <span
                        className="phone-tag"
                        style={{ background: "#FFF3CC", color: "#8A6A00" }}
                      >
                        Playful
                      </span>
                      <span
                        className="phone-tag"
                        style={{ background: "#E8DEFF", color: "#5A3FAA" }}
                      >
                        ✓ Verified
                      </span>
                    </div>
                  </div>
                  <div className="phone-actions">
                    <button
                      className="phone-btn"
                      style={{ background: "#D6EEFF" }}
                    >
                      ✕
                    </button>
                    <button
                      className="phone-btn"
                      style={{ background: "#E8DEFF" }}
                    >
                      ⭐
                    </button>
                    <button
                      className="phone-btn"
                      style={{ background: "#FFD6D6" }}
                    >
                      ♥
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-alt" id="how">
        <div className="section-inner">
          <div className="section-label">How it works</div>
          <h2 className="section-title">Three steps to a happy pet</h2>
          <p className="section-sub">
            Getting your pet a new best friend has never been this easy.
          </p>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-icon">🐾</span>
              <div className="step-num">01</div>
              <div className="step-title">Create a pet profile</div>
              <p className="step-desc">
                Add your pet&apos;s name, breed, age, temperament and photos.
                Upload vaccination proof to get the Verified badge.
              </p>
            </div>
            <div className="step-card">
              <span className="step-icon">💫</span>
              <div className="step-num">02</div>
              <div className="step-title">Swipe & match</div>
              <p className="step-desc">
                Browse pets nearby. Our AI matches by energy level, friendliness
                and age. When both owners like — it&apos;s a match!
              </p>
            </div>
            <div className="step-card">
              <span className="step-icon">📍</span>
              <div className="step-num">03</div>
              <div className="step-title">Book a playdate</div>
              <p className="step-desc">
                Chat with the owner, pick a park, choose a time. See the Live
                Pet Map to find who&apos;s out right now across Islamabad,
                Karachi and Lahore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-label">Features</div>
          <h2 className="section-title">
            Everything your pet deserves
          </h2>
          <p className="section-sub">
            Built from the ground up for Pakistan&apos;s growing pet community.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div
                className="feature-icon-wrap"
                style={{ background: "#FFD6D6" }}
              >
                🗺️
              </div>
              <div>
                <div className="feature-title">Live Pet Map</div>
                <p className="feature-desc">
                  See exactly how many pets are at parks in Islamabad, Karachi
                  and Lahore right now. F9 Park, Clifton, Jilani Park — all
                  live.
                </p>
              </div>
            </div>
            <div className="feature-card">
              <div
                className="feature-icon-wrap"
                style={{ background: "#E8DEFF" }}
              >
                🤖
              </div>
              <div>
                <div className="feature-title">AI Personality Matching</div>
                <p className="feature-desc">
                  Smart compatibility scoring based on energy level, temperament,
                  age and breed. No more mismatched playdates.
                </p>
              </div>
            </div>
            <div className="feature-card">
              <div
                className="feature-icon-wrap"
                style={{ background: "#D4F5E9" }}
              >
                ✅
              </div>
              <div>
                <div className="feature-title">Verified Pet Badge</div>
                <p className="feature-desc">
                  Upload vaccination and vet records to earn a badge. Know every
                  pet you meet is safe and healthy.
                </p>
              </div>
            </div>
            <div className="feature-card">
              <div
                className="feature-icon-wrap"
                style={{ background: "#D6EEFF" }}
              >
                💬
              </div>
              <div>
                <div className="feature-title">Owner Chat</div>
                <p className="feature-desc">
                  Built-in messaging to coordinate playdates. Share photos,
                  stories and plan the perfect meetup for your furry friends.
                </p>
              </div>
            </div>
            <div className="feature-card wide">
              <div
                className="feature-icon-wrap"
                style={{ background: "#FFE8D0" }}
              >
                🏆
              </div>
              <div>
                <div className="feature-title">Pet Events & Meetups</div>
                <p className="feature-desc">
                  Discover and host dog meetups at Islamabad&apos;s best parks.
                  From casual morning walks to full weekend events — Snifr helps
                  your pet build a real social life in the city.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAP / ISLAMABAD */}
      <section className="map-section" id="parks">
        <div className="section-inner" style={{ position: "relative", zIndex: 2 }}>
          <div className="section-label">Live right now</div>
          <h2 className="section-title">Pakistan&apos;s pet hotspots</h2>
          <p className="section-sub" style={{ color: "#C4A898" }}>
            Open the app and see who&apos;s out with their pet at this very
            moment — across three cities.
          </p>

          {/* City tabs */}
          <div className="city-tabs-container"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "36px",
            }}
          >
            <button
              className={`city-tab ${activeCity === "isb" ? "active" : ""}`}
              onClick={() => setActiveCity("isb")}
            >
              🏛️ Islamabad
            </button>
            <button
              className={`city-tab ${activeCity === "khi" ? "active" : ""}`}
              onClick={() => setActiveCity("khi")}
            >
              🌊 Karachi
            </button>
            <button
              className={`city-tab ${activeCity === "lhr" ? "active" : ""}`}
              onClick={() => setActiveCity("lhr")}
            >
              🌸 Lahore
            </button>
          </div>

          {/* Islamabad */}
          {activeCity === "isb" && (
            <div className="city-pins">
              <div className="map-pins-grid">
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#FF8FAB" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">F9 Park</div>
                    <div className="map-pin-count">12 pets nearby</div>
                  </div>
                </div>
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#4ECBA3" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">Lake View Park</div>
                    <div className="map-pin-count">7 pets nearby</div>
                  </div>
                </div>
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#5BB8F5" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">Margalla Trails</div>
                    <div className="map-pin-count">5 pets nearby</div>
                  </div>
                </div>
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#A07FDB" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">DHA Dog Park</div>
                    <div className="map-pin-count">4 pets nearby</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Karachi */}
          {activeCity === "khi" && (
            <div className="city-pins">
              <div className="map-pins-grid">
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#FF8FAB" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">Clifton Beach</div>
                    <div className="map-pin-count">18 pets nearby</div>
                  </div>
                </div>
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#4ECBA3" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">Bagh Ibn-e-Qasim</div>
                    <div className="map-pin-count">9 pets nearby</div>
                  </div>
                </div>
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#5BB8F5" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">Creek Park</div>
                    <div className="map-pin-count">6 pets nearby</div>
                  </div>
                </div>
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#A07FDB" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">DHA Phase 8 Park</div>
                    <div className="map-pin-count">11 pets nearby</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lahore */}
          {activeCity === "lhr" && (
            <div className="city-pins">
              <div className="map-pins-grid">
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#FF8FAB" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">Jilani Park</div>
                    <div className="map-pin-count">14 pets nearby</div>
                  </div>
                </div>
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#4ECBA3" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">Gulshan-e-Iqbal Park</div>
                    <div className="map-pin-count">8 pets nearby</div>
                  </div>
                </div>
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#5BB8F5" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">Race Course Park</div>
                    <div className="map-pin-count">10 pets nearby</div>
                  </div>
                </div>
                <div className="map-pin-card">
                  <span
                    className="pin-circle"
                    style={{ background: "#A07FDB" }}
                  ></span>
                  <div>
                    <div className="map-pin-name">DHA Lahore Dog Run</div>
                    <div className="map-pin-count">7 pets nearby</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-alt" id="testimonials">
        <div className="section-inner">
          <div className="section-label">Pet parent stories</div>
          <h2 className="section-title">They found their pack</h2>
          <p className="section-sub">
            Real stories from Islamabad pet owners who found their pet&apos;s
            best friends on Snifr.
          </p>
          
          {/* Desktop: Grid Layout */}
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                &quot;My German Shepherd Bruno had zero friends. Within a week on
                Snifr he had three regular playdate partners at F9. Genuinely
                life changing.&quot;
              </p>
              <div className="testimonial-author">
                <div
                  className="author-avatar"
                  style={{ background: "#FFE8D0" }}
                >
                  👩
                </div>
                <div>
                  <div className="author-name">Sara Ahmed</div>
                  <div className="author-pet">
                    Bruno&apos;s human · F-7, Islamabad
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                &quot;The Live Map alone is worth it. I open Snifr before heading
                to Clifton Beach and know exactly which dogs are there. Perfect
                for my Labrador Coco.&quot;
              </p>
              <div className="testimonial-author">
                <div
                  className="author-avatar"
                  style={{ background: "#E8DEFF" }}
                >
                  👨
                </div>
                <div>
                  <div className="author-name">Usman Malik</div>
                  <div className="author-pet">
                    Coco&apos;s dad · DHA, Karachi
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">
                &quot;Found three Golden Retriever owners near Jilani Park within
                days. Now we do weekend group walks every Sunday. Snifr is huge
                in Lahore already.&quot;
              </p>
              <div className="testimonial-author">
                <div
                  className="author-avatar"
                  style={{ background: "#D4F5E9" }}
                >
                  👩
                </div>
                <div>
                  <div className="author-name">Amna Riaz</div>
                  <div className="author-pet">
                    Mochi&apos;s mum · DHA, Lahore
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: Carousel */}
          <div className="testimonials-carousel" style={{ display: 'none' }}>
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="carousel-slide">
                  <div className="testimonial-card">
                    <div className="testimonial-stars">{testimonial.stars}</div>
                    <p className="testimonial-text">{testimonial.text}</p>
                    <div className="testimonial-author">
                      <div
                        className="author-avatar"
                        style={{ background: testimonial.avatarBg }}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="author-name">{testimonial.name}</div>
                        <div className="author-pet">{testimonial.pet}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="carousel-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="download">
        <h2 className="cta-title">
          Your pet&apos;s new
          <br />
          best friend is waiting.
        </h2>
        <p className="cta-sub">
          Join thousands of Islamabad pet owners already on Snifr. Free to
          download, free to match.
        </p>
        <div className="cta-buttons">
          <a href="#" className="btn-primary">
            🍎 Download on App Store
          </a>
          <a
            href="#"
            className="btn-primary"
            style={{
              background: "linear-gradient(135deg,#A07FDB,#7B9FE8)",
              boxShadow: "0 6px 24px rgba(160,127,219,0.4)",
            }}
          >
            🤖 Get it on Google Play
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">🐾 snifr</div>
              <p className="footer-tagline">
                Find the perfect friends for your pet. Playdates, matchmaking and
                meetups — all in one app.
              </p>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Product</div>
              <a href="#how">How it works</a>
              <a href="#features">Features</a>
              <a href="#parks">Islamabad</a>
              <a href="#parks">Karachi</a>
              <a href="#parks">Lahore</a>
              <a href="#download">Download</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Pets</div>
              <a href="#">Dogs</a>
              <a href="#">Cats</a>
              <a href="#">Breeders</a>
              <a href="#">Events</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Company</div>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Privacy</a>
              <a href="#">Contact</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="footer-copy">
              © 2026 Snifr · snifr.app · Islamabad · Karachi · Lahore 🇵🇰
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn">
                📸
              </a>
              <a href="#" className="social-btn">
                🐦
              </a>
              <a href="#" className="social-btn">
                📱
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
