
// Create URL variable for API endpoint
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// read geoJSON and trigger the chain of nested functions that will ultimately create the map
d3.json(url, function(data){
    createFeatures(data.features)
});

// Function to create the features from geoJSON records that will be used by Leaflet to create the maps
function createFeatures(earthquakeData){

    // function to be used in configuration of the map that will add a popup to each point on the map with data from geoJSON
    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3><hr><p>" + new Date(feature.properties.time) + 
        "</p><hr><p>Magnitude: " + feature.properties.mag)+"</p>";

    }
    // function to vary the colors based on magnitude scaler. This will be fed into the variable that will store the geoJSON data and options.
    function colorPicker(mag) {
         if (mag >= 5.0) {
             return "red";
         } else if (mag >= 4.0) {
             return "orange";
         } else if (mag >= 3.0) {
             return "yellow"; 
         } else if (mag >= 2.0) {
             return "green" 
         } else {
             return "blue";
         }

     };

    //  Similar to colorPicker, this will set the marker radi to be variable based on the maginitude data for that feature. 
    function radius(mag) {
        return mag * 5
    };

    // Style function to load into the variable containing geoJSON and onptions
    function style(feature) {
        return {
            fillOpacity: .65,
            fillColor: colorPicker(feature.properties.mag),
            radius: radius(feature.properties.mag),
            stroke: false, 
            
        }
    }
    
    // Add geoJSON feature data and option functions to a variable that will be used in the creation of the maps. 
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature, 
        style: style,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        }
    });

    // create the maps based on the createMap function defined below.
    createMap(earthquakes)
};

function createMap(earthquakes) {

    // Put map tile layers into variables
    var streetMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    // create base map object based on the above tiles
    var baseMaps = {
        "Street Map": streetMap,
        "Satellite": satelliteMap
    }
    // crete overlay object
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // initialize map object - this is the center of our map universe
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers:[streetMap, earthquakes]
    });

    // add control toggle to map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // add legend to map
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend");
        div.innerHTML += "<h4>Magnitude</h4>";
        div.innerHTML += '<i id=text style="background:blue"></i><span>0.00 to 1.99</span><br>';
        div.innerHTML += '<i id=text style="background:green"></i><span>2.00 to 2.99</span><br>';
        div.innerHTML += '<i id=text style="background:yellow"></i><span>3.00 to 3.99</span><br>';
        div.innerHTML += '<i id=text style="background:orange"></i><span>4 to 4.99</span><br>';
        div.innerHTML += '<i id=text style="background:red"></i><span>5.00+</span><br>';

        return div;
    };

    legend.addTo(myMap);
};

