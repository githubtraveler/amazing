$(document).ready(function () {
	"use strict";

	var $result = $("#result");

	var placeBuyButtons = function (email, sessionId, item) {
		$.post("/purchased", {
			"email"  : email,
			"session": sessionId,
			"app"    : item
		}, function (res) {
			var $products = $("#products");

			if (res === "true") {
				$products.find(".app1.paid").show();
			} else {
				$products.find(".app1.unpaid").show();
			}
		});
	};

	var login = function (email, sessionId) {
		localStorage.setItem("email", email);
		localStorage.setItem("session-id", sessionId);

		$("#login-register-modal").modal("hide");
		$("#login-btn").hide();
		$("#logout-btn").show();

		sessionLinks();
	};

	var sessionLinks = function () {
		$("a.download").each(function () {
			var $this = $(this), href;
			var file  = $this.data("href");

			var sessionId = localStorage.getItem("session-id");
			var email     = localStorage.getItem("email");

			if (sessionId && email && file) {
				href = "".concat("/download/", email, "/", sessionId, "/", file);
				$this.attr("href", href);
			}
		});
	};

	var unsessionLinks = function () {
		$("a.download").attr("href", "");
	};


	$("#logout-btn").on("click", function () {
		localStorage.removeItem("session-id");
		localStorage.removeItem("email");

		$("#login-btn").show();
		$("#logout-btn").hide();

		unsessionLinks();
	});


	$("#password-reset-request").on("click", function (event) {
		var $email = $("#login-email");

		event.preventDefault();

		$.post("/reset-request", {
			"email": $email.val()
		}, function (res) {
			alert("Password reset code was sent to " + $email.val());

			$("#reset-panel").show();
			$("#reset-heading a").trigger("click");
		}).fail(function (event) {
			console.log("fail");
		});

	});

	$("#cc-form").on("submit", function (event) {
		var ccData = {
			"number"      : $("#cc-number").val(),
			"type"        : $("#cc-type").val(),
			"expire_month": $("#cc-expire-month").val(),
			"expire_year" : $("#cc-expire-year").val(),
			"cvv2"        : $("#cc-cvv2").val(),
			"first_name"  : $("#cc-first-name").val(),
			"last_name"   : $("#cc-last-name").val()
		};

		event.preventDefault();

		$.post("/purchase", {
			"email"  : localStorage.getItem("email"),
			"session": localStorage.getItem("session-id"),
			"item"   : "app1",
			"cc"     : ccData
		}, function (res) {
			alert(res);
			$("#purchase-app").modal("hide");
		}).fail(function (event) {
			alert(event.responseText);
		});
	});

	$("#reset-form").on("submit", function (event) {
		var $email    = $("#login-email");
		var $code     = $("#reset-code");
		var $password = $("#reset-password");

		event.preventDefault();

		$.post("/reset-password", {
			"email"   : $email.val(),
			"code"    : $code.val(),
			"password": $password.val()
		}, function (res) {
			alert("password udated");
		})
	});

	(function autoLogin () {
		var sessionId = localStorage.getItem("session-id");
		var email     = localStorage.getItem("email");

		if (sessionId) {
			$("#login-btn").hide();
			$("#logout-btn").show();

			placeBuyButtons(email, sessionId, "app1");

			sessionLinks();
		}
	}());

	(function loginForm () {
		var $loginForm = $("#login-form");
		var $email     = $("#login-email");
		var $password  = $("#login-password");

		$loginForm.on("submit", function (event) {
			event.preventDefault();

			$.post("/login", {
				"email"   : $email.val(),
				"password": $password.val()
			}, function (sessionId) {
				login($email.val(), sessionId);

				console.log("Logged in with session id :", sessionId);
			}).fail(function (event) {
				$email[0].setCustomValidity(event.responseText);
			});
		});

		$email.on("input", function () {
			$email[0].setCustomValidity("");
		});

	}());

	(function registerForm () {
		var $registerForm    = $("#register-form");
		var $name            = $("#register-name");
		var $organization    = $("#register-organization");
		var $email           = $("#register-email");
		var $password        = $("#register-password");
		var $confirmPassword = $("#register-confirm-password");

		$password.add($confirmPassword).on("input", function () {
			var passwordsMatch  = ($password.val() === $confirmPassword.val());
			var validityMessage = (passwordsMatch ? "" : "Passwords must match");

			$confirmPassword[0].setCustomValidity(validityMessage);
		});

		$registerForm.on("submit", function (event) {
			event.preventDefault();

			$.post("/register", {
				"name"        : $name.val(),
				"organization": $organization.val(),
				"email"       : $email.val(),
				"password"    : $password.val()
			}, function (res) {
				// login(res);
				alert(res);
				$("#register-panel").hide();
				$("#activate-panel").show();
				$("#activate-heading a").trigger("click");
			});
		});

		$("#activate-form").on("submit", function (event) {
			event.preventDefault();

			$.post("/activate", {
				"email": $email.val(),
				"code" : $("#activate-code").val()
			} ,function (res) {
				alert("Activated");
				login(res);
			});
		});
	}());
});
