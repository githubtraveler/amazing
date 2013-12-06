(function ($) {
	var GMap = function () {
		var GMap = function (element) {
			var $el = $(element);

			this.$element       = $el;
			this.addressEncoded = encodeURI($el.text());
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
			if (!scale) {
				scale = 1;
			}

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
					return Math.round(k * n);
				};

				console.log(scale);

				if (scale.width < 100 || scale.height < 100) {
					mapSize = {"width": boost(1.5, elSize.width), "height": boost(1.5, elSize.height)};
					mapURL = getMapURL(this.addressEncoded, mapSize, 10, 2);

					this.mapWidth  = mapSize.width;
					this.mapHeight = mapSize.height;

					scale = getScalePercentage({"width":this.mapWidth, "height":this.mapHeight}, elSize);

					this.$element.css({
						"background-image": "url(" + mapURL + ")",
						"background-size": scale.width + "% " + scale.height + "% "
					});

				}

			}
		};

		return GMap;
	}();

	$(document).ready(function () {
		$(".static-gmap").each(function () {
			$(this).data("static-gmap", (new GMap(this)));
		});
	});
}(jQuery));
