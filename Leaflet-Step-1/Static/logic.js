var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(url, function(data){
    createFeatures(data.features)
});

function createFeatures(earthquakeData){

    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3><hr><p>" + new Date(feature.properties.time) + 
        "</p><hr><p>" + feature.properties.mag);
        // loops for circle size based on mag
        // loop for circle color based on (look at wolrd cup exercise 17-1)
    }

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

    function radius(mag) {
        return mag * 5
    };

    function style(feature) {
        return {
            fillOpacity: .65,
            fillColor: colorPicker(feature.properties.mag),
            radius: radius(feature.properties.mag),
            stroke: false, 
            
        }
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature, 
        style: style,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        }
    });

    createMap(earthquakes)
};

function createMap(earthquakes) {

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

    var baseMaps = {
        "Street Map": streetMap,
        "Satellite": satelliteMap
    }

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers:[streetMap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend");
        div.innerHTML += "<h4>Magnitude</h4>";
        div.innerHTML += '<i style="background:blue"></i><span>0.00 to 1.99</span><br>';
        div.innerHTML += '<i style="background:green"></i><span>2.00 to 2.99</span><br>';
        div.innerHTML += '<i style="background:yellow"></i><span>3.00 to 3.99</span><br>';
        div.innerHTML += '<i style="background:orange"></i><span>4 to 4.99</span><br>';
        div.innerHTML += '<i style="background:red"></i><span>5.00+</span><br>';

        return div;
    };

    legend.addTo(myMap);
};
    // Map object
    // tile layer
    // legend 
