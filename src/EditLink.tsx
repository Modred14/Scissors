// Route: /edit-link/:id
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
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
  CameraIcon as CameraOutlineIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import UpdateModal from "./UpdateModal";
import { logEvent } from "firebase/analytics";
import { analytics } from "./firebaseConfig";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
  links: string[];
}

interface Link {
  id: string;
  title: string;
  mainLink: string;
  shortenedLink: string;
  qrcode: string;
  customLink: string;
  clicks: number;
  visits: string[];
  createdAt: string;
  qrcodeLogo: string;
  qrcodeColor: string;
}

interface Domain {
  id: string;
  domain: string;
}

const navigation = (isLoggedIn: boolean) => [
  { name: "Home", href: "/", current: false },
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Links", href: "/links", current: false },
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

const EditLink: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser());
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const [link, setLink] = useState<Partial<Link> | null>(null);
  const [longUrl, setLongUrl] = useState("");
  const [customLink, setCustomLink] = useState("");
  const [initialLink, setInitialLink] = useState("");
  const [smallLoading, setSmallLoading] = useState(true);
  const [shortenedLink, setShortenedLink] = useState("");
  const [message, setMessage] = useState("");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [color, setColor] = useState("#000000");
  const [logo, setLogo] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const [customDomains, setCustomDomains] = useState<Domain[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const validLongUrl = longUrl.includes(".") && /^https?:\/\//.test(longUrl);
  const validCustomLink = customLink.startsWith(
    "https://app-scissors-api.onrender.com/c/"
  );

  const removePrefix = (url: string): string => {
    const prefix = "https://app-scissors-api.onrender.com/c/";
    return url.startsWith(prefix) ? url.substring(prefix.length) : url;
  };

  const checkDomain = removePrefix(customLink);
  const invalidDomainLink = checkDomain.includes("/");

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

  const addDomain = async (domain: string) => {
    setSmallLoading(true);
    try {
      const id = Date.now().toString();
      const response = await axios.post(
        "https://app-scissors-api.onrender.com/add-domain",
        {
          id,
          domain,
        }
      );
      if (response.data.success) {
        setCustomDomains([...customDomains, { id, domain }]);
        logEvent(analytics, "domain_added", {
          domain: domain,
          userId: user?.id || "guest",
          addedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error adding domain:", error);
    } finally {
      setSmallLoading(false);
    }
  };

  const getDomain = async () => {
    setSmallLoading(true);
    try {
      const response = await axios.get(
        "https://app-scissors-api.onrender.com/get-domains"
      );
      if (response.status === 200) {
        const domains: Domain[] = response.data.domains;
        setCustomDomains(domains);
      }
    } catch (error) {
      console.error("Error fetching domains:", error);
    } finally {
      setSmallLoading(false);
    }
  };

  useEffect(() => {
    getDomain();
  }, []);

  useEffect(() => {
    setSmallLoading(true);
    if (validCustomLink) {
      const domainToCheck = removePrefix(customLink);
      console.log("Valid custom link without protocol:", domainToCheck);
      setSmallLoading(false);
    } else {
      setIsAvailable(null);
      setSmallLoading(false);
    }
  }, [customLink]);

  const userId = user?.id;
  const uniqueId = id;
  useEffect(() => {
    const fetchLinkData = async () => {
      if (isLoggedIn) {
        if (!userId) return;
        setLoading(true);
        try {
          const response = await axios.get(
            `https://app-scissors-api.onrender.com/users/${userId}/links/${id}`
          );
          const data = response.data;
          setLink(data);
          setLongUrl(data.mainLink || "");
          setCustomLink(data.customLink || "");
          setInitialLink(data.customLink || "");
          setShortenedLink(data.shortenedLink || "");
          setColor(data.qrcodeColor || "#000000");
          setLogo(data.qrcodeLogo || null);
        } catch (error) {
          console.error("Error fetching link data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        const links: Link[] = JSON.parse(localStorage.getItem("links") || "[]");
        const foundLink = links.find((link) => link.id === id);
        setLink(foundLink || null);
        setLongUrl(foundLink?.mainLink || "");
        setCustomLink(foundLink?.customLink || "");
        setShortenedLink(foundLink?.shortenedLink || "");
        setInitialLink(foundLink?.customLink || "");
        setColor(foundLink?.qrcodeColor || "#000000");
        setLogo(foundLink?.qrcodeLogo || null);
        setLoading(false);
      }
    };

    fetchLinkData();
  }, [userId, id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validLongUrl) {
      console.error("Invalid URL.");
      return;
    }

    if (customLink.length > 0) {
      const checkDomainAvailability = (domain: string) => {
        setSmallLoading(true);
        const cleanedDomain = removePrefix(domain);
        const isAvailable = !customDomains.some(
          (d) => d.domain === cleanedDomain
        );
        setSmallLoading(false);
        return isAvailable;
      };
      console.log(customLink);
      const available = checkDomainAvailability(customLink);
      if (available) {
        setIsAvailable(true);
      } else if (initialLink) {
        setIsAvailable(true);
      } else setIsAvailable(false);
      if (isAvailable === null) {
        setMessage("Please wait... Validating Domain");
        return;
      }
      if (!isAvailable) {
        setMessage(
          "Kindly enter another domain, the one you inputted is already occupied by another website."
        );
        return;
      }
      if (invalidDomainLink) {
        setMessage(`Oops, your custom domain can't contain any slashes ("/") except for the ones in ("https://").`);
        return;
      }
      if (initialLink) {
        setIsAvailable(true);
      } else if (!isAvailable) {
        setMessage(
          "Kindly enter another domain, the one you inputted is already occupied by another website."
        );
        return;
      } else if (smallLoading) {
        setMessage("Kindly wait for the custom domain to be validated.");
        return;
      } else {
        setIsAvailable(false);
        setMessage(
          "Kindly enter another domain, the one you inputted is already occupied by another website."
        );
        return;
      }

      const domain = removePrefix(customLink);
      if (!isAvailable) {
        setIsAvailable(false);
        setMessage(
          "Kindly enter another domain, the one you inputted is already occupied by another website."
        );
        return;
      } else {
        await addDomain(domain);
        setIsAvailable(true);
      }

      if (!validCustomLink) {
        console.error("Invalid URL.");
        setIsSubmitted(true);
        setIsAvailable(false);
        return;
      }
      let customLinkDomain = customLink;

      const responseData = await fetch(
        "https://app-scissors-api.onrender.com/api/urls/shortenCustom",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ longUrl, customLink: domain, uniqueId }),
        }
      );

      if (responseData.ok) {
        const data = await responseData.json();
        console.log(data.message);
        console.log(domain);
        customLinkDomain = `https://app-scissors-api.onrender.com/c/${domain}`;
        logEvent(analytics, "link_created", {
          userId: user?.id || "guest",
          longUrl: longUrl,
          shortenedLink: shortenedLink,
          customLink: customLinkDomain || "none",
          createdAt: new Date().toISOString(),
        });
      } else {
        const errorData = await responseData.json();
        console.log(errorData.message);
        console.log("Custom link error");
      }
    }

    setIsOpen(true);
  };
  const handleConfirmUpdate = async () => {
    let generatedQrCode = link?.qrcode || "";
    if (isPreviewVisible) {
      if (qrRef.current) {
        try {
          setLoading(true);
          const canvas = await html2canvas(qrRef.current);
          generatedQrCode = canvas.toDataURL("image/png");
          setLink((prevLink) => ({ ...prevLink, qrcode: generatedQrCode }));
        } catch (err) {
          console.error("Failed to generate QR code image", err);
          setIsSubmitted(false);
          setLoading(false);
          return;
        } finally {
          setLoading(false);
        }
      }
    }

    if (isAvailable) {
      const domain = removePrefix(customLink);

      addDomain(domain);
    }
    const updatedLink = {
      ...link,
      title: link?.title || longUrl,
      mainLink: longUrl,
      shortenedLink: link?.shortenedLink || "",
      qrcode: generatedQrCode,
      customLink: customLink,
      qrcodeColor: color,
      qrcodeLogo: logo,
      updatedAt: new Date().toISOString(),
    };

    const userId = user?.id;

    if (!isLoggedIn) {
      try {
        setLoading(true);
        console.error("User is not logged in. Saving link to localStorage.");

        const savedLinks = localStorage.getItem("links");
        const links = savedLinks ? JSON.parse(savedLinks) : [];

        const existingLinkIndex = links.findIndex(
          (l: Link) => l.id === updatedLink.id
        );
        if (existingLinkIndex !== -1) {
          links[existingLinkIndex] = updatedLink;
        } else {
          return;
        }

        localStorage.setItem("links", JSON.stringify(links));

        navigate("/links");
        return;
      } catch (error) {
        console.error("Error saving link:", error);
        setLoading(false);
      } finally {
        setIsSubmitted(false);
        setLoading(false);
      }

      return;
    }
    try {
      setLoading(true);
      await axios.put(
        `https://app-scissors-api.onrender.com/users/${userId}/links/${id}`,
        updatedLink
      );
      console.log("Link updated successfully");
      navigate("/links");
    } catch (error) {
      console.error("Error updating link:", error);
    } finally {
      setIsSubmitted(false);
      setLoading(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setLogo(reader.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

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
        <div className="sl-toast-wrap" style={{ opacity: isFadingOut ? 0 : 1 }}>
          <div className="sl-toast">{message}</div>
        </div>
      )}

      <main>
        <section className="sl-page-hero">
          <div className="sl-grid-overlay" aria-hidden="true" />
          <div
            className="sl-orb sl-orb--green"
            style={{ width: 380, height: 380, top: "-18%", right: "-10%" }}
            aria-hidden="true"
          />
          <div className="sl-container">
            <span className="sl-eyebrow">Edit link</span>
            <h1 className="sl-page-title">Edit link</h1>
            <p className="sl-page-sub">
              Update the destination, custom domain, or QR code for this link.
            </p>
          </div>
        </section>

        <section className="sl-page-section">
          <div className="sl-container" style={{ maxWidth: 900 }}>
            {link ? (
              <form onSubmit={handleSubmit}>
                <div className="sl-link-form-grid">
                  <div>
                    <div className="sl-form-card">
                      <p className="sl-form-section-title">Long link</p>
                      <p className="sl-form-section-sub">
                        Update the destination URL for this link.
                      </p>

                      <div className="sl-field">
                        <label className="sl-label" htmlFor="longUrl">
                          Destination
                        </label>
                        <input
                          type="text"
                          id="longUrl"
                          placeholder="https://your-long-url.com"
                          required
                          value={longUrl}
                          onChange={(e) => setLongUrl(e.target.value)}
                          className={`sl-input${
                            !validLongUrl && longUrl && isSubmitted
                              ? " sl-input--error"
                              : ""
                          }`}
                        />
                        {!validLongUrl && longUrl && isSubmitted && (
                          <p className="sl-field-error">
                            Invalid link. Please, we&apos;ll need a valid URL, like
                            &quot;https://yourlonglink.com&quot;.
                          </p>
                        )}
                      </div>

                      <div className="sl-field" style={{ marginTop: 18 }}>
                        <div className="sl-field-label-row">
                          <label className="sl-label" htmlFor="title">
                            Title
                          </label>
                          <span className="sl-optional-tag">(optional)</span>
                        </div>
                        <input
                          id="title"
                          type="text"
                          value={link.title || ""}
                          onChange={(e) => setLink({ ...link, title: e.target.value })}
                          placeholder="Enter your link title"
                          className="sl-input"
                        />
                      </div>

                      <hr className="sl-form-divider" />

                      <p className="sl-form-section-title">Custom domain</p>
                      <p className="sl-form-section-sub">(optional)</p>

                      <div className="sl-field">
                        <label className="sl-label" htmlFor="customLink">
                          Custom domain
                        </label>
                        <input
                          id="customLink"
                          type="text"
                          value={customLink}
                          onChange={(e) => setCustomLink(e.target.value)}
                          placeholder="https://your-custom-link.com"
                          className={`sl-input${
                            !validCustomLink && customLink && isSubmitted
                              ? " sl-input--error"
                              : ""
                          }`}
                        />
                        {!validCustomLink && customLink && isSubmitted && (
                          <p className="sl-field-error">
                            Invalid link. Your custom link must start with
                            &quot;https://app-scissors-api.onrender.com/c/&quot;.
                          </p>
                        )}
                        {validCustomLink && smallLoading ? (
                          <p className="sl-status-text sl-status-text--muted">
                            Please wait ...
                          </p>
                        ) : (
                          !smallLoading &&
                          validCustomLink &&
                          isAvailable != null && (
                            <p
                              className={`sl-status-text ${
                                isAvailable
                                  ? "sl-status-text--ok"
                                  : "sl-status-text--bad"
                              }`}
                            >
                              {isAvailable
                                ? "Domain is available!"
                                : "Domain is occupied."}
                            </p>
                          )
                        )}
                      </div>

                      <hr className="sl-form-divider" />

                      <p className="sl-form-section-title">QR code</p>
                      <p className="sl-form-section-sub">(optional)</p>

                      <div className="sl-toggle-row">
                        <button
                          type="button"
                          className={classNames(
                            "sl-toggle",
                            isPreviewVisible && "sl-toggle--on"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsPreviewVisible(!isPreviewVisible);
                          }}
                          aria-pressed={isPreviewVisible}
                          aria-label="Toggle QR code generation"
                        >
                          <span className="sl-toggle-knob" />
                        </button>
                        <span className="sl-toggle-text">
                          Generate a QR code that is faster and easier to use.
                        </span>
                      </div>

                      {isPreviewVisible && (
                        <div className="sl-qr-panel">
                          <div className="sl-qr-panel-col">
                            <div className="sl-field" style={{ gap: 8 }}>
                              <label className="sl-label" htmlFor="color">
                                Code color
                              </label>
                              <input
                                type="color"
                                id="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="sl-qr-color-input"
                              />
                            </div>
                            <div className="sl-field" style={{ gap: 8 }}>
                              <label className="sl-label" htmlFor="file-input">
                                QR code logo
                              </label>
                              <label htmlFor="file-input" className="sl-qr-logo-upload">
                                {logo ? (
                                  <img src={logo} alt="Logo preview" />
                                ) : (
                                  <>
                                    <CameraOutlineIcon aria-hidden="true" />
                                    <span>Add logo</span>
                                  </>
                                )}
                              </label>
                              <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                style={{ display: "none" }}
                              />
                            </div>
                          </div>

                          <div className="sl-qr-preview-wrap">
                            <p className="sl-form-section-title" style={{ margin: 0 }}>
                              Preview
                            </p>
                            <div className="sl-qr-preview-box">
                              <div ref={qrRef}>
                                <QRCode
                                  value={longUrl || "scissors.netlify.app"}
                                  size={140}
                                  fgColor={color}
                                  level={"H"}
                                  includeMargin={true}
                                  imageSettings={
                                    logo
                                      ? {
                                          src: logo,
                                          x: undefined,
                                          y: undefined,
                                          height: 36,
                                          width: 36,
                                          excavate: true,
                                        }
                                      : undefined
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="sl-form-actions">
                        <Link to="/links" className="sl-btn sl-btn--ghost">
                          Cancel
                        </Link>
                        <button type="submit" className="sl-btn sl-btn--primary">
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <UpdateModal
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  onUpdate={handleConfirmUpdate}
                />
              </form>
            ) : (
              <div>
                <Link to="/links" className="sl-back-link">
                  <ArrowLeftIcon aria-hidden="true" /> Back to list
                </Link>
                <div className="sl-empty-panel">
                  <p className="sl-empty-panel-text">
                    Oops!!! There&apos;s no link associated with this ID. The
                    link may have been deleted or may not exist.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default EditLink;