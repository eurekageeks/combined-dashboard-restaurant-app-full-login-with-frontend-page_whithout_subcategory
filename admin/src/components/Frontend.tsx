import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";


interface Business {
  _id: string;
  image?: string | null;
  category: string;
  sub_category: string;
}

const categories = [
  { name: "All", icon: "✨" },
  { name: "Healthcare", icon: "💙" },
  { name: "Home Services", icon: "🧰" },
  { name: "Education & Training", icon: "🎓" },
  { name: "Food", icon: "🍴" },
];

const Frontend: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const navigate = useNavigate();
  /* ---------------- RESPONSIVE CAROUSEL ---------------- */
  const getChipsPerSlide = () => {
    if (window.innerWidth < 576) return 1;
    if (window.innerWidth < 768) return 2;
    return 3;
  };

  const [chipsPerSlide, setChipsPerSlide] = useState(getChipsPerSlide());
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const onResize = () => setChipsPerSlide(getChipsPerSlide());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const slides: typeof categories[] = [];
  for (let i = 0; i < categories.length; i += chipsPerSlide) {
    slides.push(categories.slice(i, i + chipsPerSlide));
  }
  /* ---------------------------------------------------- */

  const ADMIN_BACKEND =
    import.meta.env.VITE_ADMIN_BACKEND_URL || "http://127.0.0.1:9000";

  const ADMIN_FRONTEND_LOGIN =
    import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173/login";

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await axios.get(`${ADMIN_BACKEND}/api/admin/businesses`);
      setBusinesses(res.data);
    } catch {
      setError("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };
const [navOpen, setNavOpen] = useState(false);

  const filteredBusinesses = businesses.filter((b) => {
    const matchesSearch =
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sub_category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      b.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  if (loading)
    return <div className="text-center py-5">Loading businesses...</div>;

  if (error)
    return <div className="text-center text-danger py-5">{error}</div>;

  return (
    <div style={{ background: "#f7f9fc", minHeight: "100vh" }}>
     {/* NAVBAR */}
{/* NAVBAR */}
<nav className="navbar bg-white shadow-sm rounded-pill mx-2 mx-md-4 mt-3 px-3 px-md-4">
  <div className="container-fluid">

    {/* LEFT: BRAND */}
    <div className="d-flex align-items-center gap-2">
      <img
        src="src/assets/qr.png"
        alt="GWT-QR Logo"
        style={{ height: 32, width: 32 }}
      />
      <span className="fw-bold text-primary fs-4">GWT-QR</span>
    </div>

    {/* MOBILE TOGGLER */}
    <button
      className="btn d-md-none"
      onClick={() => setNavOpen(!navOpen)}
      aria-label="Toggle navigation"
    >
      ☰
    </button>

    {/* CENTER LINKS + RIGHT LOGIN */}
    <div
      className={`${
        navOpen ? "d-flex" : "d-none"
      } d-md-flex flex-column flex-md-row align-items-center gap-3 gap-md-4 ms-md-auto`}
    >
      <span className="text-muted">Categories</span>
      <span className="text-muted">Add Business</span>
      <span className="text-muted">About</span>

      {/* RIGHT: LOGIN */}
      <button
        className="btn btn-primary rounded-pill px-4 ms-md-3"
        onClick={() => (window.location.href = ADMIN_FRONTEND_LOGIN)}
      >
        Log in
      </button>
    </div>

  </div>
</nav>



      {/* HERO */}
      <div className="container text-center mt-5">
        <h1 className="fw-bold display-6">Find Trusted Services Near You</h1>
        <p className="text-muted">
          Healthcare, Home services, Education & Training & more — verified local businesses.
        </p>

        {/* SEARCH */}
        <div
          className="mx-auto bg-white shadow-sm rounded-pill d-flex align-items-center px-4"
          style={{ maxWidth: 700, height: 56 }}
        >
          🔍
          <input
            className="form-control border-0 ms-3"
            placeholder="Search Healthcare, Home services, Education & Training"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="ms-auto text-success fw-semibold text-nowrap d-none d-md-inline">
            📍 Near you
          </span>
        </div>

        {/* CATEGORY SLIDER */}
        <div className="position-relative mt-4 mx-auto" style={{ maxWidth: 520 }}>
          <div style={{ overflow: "hidden" }}>
            <div
              className="d-flex"
              style={{
                width: `${slides.length * 100}%`,
                transform: `translateX(-${
                  activeSlide * (100 / slides.length)
                }%)`,
                transition: "transform 0.4s ease",
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="d-flex justify-content-center gap-2"
                  style={{ width: `${100 / slides.length}%` }}
                >
                  {slide.map((c) => (
                    <span
                      key={c.name}
                    onClick={() => setSelectedCategory(c.name)}



                      className="px-3 py-2 rounded-pill shadow-sm fw-semibold"
                      style={{
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        background:
                          selectedCategory === c.name
                            ? "#0d6efd"
                            : "#fff",
                        color:
                          selectedCategory === c.name ? "#fff" : "#000",
                      }}
                    >
                      {c.icon} {c.name}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {activeSlide > 0 && (
            <button
              onClick={() => setActiveSlide((s) => s - 1)}
              className="btn btn-light rounded-circle shadow-sm"
              style={{
                position: "absolute",
                left: -12,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              ‹
            </button>
          )}

          {activeSlide < slides.length - 1 && (
            <button
              onClick={() => setActiveSlide((s) => s + 1)}
              className="btn btn-light rounded-circle shadow-sm"
              style={{
                position: "absolute",
                right: -12,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              ›
            </button>
          )}
        </div>
      </div>

      {/* BUSINESS CARDS */}
      <div className="container mt-5">
        <div className="row g-4">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((b) => (
              <div key={b._id} className="col-6 col-sm-3 col-md-2">
                <div
  className="card border-0 shadow-sm rounded-4 h-100"
  style={{ cursor: "pointer" }}
  onClick={() => {
    if (b.category.toLowerCase() === "healthcare") {
      navigate("/healthcare-directory");
    }
  }}
>

                  <img
                    src={
                      b.image
                        ? `${ADMIN_BACKEND}${b.image}`
                        : "https://via.placeholder.com/400x220"
                    }
                    className="card-img-top rounded-top-4"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                 <div className="card-body">
  <span
    className="badge bg-light text-primary mb-2 align-self-start mx-auto text-wrap"
    style={{ maxWidth: "100%" }}
  >
    {b.category}
  </span>
</div>

                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted py-5">
              No businesses found
            </div>
          )}
        </div>
      </div>
      {/* HOW IT WORKS */}
<section className="container my-5">
  <h2 className="text-center fw-bold mb-4">How it Works</h2>

  <div className="row g-4">
    <div className="col-md-4">
      <div className="bg-white shadow-sm rounded-4 p-4 h-100">
        <div className="d-flex align-items-start gap-3">
          <div className="fs-3">🔍</div>
          <div>
            <h6 className="fw-semibold mb-1">Search a service</h6>
            <p className="text-muted small mb-0">
              Clinics, kendra, Agra, Shamli
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="bg-white shadow-sm rounded-4 p-4 h-100">
        <div className="d-flex align-items-start gap-3">
          <div className="fs-3">📋</div>
          <div>
            <h6 className="fw-semibold mb-1">Compare nearby options</h6>
            <p className="text-muted small mb-0">
              Find trusted services near you
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="col-md-4">
      <div className="bg-white shadow-sm rounded-4 p-4 h-100">
        <div className="d-flex align-items-start gap-3">
          <div className="fs-3">📞</div>
          <div>
            <h6 className="fw-semibold mb-1">Contact instantly</h6>
            <p className="text-muted small mb-0">
              Connect with businesses anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

   {/* TRUST SECTION */}
<section className="container my-5">
  <div className="bg-light rounded-4 p-5 shadow-sm">
    <div className="row text-center g-4">
      <div className="col-md-4">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span className="fs-4">✅</span>
          <span className="fw-semibold">Verified Businesses</span>
        </div>
      </div>

      <div className="col-md-4">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span className="fs-4">⭐</span>
          <span className="fw-semibold">Genuine Reviews</span>
        </div>
      </div>

      <div className="col-md-4">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <span className="fs-4">📍</span>
          <span className="fw-semibold">Local & Reliable</span>
        </div>
      </div>
    </div>
  </div>
</section>


     {/* FOOTER */}
<footer className="container mt-5 py-4 border-top">
  <div className="row align-items-center text-center text-md-start">
    <div className="col-md-3 fw-bold text-primary">
      GWT-QR
    </div>

    <div className="col-md-6 d-flex justify-content-center gap-4 text-muted small my-3 my-md-0">
      <span>About GWT-QR</span>
      <span>Contact</span>
      <span>Privacy Policy</span>
      <span>Terms</span>
    </div>

    <div className="col-md-3 d-flex justify-content-center justify-content-md-end gap-2">
      <span>📘</span>
      <span>🐦</span>
      <span>🔗</span>
    </div>
  </div>

  <div className="text-center text-muted small mt-3">
    © 2024 GWT-QR
  </div>
</footer>
    </div>
  );
};

export default Frontend;
