// Open the modal for changing password
function openModal() {
    document.getElementById('passwordModal').style.display = 'block';
  }
  
  // Close the modal
  function closeModal() {
    document.getElementById('passwordModal').style.display = 'none';
  }
  
  // Function to handle the password change process
  function saveNewPassword() {
    // Get the new password from the input field
    const newPassword = document.querySelector('#passwordModal input[type="password"]:nth-child(2)').value;
    
    // Check if the passwords match
    const confirmPassword = document.querySelector('#passwordModal input[type="password"]:nth-child(3)').value;
    
    if (newPassword === confirmPassword) {
      // Update the password display in the settings content to match the length of the new password
      const passwordLabel = document.querySelector('.settings-content label');
      passwordLabel.textContent = 'Password: ' + '*'.repeat(newPassword.length); // Display new password as asterisks
  
      // Close the modal
      closeModal();
    } else {
      alert("Passwords do not match!");
    }
  }
  
  // Add an event listener to the "Save" button to handle the password change
  document.querySelector('#passwordModal button').addEventListener('click', saveNewPassword);
  