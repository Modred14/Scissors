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
import { Link } from "react-router-dom";
import Loading from "./Loading";
import TruncatedWord from "./TruncatedWord";
import useWindowWidth from "./useWindowWidth";
import SmallLoading from "./SmallLoading"

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
  links: string[];
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

const Profile: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [smallLoading, setSmallLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchLinks();
    }
  }, [isLoggedIn]);

  const windowWidth = useWindowWidth();

  const getMaxLength = (width: number): number => {
    if (width >= 1300) return 70;

    if (width >= 1150) return 65;
    if(width >= 850) return 55;
    // if (width >= 790) return 60;
    if (width >= 720) return 50;
    if (width >= 460) return 30;
    if (width >= 365) return 22;

    return 18;
  };

  const maxLength = getMaxLength(windowWidth);

  const fetchLinks = async () => {
    setSmallLoading(true)
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
      setLoading(false);
      setSmallLoading(false)
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

  // console.log(user?.profileImg);
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
      <div style={{ minHeight: "80vh", marginTop: "65px" }}>
        <main className="px-110 ">
          <div className="pt-7">
            <p className="font-extrabold text-4xl"> Profile</p>
          </div>

          {isLoggedIn ? (
            <div>
              <div className="bg-white mb-10 h-full w-full shadow-sm p-7 mt-8 pt-10">
                <p className="text-3xl -mt-3 pb-5 font-extrabold flex justify-center">
                  User details
                </p>
                <div className="grid md:grid-flow-col gap-7  items-center just">
                  <div className="grid md:grid-flow-col gap-7  items-center just">
                    <div className="flex items-center justify-center w-full">
                      <img
                        src={user?.profileImg}
                        alt={user?.firstName}
                        className="rounded-full max-h-44 w-44 outline-green-700 outline"
                      />
                    </div>
                    <div className="hidden2 sm:block">
                      <div className="grid items-center justify-start w-full">
                        <div className="grid grid-flow-row sm:gap-5 gap-2">
                          <div className="sm:grid sm:grid-flow-col sm:gap-7 gap-2 items-center justify-start w-full">
                            <div className=" justify-flex">
                              <div>
                                <p className="text-xl font-bold">First Name</p>
                                <input
                                  disabled
                                  type="text"
                                  placeholder={user?.firstName}
                                  value={user?.firstName}
                                  className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                                />
                              </div>
                            </div>
                            <div className="m-30 justify-flex">
                              <div>
                                <p className="text-xl font-bold  all">
                                  Last Name
                                </p>
                                <input
                                  disabled
                                  type="text"
                                  placeholder={user?.lastName}
                                  value={user?.lastName}
                                  className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                                />
                              </div>{" "}
                            </div>
                          </div>
                          <div className="grid sm:grid-flow-col sm:gap-7 gap-2 items-center justify-start w-full">
                            <div className="justify-flex">
                              <div>
                                <p className="text-xl font-bold  all">Email</p>
                                <input
                                  type="email"
                                  placeholder="email"
                                  disabled
                                  value={user?.email}
                                  className={`peer h-12 text-xl mt-1 block w-full px-3 mb-2 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
            
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                   `}
                                />
                              </div>
                            </div>
                            <div className="justify-flex">
                              <div>
                                <p className="text-xl font-bold  all">
                                  User Id
                                </p>
                                <input
                                  disabled
                                  type="text"
                                  value={user?.id}
                                  className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sm:hidden pt-7">
                  <div className=" w-full">
                    <div className="grid grid-flow-row sm:gap-5 gap-2">
                      <div className="sm:grid sm:grid-flow-col sm:gap-7 gap-2 items-center justify-start w-full">
                        <div className="w-full">
                          <div>
                            <p className="text-xl font-bold">First Name</p>
                            <input
                              disabled
                              type="text"
                              placeholder={user?.firstName}
                              value={user?.firstName}
                              className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                            />
                          </div>
                        </div>
                        <div className="m-30 ">
                          <div>
                            <p className="text-xl font-bold  all">Last Name</p>
                            <input
                              disabled
                              type="text"
                              placeholder={user?.lastName}
                              value={user?.lastName}
                              className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                            />
                          </div>{" "}
                        </div>
                      </div>
                      <div className=" sm:grid-flow-col sm:gap-7 gap-2 items-center justify-start w-full">
                        <div className="">
                          <div>
                            <p className="text-xl font-bold  all">Email</p>
                            <input
                              type="email"
                              placeholder="email"
                              disabled
                              value={user?.email}
                              className={`peer h-12 text-xl mt-1 block w-full px-3 mb-2 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none`}
                            />
                          </div>
                        </div>
                        <div className=" mt-5">
                          <div>
                            <p className="text-xl font-bold  all">User Id</p>
                            <input
                              disabled
                              type="text"
                              value={user?.id}
                              className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid items-center justify-normal">
                  <div className="flex mt-9 mb-2 justify-start text-xl font-extrabold">
                    Links({links.length})
                  </div>
                  {smallLoading ? (
              <div
                className="mt-7 bg-gray-200 shadow flex flex-col items-center justify-center"
                style={{ height: "300px" }}
              >
                <SmallLoading />
              </div>
            ) : links.length > 0 ? (
                    <ul
                      className="bg-gray-200"
                      style={{ minHeight: "300px" }}
                    >
                      {links
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        )
                        .map((link: any) => (
                          <li
                            key={link.id}
                            className="border m-2 p-4 h-auto bg-gray-100"
                          >
                            <div className="grid grid-flow-row lg:grid-flow-col">
                              <div className="flex sm:pb-0 pb-2 gap-4">
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
                                </div>{" "}
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <div
                      className="bg-gray-200 flex flex-col items-center justify-center"
                      style={{ height: "300px" }}
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
            </div>
          ) : (
            <div>
              <div className="  grid ">
                <div className=" bg-white h-full w-full shadow-sm p-7 pt-10 mt-8">
                  {" "}
                  <p className="flex items-center text-xl justify-center text-center font-bold">
                    You need to log in or sign up first to view your profile
                    details.
                  </p>{" "}
                  <Link to="/login">
                    <button className="w-full shadow-2xl transition-colors bg-green-700 text-base text-white mt-12 rounded-none py-2 px-2  font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="w-full shadow-2xl transition-colors bg-green-700 text-base mt-5 text-white rounded-none py-2 px-2 font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                      Get Started ➔
                    </button>
                  </Link>
                </div>{" "}
              </div>
              <div></div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};
export default Profile;
