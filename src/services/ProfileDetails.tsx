import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { handleSignOut } from "./authService";

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
interface ProfileProps {
  loading: boolean;
}

const Profile: React.FC<ProfileProps> = ({ loading }) => {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [smallLoading, setSmallLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true);
      fetchUserData();
    }
  }, []);

  const handleSignOutButton = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    handleSignOut();
  };
  const fetchUserData = async () => {
    try {
      const storedUserData = localStorage.getItem("user");
      if (storedUserData) {
        const parsedUser = JSON.parse(storedUserData);
        setUser(parsedUser);
        fetchLinks(parsedUser.id);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchLinks = async (userId: string) => {
    setSmallLoading(true);
    try {
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
      setSmallLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ minHeight: "80vh", marginTop: "65px" }}>
      <main className="px-110">
        <div className="pt-7">
          <p className="font-extrabold text-4xl">Profile</p>
        </div>

        {isLoggedIn ? (
          <div>
            <div className="bg-white mb-10 h-full w-full shadow-sm p-7 mt-8 pt-10">
              <p className="text-3xl -mt-3 pb-5 font-extrabold flex justify-center">
                User details
              </p>
              <div className="grid md:grid-flow-col gap-7 items-center">
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
                        <div>
                          <p className="text-xl font-bold">First Name</p>
                          <input
                            disabled
                            type="text"
                            value={user?.firstName}
                            className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <p className="text-xl font-bold">Last Name</p>
                          <input
                            disabled
                            type="text"
                            value={user?.lastName}
                            className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-flow-col sm:gap-7 gap-2 items-center justify-start w-full">
                        <div>
                          <p className="text-xl font-bold">Email</p>
                          <input
                            type="email"
                            disabled
                            value={user?.email}
                            className="peer h-12 text-xl mt-1 block w-full px-3 mb-2 py-2 bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <p className="text-xl font-bold">User Id</p>
                          <input
                            disabled
                            type="text"
                            value={user?.id}
                            className="peer h-12 mt-1 block w-full px-3 mb-4 py-2 text-xl bg-white border border-slate-300 rounded-md text-m shadow-sm placeholder-slate-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid items-center justify-normal">
                <div className="flex mt-9 mb-2 justify-start text-xl font-extrabold">
                  Links ({links.length})
                </div>
                {smallLoading ? (
                  <div
                    className="mt-1 bg-gray-200 shadow flex flex-col items-center justify-center"
                    style={{ height: "300px" }}
                  >
                    Loading...
                  </div>
                ) : links.length > 0 ? (
                  <ul className="bg-gray-200" style={{ minHeight: "300px" }}>
                    {links
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((link) => (
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
                                  {link.title}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <div
                    className="mt-1 bg-gray-200 flex flex-col items-center justify-center"
                    style={{ height: "300px" }}
                  >
                    <p className="text-xl font-bold text-center mb-4">
                      No link is available
                    </p>
                    <Link to="/create-link">
                      <button className="bg-green-700 hover:bg-green-800 px-4 py-2 mt-0 font-medium text-white duration-500 transition-colors">
                        Create New
                      </button>
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleSignOutButton}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded"
                >
                  sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid">
            <div className="bg-white h-full w-full shadow-sm p-7 pt-10 mt-8">
              <p className="flex items-center text-xl justify-center text-center font-bold">
                You need to log in or sign up first to view your profile
                details.
              </p>
              <Link to="/login">
                <button className="w-full shadow-2xl transition-colors bg-green-700 text-base text-white mt-12 rounded-none py-2 px-2 font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                  Login
                </button>
              </Link>
              <button
                onClick={handleSignOutButton}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 text-white rounded"
              >
                sign Out
              </button>

              <Link to="/signup">
                <button className="w-full shadow-2xl transition-colors bg-green-700 text-base mt-5 text-white rounded-none py-2 px-2 font-semibold hover:bg-green-800 duration-1000 hover:text-white">
                  Get Started ➔
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
