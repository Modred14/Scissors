import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface LocationData {
  country: string;
  city: string;
}
interface ClickData {
  referrer: string;
  timestamp: string;
  location: LocationData;
  clickCount: string;
  createdAt: string;
}
interface LocationCounts {
  countries: Record<string, number>;
  cities: Record<string, number>;
}

interface AnalyticsDashboardProps {
  linkId: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ linkId }) => {
  const [linkClicks, setLinkClicks] = useState<ClickData[]>([]);
  const [locationData, setLocationData] = useState<LocationCounts>({
    countries: {},
    cities: {},
  });
  const [activeTab, setActiveTab] = useState<"countries" | "cities">(
    "countries"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "link_clicks", linkId);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as { clicks: ClickData[] };
            setLinkClicks(data.clicks);

            const locationCounts = data.clicks.reduce<LocationCounts>(
              (acc, click) => {
                const { country = "Unknown", city = "Unknown" } =
                  (click.location as LocationData) || {};

                if (!acc.countries[country]) {
                  acc.countries[country] = 0;
                }
                acc.countries[country]++;

                if (!acc.cities[city]) {
                  acc.cities[city] = 0;
                }
                acc.cities[city]++;

                return acc;
              },
              {
                countries: {} as Record<string, number>,
                cities: {} as Record<string, number>,
              }
            );

            setLocationData(locationCounts);
          } else {
            console.warn("No document found with the provided link ID.");
            setLinkClicks([]);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    };

    fetchData();
  }, [linkId, db]);

  const clicksOverTimeData = linkClicks.reduce(
    (acc, click) => {
      const timestamp = click.timestamp;
      const validTimeDate = timestamp ? new Date(timestamp) : null;

      if (validTimeDate && !isNaN(validTimeDate.getTime())) {
        const datePart = validTimeDate.toLocaleDateString("en-GB");

        const hours = validTimeDate.getHours();
        const roundedHours = Math.floor(hours / 12) * 12;
        validTimeDate.setHours(roundedHours, 0, 0, 0);

        const timePart = validTimeDate.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });

        const dateTime: [string, string] = [datePart, timePart];

        const index = acc.labels.findIndex(
          (label) => label[0] === dateTime[0] && label[1] === dateTime[1]
        );
        if (index >= 0) {
          acc.data[index]++;
        } else {
          if (acc.labels.length < 5) {
            acc.labels.push(dateTime);
            acc.data.push(0);
          } else {
            acc.data[acc.data.length - 1]++;
          }
        }
      }

      return acc;
    },
    { labels: [] as [string, string][], data: [] as number[] }
  );

  const clicksOverTime = {
    labels: clicksOverTimeData.labels,
    datasets: [
      {
        label: "Clicks",
        data: clicksOverTimeData.data,
        borderColor: "#008000",
        backgroundColor: "#008000",
      },
    ],
  };

  const referrerCounts = linkClicks.reduce(
    (acc, click) => {
      if (!click.referrer) acc[0]++;
      else if (click.referrer === "direct") acc[1]++;
      else if (click.referrer.includes("google")) acc[2]++;
      else if (click.referrer.includes("scissors")) acc[3]++;
      else acc[4]++;
      return acc;
    },
    [0, 0, 0, 0, 0]
  );

  const totalOtherReferrers = referrerCounts
    .slice(1)
    .reduce((a: number, b: number) => a + b, 0);
  if (totalOtherReferrers === 0) {
    referrerCounts[0] = 100;
  }
  if (totalOtherReferrers > 0) {
    referrerCounts[0] = 0;
  }

  const referrerData = {
    labels: ["None", "Direct", "Google", "Scissors", "Other"],
    datasets: [
      {
        label: "Referrer",
        data: referrerCounts,
        backgroundColor: [
          "#A52A2A",
          "#36A2EB",
          "#FF6384",
          "#008000",
          "#4BC0C0",
        ],
      },
    ],
  };

  return (
    <div className="analytics-dashboard pt-3 pb-7">
      <div className="grid md:grid-flow-col gap-5 md:grid-cols-2 grid-cols-1">
        <div className="bg-white w-full outline outline-1 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold pl-3 mb-2">Clicks Over Time</h2>
          <div className="flex justify-center">
            <Line data={clicksOverTime} />
          </div>
        </div>

        <div className="bg-white w-full outline outline-1 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold pl-3 mb-2">Referrer Data</h2>
          <div className="max-h-72 flex justify-center">
            <Pie data={referrerData} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg w-full outline outline-1 shadow-md p-4">
        <h2 className="text-lg font-semibold pl-3 mb-4">
          Clicks + scans by location
        </h2>
        <div className="border rounded-md mb-4">
          <div className="flex">
            <button
              className={`px-4 py-2 w-full text-sm font-semibold ${
                activeTab === "countries"
                  ? "text-white text-lg border-b-2 bg-green-700 border-green-500"
                  : "text-gray-500 border-b-2 border-transparent "
              } focus:outline-none`}
              onClick={() => setActiveTab("countries")}
            >
              Countries
            </button>
            <button
              className={`px-4 py-2 w-full text-sm font-semibold ${
                activeTab === "cities"
                  ? "text-white text-lg border-b-2 bg-green-700 border-green-500"
                  : "text-gray-500 border-b-2 border-transparent "
              } focus:outline-none`}
              onClick={() => setActiveTab("cities")}
            >
              Cities
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === "countries" ? (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-center font-bold text-gray-600">
                    Country
                  </th>
                  <th className="py-2 text-center px-4 font-semibold text-gray-600">
                    Clicks + Scans
                  </th>
                  <th className="py-2 px-4 text-center font-semibold text-gray-600">
                    %
                  </th>
                </tr>
              </thead>
              {Object.keys(locationData.countries).length > 0 ? (
                <tbody>
                  {Object.entries(locationData.countries).map(
                    ([country, count], index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4 text-center">{country}</td>
                        <td className="py-2 px-4 text-center">{count}</td>
                        <td className="py-2 px-4 text-center">
                          {((count / linkClicks.length) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td className="text-black text-center font-bold py-4">
                      No data yet
                    </td>
                    <td className="text-black font-bold py-4 text-center">
                      No data yet
                    </td>
                    <td className="text-black font-bold py-4 text-center">
                      No data yet
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className=" bg-gray-50">
                <tr>
                  <th className="py-2 text-center px-4 font-semibold text-gray-600">
                    City
                  </th>
                  <th className="py-2 px-4 text-center font-semibold text-gray-600">
                    Clicks + Scans
                  </th>
                  <th className="py-2 px-4 text-center font-semibold text-gray-600">
                    %
                  </th>
                </tr>
              </thead>
              {Object.keys(locationData.cities).length > 0 ? (
                <tbody>
                  {Object.entries(locationData.cities).map(
                    ([city, count], index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2 px-4 text-center">{city}</td>
                        <td className="py-2 px-4 text-center">{count}</td>
                        <td className="py-2 px-4 text-center">
                          {((count / linkClicks.length) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td className="text-black text-center font-bold py-4">
                      No data yet
                    </td>
                    <td className="text-black font-bold py-4 text-center">
                      No data yet
                    </td>
                    <td className="text-black font-bold py-4 text-center">
                      No data yet
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
