import { useEffect } from "react";
import { analytics } from "./firebaseConfig";
import { FirebaseError } from "firebase/app";
import { logEvent } from "firebase/analytics";
import {
  getFirestore,
  doc,
  setDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";
import { getUserLocation } from "./LocationService";
import { getAuth } from "firebase/auth";

interface TrackLinkProps {
  link: {
    id: string;
    mainLink: string;
    customLink: string;
    shortenedLink: string;
    createdAt: string;
  };
}

const TrackLink: React.FC<TrackLinkProps> = ({ link }) => {
  useEffect(() => {
    const logLinkClick = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.warn(
            "User is not authenticated. Skipping Firestore logging."
          );
          return;
        }

        if (!link) {
          console.warn(
            "Link is null or undefined. Skipping Firestore logging."
          );
          return;
        }

        const location = await getUserLocation().catch(() => ({
          city: "Unknown",
          country_name: "Unknown",
        }));

        logEvent(analytics, "link_click", {
          linkId: link.id,
          mainLink: link.mainLink,
          customLink: link.customLink,
          shortenedLink: link.shortenedLink,
          referrer: document.referrer || "direct",
          timestamp: new Date().toISOString(),
          createdAt: link.createdAt,
          city: location.city,
          country: location.country_name,
        });

        const db = getFirestore();
        const linkClickRef = doc(db, "link_clicks", link.id);

        await setDoc(
          linkClickRef,
          {
            mainLink: link.mainLink,
            customLink: link.customLink,
            shortenedLink: link.shortenedLink,
            clicks: arrayUnion({
              referrer: document.referrer || "direct",
              createdAt: link.createdAt,
              timestamp: new Date().toISOString(),
              location: {
                city: location.city,
                country: location.country_name,
              },
            }),
            clickCount: increment(1),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error logging link click:", error);
        if (error instanceof FirebaseError) {
          console.error("FirebaseError code:", error.code);
        }
      }
    };

    logLinkClick();
  }, [link]);

  return (
    <>
      <a href={link.mainLink}>Main Link</a>
      <a href={link.customLink}>Custom Link</a>
      <a href={link.shortenedLink}>Shortened Link</a>
    </>
  );
};

export default TrackLink;
