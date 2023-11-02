// ... (existing code)

// Show the registration form when the "View Details" button is clicked
document.getElementById("show-registration").addEventListener("click", function() {
  const registrationForm = document.getElementById("registration-form");
  registrationForm.style.display = "block";
  // You can also scroll to the registration form for a better user experience
  registrationForm.scrollIntoView({ behavior: "smooth" });
});
