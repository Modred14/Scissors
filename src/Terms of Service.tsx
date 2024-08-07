import React,{ useEffect, useState } from "react";
import Loading from "./Loading";
import "./control-width.css";

const Terms: React.FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <div>
      <p className="pt-12 text-center text-6xl text-gray-600 font-bold">
        Terms of Service
      </p>
      <p className="pt-8 text-center text-4xl font-comic text-gray-600 font-bold">
        Version 1.0
      </p>
      <p className="pt-8 text-center text-4xl font-comic text-gray-600 font-bold" style={{ paddingLeft: "10%", paddingRight: "10%"}}>
        Last Updated: July 9,2024
      </p>
      <p
        className="text-xl text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: "25px", paddingBottom: "10px" }}
      >
        Welcome to Scissors! These Terms of Service ("Terms") govern your use of
        the Scissors website ("Site") and the services provided by Scissors
        ("Services"). By accessing or using the Site or Services, you agree to
        be bound by these Terms. If you do not agree to these Terms, please do
        not use the Site or Services.
      </p>
      <p
        className="text-2xl font-bold text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: 0 }}
      >
        1. Acceptance of Terms
      </p>
      <p
        className="text-xl text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
      >
        By using the Site or Services, you affirm that you are at least 10 years
        old and have the legal capacity to enter into these Terms. If you are
        using the Site or Services on behalf of an organization, you represent
        and warrant that you have the authority to bind the organization to
        these Terms.
      </p>
      <p
        className="text-2xl font-bold text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: 0 }}
      >
        2. Description of Services
      </p>
      <p
        className="text-xl text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
      >
        Scissors provides users with tools to create QR codes, generate custom
        links, and access analytics related to link usage. These services
        include but are not limited to URL shortening, QR code generation, and
        link analytics.
      </p>
      <p
        className="text-2xl font-bold text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: 0 }}
      >
        3. User Accounts
      </p>
      <p
        className="text-xl text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
      >
        To access certain features of the Services, you may need to create an
        account. You agree to provide accurate, current, and complete
        information during the registration process and to update such
        information to keep it accurate, current, and complete. You are
        responsible for safeguarding your password and for all activities that
        occur under your account.
      </p>
      <p
        className="text-2xl font-bold text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: 0 }}
      >
        4. Use of Services
      </p>
      <p
        className="text-xl text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
      >
        You agree to use the Services only for lawful purposes and in compliance
        with all applicable laws and regulations. You shall not use the Services
        to:
        <li>Create or distribute malicious links or content. </li>
        <li>Infringe upon the intellectual property rights of others.</li>
        <li>Engage in any activity that could harm or disrupt the Services.</li>
      </p>
      <p
        className="text-2xl font-bold  font-comic text-gray-600"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: 0 }}
      >
        5. Intellectual Property
      </p>
      <p
        className="text-xl text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
      >
        All content and materials available on the Site, including but not
        limited to text, graphics, website name, code, images, and logos, are
        the intellectual property of Scissors and are protected by applicable
        copyright and trademark law. Unauthorized use of any content or
        materials is prohibited.
      </p>
      <p
        className="text-2xl font-bold  font-comic text-gray-600"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: 0 }}
      >
        6. Privacy
      </p>
      <p
        className="text-xl text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
      >
        Your use of the Site and Services is also governed by our Privacy
        Policy, which is incorporated into these Terms by reference. Please
        review the Privacy Policy to understand our practices regarding your
        personal information.
      </p>
      <p
        className="text-2xl font-bold  font-comic text-gray-600"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: 0 }}
      >
        7. Limitation of Liability
      </p>
      <p
        className="text-xl text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
      >
        To the maximum extent permitted by law, Scissors shall not be liable for
        any indirect, incidental, special, consequential, or punitive damages,
        or any loss of profits or revenues, whether incurred directly or
        indirectly, or any loss of data, use, goodwill, or other intangible
        losses, resulting from (a) your use or inability to use the Services;
        (b) any unauthorized access to or use of our servers and/or any personal
        information stored therein; (c) any interruption or cessation of
        transmission to or from the Services; (d) any bugs, viruses, trojan
        horses, or the like that may be transmitted to or through our Services
        by any third party; or (e) any errors or omissions in any content or for
        any loss or damage incurred as a result of your use of any content
        posted, emailed, transmitted, or otherwise made available through the
        Services.
      </p>
      <p
        className="text-2xl font-bold  font-comic text-gray-600"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: 0 }}
      >
        8. Modifications to Services
      </p>
      <p
        className="text-xl text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
      >
        Scissors reserves the right to modify or discontinue, temporarily or
        permanently, the Site or Services (or any part thereof) with or without
        notice. You agree that Scissors shall not be liable to you or to any
        third party for any modification, suspension, or discontinuance of the
        Site or Services.
      </p>
      <p
        className="text-2xl font-bold text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: 0 }}
      >
        9. Governing Law
      </p>
      <p
        className="text-xl text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
      >
        These Terms shall be governed by and construed in accordance with the
        laws of Nigeria, without regard to its conflict of law principles.
      </p>
      <p
        className="text-2xl font-bold text-gray-600  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom: 0 }}
      >
        10. Contact Information
      </p>
      <p
        className="text-xl text-gray-600 pb-0  font-comic"
        style={{ padding: "10%", paddingTop: 0, paddingBottom:0 }}
      >
        If you have any questions about these Terms, please contact us at
        <a href="mailto:favourdomirin@gmail.com"> favourdomirin@gmail.com</a>
        <br /> 
        By using the Site or Services, you acknowledge that you have read,
        understood, and agree to be bound by these Terms of Service.
      </p>
      <div className="flex items-center justify-center">
        <img src="/Scissors_logo.png" alt="Scissors" className="w-48 my-24 animate-bounce duration-1000 ease-linear" style={{animationDuration:"3s"}}/>
        
      </div>
      <div className="flex items-center justify-center mb-16">
        <img src="/Scissors_logo.png" alt="Scissors" className="sm:w-32 w-20" />
        <p className="font-extrabold text-adjust">Scissors</p>
        </div>
    </div>
  );
};

export default Terms;
