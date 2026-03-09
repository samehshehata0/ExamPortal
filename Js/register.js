const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const email = document.getElementById("email");
const password = document.getElementById("password");
const repassword = document.getElementById("repassword");
const form = document.querySelector(".Form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;

  document.getElementById("firstNameError").textContent = "";
  document.getElementById("lastNameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("repasswordError").textContent = "";

  firstName.classList.remove("error-border");
  lastName.classList.remove("error-border");
  email.classList.remove("error-border");
  password.classList.remove("error-border");
  repassword.classList.remove("error-border");

  if (firstName.value.trim() === "") {
    document.getElementById("firstNameError").textContent =
      "First Name is required";
    firstName.classList.add("error-border");
    isValid = false;
  }

  if (lastName.value.trim() === "") {
    document.getElementById("lastNameError").textContent =
      "Last Name is required";
    lastName.classList.add("error-border");
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value.trim() === "") {
    document.getElementById("emailError").textContent = "Email is required.";
    email.classList.add("error-border");
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    document.getElementById("emailError").textContent = "Invalid email format.";
    email.classList.add("error-border");
    isValid = false;
  }

  if (password.value === "") {
    document.getElementById("passwordError").textContent =
      "Password is required";
    password.classList.add("error-border");
    isValid = false;
  } else if (password.value.length < 8) {
    document.getElementById("passwordError").textContent =
      "Password must be at least 8 characters";
    password.classList.add("error-border");
    isValid = false;
  }

  if (repassword.value !== password.value) {
    document.getElementById("repasswordError").textContent =
      "Passwords do not match";
    repassword.classList.add("error-border");
    isValid = false;
  }

  if (isValid) {
    const userData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    window.location.replace("login.html");
  }
});
