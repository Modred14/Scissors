import React from "react";
import {
  FaFacebook,
  FaGoogle,
  FaTwitter,
  FaEnvelope,
  FaSlack,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-5 text-center">
      <div className="mt-4 grid lg:grid-flow-col justify-center space-x-6">
        <div className=" grid grid-flow-col pr-5">
          <div className="disappear">
            <div className="pt-0 mt-0 flex text-left flex-col space-x-6">
              <p></p>
              <p className="hover:text-green-700   font-extrabold text-xl text-green-600">
                Solutions
              </p>
              <a href="#" className="text-white  font-bold hover:text-gray-400">
                Healthcare
              </a>
              <a href="#" className="text-white  font-bold hover:text-gray-400">
                Insurance
              </a>
              <a
                href="#dashboard"
                className="text-white  font-bold hover:text-gray-400"
              >
                Financial Services
              </a>
              <a href="#" className="text-white  font-bold hover:text-gray-400">
                Education
              </a>
              <a href="#" className="text-white  font-bold hover:text-gray-400">
                Professional Services
              </a>
              <a href="#" className="text-white  font-bold hover:text-gray-400">
                Retail
              </a>
              <a href="#" className="text-white  font-bold hover:text-gray-400">
                Consumer Packaged Goods
              </a>
              <a href="#" className="text-white  font-bold hover:text-gray-400">
                Tech Software & Hardware
              </a>
              <a href="#" className="text-white  font-bold hover:text-gray-400">
                Media & Entertainment
              </a>
            </div>
          </div>
          <div className="pt-0 mt-0 flex text-left flex-col space-x-6">
            <p></p>
            <p className="hover:text-green-700   font-extrabold text-xl text-green-600">
              Products
            </p>
            <a
              href="/create-link"
              className="text-white  font-bold hover:text-gray-400"
            >
              Url Shortner
            </a>
            <a
              href="/create-link"
              className="text-white  font-bold hover:text-gray-400"
            >
              Qr Code
            </a>
            <a
              href="/create-link"
              className="text-white  font-bold hover:text-gray-400"
            >
              Custom Domain
            </a>
            <a
              href="/create-link"
              className="text-white  font-bold hover:text-gray-400"
            >
              Analytics
            </a>
          </div>

          <div className="pt-0 mt-0 flex text-left flex-col space-x-6">
            <p></p>
            <p className="hover:text-green-700   font-extrabold text-xl text-green-600">
              Scissors
            </p>
            <a href="/" className="text-white  font-bold hover:text-gray-400">
              Home
            </a>
            <a href="/" className="text-white  font-bold hover:text-gray-400">
              About Us
            </a>
            <a
              href="/dashboard"
              className="text-white  font-bold hover:text-gray-400"
            >
              Services
            </a>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Contact
            </a>
          </div>
        </div>
        <div className="lg:pt-0 pt-5 grid grid-flow-col pr-5">
          <div className="pt-0 -ml-6 mt-0 flex text-left flex-col space-x-6">
            <p></p>
            <p className="hover:text-green-700   font-extrabold text-xl text-green-600">
              Resources
            </p>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Blog
            </a>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Resource Library
            </a>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Help Center
            </a>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Apps and Integrations
            </a>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Mobile App
            </a>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Developers
            </a>
          </div>
          <div className="pt-0 mt-0 flex text-left flex-col space-x-6">
            <p></p>
            <p className="hover:text-green-700   font-extrabold text-xl text-green-600">
              Legal
            </p>
            <a
              href="/privacy-policy"
              className="text-white  font-bold hover:text-gray-400"
            >
              Privacy Policy
            </a>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Cookie Policy
            </a>
            <a
              href="/terms-of-service"
              className="text-white  font-bold hover:text-gray-400"
            >
              Terms of Service
            </a>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Transparency Report
            </a>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Code of Conduct
            </a>
            <a href="#" className="text-white  font-bold hover:text-gray-400">
              Developers
            </a>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <hr className="my-12 " style={{ width: "80%" }} />
      </div>
      <div className="grid grid-flow-col gap-0">
        <div className="mb-4 grid lg:grid-flow-col max-w-8xl   justify-centr space-x-6">
          <div className="mb-4 pb-5 flex items-center space-x-6 justify-center">
            <p className="hover:text-green-700 font-extrabold justify-center lg:pl-14 flex text-adjuster text-green-600">
              Scissors
            </p>
          </div>
          <div className="mb-4 pb-5 md:flex items-center justify-center space-x-6 pr-14 lg:pr-10">
            <a
              href="#"
              className="text-white flex items-center justify-center gap-2 hover:text-gray-400"
            >
              © 2024 Scissors | Handmade in Nigeria.
            </a>
            <div className="mb-4 mt-0 pt-4 flex items-center justify-center space-x-6">
              <a
                href="https://facebook.com"
                className="text-white text-2xl hover:text-gray-400"
              >
                <FaFacebook />
              </a>
              <a
                href="https://google.com"
                className="text-white text-2xl hover:text-gray-400"
              >
                <FaGoogle />
              </a>
              <a
                href="https://twitter.com"
                className="text-white text-2xl hover:text-gray-400"
              >
                <FaTwitter />
              </a>
              <a
                href="mailto:favourdomirin@gmail.com"
                className="text-white text-2xl hover:text-gray-400"
              >
                <FaEnvelope />
              </a>
              <a
                href="https://slack.com"
                className="text-white text-2xl hover:text-gray-400"
              >
                <FaSlack />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
