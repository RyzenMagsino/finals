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

// Initialize product ID counter
let productIdCounter = 1; // You can also use a timestamp or UUID for unique IDs

// Handle Add Product form submission
addProductForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Get form data
  const productName = document.getElementById('productName').value;
  const quantity = document.getElementById('quantity').value;

  // Generate unique product ID
  const productId = `P-${productIdCounter.toString().padStart(4, '0')}`;
  productIdCounter++; // Increment counter for the next product

  // Get current date
  const currentDate = new Date().toLocaleDateString();

  // Create new table row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${productId}</td>
    <td>${currentDate}</td>
    <td>${productName}</td>
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

