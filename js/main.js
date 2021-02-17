window.onload = function () {
    // Call leaflet map into map frame
    var map = L.map('map').setView([36.292, -110.090], 8);
    var HikeBike_HikeBike = L.tileLayer('https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    HikeBike_HikeBike.addTo(map);

    var wellMap = L.geoJSON(nvWells);
    wellMap.addTo(map);
}