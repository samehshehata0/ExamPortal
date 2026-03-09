const emailInp = document.getElementById("email");
const passwordInp = document.getElementById("password");
const loginForm = document.querySelector(".Form");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  emailInp.classList.remove("error-border");
  passwordInp.classList.remove("error-border");

  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    document.getElementById("emailError").textContent =
      "No account found. Please register first.";
    emailInp.classList.add("error-border");
    return;
  }

  let isValid = true;

  if (emailInp.value.trim() === "") {
    document.getElementById("emailError").textContent = "Email is required.";
    emailInp.classList.add("error-border");
    isValid = false;
  } else if (emailInp.value !== storedUser.email) {
    document.getElementById("emailError").textContent =
      "This email is not registered.";
    emailInp.classList.add("error-border");
    isValid = false;
  }

  if (passwordInp.value === "") {
    document.getElementById("passwordError").textContent =
      "Password is required.";
    passwordInp.classList.add("error-border");
    isValid = false;
  } else if (passwordInp.value !== storedUser.password) {
    document.getElementById("passwordError").textContent =
      "Incorrect password.";
    passwordInp.classList.add("error-border");
    isValid = false;
  }

  if (isValid) {
    sessionStorage.setItem("isLoggedIn", "true");
    window.location.href = "exam.html";
  }
});
