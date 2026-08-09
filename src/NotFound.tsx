// Route: * (catch-all / 404)
import React, { useState } from "react";
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
import { Bars3Icon, BellIcon, XMarkIcon, HomeIcon, LinkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

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

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error reading stored user:", error);
    return null;
  }
};

const NotFound: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser());
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

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
        <section className="sl-notfound">
          <div className="sl-grid-overlay" aria-hidden="true" />
          <div
            className="sl-orb sl-orb--green"
            style={{ width: 460, height: 460, top: "-10%", left: "50%", transform: "translateX(-50%)" }}
            aria-hidden="true"
          />

          <div className="sl-notfound-content">
            <p className="sl-notfound-code">404</p>
            <h1 className="sl-notfound-title">We looked everywhere</h1>
            <p className="sl-notfound-text">
              Oops, it seems like you&apos;ve bumped into a route that
              doesn&apos;t exist. Let&apos;s get you back on track.
            </p>
            <div className="sl-notfound-actions">
              <Link to="/" className="sl-btn sl-btn--primary">
                <HomeIcon width={18} height={18} /> Go back home
              </Link>
              <Link to="/links" className="sl-btn sl-btn--ghost">
                <LinkIcon width={18} height={18} /> View your links
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NotFound;