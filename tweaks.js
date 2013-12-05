(function () {
	var drawMap = function (){
		$(".static-gmap").each(function () {
			var $this = $(this);
			var $address = $this.find("address");
			var addressEncoded = encodeURI($address.text());
			var mapImgUrl, scale, deltaWidth;

			$address.hide();
			$this.attr("href", "#")
			$this.css({
				"display"            : "block",
				"width"              : "100%",
				"color"              : "black",
				"text-shadow"        : "0 0 2px white",
				"background-repeat"  : "no-repeat",
				"background-position": "50% 50%"
			});

			if (!$this.data("map-width")) {
				$this.data("map-width", 0);
			}

			$this.height($this.width());

			deltaWidth = $this.width() - $this.data("map-width");

			if (deltaWidth > ($this.data("map-width") / 4)) {
				console.log("getting new map", $this.data("map-width"), $this.width());
				$this.data("map-width", $this.width());

				mapImgUrl = "http://maps.google.com/maps/api/staticmap?" +
					"sensor=false&" + "scale=2&" +
					"size=" + $this.width() + "x" + $this.height() + "&" +
					"zoom=" + $this.data("zoom") + "&" +
					"markers=" + addressEncoded + "&" + "center=" + addressEncoded;

				$this.css({"background-image"   : "url('" + mapImgUrl + "')"});
			}

 			scale = (deltaWidth <= 0) ? (Math.round(100 * $this.data("map-width") / $this.width())) : 100;
 			scale += "%";
 			console.log(scale);
			$this.css({"background-size": scale + " " + scale});
 		});
	};


	$(document).ready(function () {
		var getChevronHtml = function (direction) {
			return "<i class='glyphicon glyphicon-chevron-" + direction + "'></i>";
		};

		(function mobileMenuRetract() {
			var $menu   = $("#navbar-collapse");
			var $toggle = $("#header .navbar-toggle");

			$menu.on("click", "a", function () {
				if ($toggle.is(":visible") && $menu.is(":visible")) {
					$menu.collapse("hide");
				}
			});
		}());

		drawMap();

		// (function appendToggle() {
		// 	$("#services .details").each(function (){
		// 		var $this = $(this);

		// 		$("<div class='text-center small' data-toggle='collapse' data-target='#" + $this.attr("id") + "'>" +
		// 			getChevronHtml("down") +
		// 		"</div >").insertAfter($this);
		// 	});
		// }());

		(function buttonToggle() {
			var getCallback = function (html) {
				return function () {
					$($(this).parent().find("[data-toggle=collapse]")[0]).html(html);
				};
			};

			$(".details")
				.on("show.bs.collapse", getCallback(getChevronHtml("up")))
				.on("hide.bs.collapse", getCallback(getChevronHtml("down")));
		}());
	});

	$(window).resize(function () {
		drawMap();
	});

}());




