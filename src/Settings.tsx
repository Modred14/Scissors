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
import ConfirmationModal from "./ConfirmationModal";

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

const Settings: React.FC<SettingsProps> = ({ onUpdate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasAt = email.includes("@");
  const hasEmailSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(email);
  const [profileImg, setProfileImg] = useState("");
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
        const userData = JSON.parse(storedUserData);
        setUser(userData);
        setEmail(userData.email);
        setFirstName(userData.firstName);
        setProfileImg(userData.profileImg);
        setLastName(userData.lastName);
        setUserPassword(userData.password);
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

  const handleDelete = async (enteredPassword: string) => {
    if (enteredPassword === user?.password) {
      try {
        const response = await fetch(
          `https://users-api-scissors.onrender.com/users/${user?.id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          console.log("Account deleted successfully");
          setMessage("Your account has been successfully deleted.");
          localStorage.removeItem("user");
          window.location.href = "/dashboard";
          setIsModalOpen(false);
        } else {
          setIsModalOpen(false);
          console.error("Failed to delete account");
          setMessage("Failed to delete your account. Please try again.");
        }
      } catch (error) {
        setIsModalOpen(false);
        console.error("Error deleting account:", error);
        setMessage("An error occurred. Please try again.");
      }
    } else {
      setIsModalOpen(false);
      setMessage("Password is incorrect. Account not deleted.");
    }
  };

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
                        </a></Link>
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
                            <Link to= "/profile">
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
                            <Link to= "/profile">
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
      <div style={{ minHeight: "80vh", marginTop: "65px" }}>
        <main className="px-110">
          <div className="pt-7">
            <p className="font-extrabold text-4xl "> Settings</p>
          </div>

          {isLoggedIn ? (
            <div>
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  if (currentPassword && password && confirmPassword) {
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
                <div className="bg-white mb-10 h-full w-full shadow-sm p-7 mt-8 pt-10">
                  <p className="text-3xl -mt-3 pb-5 font-extrabold flex justify-center">
                    User details
                  </p>
                  <div className="grid md:grid-flow-col gap-7  items-center just">
                    <div className="flex items-center justify-center w-full">
                      <div className="rounded-full w-44 outline-green-700 outline">
                        <div
                          className="relative w-44 h-44 rounded-full outline-green-700 outline"
                          onMouseOver={() => setIsHovered(true)}
                          onMouseOut={() => setIsHovered(false)}
                          onClick={() =>
                            document.getElementById("fileInput")?.click()
                          }
                          style={{
                            backgroundImage: `url(${profileImg})`,
                            backgroundSize: "cover",
                          }}
                        >
                          <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                          />
                          {isHovered && (
                            <div className="absolute inset-0  transition-all duration-1000 bg-gray-200 bg-opacity-50 flex items-center justify-center rounded-full">
                              <img
                                src="https://img.icons8.com/ios-filled/50/000000/camera.png"
                                alt="Camera Icon"
                                className="w-10 h-10"
                              />
                            </div>
                          )}
                          <img
                            src={profileImg}
                            alt={user?.firstName}
                            className="rounded-full w-44 h-44 opacity-0"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="hidden2 sm:block">
                      <div className="grid items-center justify-start w-full">
                        <div className="grid grid-flow-row sm:gap-5 gap-2">
                          <div className="sm:grid sm:grid-flow-col sm:gap-7 gap-2 items-center justify-start w-full">
                            <div className=" justify-flex">
                              <div>
                                <p className="text-xl font-bold">First Name</p>
                                <input
                                  required
                                  type="text"
                                  placeholder={user?.firstName}
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
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
                                  required
                                  type="text"
                                  placeholder={user?.lastName}
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
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
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className={`peer h-12 text-xl mt-1 block w-full px-3 mb-2 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                  ${
                    email && !hasAt && hasEmailSymbol
                      ? "border-pink-500 text-pink-600"
                      : "border-slate-300"
                  } rounded-sm text-m shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    ${
                      email && !hasAt && hasEmailSymbol
                        ? "focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        : ""
                    }`}
                                />
                                {email && !hasAt && hasEmailSymbol && (
                                  <p className="mt-1 -mb-2 peer-invalid:visible text-pink-600 text-sm">
                                    Please provide a valid email address.
                                  </p>
                                )}
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
                  <div className="sm:hidden  pt-7">
                    <div className=" w-full">
                      {/* <p className="text-3xl py-2 font-extrabold flex justify-center">User details</p> */}
                      <div className="grid grid-flow-row sm:gap-5 gap-2">
                        <div className="sm:grid sm:grid-flow-col sm:gap-7 gap-2 items-center justify-start w-full">
                          <div className=" ">
                            <div>
                              <p className="text-xl font-bold">First Name</p>
                              <input
                                required
                                type="text"
                                placeholder={user?.firstName}
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                              />
                            </div>
                          </div>
                          <div className="m-30 ">
                            <div>
                              <p className="text-xl font-bold  all">
                                Last Name
                              </p>
                              <input
                                required
                                type="text"
                                placeholder={user?.lastName}
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
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
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`peer h-12 text-xl mt-1 block w-full px-3 mb-2 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                  ${
                    email && !hasAt && hasEmailSymbol
                      ? "border-pink-500 text-pink-600"
                      : "border-slate-300"
                  } rounded-sm text-m shadow-sm placeholder-slate-400
                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                    ${
                      email && !hasAt && hasEmailSymbol
                        ? "focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        : ""
                    }`}
                              />
                              {email && !hasAt && hasEmailSymbol && (
                                <p className="mt-1 -mb-2 peer-invalid:visible text-pink-600 text-sm">
                                  Please provide a valid email address.
                                </p>
                              )}
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
                  <div>
                    <p className="text-xl font-bold sm:pt-3 all">
                      Current Password
                    </p>
                    <input
                      type="text"
                      placeholder=" "
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                    />
                  </div>
                  <div>
                    <p className="text-xl font-bold  all">New Password</p>
                    <input
                      type="text"
                      placeholder=" "
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                    />
                  </div>
                  <div>
                    <p className="text-xl font-bold  all">Confirm Password</p>
                    <input
                      type="text"
                      placeholder=" "
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400
                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                disabled:bg-slate-50 disabled:text-slate-500  disabled:border-slate-200 disabled:shadow-none
              "
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors duration-500"
                  >
                    Update Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-red-700 text-white mt-5 py-2 px-4 rounded-md hover:bg-red-800 transition-colors duration-500"
                  >
                    Delete your account
                  </button>
                </div>
              </form>
              <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div>
              <div className="grid ">
                <div className=" bg-white h-full w-full shadow-sm p-7 pt-10 mt-8">
                  {" "}
                  <p className="flex text-xl items-center justify-center text-center font-bold">
                    You need to log in or sign up first to modify your user
                    data.
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
export default Settings;
