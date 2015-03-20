$(document).ready(function () {
	"use strict";

	var apiUrl  = "http://localhost:3000";
	var $result = $("#result");

	var login = function (sessionId) {
		localStorage.setItem("session-id", sessionId);

		$("#login-register-modal").modal("hide");
		$("#login-btn").hide();
		$("#logout-btn").show();
	};

	$("#logout-btn").on("click", function () {
		localStorage.removeItem("session-id");

		$("#login-btn").show();
		$("#logout-btn").hide();
	});


	$("#password-reset-request").on("click", function (event) {
		var $email      = $("#login-email");
		var $resetBlock = $("#reset-password-block");

		event.preventDefault();

		$.post((apiUrl + "/reset-request"), {
			"email": $email.val()
		}, function (res) {
			alert("Password reset code was sent to " + $email.val());

			$resetBlock.closest(".panel").show();
			$("#reset-heading a").trigger("click");
		}).fail(function (event) {
			console.log("fail");
		});

	});

	$("#reset-form").on("submit", function (event) {
		var $email    = $("#login-email");
		var $code     = $("#reset-code");
		var $password = $("#reset-password");

		event.preventDefault();

		$.post((apiUrl + "/reset-password"), {
			"email"   : $email.val(),
			"code"    : $code.val(),
			"password": $password.val()
		}, function (res) {
			alert("password udated");
		})
	});

	(function autoLogin () {
		var sessionId = localStorage.getItem("session-id");

		if (sessionId) {
			$("#login-btn").hide();
			$("#logout-btn").show();
		}
	}());

	(function loginForm () {
		var $loginForm = $("#login-form");
		var $email     = $("#login-email");
		var $password  = $("#login-password");

		$loginForm.on("submit", function (event) {
			event.preventDefault();

			$.post((apiUrl + "/login"), {
				"email"   : $email.val(),
				"password": $password.val()
			}, function (sessionId) {
				login(sessionId);

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

			$.post((apiUrl + "/register"), {
				"name"        : $name.val(),
				"organization": $organization.val(),
				"email"       : $email.val(),
				"password"    : $password.val()
			}, function (res) {
				login(res);
			});
		});
	}());
});
