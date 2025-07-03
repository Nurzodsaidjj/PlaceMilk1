document.addEventListener("DOMContentLoaded", () => {
  const bannerElement = document.getElementById("banner");

  async function fetchBanner() {
    try {
      const response = await fetch(
        "https://market-backend-zeta.vercel.app/banners"
      );

      const banners = await response.json();

      if (!Array.isArray(banners) || banners.length === 0) {
        throw new Error("Bannerlar bo'sh.");
      }

      const randomIndex = Math.floor(Math.random() * banners.length);
      const selectedBanner = banners[randomIndex];

      bannerElement.innerHTML = `<img src="${selectedBanner.img}" alt="Banner" />`;
    } catch (error) {
      console.error("Banner xatosi:", error.message);
      if (bannerElement) bannerElement.textContent = "Banner yuklanmadi.";
    }
  }

  fetchBanner();

  const favoriteBtn = document.getElementById("favoriteBtn");
  const favoriteModal = document.getElementById("favoriteModal");
  const closeBtn = document.querySelector(".close");

  try {
    if (!favoriteBtn || !favoriteModal || !closeBtn) {
      throw new Error("Modal elementlardan biri topilmadi!");
    }

    favoriteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      favoriteModal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
      favoriteModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === favoriteModal) {
        favoriteModal.style.display = "none";
      }
    });
  } catch (err) {
    console.error("Modal xatosi:", err.message);
  }
});
