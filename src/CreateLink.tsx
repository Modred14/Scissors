// Route: /create-link
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
import { Bars3Icon, BellIcon, XMarkIcon, CameraIcon as CameraOutlineIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
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

interface LinkProps {
  title: string;
  id: string;
  mainLink: string;
  shortenedLink: string;
  qrcode: string;
  customLink: string;
  clicks: number;
  visits: string[];
  createdAt: string;
}

interface Domain {
  id: string;
  domain: string;
}

const navigation = [
  { name: "Home", href: "/", current: false },
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Links", href: "/links", current: false },
];

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const generateUniqueId = (): string => {
  return uuidv4();
};

const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error reading stored user:", error);
    return null;
  }
};

const CreateLink: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser());
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [customDomains, setCustomDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [smallLoading, setSmallLoading] = useState(true);
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [longUrl, setLongUrl] = useState("");
  const [customLink, setCustomLink] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("#000000"); // default color black
  const [logo, setLogo] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const qrRef = useRef<HTMLDivElement>(null);
  const validLongUrl = longUrl.includes(".") && /^https?:\/\//.test(longUrl);
  const validCustomLink =
    customLink.includes(".") && /^https?:\/\//.test(customLink);
  const uniqueId = generateUniqueId();
  const removeProtocol = (url: string) => {
    return url.replace(/^https?:\/\//, "");
  };

  const checkDomain = removeProtocol(customLink);
  const invalidDomainLink = checkDomain.includes("/");

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
        setCustomDomains(response.data.domains);
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

  const checkDomainAvailability = (domain: string) => {
    setSmallLoading(true);
    const cleanedDomain = removeProtocol(domain);
    const isAvailable = !customDomains.some((d) => d.domain === cleanedDomain);
    setSmallLoading(false);
    return isAvailable;
  };

  useEffect(() => {
    setSmallLoading(true);
    if (validCustomLink) {
      const domainToCheck = removeProtocol(customLink);
      console.log("Valid custom link without protocol:", domainToCheck);
      setSmallLoading(false);
    } else {
      setIsAvailable(null);
      setSmallLoading(false);
    }
  }, [customLink]);

  const fetchLinksFromLocalStorage = () => {
    const storedLinks: LinkProps[] = JSON.parse(
      localStorage.getItem("links") || "[]"
    );
    setLinks(storedLinks);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      fetchLinksFromLocalStorage();
    }
  }, []);

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

  const [link, setLink] = useState<Partial<LinkProps>>({
    title: "",
    id: uniqueId,
    mainLink: "",
    shortenedLink: "",
    qrcode: "",
    customLink: "",
    clicks: 0,
    visits: [],
    createdAt: new Date().toISOString(),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!validLongUrl) {
      console.error("Invalid URL.");
      setIsSubmitted(true);
      return;
    }
    if (customLink.length > 0) {
      const checkDomain = removeProtocol(customLink);
      const available = checkDomainAvailability(checkDomain);
      if (available) {
        setIsAvailable(true);
      } else setIsAvailable(false);
      if (isAvailable === null) {
        setMessage("Please wait... Validating Domain");
        return;
      }
      if (smallLoading) {
        setMessage("Kindly wait for the custom domain to be validated.");
        return;
      } else if (!isAvailable) {
        setMessage(
          "Kindly enter another domain, the one you inputted is already occupied by another website."
        );
        return;
      }

      if (invalidDomainLink) {
        setMessage(
          `Oops, your custom domain can't contain any slashes ("/") except for the ones in ("https://").`
        );
        return;
      }

      if (!isAvailable) {
        setIsAvailable(false);
        setMessage(
          "Kindly enter another domain, the one you inputted is already occupied by another website."
        );
        return;
      }

      if (!validCustomLink) {
        console.error("Invalid URL.");
        setIsSubmitted(true);
        setIsAvailable(false);
        return;
      }
      const domain = removeProtocol(customLink);
      await addDomain(domain);
    }
    let generatedQrCode = link.qrcode;
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
        }
      }
    }

    const generateRandomString = (length: number): string => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
      }
      return result;
    };
    const randomString = generateRandomString(7);
    const shortenedLink = ` https://app-scissors-api.onrender.com/s/${randomString}`;

    const response = await fetch(
      " https://app-scissors-api.onrender.com/api/urls/shorten",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ longUrl, shortUrl: randomString, uniqueId }),
      }
    );
    let customLinkDomain = null;
    if (customLink) {
      const domain = removeProtocol(customLink);
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
        console.log("working");
        customLinkDomain = `https://app-scissors-api.onrender.com/c/${domain}`;
      } else {
        const errorData = await responseData.json();
        console.log(errorData.message);
        console.log("Custom link error");
      }
    }

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);

      logEvent(analytics, "link_created", {
        userId: user?.id || "guest",
        longUrl: longUrl,
        shortenedLink: shortenedLink,
        customLink: customLinkDomain || "none",
        createdAt: new Date().toISOString(),
      });
    } else {
      const data = await response.json();
      console.log(data.message);
      console.log("error");
      return;
    }

    const newLink = {
      title: link.title || longUrl,
      id: uniqueId,
      mainLink: longUrl,
      shortenedLink: shortenedLink,
      qrcode: generatedQrCode,
      customLink: customLinkDomain,
      clicks: 0,
      visits: [],
      createdAt: new Date().toISOString(),
    };

    if (!isLoggedIn) {
      try {
        setLoading(true);
        console.error("User is not logged in. Saving link to localStorage.");

        const savedLinks = localStorage.getItem("links");
        const links = savedLinks ? JSON.parse(savedLinks) : [];
        const storedLinks = JSON.parse(localStorage.getItem("links") || "[]");

        if (storedLinks.length >= 3) {
          console.log("sorry");
          setMessage(
            "Oops, you have reached the limit for non-registered users. To continue using Scissors services, please create an account."
          );
          return;
        } else {
          links.push(newLink);
          localStorage.setItem("links", JSON.stringify(links));
          setMessage("Your link has been created succesfully");
          navigate("/links");
        }
      } catch (error) {
        console.error("Error saving link:", error);
        setMessage("An error occured while saving the link");
        setIsSubmitted(false);
        setLoading(false);
      } finally {
        setIsSubmitted(false);
        setLoading(false);
      }

      return;
    }

    try {
      setLoading(true);
      const userId = user?.id;
      const response = await axios.post(
        `https://app-scissors-api.onrender.com/users/${userId}/links`,
        newLink
      );
      setMessage("Your link has been created succesfully");
      console.log("Link saved successfully:", response.data);

      navigate("/links");
    } catch (error) {
      setMessage("Oops, an error occured while creating the link");
      console.error("Error saving link:", error);
      setLoading(false);
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
                {navigation.map((item) => (
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
              {navigation.map((item) => (
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

      {!isLoggedIn && (
        <div
          className={classNames(
            "sl-usage-badge",
            "sl-usage-pill",
            links.length >= 3 && "sl-usage-badge--full"
          )}
        >
          Used: <span className="sl-usage-badge-count">{links.length}/3</span>
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
            <span className="sl-eyebrow">New link</span>
            <h1 className="sl-page-title">Create new link</h1>
            <p className="sl-page-sub">
              Shorten a long URL, add an optional custom domain, and generate
              a QR code — all in one place.
            </p>
          </div>
        </section>

        <section className="sl-page-section">
          <div className="sl-container" style={{ maxWidth: 900 }}>
            <form onSubmit={handleSubmit}>
              <div className="sl-link-form-grid">
                <div>
                  <div className="sl-form-card">
                    <p className="sl-form-section-title">Long link</p>
                    <p className="sl-form-section-sub">
                      Paste the destination URL you want to shorten.
                    </p>

                    <div className="sl-field">
                      <div className="sl-field-label-row">
                        <label className="sl-label" htmlFor="longUrl">
                          Destination
                        </label>
                        {longUrl && (
                          <span className="sl-hint-row">
                            Hit <span className="sl-kbd">Enter</span> to quick create
                          </span>
                        )}
                      </div>
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
                    <p className="sl-form-section-sub">
                      A short link is generated automatically if left blank.
                    </p>

                    <div className="sl-field">
                      <div className="sl-field-label-row">
                        <label className="sl-label" htmlFor="customLink">
                          Custom domain
                        </label>
                        <span className="sl-optional-tag">(optional)</span>
                      </div>
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
                          Invalid link. Please, we&apos;ll need a valid URL, like
                          &quot;https://yourcustomshortlink.com&quot;.
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
                      <Link to="/dashboard" className="sl-btn sl-btn--ghost">
                        Cancel
                      </Link>
                      <button type="submit" className="sl-btn sl-btn--primary">
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CreateLink;