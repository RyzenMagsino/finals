const apiUrl = 'http://localhost:4000/api/inventory'; // Backend URL

// Function to calculate total inventory from the inventory table
function calculateTotalInventory(inventoryData) {
  return inventoryData.reduce((total, item) => total + item.quantity, 0);
}
// Function to fetch inventory data from the backend
async function fetchInventory() {
  try {
    // Fetch inventory data
    const inventoryResponse = await fetch(apiUrl);
    const inventoryData = await inventoryResponse.json();

    // Fetch sales data
    const salesResponse = await fetch('http://localhost:4000/api/sales');
    const salesData = await salesResponse.json();

    // Create a map to calculate remaining inventory after sales
    const inventoryMap = inventoryData.reduce((map, item) => {
      const productName = item.productName.toLowerCase();
      if (!map[productName]) {
        map[productName] = 0;
      }
      map[productName] += item.quantity; // Accumulate all quantities
      return map;
    }, {});

    // Deduct sales from the inventory map
    salesData.forEach(sale => {
      const productName = sale.productName.toLowerCase();
      if (inventoryMap[productName] !== undefined) {
        inventoryMap[productName] -= sale.quantity; // Deduct sales quantities
      }
    });

    // Update dashboard totals
    document.getElementById('classic-total').textContent = inventoryMap['classic'] || 0;
    document.getElementById('spicy-total').textContent = inventoryMap['spicy'] || 0;
    document.getElementById('roasted-total').textContent = inventoryMap['roasted'] || 0;

    // Update the inventory table
    const tableBody = document.querySelector('#inventory-body');
    tableBody.innerHTML = ''; // Clear the table
    inventoryData.forEach(product => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td>${product.id}</td>
        <td>${new Date(product.date).toLocaleDateString()}</td>
        <td>${product.productName}</td>
        <td>${product.quantity}</td>
        <td><span class="delete-btn" onclick="deleteProduct('${product._id}')">🗑️</span></td>
      `;
      tableBody.appendChild(newRow);
    });
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
