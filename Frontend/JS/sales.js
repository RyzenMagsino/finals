let rowToDelete; // Only one declaration of this variable

  // Show modal to confirm deletion
  function showModal(element) {
    rowToDelete = element.closest('tr'); // Store the row to delete
    document.getElementById('deleteModal').style.display = 'flex';
  }

  // Hide modal
  function hideModal() {
    document.getElementById('deleteModal').style.display = 'none';
  }

  // Confirm deletion and remove row
  function confirmDelete() {
    if (rowToDelete) {
      rowToDelete.remove(); // Delete the row from the table
      rowToDelete = null; // Clear the reference
    }
    hideModal();
  }


// Reference elements for Add Product Modal
const addProductModal = document.getElementById('addProductModal');
const addProductForm = document.getElementById('addProductForm');
const tableBody = document.querySelector('table tbody');

// Open and close modal
function openAddProductModal() {
  addProductModal.style.display = 'block';
}

function closeAddProductModal() {
  addProductModal.style.display = 'none';
  addProductForm.reset(); // Reset the form fields
}

// Handle Add Product form submission
addProductForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get form data
  const productName = document.getElementById('productName').value;
  const productId = document.getElementById('productId').value;
  
  const quantity = document.getElementById('quantity').value;

  // Get current date
  const currentDate = new Date().toLocaleDateString();

  // Create new table row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${productId}</td>
    <td>${currentDate}</td>
    <td>${productName} </td>
    <td>${quantity}</td>
    <td><span class="delete-btn" onclick="showModal(this)">🗑️</span></td>
  `;

  // Append the new row to the table
  tableBody.appendChild(newRow);

  // Close the modal and reset the form
  closeAddProductModal();
});


// Function to filter rows by date
function filterByDate() {
  const selectedDate = document.getElementById('date').value; // Get the selected date in YYYY-MM-DD format
  const rows = document.querySelectorAll('table tbody tr'); // Select all rows in the table body

  rows.forEach(row => {
    const rowDate = row.cells[1].textContent; // Extract the date from the second column of the row
    const formattedRowDate = new Date(rowDate).toISOString().split('T')[0]; // Format the row date to YYYY-MM-DD

    // Show or hide the row based on whether the dates match
    if (selectedDate && formattedRowDate === selectedDate) {
      row.style.display = ''; // Show the row
    } else {
      row.style.display = 'none'; // Hide the row
    }
  });
}

// Attach event listener to the date input
document.getElementById('date').addEventListener('input', filterByDate);


