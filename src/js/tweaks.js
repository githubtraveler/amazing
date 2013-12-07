(function ($, Fluidvids) {
	"use strict";

	var linkHeights = function () {
		$("#contact-info .static-gmap").css({"height": $("#contact-info .well").outerHeight()});
	};

	var imagesMustFit = function () {
		$("#portfolio-carousel .item img").css({"max-height": ($(window).height() - 100) + "px"});
	};

	var mobileMenuRetract = function () {
		var $menu   = $("#navbar-collapse");
		var $toggle = $("#header .navbar-toggle");

		$menu.on("click", "a", function () {
			if ($toggle.is(":visible") && $menu.is(":visible")) {
				$menu.collapse("hide");
			}
		});
	};

	var fluidVideoEmbed = function () {
		Fluidvids.init({selector: "iframe", players: ["www.youtube.com", "player.vimeo.com"]});
	};

	$(document).ready(function () {
		mobileMenuRetract();
		linkHeights();
		imagesMustFit();
		fluidVideoEmbed();
	});

	$(window).resize(function (){
		linkHeights();
		imagesMustFit();
	});
}(jQuery, Fluidvids));




