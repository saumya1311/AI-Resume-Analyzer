import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { supabase } from "~/lib/supabase";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [userInitial, setUserInitial] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  // Restore dark mode preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserInitial(session.user.email[0].toUpperCase());
      }
    });
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserInitial(null);
    setShowMenu(false);
    navigate("/");
  };

  return (
    <nav className="navbar relative">
      {/* Logo */}
      <Link to="/">
        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a5b4fc] to-[#606beb]">ApplyWise</p>
      </Link>

      {/* Right side actions */}
      <div className="flex flex-row items-center gap-4">

        {/* Upload Resume */}
        <Link to="/upload" className="primary-button w-fit">
          Upload Resume
        </Link>

        {/* Avatar / Auth icon */}
        <div className="relative">
          {userInitial ? (
            /* Logged in: click avatar to log out directly */
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 hover:opacity-80"
              style={{ background: "linear-gradient(to bottom, #8e98ff, #606beb)" }}
              title="Log Out"
            >
              <span className="text-white text-sm font-bold">{userInitial}</span>
            </button>
          ) : (
            /* Logged out: person icon → /auth */
            <button
              onClick={() => navigate("/auth")}
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
              style={{ background: "linear-gradient(to bottom, #8e98ff, #606beb)" }}
              title="Sign In"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDark}
          className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105"
          style={isDark
            ? { background: "#374151" }  /* dark gray in dark mode */
            : { background: "linear-gradient(to bottom, #8e98ff, #606beb)" } /* purple gradient in light mode */
          }
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            /* Solid yellow sun in dark mode */
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="2" x2="12" y2="4" />
                <line x1="12" y1="20" x2="12" y2="22" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="2" y1="12" x2="4" y2="12" />
                <line x1="20" y1="12" x2="22" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </g>
            </svg>
          ) : (
            /* Solid white moon in light mode */
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

