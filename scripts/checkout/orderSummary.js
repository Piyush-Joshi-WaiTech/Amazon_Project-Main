import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js"; // Added products
import { formatCurrency } from "../utils/money.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartSummaryHTML = cart
    .map((cartItem) => {
      const matchingProduct = getProduct(cartItem.productId);
      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

      const deliveryDate = dayjs()
        .add(deliveryOption.deliveryDays, "days")
        .format("dddd, MMMM D");

      return `
      <div class="cart-item-container
        js-cart-item-container
        js-cart-item-container-${matchingProduct.id}"> <!-- Added class -->
        <div class="delivery-date">Delivery date: ${deliveryDate}</div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchingProduct.name}</div>
            <div class="product-price">$${formatCurrency(
              matchingProduct.priceCents
            )}</div>
            <div class="product-quantity js-product-quantity-${
              matchingProduct.id
            }">
              <span>Quantity: <span class="quantity-label">${
                cartItem.quantity
              }</span></span>
              <span class="update-quantity-link link-primary">Update</span>
              <span class="delete-quantity-link link-primary
                js-delete-link
                js-delete-link-${matchingProduct.id}"
                data-product-id="${matchingProduct.id}">Delete</span>

            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    return deliveryOptions
      .map((option) => {
        const deliveryDate = dayjs()
          .add(option.deliveryDays, "days")
          .format("dddd, MMMM D");
        const priceString =
          option.priceCents === 0
            ? "FREE"
            : `$${formatCurrency(option.priceCents)} -`;
        const isChecked =
          option.id === cartItem.deliveryOptionId ? "checked" : "";

        return `
        <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${option.id}">
          <input type="radio" ${isChecked} class="delivery-option-input" name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">${deliveryDate}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId; // Added productId variable
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      ); // Added container query
      container.remove();

      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      updateDeliveryOption(
        element.dataset.productId,
        element.dataset.deliveryOptionId
      );
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".update-quantity-link").forEach((updateButton) => {
    updateButton.addEventListener("click", () => {
      const productId = updateButton
        .closest(".cart-item-details")
        .querySelector(".js-delete-link").dataset.productId;

      const newQuantity = prompt("Enter new quantity:");

      if (newQuantity !== null) {
        const quantityNumber = parseInt(newQuantity, 10);

        if (!isNaN(quantityNumber) && quantityNumber > 0) {
          // Find cart item and update quantity
          const cartItem = cart.find((item) => item.productId === productId);
          if (cartItem) {
            cartItem.quantity = quantityNumber;

            // ✅ Save updated cart to localStorage
            localStorage.setItem("cart", JSON.stringify(cart));
          }

          // Update UI
          document.querySelector(
            `.js-product-quantity-${productId} .quantity-label`
          ).textContent = quantityNumber;
          renderPaymentSummary();
        } else {
          alert("Please enter a valid quantity (greater than 0).");
        }
      }
    });
  });
}
