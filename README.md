# Eclipse-Data-Tool
Overview
The eclipse data tool is a set of JavaScript files and an HTML page that allows the user to get data for a particular eclipse at different locations. The HTML page allows the user to select an eclipse date and upload a CSV file containing location data (either coordinates or zip codes) and it outputs a CSV file with the eclipse data for each location. 


The eclipse data that is returned includes the following:
* Eclipse type (Total, Partial, Annular, None)
* Eclipse coverage (as percentage)
* First contact date 
* First contact time (UTC)
* Second contact time (UTC)
* Third contact time (UTC)
* Fourth contact time (UTC)
* Maximum eclipse time (UTC)
* Latitude
* Longitude
* Zip Code (if the selected upload option is Zip Codes)

How To Use
1. Download or clone the repository locally from: https://github.com/ARISA-Lab-LLC/Eclipse-Data-Tool.
2. If downloaded directly from GitHub, unzip the folder to the desired location on your system
3. Open the convert.js file using a text editor and replace the API_KEY placeholder in the retrieveCoordinateFromZipCode function with an actual Google Geocoding API key (line 145). Without this change the option to get eclipse data from zip codes will always raise an error
4. Open the index.html file in the Eclipse-Data-Tool folder with your favorite browser
5. Select an eclipse date
6. Select the type of location data that will be provided in the uploaded CSV (Coordinates or Zip Codes)
7. Click the “Upload CSV File” button to choose a CSV file to upload from your local system
8. Click “Download Processed CSV” to download the result

Things to note:
* Steps 1-3 only need to be done once when the project is copied locally. 
* If the uploaded CSV file does not contain the expected location data in its proper format, an error alert will be presented to the user indicating the issue.
* You will need to add your own Google Geocoding API key to line 145 and replace the API_KEY placeholder.