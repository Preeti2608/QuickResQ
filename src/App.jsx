import React, { useState } from "react";
import "./App.css";

const emergencyCategories = [
  { id: 1, name: "Hospital", symbol: "H", description: "Find hospitals and healthcare facilities for emergency medical assistance." },
  { id: 2, name: "Pharmacy", symbol: "P", description: "Search for pharmacies and medicine services when required." },
  { id: 3, name: "Blood Bank", symbol: "B", description: "Find blood banks and access blood-related emergency information." },
  { id: 4, name: "Police Station", symbol: "PS", description: "Locate police stations and access emergency assistance information." },
  { id: 5, name: "Emergency Service", symbol: "E", description: "Access other important emergency services and assistance." },
  { id: 6, name: "More Services", symbol: "+", description: "More emergency resource categories can be added in the future." }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [searchMessage, setSearchMessage] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [locationMessage, setLocationMessage] = useState("");

  function scrollToServices() {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  function selectService(serviceName) {
    if (serviceName === "More Services") return;
    setCategory(serviceName);
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  function handleSearch(event) {
    event.preventDefault();
    const trimmedSearch = searchInput.trim();

    if (!trimmedSearch && !category) {
      setSearchMessage({ type: "error", text: "Please enter a search keyword or select a category." });
      return;
    }
    if (trimmedSearch && trimmedSearch.length < 2) {
      setSearchMessage({ type: "error", text: "Search text must contain at least 2 characters." });
      return;
    }
    if (trimmedSearch && !/^[a-zA-Z0-9\s+-]+$/.test(trimmedSearch)) {
      setSearchMessage({ type: "error", text: "Please enter a valid search keyword using letters, numbers, spaces or hyphens." });
      return;
    }
    if (category && !emergencyCategories.some((item) => item.name === category && item.name !== "More Services")) {
      setSearchMessage({ type: "error", text: "Please select a valid category." });
      return;
    }

    const searchData = {
      searchText: trimmedSearch,
      category: category,
      date: new Date().toLocaleString()
    };

    setSearchHistory((previous) => [...previous, searchData]);
    const searchJSON = JSON.stringify(searchData);
    console.log("Search JSON:", searchJSON);
    setSearchMessage({
      type: "success",
      text: "Your search request passed validation. Resource results will appear after the backend and database are connected."
    });
  }

  function handleAuthSubmit(event) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      setLoginMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (authMode === "forgot") {
      setLoginMessage({
        type: "success",
        text: "If an account exists for this email, password-reset instructions would be sent. Email recovery will work after backend integration."
      });
      return;
    }

    if (authMode === "signup") {
      if (fullName.trim().length < 2) {
        setLoginMessage({ type: "error", text: "Please enter your full name (at least 2 characters)." });
        return;
      }
      if (password.length < 6) {
        setLoginMessage({ type: "error", text: "Password must contain at least 6 characters." });
        return;
      }
      if (password !== confirmPassword) {
        setLoginMessage({ type: "error", text: "Passwords do not match. Please check and try again." });
        return;
      }

      const signupData = {
        fullName: fullName.trim(),
        email: trimmedEmail,
        action: "signup"
      };
      console.log("Signup JSON:", JSON.stringify(signupData));
      setLoginMessage({
        type: "success",
        text: "Your details passed validation. Account creation will be enabled after backend integration."
      });
      return;
    }

    if (password.length < 6) {
      setLoginMessage({ type: "error", text: "Password must contain at least 6 characters." });
      return;
    }

    const loginData = { email: trimmedEmail, action: "login" };
    console.log("Login JSON:", JSON.stringify(loginData));
    setLoginMessage({
      type: "success",
      text: "Your details passed validation. Backend authentication will be connected later."
    });
  }

  function changeAuthMode(mode) {
    setAuthMode(mode);
    setLoginMessage(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  function findNearby() {
    setLocationMessage("");
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: Number(position.coords.latitude.toFixed(6)),
          longitude: Number(position.coords.longitude.toFixed(6))
        };
        console.log("Location JSON:", JSON.stringify(locationData));
        setLocationMessage(`Location detected: ${locationData.latitude}, ${locationData.longitude}. Nearby-resource search will be connected later.`);
      },
      (error) => {
        setLocationMessage(error.code === error.PERMISSION_DENIED
          ? "Location permission was denied. Please allow location access in your browser."
          : "Unable to detect your location. Please try again.")
      }
    );
  }

  function showContactMessage() {
    window.alert("Thank you for contacting QuickResQ. Contact functionality will be connected in the backend phase.");
  }

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark quick-navbar fixed-top">
          <div className="container">
            <a className="navbar-brand logo" href="#home" onClick={() => setMenuOpen(false)}>
              <span className="logo-icon">+</span> QuickResQ
            </a>
            <button className="navbar-toggler" type="button" aria-label="Toggle navigation"
              aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
              <ul className="navbar-nav ms-auto align-items-lg-center">
                <li className="nav-item"><a className="nav-link active" href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
                <li className="nav-item"><a className="nav-link" href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
                <li className="nav-item"><a className="nav-link" href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
                <li className="nav-item"><a className="nav-link" href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                  <button className="btn btn-light login-nav-btn" onClick={() => { setLoginOpen(true); setLoginMessage(null); }}>Login</button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-7 col-md-7">
                <span className="hero-badge">Emergency Resource Finder</span>
                <h1>Find Emergency <span>Resources</span> Quickly.</h1>
                <p className="hero-text">QuickResQ helps you find important emergency resources such as hospitals, pharmacies, blood banks, police stations and emergency services from one platform.</p>
                <div className="hero-buttons">
                  <button className="btn btn-danger btn-lg" onClick={findNearby}>Find Near Me</button>
                  <button className="btn btn-outline-light btn-lg" onClick={scrollToServices}>Explore Services</button>
                </div>
                {locationMessage && <div className="alert alert-info mt-3 mb-0" role="status">{locationMessage}</div>}
              </div>
              <div className="col-lg-5 col-md-5">
                <div className="hero-card">
                  <div className="emergency-symbol">+</div>
                  <h3>Quick Access</h3>
                  <p>Search for essential emergency services whenever you need them.</p>
                  <div className="quick-stat-row">
                    <div><strong>24/7</strong><small>Access</small></div>
                    <div><strong>5+</strong><small>Categories</small></div>
                    <div><strong>1</strong><small>Platform</small></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="services-section">
          <div className="container">
            <div className="section-heading text-center">
              <span className="section-label">Emergency Services</span>
              <h2>Find What You Need</h2>
              <p>Choose an emergency service category to begin your search.</p>
            </div>
            <div className="row g-4">
              {emergencyCategories.map((service) => (
                <div className="col-lg-4 col-md-6" key={service.id}>
                  <div className={`card service-card h-100 ${service.name === "More Services" ? "future-card" : ""}`}>
                    <div className="card-body">
                      <div className="service-icon">{service.symbol}</div>
                      <h5 className="card-title">{service.name === "Emergency Service" ? "Emergency Services" : service.name === "Police Station" ? "Police Stations" : service.name === "More Services" ? "More Services" : service.name + (service.name === "Hospital" ? "s" : service.name === "Pharmacy" ? "s" : service.name === "Blood Bank" ? "s" : "")}</h5>
                      <p className="card-text">{service.description}</p>
                      {service.name === "More Services"
                        ? <button className="btn btn-outline-secondary" disabled>Coming Soon</button>
                        : <button className="btn btn-outline-danger" onClick={() => selectService(service.name)}>Search {service.name === "Police Station" ? "Police Stations" : service.name === "Emergency Service" ? "Services" : service.name + (service.name === "Hospital" ? "s" : service.name === "Pharmacy" ? "s" : service.name === "Blood Bank" ? "s" : "")}</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="search" className="search-section">
          <div className="container">
            <div className="search-box">
              <div className="section-heading text-center">
                <span className="section-label">Search</span>
                <h2>Find Emergency Resources</h2>
                <p>Search by resource name, location or category.</p>
              </div>
              <form onSubmit={handleSearch} noValidate>
                <div className="row g-3 align-items-end">
                  <div className="col-lg-6 col-md-6">
                    <label htmlFor="searchInput" className="form-label">Search Resource</label>
                    <input id="searchInput" type="text" className="form-control form-control-lg"
                      placeholder="Example: Hospital, Panaji, Pharmacy" value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)} />
                  </div>
                  <div className="col-lg-3 col-md-3">
                    <label htmlFor="categorySelect" className="form-label">Category</label>
                    <select id="categorySelect" className="form-select form-select-lg"
                      value={category} onChange={(event) => setCategory(event.target.value)}>
                      <option value="">All Categories</option>
                      {emergencyCategories.filter((item) => item.name !== "More Services").map((item) =>
                        <option key={item.id} value={item.name}>{item.name === "Emergency Service" ? "Emergency Services" : item.name + (item.name === "Hospital" ? "s" : item.name === "Pharmacy" ? "s" : item.name === "Blood Bank" ? "s" : item.name === "Police Station" ? "s" : "")}</option>
                      )}
                    </select>
                  </div>
                  <div className="col-lg-3 col-md-3">
                    <button type="submit" className="btn btn-danger btn-lg w-100">Search</button>
                  </div>
                </div>
              </form>
              <div className="search-results mt-4" aria-live="polite">
                {searchMessage ? (
                  <div className={`alert ${searchMessage.type === "error" ? "alert-danger" : "alert-success"}`} role="status">
                    <h5 className="alert-heading">{searchMessage.type === "error" ? "Please Check Your Input" : "Search Request Accepted"}</h5>
                    <p className="mb-0">{searchMessage.text}</p>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon">🔎</div>
                    <h5>No resources loaded yet</h5>
                    <p>Emergency-resource data will appear here after the backend and database are connected.</p>
                  </div>
                )}
                {searchHistory.length > 0 && (
                  <p className="history-note small text-muted mb-0">
                    Valid search requests in this session: {searchHistory.length}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <span className="section-label">About QuickResQ</span>
                <h2>Emergency Information, <span>In One Place.</span></h2>
                <p>During an emergency, finding the right service quickly can be difficult. Information may be scattered across different platforms.</p>
                <p>QuickResQ is designed as a focused platform where users can search for important emergency resources using categories and search options.</p>
                <div className="about-points">
                  <div className="about-point"><span>✓</span> Emergency-focused searching</div>
                  <div className="about-point"><span>✓</span> Category-based resource discovery</div>
                  <div className="about-point"><span>✓</span> Dynamic database integration</div>
                  <div className="about-point"><span>✓</span> Future location-based search</div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-card">
                  <div className="about-card-icon">+</div>
                  <h3>Built for Quick Access</h3>
                  <p>The application is planned as a full-stack web application using a frontend, REST API backend and database.</p>
                  <div className="technology-list">
                    <span>HTML5</span><span>CSS3</span><span>Bootstrap</span><span>React</span><span>Node.js</span><span>MongoDB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="container">
            <div className="contact-box text-center">
              <span className="section-label">Need Help?</span>
              <h2>Have a Question?</h2>
              <p>Contact support for questions or feedback regarding QuickResQ.</p>
              <button className="btn btn-light btn-lg" onClick={showContactMessage}>Contact Support</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="footer-logo"><span>+</span> QuickResQ</div>
              <p>An emergency resource finder designed to help users access important emergency information quickly.</p>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5>Quick Links</h5>
              <a href="#home">Home</a><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5>Services</h5>
              <a href="#services">Hospitals</a><a href="#services">Pharmacies</a><a href="#services">Blood Banks</a><a href="#services">Police Stations</a>
            </div>
          </div>
          <hr />
          <div className="footer-bottom">
            <p>© 2026 QuickResQ. All rights reserved.</p>
            <p>Emergency Resource Finder</p>
          </div>
        </div>
      </footer>

      {loginOpen && (
        <div className="modal-backdrop-custom" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setLoginOpen(false);
        }}>
          <div className="modal-dialog modal-dialog-centered" role="dialog" aria-modal="true" aria-labelledby="loginModalLabel">
            <div className="modal-content login-modal">
              <div className="modal-header">
                <h5 className="modal-title" id="loginModalLabel">
                  {authMode === "signup" ? "Create Your QuickResQ Account" : authMode === "forgot" ? "Reset Your Password" : "Login to QuickResQ"}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setLoginOpen(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAuthSubmit} noValidate>
                  {authMode === "signup" && (
                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                      <input type="text" id="fullName" className="form-control" placeholder="Enter your full name"
                        value={fullName} onChange={(event) => setFullName(event.target.value)} />
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input type="email" id="email" className="form-control" placeholder="Enter your email"
                      value={email} onChange={(event) => setEmail(event.target.value)} />
                  </div>

                  {authMode !== "forgot" && (
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input type="password" id="password" className="form-control" placeholder="At least 6 characters"
                        value={password} onChange={(event) => setPassword(event.target.value)} />
                    </div>
                  )}

                  {authMode === "signup" && (
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <input type="password" id="confirmPassword" className="form-control" placeholder="Re-enter your password"
                        value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    </div>
                  )}

                  {loginMessage && (
                    <div className={`alert ${loginMessage.type === "error" ? "alert-danger" : "alert-success"}`} role="alert">
                      {loginMessage.text}
                    </div>
                  )}

                  <button type="submit" className="btn btn-danger w-100">
                    {authMode === "signup" ? "Create Account" : authMode === "forgot" ? "Send Reset Instructions" : "Login"}
                  </button>
                </form>

                <div className="auth-links">
                  {authMode === "login" && (
                    <>
                      <button type="button" className="auth-link" onClick={() => changeAuthMode("forgot")}>Forgot password?</button>
                      <p className="auth-switch-text">Don't have an account? <button type="button" className="auth-link" onClick={() => changeAuthMode("signup")}>Sign up</button></p>
                    </>
                  )}
                  {authMode === "signup" && (
                    <p className="auth-switch-text">Already have an account? <button type="button" className="auth-link" onClick={() => changeAuthMode("login")}>Login</button></p>
                  )}
                  {authMode === "forgot" && (
                    <p className="auth-switch-text">Remembered your password? <button type="button" className="auth-link" onClick={() => changeAuthMode("login")}>Back to login</button></p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
