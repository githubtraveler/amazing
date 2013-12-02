(function () {
	var map, geocoder, infoWindow;
	var mapLocation = new google.maps.LatLng(49.1678005, -122.9878654);
	var mapCanvas = document.getElementById('map');

	function initialize() {
		var mapOptions, marker;
		var contactInfo = document.getElementById('contact-info');

		var infoWindowOpen = function () {
			infoWindow.open(map, marker);
		};

		mapOptions = {
			zoom             : 11,
			center           : mapLocation,
			scrollwheel      : false,
			draggable        : false,
			keyboardShortcuts: false
		};

		map = new google.maps.Map(mapCanvas, mapOptions);

		marker = new google.maps.Marker({
			position: mapLocation,
			map     : map,
			title   :'R&D Arts Inc.'
		});

		infoWindow = new google.maps.InfoWindow({content: contactInfo});

		google.maps.event.addListener(infoWindow, "domready", function () {
			contactInfo.style.visibility = "visible";
		});

		infoWindowOpen();
		google.maps.event.addListener(marker, 'click', infoWindowOpen);
	}

	google.maps.event.addDomListener(window, 'load', initialize);

	window.onresize = function () {
		var center = map.getCenter();

		google.maps.event.trigger(map, 'resize');
		map.setCenter(center);
	};
}());
