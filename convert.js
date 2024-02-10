document
  .getElementById("csvFileInput")
  .addEventListener("change", handleFileSelect);

// Besselian Elements for Solar Eclipses
const eclipse_elements = {
  "04-08-2024": [
    2460409.26284, 18.0, -4.0, 4.0, 74.0, 74.0, -0.318244, 0.5117116, 3.26e-5,
    -8.42e-6, 0.219764, 0.2709589, -5.95e-5, -4.66e-6, 7.5862002, 0.014844,
    -2.0e-6, 89.591217, 15.0040817, 0.0, 0.535814, 0.0000618, -1.28e-5,
    -0.010272, 0.0000615, -1.27e-5, 0.0046683, 0.004645,
  ],
  "10-02-2024": [
    2460586.282098, 19.0, -4.0, 4.0, 74.3, 74.3, -0.068048, 0.441617, 1.36e-5,
    -4.83e-6, -0.36317, -0.243563, 3.39e-5, 2.84e-6, -3.9872501, -0.015511,
    1.0e-6, 107.7310867, 15.0043297, 0.0, 0.570349, -0.0000002, -9.8e-6,
    0.024091, -0.0000002, -9.7e-6, 0.0046734, 0.0046501,
  ],
  "03-29-2025": [
    2460763.950417, 11.0, -4.0, 4.0, 74.5, 74.5, -0.40287, 0.5094122, 4.15e-5,
    -8.45e-6, 0.965695, 0.2788348, -7.23e-5, -4.84e-6, 3.56602, 0.015539,
    -1.0e-6, 343.831665, 15.004365, 0.0, 0.535766, -0.0000533, -1.29e-5,
    -0.01032, -0.000053, -1.28e-5, 0.0046823, 0.004659,
  ],
  "09-21-2025": [
    2460940.321576, 20.0, -4.0, 4.0, 74.8, 74.8, -0.390072, 0.4531592, 3.2e-6,
    -5.38e-6, -1.001834, -0.2521633, 4.56e-5, 3.15e-6, 0.36472, -0.0156, 0.0,
    121.7819214, 15.0047712, 0.0, 0.562492, 0.0000909, -1.03e-5, 0.016273,
    0.0000905, -1.02e-5, 0.0046583, 0.0046351,
  ],
};

eclipse_date_select = document.getElementById("eclipseDateSelect");

// Add supported eclipse dates from above to selection
Object.keys(eclipse_elements).forEach(function (date) {
  var option = document.createElement("option");
  option.value = date;
  option.innerHTML = date;
  eclipse_date_select.appendChild(option);
});

function handleFileSelect(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const content = e.target.result;
      handleFileUpload(content);
    };

    reader.readAsText(file);
  }
}

function handleFileUpload(csvContent) {
  if (document.getElementById("coordinatesRadio").checked) {
    const coordinates = parseCoordinateCSV(csvContent);
    processCoordinates(coordinates);
  } else {
    try {
      zipCodes = parseZipCodeCSV(csvContent);
      getCoordinatesForZipCodes(zipCodes).then((coordinates) => {
        processCoordinates(coordinates);
      });
    } catch (error) {
      alert(`Error: ${error.message}`);
      return;
    }
  }
}

function parseCoordinateCSV(csvContent) {
  const lines = csvContent.split("\n");
  const header = lines[0].split(",");
  const coordinates = [];

  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(",");

    if (data.length === header.length) {

      if (data[0].trim().length == 0 && data[1].trim().length == 0) {
        // Skip empty entries
        continue;
      }

      const coordinate = {
        latitude: parseFloat(data[0]),
        longitude: parseFloat(data[1]),
        zipCode: "",
      };

      coordinates.push(coordinate);
    } else {
      throw Error(`The CSV has missing data on line ${i}`)
    }
  }

  return coordinates;
}

function parseZipCodeCSV(csvContent) {
  const lines = csvContent.split("\n");
  const header = lines[0].split(",");
  const zipCodes = [];

  for (let i = 1; i < lines.length; i++) {
    const data = lines[i].split(",");

    if (data.length === header.length) {
      if (data[0].trim().length == 0) {
        // Skip empty entries
        continue;
      }

      if (data[0].length < 5) {
        throw Error("Zip Codes less than 5 digits are not supported.");
      }

      zipCodes.push(data[0]);
    }
  }

  return zipCodes;
}

async function getCoordinatesForZipCodes(zipCodes) {
  const coordinates = [];

  for (const zipCode of zipCodes) {
    const coordinate = await retrieveCoordinateFromZipCode(zipCode);
    coordinates.push(coordinate);
  }

  return coordinates;
}

async function retrieveCoordinateFromZipCode(zipCode) {
  const apiKey = "API_KEY";
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?components=country:US|postal_code:${zipCode}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
        zipCode: zipCode,
      };
    } else {
      throw new Error("Invalid response from Google Geolocation API");
    }
  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    alert(errorMessage);
    throw new Error(errorMessage);
  }
}

function processCoordinates(coordinates) {
  const processedData = [];

  coordinates.forEach(function (coordinate) {
    selected_date = document.getElementById("eclipseDateSelect").value;
    const elements = eclipse_elements[selected_date];

    calculate(
      elements,
      (latitude = coordinate["latitude"]),
      (longitude = coordinate["longitude"])
    );

    var eclipseType = "None";
    switch (gettype()) {
      case 0:
        eclipseType = "None";
        break;
      case 1:
        eclipseType = "Partial";
        break;
      case 2:
        eclipseType = "Annular";
        break;
      case 3:
        eclipseType = "Total";
        break;
    }

    const processedResult = {
      type: eclipseType,
      coverage: getcoverage().toFixed(2),
      firstContactDate: getC1Date(elements),
      firstContactTime: getC1Time(elements),
      secondContactTime: validateTime(getC2Time(elements)),
      thirdContactTime: validateTime(getC3Time(elements)),
      fourthContactTime: getC4Time(elements),
      totalEclipseTime: getMidTime(elements),
    };

    // Add processed data to the array
    processedData.push({ ...coordinate, ...processedResult });
  });

  // Create a new CSV file with processed data
  createProcessedCSV(processedData);
}

function createProcessedCSV(data) {
  const header = [
    "ZipCode",
    "Latitude",
    "Longitude",
    "LocalType",
    "CoveragePercent",
    "FirstContactDate",
    "FirstContactTimeUTC",
    "SecondContactTimeUTC",
    "ThirdContactTimeUTC",
    "FourthContactTimeUTC",
    "TotalEclipseTimeUTC",
  ];

  const outputCSV = data.map((item) => [
    item.zipCode,
    item.latitude,
    item.longitude,
    item.type,
    item.coverage,
    item.firstContactDate,
    item.firstContactTime,
    item.secondContactTime,
    item.thirdContactTime,
    item.fourthContactTime,
    item.totalEclipseTime,
  ]);

  outputCSV.unshift(header);

  const csvContent = outputCSV.map((row) => row.join(",")).join("\n");

  // Create a Blob and set it as the href for the download link
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.getElementById("downloadLink");
  downloadLink.href = url;
  downloadLink.download = "eclipse_data.csv";
  downloadLink.style.display = "block";
}

function validateTime(val) {
  if (isNaN(val)) {
    return 0;
  }

  return val;
}
