// JavaScript for Delete Button Logic
document.getElementById('confirmDelete').addEventListener('click', function() {
    // Perform your delete action here (e.g., delete item from the table or database)
    alert("Item deleted!");
  
    // Close the modal after the action
    var modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.hide();
  });
  