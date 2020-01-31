var data =d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
var linesdata=d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")

console.log(data)
function circleSize(mag){
    return mag*5000
}

function circleColor(mag){
    return mag > 5 ? "#F06B6B" :
           mag > 4 ? "#F0A76B" :
           mag > 3 ? "#F3BA4D" :
           mag > 2 ? "#F3DB4D" :
           mag > 1 ? "#E1F34D" :
                           "#B7F34D"; 
  }

var myMap=L.map("map",{
    center:[37.0902,-95.7129],
    zoom:6
})

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API }).addTo(myMap)

data.then(d=>d.features.map(d=>{
    L.circle([d.geometry.coordinates[1],d.geometry.coordinates[0]],
    {   radius:circleSize(d.properties.mag),
        color:"#000",
        weight:0.1,
        fillColor:circleColor(d.properties.mag)
    }).bindPopup(`<h1>${d.properties.place}</h1> <hr> <h3> Magnitude: ${d.properties.mag} <hr> Date: ${new Date(d.properties.time)}`)
        .addTo(myMap)

}))

var legend=L.control({position:'bottomright'})
legend.onAdd=function (){
    var div=L.DomUtil.create('div','info legend'),
    grades=[0,1,2,3,4,5],
    labels=[]
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + circleColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            
    }
    return div;
};
    

legend.addTo(myMap)






