const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");
if (hamburger && nav) {
  hamburger.addEventListener("click", () => nav.classList.toggle("open"));
}

// Simple contact “fake send”
const contactForm = document.getElementById("contactForm");
const contactMsg = document.getElementById("contactMsg");
if (contactForm && contactMsg) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm).entries());
    contactMsg.textContent = `Thanks, ${data.name}! I’ll reply to ${data.email} soon.`;
    contactForm.reset();
  });
}
