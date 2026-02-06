const primaryCta = document.getElementById("primaryCta");
const navCta = document.getElementById("navCta");

const handleCtaClick = (event) => {
  event.preventDefault();
  const contactSection = document.getElementById("contact");
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: "smooth" });
  }
};

if (primaryCta) {
  primaryCta.addEventListener("click", handleCtaClick);
}

if (navCta) {
  navCta.addEventListener("click", handleCtaClick);
}

const form = document.querySelector(".cta-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    if (button) {
      button.textContent = "Thanks! We will reach out soon.";
      button.disabled = true;
    }
  });
}
