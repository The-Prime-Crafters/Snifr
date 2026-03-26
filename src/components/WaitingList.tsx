"use client";

import { useState } from "react";

export default function WaitingList() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waiting-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("🎉 You're on the list! We'll notify you when Snifr launches.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section className="waiting-list-section">
      {/* Decorative blobs */}
      <div className="wl-blob wl-blob-1"></div>
      <div className="wl-blob wl-blob-2"></div>
      
      <div className="section-inner">
        <div className="waiting-list-content">
          {/* Header */}
          <div className="waiting-list-header">
            <div className="section-label">Join the Pack</div>
            <h2 className="section-title">Be the first to know</h2>
            <p className="section-sub">
              Snifr is launching soon in your city. Join the waiting list and get 
              <strong> early access</strong> plus <strong>exclusive rewards</strong> when we go live.
            </p>
          </div>

          {/* Form */}
          <form className="waiting-list-form" onSubmit={handleSubmit}>
            <div className="form-input-group">
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                aria-label="Email address"
              />
              <button
                type="submit"
                className="btn-primary form-submit"
                disabled={status === "loading" || status === "success"}
              >
                {status === "loading" ? (
                  <>
                    <span className="spinner"></span>
                    Joining...
                  </>
                ) : status === "success" ? (
                  <>
                    <span className="success-check">✓</span>
                    Joined!
                  </>
                ) : (
                  <>
                    <span>🐾</span>
                    Join Waiting List
                  </>
                )}
              </button>
            </div>
            
            {message && (
              <div className={`form-message ${status}`}>
                {status === "success" && <span className="message-icon">✓</span>}
                {status === "error" && <span className="message-icon">!</span>}
                {message}
              </div>
            )}
          </form>

          {/* Perks */}
          <div className="waiting-list-perks">
            <div className="perk-item">
              <div className="perk-icon-wrapper">
                <span className="perk-icon">🎁</span>
              </div>
              <div className="perk-content">
                <div className="perk-title">Early Bird Access</div>
                <div className="perk-desc">Get exclusive access before public launch</div>
              </div>
            </div>
            <div className="perk-item">
              <div className="perk-icon-wrapper" style={{ background: "linear-gradient(135deg, #E8DEFF, #D6EEFF)" }}>
                <span className="perk-icon">🏆</span>
              </div>
              <div className="perk-content">
                <div className="perk-title">Founder's Badge</div>
                <div className="perk-desc">Special verified badge on your profile</div>
              </div>
            </div>
            <div className="perk-item">
              <div className="perk-icon-wrapper" style={{ background: "linear-gradient(135deg, #D4F5E9, #FFF3CC)" }}>
                <span className="perk-icon">💎</span>
              </div>
              <div className="perk-content">
                <div className="perk-title">Premium Features</div>
                <div className="perk-desc">Free premium features for 3 months</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
