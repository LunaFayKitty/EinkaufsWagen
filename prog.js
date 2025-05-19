document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const cartBody = document.getElementById("cartBody");
  const totalPriceElement = document.getElementById("totalPrice");
  let totalPrice = 0;
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

  // Funktion zum Aktualisieren des Warenkorbs im DOM und im Local Storage
  function updateCart(productName, productPrice) {
    if (cartItems[productName]) {
      cartItems[productName].quantity++;
      const quantityElement =
        cartItems[productName].element.querySelector(".quantity");
      quantityElement.textContent = `${cartItems[productName].quantity}x`;
    } else {
      const productRow = createProductRow(productName, productPrice);
      cartBody.appendChild(productRow);
      cartItems[productName] = {
        quantity: 1,
        element: productRow, // sicherstellen, dass das 'element' richtig gesetzt ist
        price: productPrice,
      };
    }
    totalPrice += productPrice;
    totalPriceElement.textContent = `$${totalPrice}`;
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  // Funktion zum Erstellen eines Produkt-Elements im Warenkorb
  function createProductRow(productName, productPrice) {
    const productRow = document.createElement("tr");
    productRow.classList.add("flex");

    const quantity = document.createElement("td");
    quantity.classList.add(
      "border",
      "p-3",
      "quantity",
      "text-xl",
      "items-center",
      "flex"
    );
    quantity.textContent = "1x";
    productRow.appendChild(quantity);

    const name = document.createElement("td");
    name.classList.add(
      "border",
      "p-3",
      "w-full",
      "text-xl",
      "items-center",
      "flex"
    );
    name.textContent = productName;
    productRow.appendChild(name);

    const price = document.createElement("td");
    price.classList.add(
      "border",
      "p-3",
      "w-full",
      "text-xl",
      "items-center",
      "flex"
    );
    price.textContent = `${productPrice}$`;
    productRow.appendChild(price);

    const removeButtonCell = document.createElement("td");
    removeButtonCell.classList.add(
      "border",
      "p-3",
      "w-full",
      "flex",
      "justify-center"
    );
    const removeButton = document.createElement("button");
    removeButton.classList.add(
      "remove-from-cart",
      "p-1",
      "px-3",
      "rounded-md",
      "text-center",
      "text-white",
      "bg-red-500",
      "hover:bg-red-700",
      "text-xl"
    );
    removeButton.textContent = "Entfernen";
    removeButtonCell.appendChild(removeButton);
    productRow.appendChild(removeButtonCell);

    return productRow;
  }

  // Eventlistener für den "Zum Warenkorb hinzufügen" Button
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const parentDiv = this.parentNode;
      const productName = parentDiv.querySelector("h3").textContent;
      const productPrice = parseFloat(parentDiv.getAttribute("data-preis"));
      updateCart(productName, productPrice);
    });
  });

  // Eventlistener für den "Entfernen" Button des Warenkorb-Elements
  cartBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart")) {
      const row = event.target.parentNode.parentNode;
      const productName = row.querySelector("td:nth-child(2)").textContent;
      const productPrice = cartItems[productName].price;
      const quantity = parseInt(row.querySelector(".quantity").textContent);
      const productTotalPrice = productPrice * quantity;
      totalPrice -= productTotalPrice;
      totalPriceElement.textContent = `$${totalPrice}`;
      row.remove();
      delete cartItems[productName];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  });

  // Laden des Warenkorbs aus dem Local Storage beim Seitenladen
  for (const [productName, productInfo] of Object.entries(cartItems)) {
    const productRow = createProductRow(productName, productInfo.price);
    productRow.querySelector(
      ".quantity"
    ).textContent = `${productInfo.quantity}x`;
    cartBody.appendChild(productRow);
    totalPrice += productInfo.price * productInfo.quantity;
    // Setzen des 'element'-Attributs im 'cartItems' Objekt
    cartItems[productName].element = productRow;
  }
  totalPriceElement.textContent = `$${totalPrice}`;
});
