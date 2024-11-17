// Get all delete buttons, modal elements and buttons
const deleteBtns = document.querySelectorAll(".delete-btn");
const modal = document.getElementById("deleteModal");
const closeBtn = document.querySelector(".close-btn");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");

// Variable to store the row to be deleted
let rowToDelete = null;

// Event listener for all delete buttons
deleteBtns.forEach(btn => {
    btn.addEventListener("click", function () {
        rowToDelete = this.closest('tr');  // Get the parent row of the delete button
        modal.style.display = "block";  // Show modal
    });
});

// Close the modal when "X" is clicked
closeBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

// If "Yes" is clicked, delete the row
yesBtn.addEventListener("click", function () {
    if (rowToDelete) {
        rowToDelete.remove();  // Remove the selected row from the table
        rowToDelete = null;  // Clear the reference
    }
    modal.style.display = "none";  // Hide the modal
});

// If "No" is clicked, just close the modal
noBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

// Close the modal if clicked outside of the modal content
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
