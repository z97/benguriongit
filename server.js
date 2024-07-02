const express = require("express");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = 3000;
const API_KEY = process.env.API_KEY;
const date = new Date();
console.log(date);

// Function to get current date and time in UTC+3 in the format yyyy-mm-ddTHH:MM
function getCurrentDateTimeInUTC3() {
  // Create a new Date object for the current time
  const now = new Date();

  // Adjust the time to UTC+3
  now.setHours(now.getUTCHours() + 3);

  // Extract the components of the date and time
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");

  // Format the date and time as yyyy-mm-ddTHH:MM
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  // Display the formatted date and time in the console
  console.log(formattedDateTime);
}

// Call the function
getCurrentDateTimeInUTC3();

app.use(express.static("public"));

app.get("/api/flights", async (req, res) => {
  // Create a new Date object for the current time
  const now = new Date();

  // Adjust the current time to UTC+3
  now.setHours(now.getUTCHours() + 3);

  // Create a new Date object for the time 12 hours later
  const later = new Date(now.getTime() + 12 * 60 * 60 * 1000);

  // Function to format the date and time as yyyy-mm-ddTHH:MM
  function formatDateTime(date) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Format the current time and the time 12 hours later
  const currentDateTime = formatDateTime(now);
  const next12HoursDateTime = formatDateTime(later);

  // Display the formatted date and time in the console
  console.log(`${currentDateTime}/${next12HoursDateTime}`);

  try {
    const response = await fetch(
      `https://aerodatabox.p.rapidapi.com/flights/airports/icao/LLBG/${currentDateTime}/${next12HoursDateTime}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
        },
      }
    );
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2)); // Log the response for debugging
    res.json(data);
  } catch (error) {
    console.error("Error fetching flight data:", error);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
