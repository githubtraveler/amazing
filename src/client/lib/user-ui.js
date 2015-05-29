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

	var setLoginButtons = function () {
		var $userMenu       = $("#user-menu");
		var $userMenuButton = $userMenu.find("button");

		$("#guest-menu").hide();
		$userMenu.show();

		$userMenuButton.find("ins").remove();

		$userMenuButton.prepend($("<ins/>", {
			"text": localStorage.name
		}));
	};

	var login = function (email, sessionId, name) {
		localStorage.setItem("email", email);
		localStorage.setItem("session-id", sessionId);
		localStorage.setItem("name", name);

		$("#login-register-modal").modal("hide");
		setLoginButtons();

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

	var logout = function () {
		localStorage.clear();

		$("#guest-menu").show();
		$("#user-menu").hide();

		unsessionLinks();
	};

	var kick = function (event) {
		if (event.status === 403 || event.status === 401) {
			logout();
		}
	};

	$("#logout-btn").on("click", logout);

	(function () {
		var $fields = {
			"name"        : $("#profile-name"),
			"email"       : $("#profile-email"),
			"organization": $("#profile-organization")
		};

		var $profileModal = $("#profile-modal");

		var failer = function (event) {
			alert(event.responseText);
			$profileModal.modal("hide");
			kick(event);
		};

		$profileModal.on("show.bs.modal", function (event) {
			$.post("/get-profile", {
				"key"  : localStorage["session-id"],
				"email": localStorage.email
			}, function (res) {
				Object.keys($fields).forEach(function (k) {
					$fields[k].val(res[k]);
				});
			}).fail(failer);
		});

		$("#profile-form").on("submit", function (event) {
			var data = { "key": localStorage["session-id"] };

			Object.keys($fields).forEach(function (k) {
				data[k] = $fields[k].val();
			});

			$.post("/update-profile", data, function (res) {
				alert(res);
				$profileModal.modal("hide");
			}).fail(failer);
		});
	}());



	$("#purchases-modal").on("show.bs.modal", function (event) {
		$.post("/show-purchases", {
			"key"  : localStorage["session-id"],
			"email": localStorage.email
		}, function (purchases) {
			var $table = $("#purchases");

			purchases.forEach(function (purchase) {
				$table.append(
					$("<tr/>").append(
						$("<td/>", { "text" : purchase.item      }),
						$("<td/>", { "text" : purchase.key       }),
						$("<td/>", { "text" : purchase.paymentId })
					)
				);
			});
		});
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

		var email = localStorage.email;
		var key   = localStorage["session-id"];

		event.preventDefault();

		$.post("/purchase", {
			"email"  : email,
			"session": key,
			"item"   : "smsprint",
			"cc"     : ccData
		}, function (res) {
			var $products = $("#products");
			alert(res);
			$("#purchase-app").modal("hide");

			$products.find(".unpaid").hide();
			$products.find(".paid").show();

			placeBuyButtons(email, key, "smsprint");

		}).fail(function (event) {
			alert(event.responseText);
		});
	});

	$("#change-password-form").on("submit", function (event) {
		var $passFields = {
			"old"        : $("#old-password"),
			"new"        : $("#new-password"),
			"confirm-new": $("#confirm-new-password")
		};

		var data = {
			"email"      : localStorage.email,
			"oldPassword": $passFields.old.val(),
			"newPassword": $passFields.new.val()
		};

		var $this = $(this);

		event.preventDefault();

		if (data.newPassword === $passFields["confirm-new"].val()) {
			$.post("/change-password", data, function (res) {
				alert(res);
				$this.trigger("reset");
				$("#profile-modal").modal("hide");
			}).fail(function (event) {
				alert(event.responseText);
			});
		} else {
			$passFields.new[0].setCustomValidity("New password and its confirmation must match");
		}
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
			setLoginButtons();
			placeBuyButtons(email, sessionId, "smsprint");
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
			}, function (data) {
				login($email.val(), data.key, data.name);

				console.log(data.name, " logged in with session id :", data.key);
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
