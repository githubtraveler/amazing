(function ($, Fluidvids) {
	"use strict";

	var adjustMapHeight = function () {
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

	var fluidVideoEmbed = function (selector) {
		Fluidvids.init({selector: selector, players: ["www.youtube.com"]});
	};

	var linkedin = function () {
		$("#btn-linkedin").append(
			"<script type='IN/FollowCompany' data-id='1444332' data-counter='none'></script>"
		);
	};

	$(document).ready(function () {
		mobileMenuRetract();
		adjustMapHeight();
		imagesMustFit();
		linkedin();
	});

	$("#portfolio-carousel").on("show.bs.modal", function () {
		var id, $this = $(this);

		if ($this.data("resized") !== "true") {
			id = $this.attr("id");

			fluidVideoEmbed("#" + id + " iframe");
			$this.data("resized", "true");
		}
	});

	$(window).resize(function (){
		adjustMapHeight();
		imagesMustFit();
	});
}(jQuery, Fluidvids));
