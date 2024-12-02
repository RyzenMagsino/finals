const salesApiUrl = 'http://localhost:4000'; // Backend sales URL

// Function to fetch sales data and populate the table
async function fetchSalesData() {
  try {
    const response = await fetch('http://localhost:4000/api/sales'); // Replace with your API URL
    const data = await response.json();

    console.log('Fetched Sales Data:', data); // Debugging log for fetched data

    const tableBody = document.getElementById('salesTableBody');
    tableBody.innerHTML = ''; // Clear the table before adding rows

    data.forEach(product => {
      console.log('Processing Product:', product); // Debug each product in the loop

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product._id}</td>
        <td>${new Date(product.date).toLocaleDateString()}</td>
        <td>${product.productName}</td>
        <td>${product.quantity}</td>
        <td>${product.totalPrice}</td>
        <td><span class="delete-btn" onclick="showDeleteModal('${product._id}')">🗑️</span></td>
      `;
      tableBody.appendChild(row);
      console.log('Row added to table'); // Log when the row is added
    });

  } catch (err) {
    console.error('Error fetching sales data:', err);
  }
}


// Function to add a new sale
async function addSale(e) {
  e.preventDefault();

  const productName = document.getElementById('saleProductName').value;
  const quantity = parseInt(document.getElementById('saleQuantity').value, 10);

  // Fixed product prices
  const prices = {
    classic: 46,
    spicy: 47,
    roasted: 250,
  };

  if (!prices[productName.toLowerCase()]) {
    alert('Invalid product selected!');
    return;
  }

  const totalPrice = prices[productName.toLowerCase()] * quantity;

  const saleData = { productName, quantity, totalPrice };

  try {
    const response = await fetch(salesApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saleData),
    });

    if (response.ok) {
      alert('Sale successfully added!');
      fetchSalesData(); // Refresh sales table after addition
      document.getElementById('saleForm').reset(); // Clear form inputs
    } else {
      console.error('Error adding sale:', response.statusText);
      alert('Failed to add sale.');
    }
  } catch (err) {
    console.error('Error adding sale:', err);
  }
}

// Variable to store the sale ID to be deleted
let saleIdToDelete = null;

// Function to show the delete modal
function showDeleteModal(saleId) {
  saleIdToDelete = saleId; // Store the sale ID for use when confirming delete
  const deleteModal = document.getElementById('deleteModal');
  deleteModal.style.display = 'block'; // Show the modal
}

// Function to hide the delete modal
function hideModal() {
  const deleteModal = document.getElementById('deleteModal');
  deleteModal.style.display = 'none'; // Hide the modal
  saleIdToDelete = null; // Clear the stored sale ID
}

// Function to confirm deletion
// Function to confirm deletion
function confirmDelete() {
  if (saleIdToDelete) {
    deleteSale(saleIdToDelete); // Call the deleteSale function
    hideModal(); // Hide the modal after confirming
  } else {
    console.error('No sale ID set for deletion');
  }
}

// Function to delete a sale by ID
async function deleteSale(saleId) {
  try {
    const response = await fetch(`${salesApiUrl}/api/sales/${saleId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Sale successfully deleted!');
      fetchSalesData(); // Refresh the sales table after deletion
    } else {
      console.error('Error deleting sale:', response.statusText);
      alert('Failed to delete sale.');
    }
  } catch (err) {
    console.error('Error deleting sale:', err);
  }
}


// Fetch sales data on page load
document.addEventListener('DOMContentLoaded', fetchSalesData);
