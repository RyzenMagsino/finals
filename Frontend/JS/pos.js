// Global variable to store products from the backend
let products = [];

// Fetch products from the backend (MongoDB)
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:4000/api/pos');
    const data = await response.json();

    if (response.ok) {
      products = data.products;

      // Populate dropdown
      const dropdown = document.getElementById('product-dropdown');
      dropdown.innerHTML = products.map(
        (product, index) => `<option value="${index}">${product.name} - ₱${product.price}</option>`
      ).join('');

      updateTable();
    } else {
      alert('Failed to fetch products');
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
}


// Function to update the backend when the quantity changes
async function updateProductQuantity(productId, qty) {
  try {
    const response = await fetch(`http://localhost:4000/api/pos/${products[selectedIndex]._id}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qty }),
    });
    

    const data = await response.json();
    if (response.ok) {
      console.log('Product quantity updated:', data);
      updateTable();
    } else {
      alert('Failed to update product quantity');
    }
  } catch (err) {
    console.error('Error updating product quantity:', err);
  }
}

// Add Quantity to the Selected Product
async function addQuantity() {
  const dropdown = document.getElementById("product-dropdown");
  const selectedIndex = parseInt(dropdown.value, 10);
  
  // Increment the quantity locally
  products[selectedIndex].qty++;
  
  // Update the backend with the new quantity
  await updateProductQuantity(products[selectedIndex]._id, products[selectedIndex].qty);
}

// Remove Quantity from the Selected Product
async function removeQuantity() {
  const dropdown = document.getElementById("product-dropdown");
  const selectedIndex = parseInt(dropdown.value, 10);

  // Decrement the quantity locally (if > 0)
  if (products[selectedIndex].qty > 0) {
    products[selectedIndex].qty--;
    
    // Update the backend with the new quantity
    await updateProductQuantity(products[selectedIndex]._id, products[selectedIndex].qty);
  }
}

// Update the Table with Product Details
function updateTable() {
  const tableBody = document.getElementById("product-list");
  tableBody.innerHTML = "";
  let total = 0;

  // Generate Table Rows Dynamically from products
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

// Process Payment and Save Transaction to Backend
async function pay() {
  const payment = parseFloat(document.getElementById("payment").value) || 0;
  const total = parseFloat(document.getElementById("total-price").innerText);

  if (payment >= total) {
    // Create the transaction object
    const transaction = {
      totalAmount: total,
      paymentAmount: payment,
      changeAmount: payment - total,
      products: products.filter(product => product.qty > 0),
    };

    // Send transaction details to the backend for processing
    try {
      const response = await fetch('http://localhost:4000/api/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Payment Successful!');
        // Reset quantities after payment
        products.forEach((product) => (product.qty = 0));
        document.getElementById("payment").value = "";
        updateTable();
        calculateChange();
      } else {
        alert('Payment failed');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
    }
  } else {
    alert("Insufficient Payment!");
  }
}

// Initialize the Table and Fetch Products on Page Load
fetchProducts();
