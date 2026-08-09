// Route: /link/:id
import React, { useEffect, useState } from "react";
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
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  ArrowLeftIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import Loading from "./Loading";
import { Link, useParams } from "react-router-dom";
import useWindowWidth from "./useWindowWidth";
import TruncatedWord from "./TruncatedWord";
import Confirm from "./Confirm";
import SmallLoading from "./SmallLoading";
import axios from "axios";
import { logEvent } from "firebase/analytics";
import { analytics } from "./firebaseConfig";
import AnalyticsDashboard from "./Analytics";
import Footer from "./Footer";

interface User {
  firstName: string;
  lastName: string;
  id: string;
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
interface Domain {
  id: string;
  domain: string;
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

const LinkDetails: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser());
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const [smallLoading, setSmallLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [link, setLink] = useState<LinkProps | null>(null);
  const [customDomains, setCustomDomains] = useState<Domain[]>([]);
  const [copied, setCopied] = useState(false);

  const handleCopyClick = async (id: string) => {
    try {
      const link = links.find((link) => link.id === id);
      if (!link) {
        throw new Error("Link not found");
      }

      const textToCopy = link.customLink || link.shortenedLink;
      await navigator.clipboard.writeText(textToCopy);
      console.log(textToCopy);
      setMessage("You have successfully copied the link.");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error("Failed to copy: ", err);
      setMessage("Oops!! Could not copy the link.");
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

  const userPassword = user?.password;

  const handleDelete = async (enteredPassword: string) => {
    if (isLoggedIn) {
      if (enteredPassword === user?.password) {
        try {
          const response = await fetch(
            `https://app-scissors-api.onrender.com/users/${userId}/links/${id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          setLink(null);
          setLinks([]);
          const link = links.find((link) => link.id === id);
          const customLink = link?.customLink || "";
          const domain = removeProtocol(customLink);
          removeDomain(domain);
          setIsModalOpen(false);
          setMessage(`You have successfully deleted the link with ID ${id}.`);
          console.log("Link deleted successfully");
        } catch (error) {
          setIsModalOpen(false);
          console.error("Error deleting link:", error);
          setMessage("Oops!! Could not delete the link.");
        }
      } else {
        setIsModalOpen(false);
        setMessage("Incorrect password. Please try again.");
      }
    } else {
      const links = localStorage.getItem("links");
      if (links) {
        const linksArray = JSON.parse(links);
        const updatedLinks = linksArray.filter(
          (link: LinkProps) => link.id !== id
        );
        setIsModalOpen(false);
        setLink(null);
        setLinks([]);
        localStorage.setItem("links", JSON.stringify(updatedLinks));
        setMessage(`You have successfully deleted the link with ID ${id}.`);
        console.log(`Removed link with ID ${id}`);
      } else {
        setMessage("Oops!! Could not delete the link.");
      }
    }
  };

  const userId = user?.id;
  useEffect(() => {
    const fetchLinkDetails = async () => {
      setSmallLoading(true);
      if (isLoggedIn) {
        try {
          const userId = user?.id;
          const response = await fetch(
            `https://app-scissors-api.onrender.com/users/${userId}/links/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          console.log(data || null);
          setLink(data);
        } catch (error) {
          console.error("Error fetching link details from database:", error);
        }
      } else {
        const links: LinkProps[] = JSON.parse(
          localStorage.getItem("links") || "[]"
        );
        const foundLink = links.find((link) => link.id === id);
        setLink(foundLink || null);
      }
      setLoading(false);
      setSmallLoading(false);
    };

    fetchLinkDetails();

    logEvent(analytics, "view_link_details", {
      link_id: id,
    });
  }, [id, isLoggedIn, userId]);

  const windowWidth = useWindowWidth();

  const getMaxLength = (width: number): number => {
    if (width >= 1250) return 50;
    if (width >= 1170) return 40;
    if (width >= 690) return 30;
    if (width >= 460) return 20;
    if (width >= 350) return 15;

    return 10;
  };
  const getOtherMaxLinkLength = (width: number): number => {
    if (width >= 1000) return 60;
    if (width >= 768) return 40;
    if (width >= 650) return 50;
    if (width >= 500) return 40;
    if (width >= 400) return 30;

    return 20;
  };
  const getMaxLinkLength = (width: number): number => {
    if (width >= 800) return 35;
    if (width >= 760) return 30;
    if (width >= 600) return 40;
    if (width >= 500) return 40;
    if (width >= 400) return 30;

    return 20;
  };

  const maxLength = getMaxLength(windowWidth);

  const maxLinkLength = getMaxLinkLength(windowWidth);
  const maxOtherLinkLength = getOtherMaxLinkLength(windowWidth);
  const removeProtocol = (url: string) => {
    return url.replace(/^https?:\/\//, "");
  };
  const removeDomain = async (domain: string) => {
    try {
      const response = await axios.delete(
        "https://app-scissors-api.onrender.com/remove-domain",
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: { domain },
        }
      );

      if (response.data.success) {
        setCustomDomains(response.data.domains);
        const cleanedDomain = removeProtocol(domain);
        return !customDomains.some((d) => d.domain === cleanedDomain);
      }
    } catch (error) {
      console.error("Error removing domain:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchLinks();
    } else {
      fetchLinksFromLocalStorage();
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

  const handleDownload = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const link = document.createElement("a");
    link.href = (event.currentTarget as HTMLAnchorElement).href;
    link.download = `${link.title}_qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (link) {
      setMessage("Your download has started succesfully.");
    } else {
      setMessage("Oops, An error occurred while downloading the qrcode.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "/dashboard";
    setIsLoggedIn(false);
    setUser(null);
  };

  const avatarSrc =
    isLoggedIn && user && user.profileImg
      ? user.profileImg
      : "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  if (loading) {
    return <Loading />;
  }

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

      {message && (
        <div className="sl-toast-wrap" style={{ opacity: isFadingOut ? 0 : 1 }}>
          <div className="sl-toast">{message}</div>
        </div>
      )}

      <main>
        <section className="sl-page-hero" style={{ paddingBottom: 8 }}>
          <div className="sl-grid-overlay" aria-hidden="true" />
          <div
            className="sl-orb sl-orb--green"
            style={{ width: 380, height: 380, top: "-18%", right: "-10%" }}
            aria-hidden="true"
          />
          <div className="sl-container">
            <Link to="/links" className="sl-back-link">
              <ArrowLeftIcon aria-hidden="true" /> Back to list
            </Link>
          </div>
        </section>

        <section className="sl-page-section" style={{ paddingTop: 0 }}>
          <div className="sl-container" style={{ maxWidth: 900 }}>
            <Confirm
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onDelete={handleDelete}
              isLoggedIn={isLoggedIn}
              id={link?.id}
              setMessage={setMessage}
              userPassword={userPassword}
            />

            {smallLoading ? (
              <div className="sl-loading-panel" style={{ minHeight: 400 }}>
                <SmallLoading />
              </div>
            ) : link ? (
              <div>
                <div className="sl-detail-card">
                  <h1 className="sl-detail-title">
                    <TruncatedWord word={link.title} maxLength={maxLength} />
                  </h1>
                  <div className="sl-detail-head-row">
                    <img
                      src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.mainLink}&size=32`}
                      className="sl-detail-favicon"
                      alt=""
                      aria-hidden="true"
                    />
                    <div className="sl-detail-links">
                      <a
                        href={link.mainLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TruncatedWord
                          word={link.mainLink}
                          maxLength={maxOtherLinkLength}
                        />
                      </a>
                      {link.customLink ? (
                        <a
                          href={link.customLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <TruncatedWord
                            word={link.customLink}
                            maxLength={maxOtherLinkLength}
                          />
                        </a>
                      ) : (
                        <a
                          href={link.shortenedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <TruncatedWord
                            word={link.shortenedLink}
                            maxLength={maxOtherLinkLength}
                          />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="sl-detail-foot-row">
                    <div className="sl-detail-date">
                      <CalendarIcon aria-hidden="true" />
                      {new Date(link.createdAt).toLocaleString()}
                    </div>
                    <div className="sl-detail-actions">
                      <button
                        className="sl-icon-btn"
                        onClick={() => handleCopyClick(link.id)}
                      >
                        {copied ? (
                          <CheckIcon aria-hidden="true" />
                        ) : (
                          <DocumentDuplicateIcon aria-hidden="true" />
                        )}
                        <span>{copied ? "Copied" : "Copy"}</span>
                      </button>
                      <Link to={`/edit-link/${link.id}`}>
                        <button
                          className="sl-icon-btn sl-icon-btn--square"
                          aria-label="Edit link"
                        >
                          <PencilSquareIcon aria-hidden="true" />
                        </button>
                      </Link>
                      <button
                        className="sl-icon-btn sl-icon-btn--square"
                        aria-label="Delete link"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <TrashIcon aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="sl-detail-card">
                  <div className="sl-detail-grid">
                    <div>
                      <p className="sl-detail-label">Original link</p>
                      <a
                        className="sl-detail-row-value"
                        href={link.mainLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TruncatedWord
                          word={link.mainLink}
                          maxLength={maxLinkLength}
                        />
                      </a>

                      <p className="sl-detail-label">Shortened link</p>
                      <a
                        className="sl-detail-row-value"
                        href={link.shortenedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TruncatedWord
                          word={link.shortenedLink}
                          maxLength={maxLinkLength}
                        />
                      </a>

                      {link.customLink && (
                        <>
                          <p className="sl-detail-label">Custom link</p>
                          <a
                            className="sl-detail-row-value"
                            href={link.customLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <TruncatedWord
                              word={link.customLink}
                              maxLength={maxLinkLength}
                            />
                          </a>
                        </>
                      )}
                    </div>

                    <div>
                      <p className="sl-detail-qr-title">QR code</p>
                      {link.qrcode ? (
                        <>
                          <div className="sl-detail-qr-box">
                            <img src={link.qrcode} alt="QR Code" style={{ maxWidth: "100%" }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                            <a
                              className="sl-btn sl-btn--primary sl-btn--sm"
                              href={link.qrcode}
                              download={`${link.title}_qrcode.png`}
                              onClick={handleDownload}
                            >
                              <ArrowDownTrayIcon aria-hidden="true" /> Download
                            </a>
                          </div>
                        </>
                      ) : (
                        <p className="sl-detail-qr-empty">
                          No QR code found with this link.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="sl-detail-card" style={{ marginBottom: 40 }}>
                  <p className="sl-detail-analytics-title">Analytics</p>
                  <AnalyticsDashboard linkId={link.id} />
                </div>
              </div>
            ) : (
              <div className="sl-empty-panel">
                <p className="sl-empty-panel-text">
                  Oops!!! There is no link associated with this ID. The link
                  may have been deleted or may not exist.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LinkDetails;