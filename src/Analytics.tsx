import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import DateRangePicker from "./DateRangePicker";
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

type ClicksOverTimeEntry = { date: string; clicks: number };

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ linkId }) => {
  const [linkClicks, setLinkClicks] = useState<ClickData[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
            const filteredClicks = data.clicks.filter((click) => {
              const clickDate = new Date(click.timestamp);
              if (startDate && endDate) {
                return clickDate >= startDate && clickDate <= endDate;
              }
              return true;
            });
            setLinkClicks(filteredClicks);
           

            const locationCounts = filteredClicks.reduce<LocationCounts>(
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
  }, [linkId, startDate, endDate, db]);

const lastDate = endDate ? new Date(endDate) : new Date();
const clicksOverTimeData: ClicksOverTimeEntry[] = [];

const today = lastDate;
let currentDate = startDate ? new Date(startDate) : new Date(lastDate);
let pastDate = new Date(today);


if (startDate && endDate) {
   while (currentDate <= lastDate) {
    const datePart = currentDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    clicksOverTimeData.push({ date: datePart, clicks: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }
} else {for (let i = 0; i < 6; i++) {
  if (startDate && pastDate < startDate) break;

  const pastDatePart = pastDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  clicksOverTimeData.push({ date: pastDatePart, clicks: 0 });
  pastDate.setDate(pastDate.getDate() - 1);
}}

linkClicks.forEach((click) => {
  const timestamp = click.timestamp;
  const validTimeDate = timestamp ? new Date(timestamp) : null;

  if (validTimeDate && !isNaN(validTimeDate.getTime())) {
    const datePart = validTimeDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    const index = clicksOverTimeData.findIndex((entry) => entry.date === datePart);
    if (index >= 0) {
      clicksOverTimeData[index].clicks++;
    }
  }
});

clicksOverTimeData.sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

const clicksOverTime = {
  labels: clicksOverTimeData.map((entry) => entry.date),
  datasets: [
    {
      label: "Clicks",
      data: clicksOverTimeData.map((entry) => entry.clicks),
      borderColor: "#008000",
      backgroundColor: "#008000",
      fill: false,
    },
  ],
};
const options = {
  scales: {
    y: {
      beginAtZero: true,
      suggestedMin: 0,
      suggestedMax: 10,   
      ticks: {
        stepSize: 1,  
        precision: 0,
      },
    },
  },
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

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="analytics-dashboard pt-1 pb-7">
      <div className="sm:-mt-12 mb-8"><DateRangePicker onDateChange={handleDateChange} /></div>
      
      <div className="grid md:grid-flow-col gap-5 md:grid-cols-2 grid-cols-1">
        <div className="bg-white w-full outline outline-1 rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold pl-3 mb-2">Clicks Over Time</h2>
          
          <div className="flex justify-center">
          
            <Line data={clicksOverTime} options={options}/>
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
