var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data){
    createFeatures(data.features)
});

function createFeatures(earthquateData){

    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3><hr><p>" + new Date(feature.properties.time) + 
        "</p><hr><p>" + feature.properties.mag);
        // loops for circle size based on mag
        // loop for circle color based on 
    }

    var earthquakes = L.geoJSON(earthquateData, {
        onEachFeature: onEachFeature
    });

    createMap(earthquakes)
};

function createMap(earthquakes)
    // Map object
    // tile layer
    // legend 

