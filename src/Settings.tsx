// Route: /settings (child of SettingsParent)
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
  CameraIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";
import Footer from "./Footer";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profileImg: string;
  links: Link[];
}
type Link = {
  title: string;
  id: string;
  mainLink: string;
  shortenedLink: string;
  qrcode: string;
  customLink: string;
  clicks: number;
  visits: string[];
  createdAt: string;
};

interface SettingsProps {
  user: User | null;
  onUpdate: (user: User) => void;
  isSaving?: boolean;
}

const navigation = [
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

const Settings: React.FC<SettingsProps> = ({ onUpdate, isSaving = false }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getStoredUser());
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(() => getStoredUser()?.email ?? "");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState(() => getStoredUser()?.firstName ?? "");
  const [lastName, setLastName] = useState(() => getStoredUser()?.lastName ?? "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [userPassword] = useState(() => getStoredUser()?.password ?? "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasAt = email.includes("@");
  const [hasPassword] = useState(() => !!getStoredUser()?.password);
  const hasEmailSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(email);
  const [profileImg, setProfileImg] = useState(() => getStoredUser()?.profileImg ?? "");
  const [isHovered, setIsHovered] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImg(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePassword = (password: string) => {
    const minLength = 6;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);

    return (
      password.length > minLength &&
      hasSymbol &&
      hasNumber &&
      hasLowerCase &&
      hasUpperCase
    );
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

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  const handleDelete = async (enteredPassword: string) => {
    if (enteredPassword === user?.password) {
      setLoading(true);
      try {
        const response = await fetch(
          `https://app-scissors-api.onrender.com/users/${user?.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({ id: user?.id, email: user?.email }),
          }
        );
        if (response.ok) {
          console.log("Account deleted successfully");
          setMessage("Your account has been successfully deleted.");
          localStorage.removeItem("user");
          setLoading(false);
          window.location.href = "/dashboard";
          setIsModalOpen(false);
        } else {
          console.error("Failed to delete account. Status:", response.status);
          const errorData = await response.json();
          setMessage(
            errorData.message ||
              "Failed to delete your account. Please try again."
          );
          setIsModalOpen(false);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        setMessage("An error occurred. Please try again.");
        setIsModalOpen(false);
        setLoading(false);
      }
    } else {
      setMessage("Password is incorrect. Account not deleted.");
      setIsModalOpen(false);
      setLoading(false);
    }
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
            style={{ width: 360, height: 360, top: "-18%", right: "-10%" }}
            aria-hidden="true"
          />
          <div className="sl-container">
            <span className="sl-eyebrow">Settings</span>
            <h1 className="sl-page-title">Account settings</h1>
            <p className="sl-page-sub">
              Update your profile details, change your password, or manage
              your account.
            </p>
          </div>
        </section>

        <section className="sl-page-section">
          <div className="sl-container" style={{ maxWidth: 780 }}>
            {isLoggedIn ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (password && confirmPassword) {
                    if (currentPassword != userPassword) {
                      setMessage(
                        "The current password you have entered does not match the data in our database"
                      );
                      return;
                    }
                    if (!validatePassword(password)) {
                      setMessage(
                        "Password must be greater than six characters, and contain a symbol, one number, one lowercase, and one uppercase letter."
                      );
                      return;
                    }
                    if (password !== confirmPassword) {
                      setMessage(
                        "Passwords do not match, check the password and try again"
                      );
                      return;
                    }
                    const updatedUser = {
                      ...user,
                      email,
                      firstName,
                      lastName,
                      password,
                      profileImg,
                      id: user?.id || "",
                      links: user?.links || [],
                    };
                    console.log("Update Settings clicked:", updatedUser);
                    onUpdate(updatedUser);
                  } else {
                    const updatedUser = {
                      ...user,
                      email,
                      firstName,
                      lastName,
                      profileImg,
                      password: user?.password || "",
                      id: user?.id || "",
                      links: user?.links || [],
                    };
                    console.log(
                      "Update Settings clicked without password:",
                      updatedUser
                    );
                    onUpdate(updatedUser);
                  }
                }}
              >
                <div className="sl-form-card">
                  <p className="sl-form-card-title">User details</p>

                  <div className="sl-avatar-row">
                    <div
                      className="sl-avatar-upload"
                      onMouseOver={() => setIsHovered(true)}
                      onMouseOut={() => setIsHovered(false)}
                      onClick={() => document.getElementById("fileInput")?.click()}
                      style={{ backgroundImage: `url(${profileImg})` }}
                    >
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                      <div
                        className="sl-avatar-upload-overlay"
                        style={{ opacity: isHovered ? 1 : undefined }}
                      >
                        <CameraIcon aria-hidden="true" /> Change
                      </div>
                    </div>
                    <div>
                      <p className="sl-avatar-row-name">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="sl-avatar-row-text">
                        Click your photo to upload a new one. Squares work
                        best.
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
                        required
                        type="text"
                        placeholder={user?.firstName}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="sl-input"
                      />
                    </div>
                    <div className="sl-field">
                      <label className="sl-label" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        required
                        type="text"
                        placeholder={user?.lastName}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="sl-input"
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
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={classNames(
                          "sl-input",
                          email && !hasAt && hasEmailSymbol && "sl-input--error"
                        )}
                      />
                      {email && !hasAt && hasEmailSymbol && (
                        <p className="sl-field-error">
                          Please provide a valid email address.
                        </p>
                      )}
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
                      />
                    </div>

                    {hasPassword && (
                      <div className="sl-field">
                        <label className="sl-label" htmlFor="currentPassword">
                          Current Password
                        </label>
                        <input
                          id="currentPassword"
                          type="password"
                          placeholder=" "
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="sl-input"
                        />
                      </div>
                    )}
                    <div className="sl-field">
                      <label className="sl-label" htmlFor="newPassword">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        placeholder=" "
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="sl-input"
                      />
                    </div>
                    <div className="sl-field">
                      <label className="sl-label" htmlFor="confirmPassword">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder=" "
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="sl-input"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="sl-btn sl-btn--primary sl-btn--block"
                    style={{ marginTop: 26 }}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving…" : "Update Settings"}
                  </button>
                </div>

                <div className="sl-danger-zone">
                  <div>
                    <p className="sl-danger-zone-title">
                      <ExclamationTriangleIcon aria-hidden="true" /> Delete
                      account
                    </p>
                    <p className="sl-danger-zone-text">
                      Permanently remove your account and all of its data.
                      This action cannot be undone.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="sl-btn sl-btn--danger"
                  >
                    Delete your account
                  </button>
                </div>
              </form>
            ) : (
              <div className="sl-gate">
                <div className="sl-gate-icon">
                  <LockClosedIcon aria-hidden="true" />
                </div>
                <p className="sl-gate-text">
                  You need to log in or sign up first to modify your user
                  data.
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

            <ConfirmationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onDelete={handleDelete}
              userPassword={user?.password}
              setMessage={setMessage}
              isLoggedIn={isLoggedIn}
              isSubmitting={loading}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
export default Settings;