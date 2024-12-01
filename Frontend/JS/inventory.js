const apiUrl = 'http://localhost:4000/api/inventory'; // Backend URL

// Function to fetch inventory data from the backend
async function fetchInventory() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Clear the existing table
    const tableBody = document.querySelector('#inventory-body');
    tableBody.innerHTML = '';

    let classicTotal = 0;
    let spicyTotal = 0;
    let roastedTotal = 0;

    data.forEach(product => {
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${product.id}</td> <!-- Use the custom id -->
    <td>${new Date(product.date).toLocaleDateString()}</td>
    <td>${product.productName}</td>
    <td>${product.quantity}</td>
    <td><span class="delete-btn" onclick="deleteProduct('${product._id}')">🗑️</span></td>
  `;
  tableBody.appendChild(newRow);

      // Update totals based on product name
      if (product.productName.toLowerCase() === 'classic') {
        classicTotal += product.quantity;
      } else if (product.productName.toLowerCase() === 'spicy') {
        spicyTotal += product.quantity;
      } else if (product.productName.toLowerCase() === 'roasted') {
        roastedTotal += product.quantity;
      }
    });

    // Update dashboard totals
    document.getElementById('classic-total').textContent = classicTotal;
    document.getElementById('spicy-total').textContent = spicyTotal;
    document.getElementById('roasted-total').textContent = roastedTotal;
  } catch (err) {
    console.error('Error fetching inventory:', err);
  }
}

// Add product functionality
const addProductForm = document.getElementById('addProductForm');
addProductForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const productName = document.getElementById('productName').value; // Get selected product name from dropdown
  const quantity = parseInt(document.getElementById('quantity').value, 10);

  const productData = { productName, quantity };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      fetchInventory(); // Refresh the table and dashboard
      closeAddProductModal(); // Close the modal
    } else {
      console.error('Error adding product:', response.statusText);
    }
  } catch (err) {
    console.error('Error adding product:', err);
  }
});

async function deleteProduct(productId) {
  try {
    const response = await fetch(`${apiUrl}/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Product deleted successfully');
      fetchInventory(); // Refresh the inventory
    } else {
      console.error('Error deleting product:', response.statusText);
    }
  } catch (err) {
    console.error('Error deleting product:', err);
  }
}


// Open Add Product Modal
function openAddProductModal() {
  document.getElementById('addProductModal').style.display = 'block'; // Show the modal
}

// Close Add Product Modal
function closeAddProductModal() {
  document.getElementById('addProductModal').style.display = 'none'; // Close the modal
  addProductForm.reset(); // Reset the form fields
}

// Call fetchInventory on page load
document.addEventListener('DOMContentLoaded', fetchInventory);
