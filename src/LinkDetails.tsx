import React, { useEffect, useState } from "react";
import "./style.css";
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
import Loading from "./Loading";
import { Link, useParams } from "react-router-dom";
import useWindowWidth from "./useWindowWidth";
import TruncatedWord from "./TruncatedWord";
import Confirm from "./Confirm";
import SmallLoading from "./SmallLoading";
import axios from "axios";
import { logEvent } from "firebase/analytics";
import { analytics } from "./firebaseConfig";
import TrackLink from "./TrackLink";
import AnalyticsDashboard from "./services/Analytics";
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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const LinkDetails: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [smallLoading, setSmallLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [link, setLink] = useState<LinkProps | null>(null);
  const [customDomains, setCustomDomains] = useState<Domain[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      console.log(userData);
      fetchUserData();
    } else {
      setLoading(false);
      fetchLinksFromLocalStorage();
    }
  }, []);

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
      // alert("Text copied to clipboard!");
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
    // if (width >= 1000) return 40;
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
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

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
      setLoading(false);
      setSmallLoading(false);
    }
  };

  const fetchLinksFromLocalStorage = () => {
    setSmallLoading(true);
    const storedLinks: LinkProps[] = JSON.parse(
      localStorage.getItem("links") || "[]"
    );
    setLinks(storedLinks);
    setLoading(false);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="fixed header-grid w-full" style={{ zIndex: 1000 }}>
        <Disclosure as="nav" className="bg-gray-800">
          <div className="mx-auto px-2 md:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center md:hidden"></div>
              <div className="logo-placement">
                <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to="/">
                      <img
                        alt="Scissors"
                        src="/Scissors_logo.png"
                        className="h-8 w-auto"
                      />
                    </Link>
                  </div>
                  <div className="hidden md:ml-6 md:block">
                    <div className="flex space-x-4">
                      {navigation(isLoggedIn).map((item) => (
                        <Link to={item.href}>
                          <a
                            key={item.name}
                            href={item.href}
                            aria-current={item.current ? "page" : undefined}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                          >
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
                {isLoggedIn ? (
                  <>
                    <div className="place-self-end flex space-x-4 ">
                      <div className="absolute inset-y-0 right-10 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
                        <button
                          type="button"
                          className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">View notifications</span>
                          <BellIcon aria-hidden="true" className="h-6 w-6" />
                        </button>

                        {/* Profile dropdown */}
                        <Menu as="div" className="relative ml-3">
                          <div className="profile-picture">
                            <MenuButton className="md:w-8 relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              {user && user.profileImg && (
                                <img
                                  src={user.profileImg}
                                  alt="User profile"
                                  className="h-8 w-8 rounded-full"
                                />
                              )}
                            </MenuButton>
                          </div>
                          <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                          >
                            <MenuItem>
                              <Link to="/profile">
                                <a
                                  href="/profile"
                                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                >
                                  Your Profile
                                </a>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link to="/settings">
                                <a
                                  href="/settings"
                                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                >
                                  Settings
                                </a>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link to="#">
                                <a
                                  href="#"
                                  className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                  onClick={handleSignOut}
                                >
                                  Sign out
                                </a>
                              </Link>
                            </MenuItem>
                          </MenuItems>
                        </Menu>
                        {/* Mobile menu button*/}
                        <div className="bar">
                          <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon
                              aria-hidden="true"
                              className="block h-6 w-6 group-data-[open]:hidden"
                            />
                            <XMarkIcon
                              aria-hidden="true"
                              className="hidden h-6 w-6 group-data-[open]:block"
                            />
                          </DisclosureButton>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="place-self-end flex space-x-4 ">
                    <div className="absolute inset-y-0 right-10 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0">
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon aria-hidden="true" className="h-6 w-6" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div className="profile-picture">
                          <MenuButton className="md:w-8 relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                              alt="Default profile"
                              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                              className="h-8 w-8 rounded-full"
                            />
                          </MenuButton>
                        </div>
                        <MenuItems
                          transition
                          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <MenuItem>
                            <Link to="/profile">
                              <a
                                href="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                              >
                                Your Profile
                              </a>
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link to="/settings">
                              <a
                                href="/settings"
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                              >
                                Settings
                              </a>
                            </Link>
                          </MenuItem>
                        </MenuItems>
                      </Menu>
                      {/* Mobile menu button*/}
                      <div className="bar">
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Open main menu</span>
                          <Bars3Icon
                            aria-hidden="true"
                            className="block h-6 w-6 group-data-[open]:hidden"
                          />
                          <XMarkIcon
                            aria-hidden="true"
                            className="hidden h-6 w-6 group-data-[open]:block"
                          />
                        </DisclosureButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DisclosurePanel className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation(isLoggedIn).map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
      <div style={{ minHeight: "100vh", marginTop: "65px" }}>
        <main className="px-110 main">
          <Link to="/links">
            <div className="pt-10 flex gap-1 text-black text-sm">
              <i className="text-sm material-icons">arrow_back</i> Back to List
            </div>{" "}
          </Link>
          {message && (
            <div
              className={`flex justify-center transition-opacity duration-500 ${
                isFadingOut ? "opacity-0" : "opacity-100"
              }`}
            >
              <div
                className="fixed animate-message bg-black p-4 mx-4 rounded"
                style={{ top: "10%" }}
              >
                <p className=" text-red-100">{message}</p>
              </div>{" "}
            </div>
          )}
          <div>
            <Confirm
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onDelete={handleDelete}
              isLoggedIn={isLoggedIn}
              id={link?.id}
              setMessage={setMessage}
              userPassword={userPassword}
            />
            <div></div>{" "}
            {smallLoading ? (
              <div
                className="mt-7 bg-white shadow flex flex-col items-center justify-center"
                style={{ height: "500px" }}
              >
                <SmallLoading />
              </div>
            ) : link ? (
              <div>
                <div className="bg-white shadow-sm p-7 rounded-md mt-7">
                  <p className="text-3xl font-extrabold">
                    {" "}
                    <TruncatedWord word={link.title} maxLength={maxLength} />
                  </p>
                  <div className="flex gap-3 mt-2">
                    {" "}
                    <img
                      src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.mainLink}&size=32`}
                      className="rounded-3xl block w-10 sm:w-16"
                      alt="link"
                    />
                    <div className="flex text-sm items-center">
                      <div>
                        <p>
                          {" "}
                          <a
                            className="hover:underline text-base font-semibold"
                            href={link.mainLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <TruncatedWord
                              word={link.mainLink}
                              maxLength={maxOtherLinkLength}
                            />
                          </a>
                        </p>
                        {link.customLink ? (
                          <p>
                            {" "}
                            <a
                              className="hover:underline hover:text-black text-black font-semibold"
                              href={link.customLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <TruncatedWord
                                word={link.customLink}
                                maxLength={maxOtherLinkLength}
                              />
                            </a>
                          </p>
                        ) : (
                          <p>
                            {" "}
                            <a
                              className="hover:underline hover:text-black text-black font-semibold"
                              href={link.shortenedLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <TruncatedWord
                                word={link.shortenedLink}
                                maxLength={maxOtherLinkLength}
                              />
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <hr
                    className="my-5 mx-0"
                    style={{
                      height: "1px",
                      backgroundColor: "rgb(83, 83, 83, 0.1)",
                      border: "none",
                    }}
                  />
                  <div className="grid  grid-flow-col gap-5">
                    <div className="flex w-20 sm:pt-3 sm:w-auto gap-2 text-sm">
                      <span className="material-icons text-sm">
                        calendar_today
                      </span>
                      {new Date(link.createdAt).toLocaleString()}
                    </div>
                    <div className="flex justify-end">
                      <div className="flex gap-2">
                        <button
                          className="px-2 h-9 grid grid-flow-col font-bold bg-gray-200 text-sm hover:bg-gray-300 rounded"
                          onClick={() => handleCopyClick(link.id)}
                        >
                          <span className="material-icons pt-2 text-sm font-extrabold">
                            content_copy
                          </span>
                          <p className="pt-2 px-1">Copy</p>
                        </button>
                        <Link to={`/edit-link/${link.id}`}>
                          <button className="px-2 text-black hover:text-black py-2 h-9 grid grid-flow-col font-bold bg-gray-200 text-sm hover:bg-gray-300 rounded">
                            <span className="material-icons text-sm">edit</span>
                          </button>
                        </Link>

                        <button
                          className="px-2 text-black gap hover:text-black py-2 h-9 grid grid-flow-col font-bold bg-gray-200 text-sm hover:bg-gray-300 rounded"
                          onClick={() => {
                            setIsModalOpen(true); // Open modal to confirm deletion
                          }}
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow-sm p-7 grid md:grid-flow-col rounded-md mt-7">
                  <div className="flex items-center md:pb-0 pb-10 justify-center text-lg">
                    <div>
                      <p>
                        <strong className="text-xl font-extrabold ">
                          Original Link:
                        </strong>
                        <a
                          className="hover:underline hover:text-black text-black font-semibold"
                          href={link.mainLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <TruncatedWord
                            word={link.mainLink}
                            maxLength={maxLinkLength}
                          />
                        </a>
                      </p>
                      <p className=" pt-4">
                        <strong className="text-xl font-extrabold">
                          Shortened Link:
                        </strong>
                        <a
                          className="hover:underline hover:text-black text-black font-semibold"
                          href={link.shortenedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <TruncatedWord
                            word={link.shortenedLink}
                            maxLength={maxLinkLength}
                          />
                        </a>
                      </p>

                      {link.customLink && (
                        <>
                          <p className=" pt-4">
                            <strong className="text-xl font-extrabold">
                              Custom Link:
                            </strong>{" "}
                            <a
                              className="hover:underline hover:text-black text-black font-semibold"
                              href={link.customLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <TruncatedWord
                                word={link.customLink}
                                maxLength={maxLinkLength}
                              />
                            </a>
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className=" text-center text-xl font-extrabold flex justify-center">
                      QR Code
                    </p>

                    {link.qrcode ? (
                      <>
                        <div className="flex text-center items-center justify-center">
                          <img src={link.qrcode} alt="QR Code" />
                        </div>
                        <div className="mt-3 flex text-center items-center  justify-center ">
                          <button className="flex font-bold ml-0 px-2 py-1 gap-1 text-white bg-green-700">
                            <a
                              className="flex font-bold px-2 py-1 gap-1 hover:text-white text-white bg-green-700"
                              href={link.qrcode}
                              download={`${link.title}_qrcode.png`}
                              onClick={handleDownload}
                            >
                              <i className="material-icons">download</i>Download
                            </a>
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-base text-center items-center justify-center font-bold">
                        No QR code found with this Link.
                      </p>
                    )}
                  </div>
                </div>
                <div className="bg-white shadow-sm p-7 pb-0 mb-16 grid md:grid-flow-col rounded-md mt-7">
                  <div className="hidden">
                    <TrackLink link={link} />
                  </div>
                  <div>
                    <p className=" text-center text-3xl mb-2 font-extrabold flex">
                      Analytics
                    </p>
                    <AnalyticsDashboard linkId={link.id} />
                  </div>
                </div>
              </div>
            ) : smallLoading ? (
              <div
                className="mt-7 bg-white shadow flex flex-col items-center justify-center"
                style={{ height: "500px" }}
              >
                <SmallLoading />
              </div>
            ) : (
              !link && (
                <div>
                  <div className="bg-white shadow-sm p-7 grid md:grid-flow-col rounded-md mt-7">
                    <div>
                      <p className="font-bold ">
                        Oops!!! There is no link associated with this ID. The
                        link may have been deleted or may not exist.
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </main>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </>
  );
};

export default LinkDetails;
