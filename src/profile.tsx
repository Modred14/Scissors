// File: src/profile.tsx
import React, { useEffect, useState } from "react";
import "./style.css";
import "./landing.css";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { LockClosedIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import TruncatedWord from "./TruncatedWord";
import useWindowWidth from "./useWindowWidth";
import SmallLoading from "./SmallLoading";
import Footer from "./Footer";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
  links: string[];
}

type Link = {
  title: string;
  id: string;
  mainLink: string;
  shortenedLink: string;
  qrcode: string;
  customLink: string;
  clicks: number;
  visits: number;
  createdAt: string;
};

const navigation = (isLoggedIn: boolean) => [
  { name: "Home", href: "/", current: false },
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Links", href: "/links", current: false },
  ...(!isLoggedIn
    ? [
        { name: "Sign In", href: "/login", current: false },
        { name: "Sign Up", href: "/signup", current: false },
      ]
    : []),
];

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const Profile: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [smallLoading, setSmallLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchLinks();
    }
  }, [isLoggedIn]);

  const windowWidth = useWindowWidth();

  const getMaxLength = (width: number): number => {
    if (width >= 1300) return 70;

    if (width >= 1150) return 65;
    if (width >= 850) return 55;
    if (width >= 720) return 50;
    if (width >= 460) return 30;
    if (width >= 365) return 22;

    return 18;
  };

  const maxLength = getMaxLength(windowWidth);

  const fetchLinks = async () => {
    setSmallLoading(true);
    try {
      const userId = user?.id;
      const response = await fetch(
        `https://app-scissors-api.onrender.com/users/${userId}/links`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
      setSmallLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const storedUserData = localStorage.getItem("user");

      if (storedUserData) {
        const user = JSON.parse(storedUserData);
        setUser(user);
      } else {
        console.error("Failed to fetch user data or no user data found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };
  if (typeof links.length === "undefined") {
    setSmallLoading(true);
    handleSignOut();
  }
  if (loading) {
    return <Loading />;
  }

  const avatarSrc =
    isLoggedIn && user && user.profileImg
      ? user.profileImg
      : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <div className="sl">
      <div className="sl-noise" aria-hidden="true" />

      {/* ---------------------------------------------------------------- */}
      {/* Navigation                                                      */}
      {/* ---------------------------------------------------------------- */}
      <Disclosure as="div" className="sl-nav-wrap" style={{ zIndex: 1200 }}>
        {({ open }) => (
          <>
            <nav className="sl-nav" aria-label="Primary">
              <Link to="/" className="sl-nav-brand">
                <img alt="Scissors" src="/Scissors_logo.png" />
                Scissors
              </Link>

              <div className="sl-nav-links">
                {navigation(isLoggedIn).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={classNames(
                      "sl-nav-link",
                      item.current && "sl-nav-link--current"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="sl-nav-actions">
                <button
                  type="button"
                  className="sl-nav-icon-btn"
                  aria-label="View notifications"
                >
                  <BellIcon aria-hidden="true" />
                </button>

                <Menu as="div" style={{ position: "relative" }}>
                  <MenuButton className="sl-nav-avatar-btn">
                    <span className="sr-only">Open user menu</span>
                    <img alt="User profile" src={avatarSrc} className="sl-nav-avatar" />
                  </MenuButton>
                  <MenuItems transition className="sl-menu-items">
                    <MenuItem>
                      <Link to="/profile" className="sl-menu-item">
                        Your Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/settings" className="sl-menu-item">
                        Settings
                      </Link>
                    </MenuItem>
                    {isLoggedIn && (
                      <MenuItem>
                        <a href="#" className="sl-menu-item" onClick={handleSignOut}>
                          Sign out
                        </a>
                      </MenuItem>
                    )}
                  </MenuItems>
                </Menu>

                <DisclosureButton
                  className="sl-mobile-toggle"
                  aria-label="Toggle main menu"
                >
                  {open ? (
                    <XMarkIcon aria-hidden="true" />
                  ) : (
                    <Bars3Icon aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>
            </nav>

            <DisclosurePanel transition className="sl-mobile-panel">
              {navigation(isLoggedIn).map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className="sl-mobile-link"
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      <main>
        {/* -------------------------------------------------------------- */}
        {/* Page header                                                   */}
        {/* -------------------------------------------------------------- */}
        <section className="sl-page-hero">
          <div className="sl-grid-overlay" aria-hidden="true" />
          <div
            className="sl-orb sl-orb--green"
            style={{ width: 360, height: 360, top: "-18%", right: "-10%" }}
            aria-hidden="true"
          />
          <div className="sl-container">
            <span className="sl-eyebrow">Profile</span>
            <h1 className="sl-page-title">Your profile</h1>
            <p className="sl-page-sub">
              A quick look at your account details and the links you own.
            </p>
          </div>
        </section>

        <section className="sl-page-section">
          <div className="sl-container" style={{ maxWidth: 780 }}>
            {isLoggedIn ? (
              <div>
                <div className="sl-form-card">
                  <p className="sl-form-card-title">User details</p>

                  <div className="sl-avatar-row">
                    <div
                      className="sl-avatar-upload sl-avatar-upload--static"
                      style={{ backgroundImage: `url(${user?.profileImg})` }}
                      role="img"
                      aria-label={user?.firstName}
                    />
                    <div>
                      <p className="sl-avatar-row-name">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="sl-avatar-row-text">
                        This is how your account appears across Scissors.
                      </p>
                    </div>
                  </div>

                  <div className="sl-field-grid">
                    <div className="sl-field">
                      <label className="sl-label" htmlFor="firstName">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        disabled
                        type="text"
                        placeholder={user?.firstName}
                        value={user?.firstName}
                        className="sl-input"
                        readOnly
                      />
                    </div>
                    <div className="sl-field">
                      <label className="sl-label" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        disabled
                        type="text"
                        placeholder={user?.lastName}
                        value={user?.lastName}
                        className="sl-input"
                        readOnly
                      />
                    </div>
                    <div className="sl-field">
                      <label className="sl-label" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="email"
                        disabled
                        value={user?.email}
                        className="sl-input"
                        readOnly
                      />
                    </div>
                    <div className="sl-field">
                      <label className="sl-label" htmlFor="userId">
                        User Id
                      </label>
                      <input
                        id="userId"
                        disabled
                        type="text"
                        value={user?.id}
                        className="sl-input"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <p className="sl-dash-section-title">Links ({links.length})</p>

                {smallLoading ? (
                  <div className="sl-loading-panel">
                    <SmallLoading />
                  </div>
                ) : links.length > 0 ? (
                  <ul className="sl-link-list">
                    {links
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((link: Link) => (
                        <li key={link.id} className="sl-simple-link-row">
                          <Link to={`/link/${link.id}`} className="sl-link-title">
                            <TruncatedWord word={link.title} maxLength={maxLength} />
                          </Link>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <div className="sl-empty-panel">
                    <p className="sl-empty-panel-text">No link is available</p>
                    <Link to="/create-link" className="sl-btn sl-btn--primary">
                      <PlusCircleIcon width={18} height={18} /> Create new
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="sl-gate">
                <div className="sl-gate-icon">
                  <LockClosedIcon aria-hidden="true" />
                </div>
                <p className="sl-gate-text">
                  You need to log in or sign up first to view your profile
                  details.
                </p>
                <div className="sl-gate-actions">
                  <Link to="/login" className="sl-btn sl-btn--primary sl-btn--block">
                    Login
                  </Link>
                  <Link to="/signup" className="sl-btn sl-btn--ghost sl-btn--block">
                    Get Started ➔
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
export default Profile;