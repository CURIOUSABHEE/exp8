$(document).ready(function () {
  var cart = [];

  // ===== Show Toast Notification =====
  function showToast(message) {
    $("#toast-msg").text(message);
    $("#toast").addClass("show");
    setTimeout(function () {
      $("#toast").removeClass("show");
    }, 2500);
  }

  // ===== Update Cart Badge =====
  function updateCartBadge() {
    var count = cart.length;
    if (count > 0) {
      $("#cart-count, #cart-count-2").text(count).show();
    } else {
      $("#cart-count, #cart-count-2").hide();
    }
  }

  // ===== Render Cart Items =====
  function renderCart() {
    var container = $("#cart-items");
    container.empty();

    if (cart.length === 0) {
      $("#empty-cart").show();
      $("#cart-summary").hide();
      return;
    }

    $("#empty-cart").hide();
    $("#cart-summary").show();

    var total = 0;
    cart.forEach(function (item, index) {
      total += item.price;
      var itemHtml =
        '<div class="cart-item" style="animation-delay: ' + (index * 0.1) + 's;">' +
        '  <div class="cart-item-info">' +
        '    <h4>' + item.name + '</h4>' +
        '    <span>Qty: 1</span>' +
        '  </div>' +
        '  <span class="cart-item-price">$' + item.price + '</span>' +
        '  <button class="cart-item-remove" data-index="' + index + '">✕</button>' +
        '</div>';
      container.append(itemHtml);
    });

    $("#cart-subtotal").text("$" + total);
    $("#cart-total").text("$" + total);
  }

  // ===== Add to Cart =====
  $(document).on("click", ".add-to-cart", function () {
    var name = $(this).data("name");
    var price = parseInt($(this).data("price"), 10);

    cart.push({ name: name, price: price });
    updateCartBadge();
    showToast(name + " added to cart!");
  });

  // ===== Remove from Cart =====
  $(document).on("click", ".cart-item-remove", function () {
    var index = $(this).data("index");
    var removed = cart.splice(index, 1);
    updateCartBadge();
    renderCart();
    showToast(removed[0].name + " removed");
  });

  // ===== Checkout =====
  $(document).on("click", ".checkout-btn", function () {
    if (cart.length === 0) {
      showToast("Your cart is empty!");
      return;
    }

    var total = cart.reduce(function (sum, item) { return sum + item.price; }, 0);
    var count = cart.length;

    cart = [];
    updateCartBadge();
    renderCart();
    showToast("Order placed! " + count + " item(s) — $" + total);
  });

  // ===== Render Cart on Page Show =====
  $(document).on("pageshow", "#cart", function () {
    renderCart();
  });

  // ===== Service Worker Registration =====
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("./sw.js")
        .then(function (reg) {
          console.log("[ShopEasy] SW registered:", reg.scope);
        })
        .catch(function (err) {
          console.error("[ShopEasy] SW failed:", err);
        });
    });
  }
});