import "./sign.css";

const continueBtn = document.querySelector("h3");
const input = document.querySelector(".ner");

// Basic email validation: must contain @ and be at least 5 chars
function isValidEmail(value) {
  return value.includes("@") && value.length >= 5;
}

// Create account - Continue button
continueBtn.addEventListener("click", function () {
  const value = input.querySelector("input").value.trim();

  if (value === "") {
    alert("Please enter your email or username!");
    return;
  }

  if (isValidEmail(value)) {
    // Success - redirect to home
    window.location.href = "home.html";
  } else {
    alert("Please enter a valid email address!");
  }
});

// Allow Enter key to submit
input.querySelector("input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    continueBtn.click();
  }
});
