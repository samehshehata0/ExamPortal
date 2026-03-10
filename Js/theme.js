const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const logoImg = document.getElementById("logo-img");
const currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);
updateIcon(currentTheme);

themeToggle.addEventListener("click", () => {
  let theme = document.documentElement.getAttribute("data-theme");
  let newTheme = theme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateIcon(newTheme);
});

function updateIcon(theme) {
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  if (logoImg) {
    logoImg.src =
      theme === "dark"
        ? "../imgs/output-onlinepngtools.png"
        : "../imgs/open-book.png";
  }
}

