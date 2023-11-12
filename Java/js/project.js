document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('map-container').setView([47.6062, -122.3321], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    let evMarkers = {};
    let chargeMarkers = {};
    const evCluster = L.markerClusterGroup();
    const chargeCluster = L.markerClusterGroup();

    d3.csv('merged_data1.csv').then(function (data) {
        data.forEach(function (row) {
            const latitude = parseFloat(row.Latitude);
            const longitude = parseFloat(row.Longitude);

            if (!isNaN(latitude) && !isNaN(longitude)) {
                const evType = row['Electric Vehicle Type'];
                const chargeType = row['Fuel Type Code'];

                if (evType) {
                    const evMarker = L.marker([latitude, longitude], {
                        icon: L.divIcon({
                            className: `marker-ev-${evType.toLowerCase()}`,
                            html: `<div class="marker"></div>`,
                        }),
                    }).bindPopup(`<b>${row.Model}</b><br>EV Location: ${latitude}, ${longitude}`);
                    evCluster.addLayer(evMarker);

                    if (!evMarkers[evType]) {
                        evMarkers[evType] = L.layerGroup();
                    }
                    evMarkers[evType].addLayer(evMarker);
                }

                if (chargeType) {
                    const chargeMarker = L.marker([latitude, longitude], {
                        icon: L.divIcon({
                            className: `marker-charge-${chargeType.toLowerCase()}`,
                            html: `<div class="marker"></div>`,
                        }),
                    }).bindPopup(`<b>${row.Model}</b><br>Charge Location: ${latitude}, ${longitude}`);
                    chargeCluster.addLayer(chargeMarker);

                    if (!chargeMarkers[chargeType]) {
                        chargeMarkers[chargeType] = L.layerGroup();
                    }
                    chargeMarkers[chargeType].addLayer(chargeMarker);
                }
            }
        });

        map.addLayer(evCluster);
        map.addLayer(chargeCluster);

        const layers = {
            "EV Locations": evMarkers,
            "Charge Locations": chargeMarkers,
            "Both Together": L.layerGroup([evCluster, chargeCluster])
        };

        L.control.layers(null, layers).addTo(map);
    });

    function optionChanged(option) {
        map.eachLayer(function (layer) {
            if (layer instanceof L.LayerGroup || layer instanceof L.MarkerClusterGroup) {
                map.removeLayer(layer);
            }
        });

        if (option === "ev" && evMarkers[option]) {
            map.addLayer(evMarkers[option]);
        } else if (option === "charge" && chargeMarkers[option]) {
            map.addLayer(chargeMarkers[option]);
        } else if (option === "both") {
            map.addLayer(evCluster);
            map.addLayer(chargeCluster);
        }
    }
});
