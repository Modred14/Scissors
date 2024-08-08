import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
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
import { Link, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import QRCode from "qrcode.react";
import ToggleButton from "./ToggleButton";
import Tooltip from "./Tooltip";
import styled from "styled-components";
import { toPng } from "html-to-image";
import { v4 as uuidv4 } from "uuid";

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

const generateUniqueId = (): string => {
  return uuidv4();
};

const CreateLink: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [customDomains, setCustomDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [smallLoading, setSmallLoading] = useState(true);
  const [links, setLinks] = useState<Link[]>([]);
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
  const qrRef = useRef(null);
  const validLongUrl = longUrl.includes(".") && /^https?:\/\//.test(longUrl);
  const validCustomLink =
    customLink.includes(".") && /^https?:\/\//.test(customLink);
  const uniqueId = generateUniqueId();
  const removeProtocol = (url: string) => {
    return url.replace(/^https?:\/\//, "");
  };

  const checkDomain = async (domain: string) => {
    try {
      const response = await axios.get(
        "https://users-api-scissors.onrender.com/check-domain",
        {
          params: { domain },
        }
      );
      console.log("Domain check response:", response.data); // Log response data for debugging
      setIsAvailable(response.data.available);
    } catch (error) {
      console.error("Error checking domain:", error);
      setIsAvailable(false);
    }
  };

  const addDomain = async (domain: string) => {
    try {
      const id = Date.now().toString(); // Simple unique string ID generation
      const response = await axios.post(
        "https://users-api-scissors.onrender.com/add-domain",
        {
          id,
          domain,
        }
      );
      if (response.data.success) {
        setCustomDomains([...customDomains, { id, domain }]);
      }
    } catch (error) {
      console.error("Error adding domain:", error);
    }
  };

  const getDomain = async () => {
    setSmallLoading(true);
    try {
      const response = await axios.get(
        "https://users-api-scissors.onrender.com/get-domains"
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
    const cleanedDomain = removeProtocol(domain);
    return !customDomains.some((d) => d.domain === cleanedDomain);
  };

  useEffect(() => {
    if (validCustomLink) {
      const domainToCheck = removeProtocol(customLink);
      console.log("Valid custom link without protocol:", domainToCheck);
      checkDomain(domainToCheck);
    } else {
      setIsAvailable(null);
    }
  }, [customLink]);

  const fetchLinksFromLocalStorage = () => {
    const storedLinks: Link[] = JSON.parse(
      localStorage.getItem("links") || "[]"
    );
    setLinks(storedLinks);
    setLoading(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      fetchUserData(userData.token);
    } else {
      setLoading(false);
      fetchLinksFromLocalStorage();
    }
  }, []);

  useEffect(() => {
    // Clear the message after 5 seconds with a fade-out effect
    if (message) {
      const timer = setTimeout(() => {
        setIsFadingOut(true); // Trigger the fade-out effect
        setTimeout(() => setMessage(""), 500); // Match the duration with CSS transition
      }, 4500); // Start fade-out before 5 seconds

      // Clear timeout if component unmounts or message changes
      return () => {
        clearTimeout(timer);
        setIsFadingOut(false); // Reset the fade-out state
      };
    }
  }, [message]);

  const [link, setLink] = useState<Partial<Link>>({
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
      if (!isAvailable) {
        setMessage(
          "Kindly enter another domain, the one you inputted is already occupied by another website."
        );
        return;
      }
      const domain = removeProtocol(customLink);
      const available = checkDomainAvailability(domain);
      if (available) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
        setMessage(
          "Kindly enter another domain, the one you inputted is already occupied by another website."
        );
        return;
      }
      if (isAvailable) {
        const domain = removeProtocol(customLink);
        addDomain(domain);
      }
      if (!validCustomLink) {
        console.error("Invalid URL.");
        setIsSubmitted(true);
        return;
      }
    }
    let generatedQrCode = link.qrcode;
    if (isPreviewVisible) {
      // Ensure the QR code is generated before form submission
      if (qrRef.current) {
        try {
          setLoading(true);
          generatedQrCode = await toPng(qrRef.current);
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
    const shortenedLink = `https://scissors.${randomString}.com`;

    const newLink = {
      title: link.title || longUrl,
      id: uniqueId,
      mainLink: longUrl,
      shortenedLink: shortenedLink,
      qrcode: generatedQrCode,
      customLink: customLink,
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
            "Oops, you've reached the limit for non-registered users. To continue using Scissors services, please create an account."
          );
          return;
        } else {
          links.push(newLink);
          localStorage.setItem("links", JSON.stringify(links));
          setMessage("Your link has been created succesfully");
          navigate("/links");
        }

        // alert("Link saved locally. Please log in to save it to the server.");
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
      const userId = user?.id;
      const response = await axios.post(
        `https://users-api-scissors.onrender.com/users/${userId}/links`,
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
        // Parse the user data from local storage and use it
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
  return (
    <>
      <div
        className="fixed header-grid w-full min-w-fit "
        style={{ zIndex: 1000 }}
      >
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
                              <a
                                href="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                              >
                                Your Profile
                              </a>
                            </MenuItem>
                            <MenuItem>
                              <a
                                href="/settings"
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                              >
                                Settings
                              </a>
                            </MenuItem>
                            <MenuItem>
                              <a
                                href="#"
                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                                onClick={handleSignOut}
                              >
                                Sign out
                              </a>
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
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              className="h-8 w-8 rounded-full"
                            />
                          </MenuButton>
                        </div>
                        <MenuItems
                          transition
                          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <MenuItem>
                            <a
                              href="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                            >
                              Your Profile
                            </a>
                          </MenuItem>
                          <MenuItem>
                            <a
                              href="/settings"
                              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                            >
                              Settings
                            </a>
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
        {message && (
          <div
            className={`flex justify-center transition-opacity duration-500 ${
              isFadingOut ? "opacity-0" : "opacity-100"
            }`}
          >
            <div
              className="fixed animate-message bg-black p-4 mx-4 rounded"
              style={{ zIndex: "1500", top: "10%" }}
            >
              <p className=" text-red-100">{message}</p>
            </div>{" "}
          </div>
        )}
        {!isLoggedIn && (
          <div
            className="fixed rounded-full shadow-2xl outline outline-1  bg-gray-100 font-bold"
            style={{ top: "93.5%", left: "5%", zIndex: "1500" }}
          >
            {links.length < 3 ? (
              <div className="rounded-full  inline text-2xl px-3">
                <div className="inline font-comic">Used:</div>
                <div className="rounded-full inline pl-1 text-2xl text-green-500">
                  {links.length}/3
                </div>
              </div>
            ) : (
              <div className="rounded-full  inline text-2xl px-3">
                <div className="inline font-comic">Used:</div>
                <div className="rounded-full inline pl-1 text-2xl text-red-500">
                  {links.length}/3
                </div>
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <main className="px-100 main">
            <div className="pt-20">
              <p className="text-3xl font-bold tracking-tight p-0 pb-6 text-gray-900">
                Create New Link
              </p>
              <p className="text-xl font-semibold pb-3">Long Link</p>
              <div className="grid grid-flow-col">
                <label className="text-md flex font-bold" htmlFor="longUrl">
                  Destination
                </label>
                {longUrl && (
                  <div className="text-sm flex justify-end font-semibold hidden-block">
                    <p className="inline ">
                      Hit{" "}
                      <p className="inline  bg-gray-300 font-bold px-2 py-1 rounded-md text-sm">
                        Enter
                      </p>{" "}
                      to quick create
                    </p>
                  </div>
                )}
              </div>
              <input
                type="text"
                id="longUrl"
                placeholder="https://your-long-url.com"
                required
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className={`peer h-12 mt-1 block w-full px-3 py-2 bg-white border ${
                  !validLongUrl && longUrl && isSubmitted
                    ? "border-pink-500 text-pink-600"
                    : "border-slate-300"
                } rounded-sm text-m shadow-sm placeholder-slate-400
                  focus:outline-none  focus:ring-gray-400 focus:ring-1 
                  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                  ${
                    !validLongUrl && longUrl && isSubmitted
                      ? "focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                      : ""
                  }
                `}
              />
              {!validLongUrl && longUrl && isSubmitted && (
                <p className="mt-1  peer-invalid:visible text-pink-600 text-sm">
                  Invalid link. Please, we'll need a valid URL, like
                  "https://yourlonglink.com".
                </p>
              )}
              <label htmlFor="title">
                <div className="grid grid-flow-col pt-8 w-28">
                  <p className="text-md font-bold">Title</p>{" "}
                  <p className="text-md font-light">(optional)</p>
                </div>
              </label>
              <input
                id="title"
                type="text"
                value={link.title || ""}
                onChange={(e) => setLink({ ...link, title: e.target.value })}
                placeholder="Enter your link title"
                className=" h-12 mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-sm text-m shadow-sm placeholder-slate-400
              focus:outline-none  focus:ring-gray-400 focus:ring-1
            "
              />
              <hr
                className="my-12 mx-0"
                style={{
                  height: "1px",
                  backgroundColor: "rgb(83, 83, 83, 0.5)",
                  border: "none",
                }}
              />
              <p className="text-2xl font-bold tracking-tight p-0 pb-2 text-gray-900">
                Ways to share
              </p>
              <p className="text-xl font-semibold">Short Link</p>
              <div className="grid grid-flow-col pt-3 w-56">
                <p className="text-md font-bold">Custom Domain</p>{" "}
                <p className="text-md font-light">(optional)</p>{" "}
                <Tooltip info="A short link will be automatically generated for you if the custom domain field is left blank." />
              </div>
              <input
                type="text"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                placeholder="https://your-custom-link.com"
                className={`peer h-12 mt-1 block w-full px-3 pt-2 bg-white border ${
                  !validCustomLink && customLink && isSubmitted
                    ? "border-pink-500 text-pink-600"
                    : "border-slate-300"
                } rounded-sm text-m shadow-sm placeholder-slate-400
                  focus:outline-none  focus:ring-gray-400 focus:ring-1 
                  disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                  ${
                    !validCustomLink && customLink && isSubmitted
                      ? "focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                      : ""
                  }
                `}
              />
              {!validCustomLink && customLink && isSubmitted && (
                <p className="mt-1  peer-invalid:visible text-pink-600 text-sm">
                  Invalid link. Please, we'll need a valid URL, like
                  "https://yourcustomshortlink.com".
                </p>
              )}
              {smallLoading ? (
                <div className="mt-1 text-sm">Please wait ...</div>
              ) : (
                !smallLoading &&
                isAvailable !== null &&
                validCustomLink && (
                  <p
                    className={`mt-1 text-sm m-0 ${
                      isAvailable ? "text-green-600" : "text-pink-600"
                    }`}
                  >
                    {isAvailable
                      ? "Domain is available!"
                      : "Domain is occupied."}
                  </p>
                )
              )}
              <div className="pt-12">
                <button
                  type="submit"
                  className="mt-5 shadow-2xl h-12 w-full text-center hidden  font-bold  bg-green-700 hover:bg-green-800 text-white hover:text-white py-2 px-4 rounded-md transition-colors duration-1000 focus:outline-none focus:ring-2 focus:ring-green-600 active:ring-green-600 text-md"
                >
                  Create
                </button>{" "}
              </div>
            </div>
            <div className="grid grid-flow-col pt-0 w-44">
              <p className="text-xl font-semibold">QR Code</p>{" "}
              <p className="text-lg font-light">(optional)</p>
            </div>
            <div className="grid w-120 grid-flow-col pt-3">
              <ToggleButton
                toggleState={isPreviewVisible}
                onToggle={() => setIsPreviewVisible(!isPreviewVisible)}
              />
              <p className="text-md mb-4 pl-2 font-light">
                Generate a QR Code that is faster and easier to use.
              </p>
            </div>
            {isPreviewVisible && (
              <div className="shadow flex-qr p-5 max-w-4xl grid-qrcode bg-gray-300 ">
                <Container>
                  <div className="pt-120">
                    <div className="pl-120 sm:p-3">
                      <p className="text-md font-semibold">Code Color</p>
                      <input
                        type="color"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="Choose Color"
                      />
                    </div>
                    <div className="sm:p-3 sm:pt-0">
                      <p className="text-md pt-3 pb-0 mb-0 font-semibold">
                        QR Code Logo
                      </p>
                      <LogoContainer>
                        <Label htmlFor="file-input">
                          {logo ? (
                            <LogoPreview src={logo} alt="Logo Preview" />
                          ) : (
                            <Placeholder>
                              <CameraIcon
                                src="https://img.icons8.com/ios-filled/50/000000/camera.png"
                                alt="Camera Icon"
                              />
                              <Text>Add Logo</Text>
                            </Placeholder>
                          )}
                        </Label>
                        <FileInput
                          id="file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </LogoContainer>
                    </div>
                  </div>
                </Container>
                <div className="align-div">
                  <div className="bg-white qr-width p-7 shadow mt-6 sm:m-3">
                    <p className="text-md font-bold text-center">Preview</p>

                    <div className="pp bg-white  w-auto justify-center items-center justify-self-center shadow outline m-3 outline-1">
                      <div ref={qrRef}>
                        <QRCode
                          value={longUrl || "scissors.netlify.app"}
                          size={150}
                          fgColor={color}
                          level={"H"}
                          includeMargin={true}
                          imageSettings={
                            logo
                              ? {
                                  src: logo,
                                  x: null,
                                  y: null,
                                  height: 40,
                                  width: 40,
                                  excavate: true,
                                }
                              : undefined
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="md:p-14"></div>
            <div className="pt-12">
              <button
                type="submit"
                className="mt-5 shadow-2xl h-12 w-full text-center md:hidden  font-bold  bg-green-700 hover:bg-green-800 text-white hover:text-white py-2 px-4 rounded-md transition-colors duration-1000 focus:outline-none focus:ring-2 focus:ring-green-600 active:ring-green-600 text-md"
              >
                Create
              </button>{" "}
              <Link to="/dashboard">
                <button className="mt-5 mb-14 h-12 w-full md:hidden outline-green-800 text-green-600 text-center bg-gray-100 font-bold py-2 px-4 rounded-md transition-colors duration-1000 outline outline-1 focus:outline-none shadow-2xl text-md">
                  Cancel
                </button>
              </Link>
            </div>
          </main>
          <div
            className=" md:bg-white md:fixed header-grid md:w-full
         md:top-auto md:shadow lg:-mr-6 md:min-w-full hidden md:block"
            style={{ zIndex: 1000, top: "91%" }}
          >
            <div className="max-w-9xl flex justify-end mx-auto p-4">
              <Link to="/dashboard">
                <button className="outline-green-800 mx-3 hover:text-green-100 hover:bg-red-600 text-green-600 text-center bg-gray-100 font-bold py-2 px-4 rounded-md transition-colors duration-1000 outline outline-1 focus:outline-none shadow-2xl text-md">
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="font-bold  bg-green-700 mx-3 hover:bg-green-800 text-white hover:text-white py-2 px-4 rounded-md transition-colors duration-1000 focus:outline-none focus:ring-2 focus:ring-green-600 active:ring-green-600 text-md"
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: -5px 0;
`;

const Label = styled.label`
  display: inline-block;
  padding: 20px 20px;
  background-color: #f0f0f0;
  color: #000;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FileInput = styled.input`
  display: none;
`;

const LogoPreview = styled.img`
  max-width: 100px;
  max-height: 100px;
  border-radius: 5px;
`;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 10px;
`;

const CameraIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const Text = styled.span`
  margin-top: 5px;
  font-size: 12px;
  color: #888;
`;
export default CreateLink;
