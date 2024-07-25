import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import Loading from "./Loading";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;
  links: string[];
}

const navigation = (isLoggedIn: boolean) => [
  { name: "Home", href: "/", current: true },
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

const LandingPage: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
    try {
      const response = await axios.get<User[]>("http://localhost:5000/users");
      if (response.status === 200 && response.data.length > 0) {
        setUser(response.data[0]);
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
        <main>
          <div className="px-6 lg:px-14 mt-0 grid lg:grid-cols-2 lg:grid-flow-col md:mb-10 mb-0">
            <div>
              <p className=" pt-24 md:pt-48 px-0 text-6xl small-text  font-extrabold">
                Create faster <br /> digital connections
              </p>
              <p className=" text-2xl smaller-text  pt-2 md:pt-5">
                Use our custom link editor, QR Code generator, and url shortner
                to engage your audience and get them to the right information
                more quickly. Create, modify, and track everything using
                Scissors.
              </p>
              <div className="md:grid md:grid-flow-col mt-5 md:gap-10 md:w-72">
                <Link to="/signup">
                  <button className="w-full shadow-2xl transition-colors bg-green-700 text-xl text-white py-2 px-2 mt-3 font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                    Get Started ➔
                  </button>
                </Link>
                <Link to="/login">
                  <button className="w-full shadow-2xl  transition-colors bg-green-700 text-xl text-white py-2 px-2 mt-3 font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                    Log In
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex mt-12 md:mt-24 flex-col justify-center items-center">
              <img src="src/home.png" alt="home image" />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="grid justify-center items-center">
              <p className="pt-14 px-6 lg:px-14 text-5xl small-text font-extrabold text-center">
                The Scissors Connections Platform
              </p>
            </div>
            <p className="max-w-6xl px-6 lg:px-14 text-2xl smaller-text pt-2 md:pt-5">
              Use of service to get your url shortened, edit your links to suit
              your brand, generate QR code for your links and view the analytics
              of your generated urls. You can also use the links and codes
              generated with our services to give your audience the right
              information.
            </p>
            <Link to="/signup">
              <button className="w-48 shadow-2xl  transition-colors bg-green-700 text-xl text-white py-2 px-2 mt-12 font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                Get Started ➔
              </button>
            </Link>
            <div className="px-12 grid md:max-w-6xl mt-12 md:grid-cols-3 gap-10 md:grid-flow-col md:px-6">
              <div className=" outline outline-1 shadow-lg thecard">
                <div className="thefront">
                  <img src="src/random.png" alt="Url shortner" />
                  <div>
                    <p className="font-bold text-2xl py-3 px-3">
                      🔗 URL Shortner
                    </p>
                    <p className="font-bold text-sm pb-3 px-3">
                      A full-service approach to help strengthen each and every
                      point of contact your audience has with your content.
                    </p>
                  </div>
                </div>
                <div className="theback">
                  <p className="font-bold text-base pb-3 pt-10 px-4">
                    We offer a comprehensive service to enhance every point of
                    contact your audience has with your content, ensuring
                    stronger engagement and connection. By addressing each
                    touchpoint, we help create a cohesive and impactful brand
                    presence that resonates with your audience.
                  </p>
                  <Link to="/signup">
                    <button className="w-full shadow-2xl transition-colors bg-green-700 text-base text-white rounded-none py-2 px-2 mt-12 font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                      Get Started ➔
                    </button>
                  </Link>
                </div>
              </div>
              <div className="outline outline-1 shadow-lg thecard">
                <div className="thefront">
                  <img src="src/qrcode.png" alt="QR Code" />
                  <div>
                    <p className="font-bold text-2xl py-3 px-3">🀫 QR Codes</p>
                  </div>
                  <p className="font-bold text-sm pb-3 px-3">
                    QR Code solutions for every brand, business, and customer
                    interaction.
                  </p>
                </div>
                <div className="theback">
                  <p className="font-bold text-base pb-3 pt-10 px-4">
                    QR Code solutions for every brand, business, and customer
                    interaction. Our service ensures seamless integration and
                    enhanced engagement across all touchpoints, providing
                    reliable and efficient ways to connect with your audience
                    through customized QR codes.
                  </p>
                  <Link to="/signup">
                    <button className="w-full shadow-2xl transition-colors bg-green-700 text-base text-white rounded-none py-2 px-2 mt-12 font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                      Get Started ➔
                    </button>
                  </Link>
                </div>
              </div>
              <div className="outline outline-1 shadow-lg thecard">
                <div className="thefront">
                  <img src="src/url.png" alt="Url shortner" />
                  <div>
                    <p className="font-bold text-2xl py-3 px-3">
                      🌐 Custom Links
                    </p>
                  </div>
                  <p className="font-bold text-sm pb-3 px-3">
                    Simply type the link you want, and if the domain is
                    available, you will secure your personalized custom URL.
                  </p>
                </div>
                <div className="theback">
                  {" "}
                  <p className="font-bold text-base pb-3 pt-10 px-4">
                    Type the link you want, and if the domain is available, you
                    will secure your personalized custom URL. This ensures you
                    get a unique and memorable link tailored to your needs,
                    enhancing your brand’s online presence and making it easier
                    for customers to find and engage with you.
                  </p>
                  <Link to="/signup">
                    <button className="w-full shadow-2xl bg-green-700 transition-colors text-base text-white rounded-none py-2 px-2 mt-12 font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                      Get Started ➔
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex bg-green-900 mt-24 mb-0 pb-14 pt-14 md:py-28 flex-col items-center justify-center">
            <div className="grid  justify-center items-center">
              <p className=" pb-5 text-white px-6 max-w-6xl lg:px-14 text-5xl small-text font-extrabold text-center">
                Adopted and cherished by millions of users for more than a
                decade
              </p>
              <div className="max-w-7xl px-5 grid mt-12 shadow-xl lg:grid-cols-4 gap-2 lg:grid-flow-col md:px-6 correct-grid">
                <div className="bg-gray-300 p-5 md:p-10 font-bold text-xl rounded-xl">
                  <p className="text-6xl">
                    🌍 <br />
                    10M+
                  </p>
                  <p className="pl-2">Global customers</p>
                </div>
                <div className="bg-gray-300 shadow-xl p-5 md:p-10 font-bold text-xl rounded-xl">
                  <p className="text-6xl">
                    🔗 <br />
                    390M
                  </p>
                  <p className="pl-2">Links & QR Codes created monthly</p>
                </div>
                <div className="bg-gray-300 shadow-xl p-5 md:p-10 font-bold text-xl rounded-xl">
                  <p className="text-6xl">
                    💻 <br />
                    12k+
                  </p>
                  <p className="pl-2">App integrations</p>
                </div>
                <div className="bg-gray-300 p-5 shadow-xl md:p-10 font-bold text-xl rounded-xl">
                  <p className="text-6xl">
                    🌐 <br />
                    15B
                  </p>
                  <p className="pl-2">Connections (clicks & scans monthly)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-20 pt-0 flex-col items-center justify-center">
            <div>
              <p className=" px-6 lg:px-14 text-5xl small-text font-extrabold text-center">
                More than a link shortener
              </p>
              <p className="text-xl max-w-6xl px-6 lg:px-14 font-bold pt-3 text-center">
                Understanding how your clicks and scans are performing should be
                as simple as making them. Manage, assess, and enhance all your
                connections in one location.
              </p>
            </div>
            <Link to="/signup">
              <button className="w-48 justify-self-center justify-center outline outline-black bg-gray-100 shadow-xl text-lg text-green-600 rounded-lg transition-colors py-2  px-2 mt-12 font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                Get Started ➔
              </button>
            </Link>
          </div>
          <div className="h-28"></div>
        </main>
      </div>
    </>
  );
};

export default LandingPage;
