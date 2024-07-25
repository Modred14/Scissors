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
import LinkOptions from "./LinkOptions";

interface User {
  firstName: string;
  lastName: string;
  profileImg: string;
}
type Link = {
  title: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data);
      } else {
        console.error("Failed to fetch user data");
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
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        `http://localhost:5000/users/${userId}/links`,
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
    }
  };

  const fetchLinksFromLocalStorage = () => {
    const storedLinks: Link[] = JSON.parse(
      localStorage.getItem("links") || "[]"
    );
    setLinks(storedLinks);
    setLoading(false);
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
      <div className="fixed header-grid w-full">
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
                        src="src/Scissors_logo.png"
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
        <header className="bg-white shadow lg:-mr-6 min-w-full">
          <div className="max-w-9xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl max-w-8xl font-bold tracking-tight text-gray-900">
              Links
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto py-6 max-w-8xl px-4 sm:px-6 lg:px-8">
            <div>
              <p className="mb-3 text-xl font-extrabold">
                Active ({links.length})
              </p>
            </div>
            <div>
              {links.length > 0 ? (
                <ul className="bg-white shadow p-7 pt-1">
                  {links
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    )
                    .map((link: any) => (
                      <li
                        key={link.createdAt}
                        className="border m-4 mt-12 p-4 h-auto bg-gray-100"
                      >
                        <div className="grid grid-flow-row md:grid-flow-col">
                          <div className="flex gap-4">
                            <div >
                              {" "}
                              <img
                                src={`https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${link.mainLink}&size=32`}
                                className="show-link"
                                alt="link"
                              />
                            </div>
                            <div>
                              <div className="text-xl font-bold">
                                {link.title}
                              </div>
                              <a
                                className=" font-semibold"
                                href={link.mainLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.mainLink}
                              </a>
                              <br />
                              <a
                                className=" font-semibold"
                                href={link.shortenedLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.shortenedLink}
                              </a>
                              <a
                                className=" font-semibold"
                                href={link.customLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.customLink}
                              </a>
                              <div>{link.createdAt}</div>
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
                            <LinkOptions />
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
                    <a href="/create-link">
                      <button className="bg-green-700 hover:bg-green-800 px-4 py-2 mt-0 font-medium text-white duration-500 transition-colors">
                        Create New
                      </button>
                    </a>
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
