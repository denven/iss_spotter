const { nextISSTimesForMyLocation } = require('./iss_promised');

//fetchMyIP()
//  .then(fetchCoordsByIP)
//  .then(fetchISSFlyOverTimes)
//  .then(body => {
//    JSON.parse(body).response.map(item => {
//      console.log(`Next pass at ${Date(item.risetime)} for ${item.duration} seconds!`);
//    });
//  });


nextISSTimesForMyLocation()
  .then((data) => {
      data.map(item => { console.log(`Next pass at ${Date(item.risetime)} for ${item.duration} seconds!`); });
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  })
