// List of Products
const products = [
    { name: "Classic Chicken", price: 46, qty: 0 },
    { name: "Spicy Chicken", price: 47, qty: 0 },
    { name: "Roasted Chicken", price: 48, qty: 0 },
  ];
  
  // Add Quantity to the Selected Product
  function addQuantity() {
    const dropdown = document.getElementById("product-dropdown");
    const selectedIndex = parseInt(dropdown.value, 10);
    
    // Increment the quantity of the selected product
    products[selectedIndex].qty++;
    updateTable();
  }
  
  // Remove Quantity from the Selected Product
  function removeQuantity() {
    const dropdown = document.getElementById("product-dropdown");
    const selectedIndex = parseInt(dropdown.value, 10);
  
    // Decrement the quantity of the selected product, ensuring it doesn't go below zero
    if (products[selectedIndex].qty > 0) {
      products[selectedIndex].qty--;
      updateTable();
    }
  }
  
  // Update the Table with Product Details
  function updateTable() {
    const tableBody = document.getElementById("product-list");
    tableBody.innerHTML = "";
    let total = 0;
  
    // Generate Table Rows Dynamically
    products.forEach((product) => {
      if (product.qty > 0) {
        const productTotal = product.qty * product.price;
        total += productTotal;
  
        const row = `<tr>
          <td>${product.qty}</td>
          <td>${product.name}</td>
          <td>${product.price}</td>
          <td>${productTotal}</td>
        </tr>`;
        tableBody.innerHTML += row;
      }
    });
  
    // Update Total Price
    document.getElementById("total-price").innerText = total.toFixed(2);
  }
  
  // Calculate the Change
  function calculateChange() {
    const payment = parseFloat(document.getElementById("payment").value) || 0;
    const total = parseFloat(document.getElementById("total-price").innerText);
    const change = payment - total;
  
    document.getElementById("change").innerText = change >= 0 ? change.toFixed(2) : "0.00";
  }
  
  // Process Payment
  function pay() {
    const payment = parseFloat(document.getElementById("payment").value) || 0;
    const total = parseFloat(document.getElementById("total-price").innerText);
  
    if (payment >= total) {
      alert("Payment Successful!");
      products.forEach((product) => (product.qty = 0));
      document.getElementById("payment").value = "";
      updateTable();
      calculateChange();
    } else {
      alert("Insufficient Payment!");
    }
  }
  
  // Initialize the Table on Page Load
  updateTable();
  