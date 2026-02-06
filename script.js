const ACCESS_KEY = "labyrinth";
const ACCESS_STORAGE_KEY = "puzzleAccess";

const gate = document.getElementById("gate");
const gateForm = document.getElementById("gateForm");
const gatePassword = document.getElementById("gatePassword");
const gateError = document.getElementById("gateError");

const unlockGate = () => {
  if (gate) {
    gate.classList.add("gate-hidden");
  }
  document.body.classList.remove("locked");
  sessionStorage.setItem(ACCESS_STORAGE_KEY, "granted");
};

if (sessionStorage.getItem(ACCESS_STORAGE_KEY) === "granted") {
  unlockGate();
}

if (gateForm && gatePassword) {
  gatePassword.focus();
  gateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const entered = gatePassword.value.trim().toLowerCase();
    const expected = ACCESS_KEY.toLowerCase();
    if (entered === expected) {
      unlockGate();
    } else if (gateError) {
      gateError.textContent = "Incorrect passphrase. Try again.";
      gatePassword.value = "";
      gatePassword.focus();
    }
  });
}

document.querySelectorAll("[data-scroll]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    const targetSelector = button.getAttribute("data-scroll");
    if (!targetSelector) {
      return;
    }
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const accessForm = document.getElementById("accessForm");
if (accessForm) {
  accessForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = accessForm.querySelector("button");
    if (button) {
      button.textContent = "Request received. Check your email.";
      button.disabled = true;
    }
  });
}
