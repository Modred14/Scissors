// Route: /links
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
  CalendarIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import TruncatedWord from "./TruncatedWord";
import useWindowWidth from "./useWindowWidth";
import LinkOptions from "./LinkOptions";
import SmallLoading from "./SmallLoading";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profileImg: string;
  password: string;
}
type LinkProps = {
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
  { name: "Links", href: "/links", current: true },
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

const Links: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser());
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [smallLoading, setSmallLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyClick = async (index: number) => {
    try {
      const textToCopy = links[index].customLink || links[index].shortenedLink;
      await navigator.clipboard.writeText(textToCopy);
      console.log(textToCopy);
      setMessage("You have successfully copied the link.");
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((i) => (i === index ? null : i)), 1600);
    } catch (err) {
      console.error("Failed to copy: ", err);
      setMessage("Oops!! Couldn't copy the link.");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => setMessage(""), 500);
      }, 4500);

      return () => {
        clearTimeout(timer);
        setIsFadingOut(false);
      };
    }
  }, [message]);

  useEffect(() => {
    if (!isLoggedIn) {
      fetchLinksFromLocalStorage();
    }
  }, []);

  const windowWidth = useWindowWidth();

  const getMaxLength = (width: number): number => {
    if (width >= 1300) return 80;
    if (width >= 1160) return 65;
    if (width >= 790) return 55;
    if (width >= 680) return 45;
    if (width >= 510) return 35;
    if (width >= 370) return 22;

    return 18;
  };

  const maxLength = getMaxLength(windowWidth);

  const getMaxLinkLength = (width: number): number => {
    if (width >= 1250) return 84;
    if (width >= 1100) return 74;
    if (width >= 750) return 60;
    if (width >= 600) return 49;
    if (width >= 470) return 35;
    if (width >= 370) return 27;
    return 23;
  };
  const maxLinkLength = getMaxLinkLength(windowWidth);

  useEffect(() => {
    if (isLoggedIn) {
      fetchLinks();
    }
  }, [isLoggedIn]);

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
      setSmallLoading(false);
    }
  };

  const fetchLinksFromLocalStorage = () => {
    setSmallLoading(true);
    const storedLinks: LinkProps[] = JSON.parse(
      localStorage.getItem("links") || "[]"
    );
    setLinks(storedLinks);
    setSmallLoading(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "/dashboard";
    setIsLoggedIn(false);
    setUser(null);
  };
  if (typeof links.length === "undefined") {
    setSmallLoading(true);
    handleSignOut();
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
                {isLoggedIn ? (
                  <>
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
                        <MenuItem>
                          <a href="#" className="sl-menu-item" onClick={handleSignOut}>
                            Sign out
                          </a>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </>
                ) : (
                  <Link to="/signup" className="sl-btn sl-btn--primary sl-btn--sm sl-nav-cta">
                    Get Started
                  </Link>
                )}

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

      {message && (
        <div
          className="sl-toast-wrap"
          style={{ opacity: isFadingOut ? 0 : 1 }}
        >
          <div className="sl-toast">
            <CheckIcon aria-hidden="true" />
            {message}
          </div>
        </div>
      )}

      <main>
        {/* -------------------------------------------------------------- */}
        {/* Page header                                                   */}
        {/* -------------------------------------------------------------- */}
        <section className="sl-page-hero">
          <div className="sl-grid-overlay" aria-hidden="true" />
          <div
            className="sl-orb sl-orb--green"
            style={{ width: 380, height: 380, top: "-18%", right: "-10%" }}
            aria-hidden="true"
          />
          <div className="sl-container">
            <div className="sl-page-hero-row">
              <div>
                <span className="sl-eyebrow">Links</span>
                <h1 className="sl-page-title">Your links</h1>
                <p className="sl-page-sub">
                  Every link you&apos;ve created, in one place. Track, copy,
                  edit, or remove them any time.
                </p>
              </div>
              <Link to="/create-link" className="sl-btn sl-btn--primary">
                <PlusCircleIcon width={18} height={18} /> New link
              </Link>
            </div>
          </div>
        </section>

        {!isLoggedIn && (
          <div
            className={classNames(
              "sl-usage-badge",
              links.length >= 3 && "sl-usage-badge--full"
            )}
            style={{ position: "fixed", left: 20, bottom: 20, zIndex: 1400 }}
          >
            Used: <span className="sl-usage-badge-count">{links.length}/3</span>
          </div>
        )}

        {/* -------------------------------------------------------------- */}
        {/* Links list                                                    */}
        {/* -------------------------------------------------------------- */}
        <section className="sl-page-section">
          <div className="sl-container">
            <p className="sl-dash-section-title">Active ({links.length})</p>

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
                  .map((link: LinkProps, index: number) => (
                    <li key={link.id} className="sl-link-row">
                      <div className="sl-link-row-main">
                        <img
                          src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.mainLink}&size=32`}
                          className="sl-link-favicon"
                          alt=""
                          aria-hidden="true"
                        />
                        <div style={{ minWidth: 0 }}>
                          <Link to={`/link/${link.id}`} className="sl-link-title">
                            <TruncatedWord word={link.title} maxLength={maxLength} />
                          </Link>
                          <a
                            className="sl-link-url"
                            href={link.mainLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <TruncatedWord
                              word={link.mainLink}
                              maxLength={maxLinkLength}
                            />
                          </a>
                          <a
                            className="sl-link-short"
                            href={link.customLink || link.shortenedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <TruncatedWord
                              word={link.customLink || link.shortenedLink}
                              maxLength={maxLinkLength}
                            />
                          </a>
                          <div className="sl-link-date">
                            <CalendarIcon aria-hidden="true" />
                            {new Date(link.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="sl-link-actions">
                        <button
                          className="sl-icon-btn"
                          onClick={() => handleCopyClick(index)}
                        >
                          {copiedIndex === index ? (
                            <CheckIcon aria-hidden="true" />
                          ) : (
                            <DocumentDuplicateIcon aria-hidden="true" />
                          )}
                          <span>{copiedIndex === index ? "Copied" : "Copy"}</span>
                        </button>
                        <Link to={`/edit-link/${link.id}`}>
                          <button
                            className="sl-icon-btn sl-icon-btn--square"
                            aria-label="Edit link"
                          >
                            <PencilSquareIcon aria-hidden="true" />
                          </button>
                        </Link>
                        <LinkOptions
                          id={link.id}
                          userId={user?.id ?? ""}
                          isLoggedIn={isLoggedIn}
                          setMessage={setMessage}
                          customLink={link.customLink}
                          userPassword={user?.password ?? " "}
                          smallLoading={smallLoading}
                          setSmallLoading={setSmallLoading}
                          setLinks={setLinks}
                        />
                      </div>
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

            {links.length > 0 && (
              <div className="sl-list-end">
                -- You&apos;ve reached the end of your links --
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Links;