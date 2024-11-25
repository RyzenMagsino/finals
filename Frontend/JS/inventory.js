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
  const category = document.getElementById('category').value;
  const quantity = document.getElementById('quantity').value;

  // Get current date
  const currentDate = new Date().toLocaleDateString();

  // Create new table row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${productId}</td>
    <td>${currentDate}</td>
    <td>${productName} (${category})</td>
    <td>${quantity}</td>
    <td><span class="delete-btn" onclick="showModal(this)">🗑️</span></td>
  `;

  // Append the new row to the table
  tableBody.appendChild(newRow);

  // Close the modal and reset the form
  closeAddProductModal();
});

let rowToDelete; // Only one declaration of this variable

// Delete row functionality
function showModal(element) {
  rowToDelete = element.closest('tr'); // Store the row to delete
  document.getElementById('deleteModal').style.display = 'flex';
}

function hideModal() {
  document.getElementById('deleteModal').style.display = 'none';
}

function confirmDelete() {
  if (rowToDelete) {
    rowToDelete.remove(); // Delete the row from the table
    rowToDelete = null; // Clear the reference
  }
  hideModal();
}

