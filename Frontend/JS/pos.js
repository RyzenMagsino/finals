// Product Data
const products = [
  { id: 0, name: "Classic Chicken", price: 46, qty: 0 },
  { id: 1, name: "Spicy Chicken", price: 47, qty: 0 },
  { id: 2, name: "Roasted Chicken", price: 300, qty: 0 },
];

// Add Quantity
function addQuantity() {
  const dropdown = document.getElementById("product-dropdown");
  const selectedIndex = parseInt(dropdown.value, 10);

  if (!isNaN(selectedIndex)) {
    products[selectedIndex].qty++;
    updateProductList();
  }
}

// Remove Quantity
function removeQuantity() {
  const dropdown = document.getElementById("product-dropdown");
  const selectedIndex = parseInt(dropdown.value, 10);

  if (!isNaN(selectedIndex) && products[selectedIndex].qty > 0) {
    products[selectedIndex].qty--;
    updateProductList();
  }
}

// Update Product List
function updateProductList() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Clear existing rows
  let totalPrice = 0;

  products.forEach((product) => {
    if (product.qty > 0) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.qty}</td>
        <td>${product.name}</td>
        <td>₱${product.price.toFixed(2)}</td>
        <td>₱${(product.qty * product.price).toFixed(2)}</td>
      `;
      productList.appendChild(row);
      totalPrice += product.qty * product.price;
    }
  });

  document.getElementById("total-price").innerText = totalPrice.toFixed(2);
  calculateChange(); // Update change based on the payment input
}

// Calculate Change
function calculateChange() {
  const payment = parseFloat(document.getElementById("payment").value) || 0;
  const total = parseFloat(document.getElementById("total-price").innerText) || 0;
  const change = payment >= total ? payment - total : 0;
  document.getElementById("change").innerText = change.toFixed(2);
}

// Pay Function
async function pay() {
  const total = parseFloat(document.getElementById("total-price").innerText);
  const payment = parseFloat(document.getElementById("payment").value);

  if (payment >= total) {
    const salesData = products
      .filter((product) => product.qty > 0)
      .map((product) => ({
        productName: mapProductNameToInventory(product.name),
        quantity: product.qty,
        total: product.qty * product.price,
      }));

    console.log("Sales Data to Send:", salesData); // Debugging: Log sales data

    try {
      const response = await fetch("http://localhost:4000/api/sales/pos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sales: salesData }),
      });

      if (response.ok) {
        alert("Payment Successful! Sales recorded.");
        // Reset the product quantities after sale is processed
        products.forEach((product) => (product.qty = 0));
        document.getElementById("payment").value = "";
        updateProductList();
        document.getElementById("change").innerText = "0.00";
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Failed to process payment. Please try again.");
    }
  } else {
    alert("Insufficient Payment!");
  }
}

// Map the product names sent from POS to the ones in the inventory
function mapProductNameToInventory(posName) {
  const nameMap = {
    "Classic Chicken": "Classic",
    "Spicy Chicken": "Spicy",
    "Roasted Chicken": "Roasted"
  };
  return nameMap[posName] || posName; // Return the original name if no mapping is found
}

// Initialize
function init() {
  updateProductList();
}

// Run Initialization
document.addEventListener("DOMContentLoaded", init);
