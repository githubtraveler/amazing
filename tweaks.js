$(document).ready(function () {
	(function mobileMenuRetract() {
		var $menu   = $("#navbar-collapse");
		var $toggle = $("#header .navbar-toggle");

		$menu.on("click", "a", function () {
			if ($toggle.is(":visible") && $menu.is(":visible")) {
				$menu.collapse("hide");
			}
		});
	}());

	// (function buttonToggle() {
	// 	var getCallback = function (text) {
	// 		return function () {
	// 			$($(this).parent().find("[data-toggle=collapse]")[0]).text(text);
	// 		};
	// 	};

	// 	$(".details")
	// 		.on("show.bs.collapse", getCallback("less"))
	// 		.on("hide.bs.collapse", getCallback("more"));
	// }());
});
