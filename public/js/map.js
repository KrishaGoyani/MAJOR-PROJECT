
    mapboxgl.accessToken = mapToken;
	
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: [72.8806,21.2408], // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 2 // starting zoom
    });
    
console.log(coordinates);
const marker = new mapboxgl.Marker({color: "red"})
.setLngLat([12.554729, 55.70651])//Listing.geometry.coordinates
.setPopup( new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.title}</h4> <p>Exact location provided after booking</p>`))
.addTo(map);