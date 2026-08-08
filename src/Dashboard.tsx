// File: src/Dashboard.tsx
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
import {
  PlusCircleIcon,
  FolderIcon,
  LinkIcon,
  ChartBarIcon,
  QrCodeIcon,
  PencilSquareIcon,
  ArrowUpRightIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Loading from "./Loading";
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

const navigation = (isLoggedIn: boolean) => [
  { name: "Home", href: "/", current: false },
  { name: "Dashboard", href: "/dashboard", current: true },
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

type DashTile = {
  to: string;
  icon: React.ElementType;
  title: string;
  text: string;
  primary?: boolean;
};

const primaryTiles: DashTile[] = [
  {
    to: "/create-link",
    icon: PlusCircleIcon,
    title: "Create New Link",
    text: "Shorten a URL and get a shareable link in seconds.",
    primary: true,
  },
  {
    to: "/links",
    icon: FolderIcon,
    title: "View All Saved Links",
    text: "Browse, search, and manage everything you've created.",
  },
  {
    to: "/create-link",
    icon: LinkIcon,
    title: "Shorten a Link",
    text: "Turn a long URL into a clean, memorable one.",
  },
];

const secondaryTiles: DashTile[] = [
  {
    to: "/links",
    icon: ChartBarIcon,
    title: "View Links Analytics",
    text: "See clicks and performance across your links.",
  },
  {
    to: "/create-link",
    icon: QrCodeIcon,
    title: "Generate QR Code for Links",
    text: "Create a scannable QR code for any link you own.",
  },
  {
    to: "/links",
    icon: PencilSquareIcon,
    title: "Edit Saved Links",
    text: "Update aliases, destinations, and link details.",
  },
];

const Dashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <Loading />;
  }

  const avatarSrc =
    isLoggedIn && user && user.profileImg
      ? user.profileImg
      : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const renderTile = (tile: DashTile, key: string) => {
    const Icon = tile.icon;
    return (
      <Link
        to={tile.to}
        key={key}
        className={classNames("sl-dash-tile", tile.primary && "sl-dash-tile--primary")}
      >
        <ArrowUpRightIcon className="sl-dash-tile-arrow" aria-hidden="true" />
        <div className="sl-dash-tile-icon">
          <Icon aria-hidden="true" />
        </div>
        <div>
          <div className="sl-dash-tile-title">{tile.title}</div>
          <div className="sl-dash-tile-text">{tile.text}</div>
        </div>
      </Link>
    );
  };

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
        {/* Welcome header                                                */}
        {/* -------------------------------------------------------------- */}
        <section className="sl-dash-hero">
          <div className="sl-grid-overlay" aria-hidden="true" />
          <div
            className="sl-orb sl-orb--green"
            style={{ width: 420, height: 420, top: "-20%", right: "-10%" }}
            aria-hidden="true"
          />
          <div className="sl-container">
            <div className="sl-dash-hero-row">
              <div>
                <span className="sl-eyebrow">Dashboard</span>
                <h1 className="sl-dash-hero-title">
                  {isLoggedIn && user
                    ? `Welcome back, ${user.firstName}.`
                    : "Hi there, welcome to Scissors."}
                </h1>
                <p className="sl-dash-hero-sub">
                  {isLoggedIn
                    ? "What would you like to do on Scissors today?"
                    : "Here's what you can do on Scissors."}
                </p>
              </div>
              <Link to="/create-link" className="sl-btn sl-btn--primary">
                <PlusCircleIcon width={18} height={18} /> New link
              </Link>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* Action tiles                                                  */}
        {/* -------------------------------------------------------------- */}
        <section className="sl-dash-section">
          <div className="sl-container">
            <p className="sl-dash-section-title">Create &amp; manage</p>
            <div className="sl-dash-grid">
              {primaryTiles.map((tile, i) => renderTile(tile, `primary-${i}`))}
            </div>

            <p className="sl-dash-section-title" style={{ marginTop: 40 }}>
              Analyze &amp; brand
            </p>
            <div className="sl-dash-grid">
              {secondaryTiles.map((tile, i) => renderTile(tile, `secondary-${i}`))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;