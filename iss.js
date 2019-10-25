/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');
const iplibUrl = `https://api.ipify.org?format=json`;
const geoLibUrl = `https://ipvigilante.com/`;
const issUrl = `http://api.open-notify.org/iss-pass.json?`


const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request(iplibUrl, (error, resp, body) => {

    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching IP. Error: Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all's well and we got the data
    const data = JSON.parse(body);
    callback(null, data["ip"].trim());
    return;
  });

};

const fetchCoordsByIP = function (ip, callback) {
  request(geoLibUrl + ip, (error, resp, body) => {
    
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (resp.statusCode !== 200) {
      callback(Error(`Status Code ${resp.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }
    // if we get here, all's well and we got the data
    const { latitude, longitude } = JSON.parse(body).data;
    callback(null, { latitude, longitude });
    return;
  });
}

const fetchISSFlyOverTimes = function(coords, callback) {

  let issFullUrl = `${issUrl}lat=${coords.latitude}&lon=${coords.longitude}`;
  request(issFullUrl, (error, resp, body) => {
    
    // error can be set if invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (resp.statusCode !== 200) {
      callback(Error(`Status Code ${resp.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    // if we get here, all's well and we got the data
    callback(null, JSON.parse(body).response);
    return;
  });
};

const nextISSTimesForMyLocation_ = function (callback) {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback){
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = {
  nextISSTimesForMyLocation
};
