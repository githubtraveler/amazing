(function () {
	var map, geocoder, infoWindow;
	var mapLocation = new google.maps.LatLng(49.1678005, -122.9878654);
	var mapCanvas = document.getElementById('map-canvas');

	function initialize() {
		var mapOptions, marker;

		var infoWindowOpen = function () {
			infoWindow.open(map, marker);
		};

		mapOptions = {
			zoom             : 16,
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

		infoWindow = new google.maps.InfoWindow({
			content: document.getElementById('contact-info')
		});

		google.maps.event.addListener(infoWindow, "domready", function () {
			$("#contact-info").css("visibility", "visible");
		});

		infoWindowOpen();
		google.maps.event.addListener(marker, 'click', infoWindowOpen);
	}

	google.maps.event.addDomListener(window, 'load', initialize);

	$(window).on("resize", function () {
		var center = map.getCenter();

		google.maps.event.trigger(map, 'resize');
		map.setCenter(center);
	});
}());
