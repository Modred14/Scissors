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
  { name: "Links", href: "/links", current: true },
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

const Links: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [smallLoading, setSmallLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  const handleCopyClick = async (index: number) => {
    try {
      const textToCopy = links[index].customLink || links[index].shortenedLink;
      await navigator.clipboard.writeText(textToCopy);
      console.log(textToCopy);
      setMessage("You have successfully copied the link.");
      // alert("Text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      setMessage("Oops!! Couldn't copy the link.");
    }
  };

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
        `https://users-api-scissors.onrender.com/users/${userId}/links`,
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
    const storedLinks: Link[] = JSON.parse(
      localStorage.getItem("links") || "[]"
    );
    setLinks(storedLinks);
    setLoading(false);
    setSmallLoading(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "/dashboard";
    setIsLoggedIn(false);
    setUser(null);
  };
  if (typeof links.length === "undefined" ) {
    setSmallLoading(true);
    handleSignOut();
  } 

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
        <header className="bg-white shadow lg:-mr-6 min-w-full">
          <div className="max-w-9xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl max-w-8xl font-bold tracking-tight text-gray-900">
              Links
            </h1>
          </div>
        </header>
        <main>
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
          <div className="mx-auto py-6 max-w-8xl px-4 sm:px-6 lg:px-8">
            <div>
              <p className="mb-3 text-xl font-extrabold">
                Active ({links.length})
              </p>
            </div>
            <div>
              {smallLoading ? (
                <div
                  className="bg-white shadow flex flex-col items-center justify-center"
                  style={{ height: "500px" }}
                >
                  <SmallLoading />
                </div>
              ) : links.length > 0 ? (
                <ul
                  className="bg-white shadow p-7 pt-1"
                  style={{ minHeight: "500px" }}
                >
                  {links
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((link: Link, index: number) => (
                      <li
                        key={link.id}
                        className="border sm:m-4 mt-6 sm:mt-10 pl-0  sm:pl-4 p-4 h-auto bg-gray-100"
                      >
                        <div className="grid grid-flow-row lg:grid-flow-col">
                          <div className="flex sm:pb-0 pb-2 gap-4">
                            <div>
                              {" "}
                              <img
                                src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.mainLink}&size=32`}
                                className="show-link rounded-3xl"
                                alt="link"
                              />
                            </div>
                            <div>
                              <Link
                                to={`/link/${link.id}`}
                                className="text-black hover:underline hover:text-black text-xl font-bold"
                              >
                                <TruncatedWord
                                  word={link.title}
                                  maxLength={maxLength}
                                />
                              </Link>
                              <a
                                className="hover:underline font-semibold"
                                href={link.mainLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <TruncatedWord
                                  word={link.mainLink}
                                  maxLength={maxLinkLength}
                                />
                              </a>
                              {link.customLink ? (
                                <p>
                                  {" "}
                                  <a
                                    className="hover:underline  font-semibold"
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
                              ) : (
                                <p>
                                  {" "}
                                  <a
                                    className="hover:underline font-semibold"
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
                              )}
                              <div className="flex gap-2 text-sm pt-3">
                                <span className="material-icons text-sm">
                                  calendar_today
                                </span>
                                {new Date(link.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <hr
                              className="my-5 mx-0 md:hidden"
                              style={{
                                height: "0.5px",
                                backgroundColor: "rgb(83, 83, 83, 0.5)",
                                border: "none",
                              }}
                            />
                          </div>
                          <div className="flex justify-end">
                            <div className="relative inline-block">
                              <div className="flex gap-2">
                                <button
                                  className="px-2 h-9 grid grid-flow-col font-bold bg-gray-200 text-sm hover:bg-gray-300 rounded"
                                  onClick={() => handleCopyClick(index)}
                                >
                                  <span className="material-icons pt-2 text-sm font-extrabold">
                                    content_copy
                                  </span>
                                  <p className="pt-2 px-1">Copy</p>
                                </button>
                                <Link to={`/edit-link/${link.id}`}>
                                  <button className="px-2 text-black hover:text-black py-2 h-9 grid grid-flow-col font-bold bg-gray-200 text-sm hover:bg-gray-300 rounded">
                                    <span className="material-icons text-sm">
                                      edit
                                    </span>
                                  </button>
                                </Link>
                                <LinkOptions
                                  id={link.id}
                                  userId={user?.id ?? ""}
                                  isLoggedIn={isLoggedIn}
                                  setMessage={setMessage}
                                  customLink={link.customLink}
                                  userPassword={user?.password ?? ""}
                                  smallLoading={smallLoading}
                                  setSmallLoading={setSmallLoading}
                                  setLinks={setLinks}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <div
                  className="bg-white shadow flex flex-col items-center justify-center"
                  style={{ height: "500px" }}
                >
                  <p className="text-xl font-bold text-center mb-4">
                    No link is available
                  </p>
                  <div>
                    <Link to="/create-link">
                      <a href="/create-link">
                        <button className="bg-green-700 hover:bg-green-800 px-4 py-2 mt-0 font-medium text-white duration-500 transition-colors">
                          Create New
                        </button>
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Links;
