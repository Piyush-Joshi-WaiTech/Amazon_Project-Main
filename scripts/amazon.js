import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

const productsGrid = document.querySelector(".js-products-grid");
productsGrid.innerHTML = "";

products.forEach((product) => {
  const ratingImagePath = `images/ratings/rating-${Math.round(
    product.rating.stars * 10
  )}.png`;

  const productElement = document.createElement("div");
  productElement.classList.add("product-container");

  productElement.innerHTML = `
    <div class="product-image-container">
      <img class="product-image" src="${product.image}" alt="${product.name}" />
    </div>

    <div class="product-name limit-text-to-2-lines">${product.name}</div>

    <div class="product-rating-container">
      <img class="product-rating-stars" src="${ratingImagePath}" alt="Rating Stars" />
      <div class="product-rating-count link-primary">${
        product.rating.count
      }</div>
    </div>

    <div class="product-price">$${formatCurrency(product.priceCents)}</div>

    <div class="product-quantity-container">
      <select class="product-quantity js-quantity-selector-${product.id}">
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>

    <div class="product-spacer"></div> <!-- ✅ Added back from the 1st code -->

    <div class="added-to-cart js-added-message-${product.id}">
      <img src="images/icons/checkmark.png"> Added
    </div>

    <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">Add to Cart</button>
  `;

  productsGrid.appendChild(productElement);
});

function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  // ✅ Ensure it always displays cart quantity (as in 1st code)
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  let timeoutId; // Store timeout ID to clear it later

  button.addEventListener("click", () => {
    const productId = button.dataset.productId;

    // Get the selected quantity using the unique selector
    const quantitySelector = document.querySelector(
      `.js-quantity-selector-${productId}`
    );
    const selectedQuantity = Number(quantitySelector.value);

    addToCart(productId, selectedQuantity);
    updateCartQuantity();

    // Get the "Added" message element
    const addedMessage = document.querySelector(
      `.js-added-message-${productId}`
    );

    // Show the message
    addedMessage.classList.add("show-added-message");

    // Clear previous timeout if it exists
    clearTimeout(timeoutId);

    // Hide message after 2 seconds
    timeoutId = setTimeout(() => {
      addedMessage.classList.remove("show-added-message");
    }, 2000);
  });
});
