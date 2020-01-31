var data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var linesdata = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

function circleSize(mag) {
    return mag * 5
}

function circleColor(mag) {
    return mag > 5 ? "#F06B6B" :
        mag > 4 ? "#F0A76B" :
            mag > 3 ? "#F3BA4D" :
                mag > 2 ? "#F3DB4D" :
                    mag > 1 ? "#E1F34D" :
                        "#B7F34D";
}
d3.json(data).then(function (data) {
    d3.json(linesdata).then(function (linesdata) {
        createFeatures(data.features, linesdata.features)
    })
})
function createFeatures(earthquakeData, linesdata) {
    function onEachFeature(feature, layer) {

        // L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
        //     radius: circleSize(feature.properties.mag),
        //     color: "#000",
        //     weight: 0.1,
        //     fillColor: circleColor(feature.properties.mag)

        // })
        layer.bindPopup(`<h1>${feature.properties.place}</h1> <hr> <h3> Magnitude: ${feature.properties.mag} <hr> Date: ${new Date(feature.properties.time)}`)

    }

    function geojsonMarkerOptions(feature) {
        return {
            radius: circleSize(feature.properties.mag),
            color: "#000",
            weight: 0.1,
            fillColor: circleColor(feature.properties.mag),
            fillOpacity: 1
        }
    }
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions(feature))
        },
        onEachFeature: onEachFeature
    })

    var faultLines = L.geoJSON(linesdata, {
        style: {
            color: "#FDA400",
            weight: 2,
            fillOpacity: 0.1
        }

    })
    createMap(earthquakes, faultLines)
}

function createMap(earthquakes, faultLines) {
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API
    })

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API
    })

    var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API
    })


    var baseMaps = {
        "Light": lightmap,
        "Satellite": satellitemap,
        "Outdoor": outdoormap
    }




    // var earthquake=[]
    // var faultLine=[]

    // faultLine.push(linesdata.then(d=>L.geoJSON(d,{
    //     color: "#FDA400",
    // weight: 2,
    // "opacity": 1,
    // fillOpacity: 0.1})))

    // earthquake.push(data.then(d=>d.features.map(d=>{
    //     L.circle([d.geometry.coordinates[1],d.geometry.coordinates[0]],
    //     {   radius:circleSize(d.properties.mag),
    //         color:"#000",
    //         weight:0.1,
    //         fillColor:circleColor(d.properties.mag)
    //     }).bindPopup(`<h1>${d.properties.place}</h1> <hr> <h3> Magnitude: ${d.properties.mag} <hr> Date: ${new Date(d.properties.time)}`)

    // }
    // )))
    // console.log(earthquake)
    // var earthquakes=L.layerGroup(earthquake)

    // var faultLines=L.layerGroup(faultLine)

    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Fault Lines": faultLines
    }

    // L.control.layers(baseMaps,overlayMaps,{
    //     collapsed:true
    // }).addTo(myMap)
    var myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 4,
        layers: [lightmap, earthquakes, faultLines]
    })
    L.control
        .layers(baseMaps, overlayMaps, {
            collapsed: true
        }).addTo(myMap);

    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = []
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + circleColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');

        }
        return div;
    };


    legend.addTo(myMap)
}





// async function doEverything(){
//     const API = "pk.eyJ1IjoibWFzb254bWgiLCJhIjoiY2s1dHp0ZmxlMTRnbjNsbjF5bnNucmV0cCJ9.rUzhAfuVNEDzvniPdAlBSg";
//     var data = await d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
//     var linesdata= await d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
//     var linesdatan= await d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")
//     console.log(typeof(data))
//     function circleSize(mag){
//         return mag*5000
//     }
//     function circleColor(mag){
//         return mag > 5 ? "#F06B6B" :
//                mag > 4 ? "#F0A76B" :
//                mag > 3 ? "#F3BA4D" :
//                mag > 2 ? "#F3DB4D" :
//                mag > 1 ? "#E1F34D" :
//                                "#B7F34D";
//       }
//     var myMap=L.map("map",{
//         center:[37.0902,-95.7129],
//         zoom:6,
//     })
//     var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
//             attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
//             maxZoom: 18,
//             id: "mapbox.light",
//             accessToken: API
//         })
//     lightmap.addTo(myMap);
//         var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
//             attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
//             maxZoom: 18,
//             id: "mapbox.satellite",
//             accessToken: API
//         })
//         var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
//             attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
//             maxZoom: 18,
//             id: "mapbox.outdoors",
//             accessToken: API
//         })
//         // var earthquake=[]
//         // var faultLine=[]
//         // faultLine.push(linesdata.then(d=>L.geoJSON(d,{
//         //     color: "#FDA400",
//         // weight: 2,
//         // "opacity": 1,
//         // fillOpacity: 0.1})))
//         // earthquake.push(data.then(d=>d.features.map(d=>{
//         //     L.circle([d.geometry.coordinates[1],d.geometry.coordinates[0]],
//         //     {   radius:circleSize(d.properties.mag),
//         //         color:"#000",
//         //         weight:0.1,
//         //         fillColor:circleColor(d.properties.mag)
//         //     }).bindPopup(`<h1>${d.properties.place}</h1> <hr> <h3> Magnitude: ${d.properties.mag} <hr> Date: ${new Date(d.properties.time)}`)
//         // }
//         // )))
//         // var earthquakes=L.layerGroup(earthquake)
//         console.log(data.features);
//         var earthquakes= L.layerGroup(data.features.map(d=>
//             L.circle(L.latLng(parseFloat(d.geometry.coordinates[1]), parseFloat(d.geometry.coordinates[0])),
//             {   radius:circleSize(d.properties.mag),
//                 color:"#000",
//                 weight:0.1,
//                 fillColor:circleColor(d.properties.mag)
//             }).bindPopup(`<h1>${d.properties.place}</h1> <hr> <h3> Magnitude: ${d.properties.mag} <hr> Date: ${new Date(d.properties.time)}`)
//         ));
//         // var earthq= data.features.map(d=>L.circle(L.latLng(
//         //     d.geometry.coordinates[1],
//         //     d.geometry.coordinates[0])));
//         //
//         // console.log(typeof(earthq[1]))
//         // console.log(earthq[0]);
//         //
//         // var earthquakes = L.layerGroup(earthq);
//         var faultLines=L.geoJSON(linesdatan);
//         var baseMaps={
//             "light":lightmap,
//             "satellite":satellitemap,
//             "outdoor":outdoormap
//         }
//         var overlayMaps = {
//             "Earthquakes": earthquakes,
//             "Fault Lines": faultLines
//         }
//         L.control.layers(baseMaps,overlayMaps,{
//             collapsed:true
//         }).addTo(myMap)
//     var legend=L.control({position:'bottomright'})
//     legend.onAdd=function (){
//         var div=L.DomUtil.create('div','info legend'),
//         grades=[0,1,2,3,4,5],
//         labels=[]
//         for (var i = 0; i < grades.length; i++) {
//             div.innerHTML +=
//                 '<i style="background:' + circleColor(grades[i] + 1) + '"></i> ' +
//                 grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
//         }
//         return div;
//     };
//     legend.addTo(myMap)
//     // linesdata.then(d=>L.geoJSON(d,{
//     //     color: "#FDA400",
//     // weight: 2,
//     // "opacity": 1,
//     // fillOpacity: 0.1}).addTo(myMap))
//     }
//     doEverything();
