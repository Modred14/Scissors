import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateRangePicker = ({
  onDateChange,
}: {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    onDateChange(date, endDate);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    onDateChange(startDate, date);
  };
  const validTimeDate = new Date(new Date().getTime() - 86400000);

  const validDate = startDate || "";
  const endRange =
    typeof validDate === "string"
      ? new Date()
      : new Date(validDate.getTime() + 86400000);

  return (
    <div className="flex gap-1 sm:justify-end w-full">
      <div className="flex items-center w-full gap-2 bg-gradient-to-r from-gray-700 to-gray-800 p-2 rounded-lg shadow-md">
        <div className="relative w-full">
          <DatePicker
            className="px-2 w-20 text-sm bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            selected={startDate}
            onChange={handleStartDateChange}
            dateFormat="MMM d"
            placeholderText="Start Date"
            maxDate={validTimeDate}
          />
        </div>
        <div className="text-white font-semibold">to</div>
        <div className="relative w-full">
          <DatePicker
            className="px-2 w-20 text-sm bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            selected={endDate}
            onChange={handleEndDateChange}
            dateFormat="MMM d"
            placeholderText="End Date"
            minDate={endRange || new Date()}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
