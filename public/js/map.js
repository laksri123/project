let cord = coordinates.split(",");

if (cord.length == 1) {
  cord = ["77.1025", "28.7041"]; // for those lists whose coordinates are not fixed
}
console.log(cord);

mapboxgl.accessToken = mapToken; // it is defined inside script tag above
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: cord, // starting position [lng, lat] (reverse)
  zoom: 8, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red", className:"map-mark"}).setLngLat(cord).setPopup(new mapboxgl.Popup({className:"map-popup"}).setHTML(`<h3>${title}</h3><p>Exact location will be provided after booking</p>`)).addTo(map);
map.addControl(new mapboxgl.NavigationControl());         


