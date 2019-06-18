// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// var queryUrl3 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";
// Perform a request to retrieve the Geo json from the query URL
d3.json(queryUrl, function(data) {
  // send the data.features object to the cr_Features function.
  console.log(data)
  createFeatures(data.features);
});

// Function to create features using the earthquake data.
function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: fillColor(feature.properties.mag),
        color: "black",
        weight: 0.6,
        opacity: 0.4,
        fillOpacity: 0.6
      });
      },

      // Create popups
      onEachFeature: function (feature, layer) {
        return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
      }
    });

    // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

//creting  map using two layers.
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap,
    "Satellite Map": satellite
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  // map center is Trenton, NJ.
  var myMap = L.map("map", {
    center: [
      40.22, -74.75
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


// Set up the legend and the colour variance for magnitude from leaflet documentation
var legend = L.control({ position: 'bottomright'});
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0,1,2,3,4,5,6],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + fillColor(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
  };
   // Adding legend to the map

// Define colors depending on the magnituge of the earthquake
function fillColor(magnituge) {

    switch (true) {
      case magnituge >= 6.0:
        return 'darkred';
        break;
      
      case magnituge >= 5.0:
        return 'red';
        break;

      case magnituge >= 4.0:
        return 'darkorange';
        break;
      
      case magnituge >= 3.0:
        return 'orange';
        break;

      case magnituge >= 2.0:
        return 'gold';
        break;

      case magnituge >= 1.0:
        return 'yellow';
        break;

      default:
        return 'greenyellow';
    };
};


// Reflect the earthquake magnitude
function markerSize(magnituge) {
  return magnituge*3;
}




// // Perform a GET request to the query URL
// d3.json(queryUrl, function(data) {
//   // Once we get a response, send the data.features object to the createFeatures function
//   console.log(data)
//   createFeatures(data.features);
// });

// function createFeatures(earthquakeData) {

// // Define a function we want to run once for each feature in the features array
// // Give each feature a popup describing the place and time of the earthquake
//   function onEachFeature(feature, layer) {
//     layer.bindPopup("<h3>" + feature.properties.place +
//       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
//   }
  


//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var earthquakes = L.geoJSON(earthquakeData, {
//     pointToLayer: function (feature, latlng) {
//               return L.circleMarker(latlng, {
//         radius: markerSize(feature.properties.mag),
//         fillColor: fillColor(feature.properties.mag),
//         color: "black",
//         weight: 0.6,
//         opacity: 0.4,
//         fillOpacity: 0.6
//       });
//       },

//       // Create popups
//       onEachFeature: function (feature, layer) {
//         return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
//       }
//     });

//   // Sending our earthquakes layer to the createMap function
//   createMap(earthquakes);
// }


// function createMap(earthquakes) {

//   // Define streetmap and darkmap layers
//   var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.streets",
//     accessToken: API_KEY
//   });

//   var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.dark",
//     accessToken: API_KEY
//   });

//   var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.satellite",
//     accessToken: API_KEY
//   });

//   // Define a baseMaps object to hold our base layers
//   var baseMaps = {
//     "Street Map": streetmap,
//     "Dark Map": darkmap
//     "Satellite": satellite
//   };

//   // Create overlay object to hold our overlay layer
//   var overlayMaps = {
//     Earthquakes: earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load
//   var myMap = L.map("map", {
//     center: [
//       40.22, -74.75
//     ],
//     zoom: 3,
//     layers: [streetmap, earthquakes]
//   });
 
//   // Create a layer control
//   // Pass in our baseMaps and overlayMaps
//   // Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);

// var legend = L.control({position: 'bottomright'});
// legend.onAdd = function() {
//     var div = L.DomUtil.create('div', 'info legend'),
//         magnitude = [0,1,2,3,4,5,6],
//         labels = [];

//     // loop through our density intervals and generate a label with a colored square for each interval
//     for (var i = 0; i < magnitude.length; i++) {
//         div.innerHTML +=
//             '<i style="background:' + fillColor(magnitude[i] + 1) + '"></i> ' +
//             magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
//     }

//     return div;
// };

// legend.addTo(myMap);
// };


// function fillColor(magnituge) {

//     switch (true) {
//       case magnituge >= 6.0:
//         return 'darkred';
//         break;
      
//       case magnituge >= 5.0:
//         return 'red';
//         break;

//       case magnituge >= 4.0:
//         return 'orangered';
//         break;
      
//       case magnituge >= 3.0:
//         return 'orange';
//         break;

//       case magnituge >= 2.0:
//         return 'gold';
//         break;

//       case magnituge >= 1.0:
//         return 'yellow';
//         break;

//       default:
//         return 'greenyellow';
//     };
// };


// function markerSize(magnituge) {
//   return magnituge*3;
// }

// d3.json("/geoJSON/PB2002_boundaries.json", function(data1) {
//   // Once we get a response, send the data.features object to the createFeatures function
//   console.log(data1)
//   createCoordi(data1.features.geometry.coordinates);
// });

// function createCoordi(faultData) {

//   // Create a GeoJSON layer containing the features array on the earthquakeData object
//   // Run the onEachFeature function once for each piece of data in the array
//   var defaultLine = L.geoJSON(faultData, {
//       return L.polyline(faultData).addTo(myMap);
        
//             });



// var poly = L.polygon(createFeatures).addTo(myMap);

// function() {
//   'use strict';

//   var map = L.map('mapContainer');

//   $.get('steps.csv', function(csvContents) {
    // var geoLayer = L.geoCsv(csvContents, {firstLineTitles: true, fieldSeparator: ','});
//     map.addLayer(geoLayer);
//   });
// };
// var polylinePoints = [
//  [-6.15534E+01,+1.89589E+01],
//  [-6.21765E+01,+1.92752E+01],
//  [-6.28467E+01,+1.95743E+01],
//  [-6.33598E+01,+1.96915E+01],
//  [-6.37601E+01,+1.97242E+01],
//  [-6.43436E+01,+1.97794E+01],
//  [-6.51285E+01,+1.98329E+01],
//  [-6.56940E+01,+1.98288E+01],
//  [-6.62594E+01,+1.98246E+01],
//  [-6.70405E+01,+1.97543E+01],
//  [-6.75313E+01,+1.97213E+01],
//  [-6.80218E+01,+1.96870E+01],
//  [-6.88528E+01,+1.95890E+01],
//  [-6.94148E+01,+1.96961E+01],
//  [-6.99775E+01,+1.98015E+01],
//  [-7.06265E+01,+2.00022E+01],
//  [-7.12771E+01,+2.02005E+01],
//  [-7.18044E+01,+2.02665E+01],
//  [-7.23322E+01,+2.03310E+01],
//  [-7.32385E+01,+2.02913E+01],
//  [-7.39942E+01,+2.01659E+01],
//  [-7.47486E+01,+2.00372E+01],
//  [-7.52388E+01,+1.99902E+01],
//  [-7.57287E+01,+1.99419E+01],
//  [-7.63564E+01,+1.98453E+01],
//  [-7.69834E+01,+1.97465E+01],
//  [-7.76726E+01,+1.96228E+01],
//  [-7.83607E+01,+1.94965E+01],
//  [-7.90110E+01,+1.93815E+01],
//  [-7.96604E+01,+1.92642E+01],
//  [-8.02095E+01,+1.91597E+01],
//  [-8.07579E+01,+1.90536E+01],
//  [-8.12563E+01,+1.89598E+01],
//  [-8.17541E+01,+1.88647E+01],
//  [-8.16893E+01,+1.83332E+01],
//  [-8.16248E+01,+1.78016E+01],
//  [-8.22442E+01,+1.76907E+01],
//  [-8.28646E+01,+1.76257E+01],
//  [-8.37058E+01,+1.74809E+01],
//  [-8.42479E+01,+1.73440E+01],
//  [-8.49097E+01,+1.71066E+01],
//  [-8.56714E+01,+1.69110E+01],
//  [-8.63195E+01,+1.66945E+01],
//  [-8.69661E+01,+1.64759E+01],
//  [-8.77228E+01,+1.62506E+01],
//  [-8.88764E+01,+1.56222E+01],
//  [-8.93716E+01,+1.52150E+01],
//  [-8.97180E+01,+1.48151E+01],
//  [-9.00373E+01,+1.43923E+01],
//  [-9.04260E+01,+1.39172E+01],
//  [-9.08103E+01,+1.33941E+01],
//  [-9.08980E+01,+1.25837E+01]
//   ];            
      
// var polyline = L.polyline(polylinePoints).addTo(myMap);    
