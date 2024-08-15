import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import Footer from "./Footer";

const Policy: React.FC = () => {
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
        Privacy Policy
      </p>
      <p className="pt-8 text-center text-4xl font-comic text-gray-600 font-bold">
        Version 1.0
      </p>
      <p
        className="pt-8 text-center text-4xl font-comic text-gray-600 font-bold"
        style={{ paddingLeft: "10%", paddingRight: "10%" }}
      >
        Last Updated: July 9,2024
      </p>
      <div className="font-comic">
        <p
          className="text-xl text-gray-600"
          style={{ padding: "10%", paddingTop: "25px", paddingBottom: "10px" }}
        >
          At Scissors, we are committed to protecting your privacy. This Privacy
          Policy explains how we collect, use, disclose, and safeguard your
          information when you visit our website (&quot;Site&quot;) and use our
          services (&quot;Services&quot;). By accessing or using the Site or
          Services, you agree to the terms of this Privacy Policy. If you do not
          agree with the terms of this Privacy Policy, please do not use the
          Site or Services.
        </p>
        <p
          className="text-2xl font-bold text-gray-800"
          style={{ padding: "10%", paddingTop: "25px", paddingBottom: 0 }}
        >
          1. Information We Collect
        </p>
        <p
          className="text-xl text-gray-600"
          style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
        >
          We collect various types of information in connection with the
          services we provide, including:
          <li>
            Personal Information: When you create an account, we may collect
            personal information such as your name, email address, and password.
          </li>
          <li>
            Usage Data: We collect information about your interactions with our
            Site and Services, such as the links you create, the QR codes you
            generate, and the analytics related to link usage.
          </li>
          <li>
            Log Data: Our servers automatically record information (&quot;Log
            Data&quot;) when you use the Site. This Log Data may include your IP
            address, browser type, the pages you visit, and the time spent on
            those pages.
          </li>
          <li>
            Cookies and Tracking Technologies: We use cookies and similar
            tracking technologies to track the activity on our Site and hold
            certain information. Cookies are files with a small amount of data
            that are sent to your browser from a website and stored on your
            device.
          </li>
        </p>
        <p
          className="text-2xl font-bold text-gray-800"
          style={{ padding: "10%", paddingTop: "25px", paddingBottom: 0 }}
        >
          How We Use Your Information
        </p>
        <p
          className="text-xl text-gray-600"
          style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
        >
          We use the information we collect to:
          <li>
            Provide, operate, and maintain the Site and Services: Your
            information helps us deliver the services you request, including URL
            shortening, QR code generation, and analytics tracking.
          </li>
          <li>
            Improve, personalize, and expand our Site and Services: We analyze
            how users interact with our Site and Services to identify areas for
            improvement, develop new features, and tailor our offerings to meet
            user needs.
          </li>
          <li>
            Understand and analyze how you use our Site and Services: Usage data
            allows us to gain insights into user behavior, preferences, and
            trends, which helps us optimize the user experience and enhance the
            functionality of our services.
          </li>
          <li>
            Prevent fraudulent or unauthorized activities: We take measures to
            detect and prevent fraudulent activities, unauthorized access, and
            other harmful actions that could compromise the security and
            integrity of our Site and Services.
          </li>
        </p>
        <p
          className="text-2xl font-bold text-gray-800"
          style={{ padding: "10%", paddingTop: "25px", paddingBottom: 0 }}
        >
          3. Data Security
        </p>
        <p
          className="text-xl text-gray-600"
          style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
        >
          We take data security seriously and implement appropriate measures to
          protect your information. Here are some of the security practices we
          employ:
          <li>
            Access Controls: We implement access controls to restrict access to
            your personal information to authorized personnel only. Our
            employees and contractors are bound by confidentiality obligations
            and undergo regular security training.
          </li>
          <li>
            Regular Audits and Assessments: We conduct regular audits and
            assessments of our security practices to identify and address
            vulnerabilities. This helps us maintain a secure environment and
            protect your information from unauthorized access, disclosure, or
            misuse.
          </li>
          <li>
            Incident Response: In the event of a data breach or security
            incident, we have established protocols to respond promptly and
            effectively. We will notify affected users and take necessary steps
            to mitigate the impact and prevent future occurrences.
          </li>
        </p>
        <p
          className="text-2xl font-bold text-gray-800"
          style={{ padding: "10%", paddingTop: "25px", paddingBottom: 0 }}
        >
          4. Third-Party Services and Links
        </p>
        <p
          className="text-xl text-gray-600"
          style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
        >
          Our Site may contain links to third-party websites, services, or
          applications. This Privacy Policy does not apply to those third-party
          services, and we are not responsible for their privacy practices. We
          encourage you to review the privacy policies of any third-party
          services you interact with.
        </p>
        <p
          className="text-2xl font-bold text-gray-800"
          style={{ padding: "10%", paddingTop: "25px", paddingBottom: 0 }}
        >
          5. Data Retention
        </p>
        <p
          className="text-xl text-gray-600"
          style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
        >
          We retain your personal information for as long as necessary to
          fulfill the purposes outlined in this Privacy Policy unless a longer
          retention period is required or permitted by law. When your
          information is no longer needed, we will securely delete or anonymize
          it.
        </p>
        <p
          className="text-2xl font-bold text-gray-800"
          style={{ padding: "10%", paddingTop: "25px", paddingBottom: 0 }}
        >
          6. Your Rights and Choices
        </p>
        <p
          className="text-xl text-gray-600"
          style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
        >
          Depending on your jurisdiction, you may have certain rights and
          choices regarding your personal information. These may include:
          <li>
            Access and Rectification: You have the right to access and update
            your personal information. If you believe that any information we
            hold about you is inaccurate or incomplete, you can request
            corrections or updates.
          </li>
          <li>
            Data Portability: In certain circumstances, you may have the right
            to request a copy of your personal information in a structured,
            commonly used, and machine-readable format. You can also request
            that we transfer this information to another data controller.
          </li>
          <li>
            Deletion and Erasure: You can request the deletion or erasure of
            your personal information, subject to certain exceptions. Please
            note that we may need to retain certain information for legal or
            legitimate business purposes.
          </li>
          <li>
            Objection and Restriction: You have the right to object to the
            processing of your personal information or request restrictions on
            its processing. This may include opting out of marketing
            communications or limiting the use of your data for certain
            purposes.
          </li>
        </p>
        <p
          className="text-2xl font-bold text-gray-800"
          style={{ padding: "10%", paddingTop: "25px", paddingBottom: 0 }}
        >
          7. Changes to This Privacy Policy
        </p>
        <p
          className="text-xl text-gray-600"
          style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
        >
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or legal requirements. We will notify you of any
          material changes by posting the updated Privacy Policy on our Site and
          indicating the effective date of the revisions. Your continued use of
          the Site and Services after the effective date constitutes your
          acceptance of the updated Privacy Policy.
        </p>
        <p
          className="text-2xl font-bold text-gray-800"
          style={{ padding: "10%", paddingTop: "25px", paddingBottom: 0 }}
        >
          8. Contact Us
        </p>
        <p
          className="text-xl text-gray-600"
          style={{ padding: "10%", paddingTop: 0, paddingBottom: "10px" }}
        >
          If you have any questions, concerns, or requests regarding this
          Privacy Policy or our privacy practices, please contact us at:
          Scissors Email:
          <a href="mailto:favourdomirin@gmail.com">favourdomirin@gmail.com</a>
        </p>
      </div>
      <div className="flex items-center justify-center">
        <img
          src="/Scissors_logo.png"
          alt="Scissors"
          className="w-48 my-24 animate-bounce duration-1000 ease-linear"
          style={{ animationDuration: "3s" }}
        />
      </div>
      <div className="flex items-center justify-center mb-16">
        <img src="/Scissors_logo.png" alt="Scissors" className="sm:w-32 w-20" />
        <p className="font-extrabold text-adjust">Scissors</p>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};
export default Policy;
