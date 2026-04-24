$(document).ready(function () {
  // ===== Add to Cart Logic =====
  $(".add-to-cart").click(function () {
    var productName = $(this).closest("[data-role='content']").find("h3").text();
    var itemHtml = "<li>" + productName + "</li>";

    $("#cart-items").append(itemHtml);

    // Refresh the jQuery Mobile listview to apply styles
    if ($("#cart-items").hasClass("ui-listview")) {
      $("#cart-items").listview("refresh");
    }

    alert("Item added to cart!");
  });

  // ===== Checkout Button =====
  $(".checkout-btn").click(function () {
    var itemCount = $("#cart-items li").length;
    if (itemCount === 0) {
      alert("Your cart is empty!");
    } else {
      alert("Order placed for " + itemCount + " item(s). Thank you!");
      $("#cart-items").empty();
      if ($("#cart-items").hasClass("ui-listview")) {
        $("#cart-items").listview("refresh");
      }
    }
  });

  // ===== Service Worker Registration for PWA Support =====
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("./sw.js")
        .then(function (reg) {
          console.log("SW Registered with scope:", reg.scope);
        })
        .catch(function (err) {
          console.log("SW Registration Failed:", err);
        });
    });
  }
});