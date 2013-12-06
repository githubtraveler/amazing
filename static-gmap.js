(function ($) {
	var GMap = function () {
		var GMap = function (element) {
			var $el = $(element);

			this.$element       = $el;
			this.addressEncoded = encodeURI($.trim($el.text()));
			this.mapWidth       = 0;
			this.mapHeight      = 0;

			$el.text("");

			$el.css({
				"display"            : "block",
				"background-repeat"  : "no-repeat",
				"background-position": "50% 50%"
			});

			this.draw();
		};

		var getMapURL = function (addressEncoded, size, zoom, scale) {
			scale = scale || 1;

			return "http://maps.google.com/maps/api/staticmap?" +
				"sensor=false&" + "scale=" + scale + "&" + "zoom=" + zoom + "&" +
				"size=" + size.width + "x" + size.height + "&" +
				"markers=" + addressEncoded + "&" + "center=" + addressEncoded;
		};

		var getScalePercentage = function (mapSize, containerSize) {
			var dimScale = function (a, b) {
				return Math.round(100 * a / b);
			}

			return {
				"width" : dimScale(mapSize.width, containerSize.width),
				"height": dimScale(mapSize.height, containerSize.height)
			};
		};

		GMap.prototype = {
			constructor: GMap,
			draw: function () {
				var elSize = {
					"width" : this.$element.innerWidth(),
					"height": this.$element.innerHeight()
				};

				var mapURL, mapSize;
				var scale = getScalePercentage({"width":this.mapWidth, "height":this.mapHeight}, elSize);

				var boost = function (k, n) {
					var result = Math.floor(k * n);

					return (result < 640) ? result : 640 ;
				};

				if (this.mapWidth < 640 && this.mapHeight < 640) {
					if (scale.width < 100 || scale.height < 100) {
						mapSize = {"width": boost(1.5, elSize.width), "height": boost(1.5, elSize.height)};

						console.log("getting new map", mapSize.width, mapSize.height);
						mapURL = getMapURL(this.addressEncoded, mapSize, 10, 2);

						this.mapWidth  = mapSize.width;
						this.mapHeight = mapSize.height;

						this.$element.css({"background-image": "url(" + mapURL + ")"});
					}
				}

				scale = getScalePercentage({"width":this.mapWidth, "height":this.mapHeight}, elSize);
				console.log("scaling to", scale.width, scale.height);

				if (scale.width < 100) {
					scale.height = Math.round(100 * scale.height / scale.width);
					scale.width = 100;
				}

				if (scale.height < 100) {
					scale.width = Math.round(100 * scale.width / scale.height);
					scale.height = 100;
				}

				this.$element.css({"background-size": scale.width + "% " + scale.height + "% "});
			}
		};

		return GMap;
	}();

	$(document).ready(function () {
		$(".static-gmap").each(function () {
			$(this).data("static-gmap", (new GMap(this)));
		});
	});

	$(window).resize(function () {
		$(".static-gmap").each(function () {
			$(this).data("static-gmap").draw();
		});
	});
}(jQuery));
