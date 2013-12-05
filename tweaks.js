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
