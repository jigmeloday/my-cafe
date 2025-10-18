'use client';
import { useState } from "react";

function TimePicker() {
  const [time, setTime] = useState("12:00");

  return (
    <div className="flex flex-col w-40">
      <label htmlFor="time" className="mb-2 text-sm font-medium text-gray-200">
        Select Time
      </label>
      <input
        type="time"
        id="time"
        name="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="
          p-2
          rounded-lg
          bg-gray-800
          text-gray-100
          border
          border-gray-600
          focus:outline-none
          focus:ring-2
          focus:ring-teal-400
          hover:border-teal-400
          transition
          duration-200
        "
      />
      <p className="mt-1 text-sm text-gray-400">Selected Time: {time}</p>
    </div>
  );
}

export default TimePicker;
