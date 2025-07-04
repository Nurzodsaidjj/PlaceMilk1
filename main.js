import { getProducts } from "./service.js";

document.addEventListener("DOMContentLoaded", () => {
  const phones__wrapper = document.querySelector(".phones__wrapper");
  const bannerElement = document.getElementById("banner");
  const favoriteBtn = document.getElementById("favoriteBtn");
  const favoriteModal = document.getElementById("favoriteModal");
  const favoriteList = document.getElementById("favoriteList");
  const closeBtn = document.querySelector(".close");

  async function fetchBanner() {
    try {
      const response = await fetch(
        "https://market-backend-zeta.vercel.app/banners"
      );
      const banners = await response.json();

      if (!Array.isArray(banners) || banners.length === 0) {
        throw new Error("Bannerlar bo'sh.");
      }

      const selectedBanner =
        banners[Math.floor(Math.random() * banners.length)];
      bannerElement.innerHTML = `<img src="${selectedBanner.img}" alt="Banner">`;
    } catch (err) {
      console.error("Banner xatosi:", err.message);
      bannerElement.textContent = "Banner yuklanmadi.";
    }
  }

  async function renderPhone() {
    const data = await getProducts("phones");
    const limitedData = data.slice(0, 12);

    phones__wrapper.innerHTML = limitedData
      .map(
        (item) => `
        <div class="product__card" data-id="${item.id}">
          <img src="${item.img}" alt="${item.title}" />
          <h2>${item.title}</h2>
          <button class="like-btn">🤍 Like</button>
        </div>
      `
      )
      .join("");

    document.querySelectorAll(".like-btn").forEach((btn, index) => {
      btn.addEventListener("click", () => {
        saveToFavorites(limitedData[index]);
        btn.textContent = "❤️ Liked";
        btn.disabled = true;
      });
    });
  }
  async function renderSport() {
    const laptops__wrapper = document.querySelector(".laptops__wrapper");
    const data = await getProducts("sport");

    const limitedData = data.slice(0, 12);
    laptops__wrapper.innerHTML = limitedData
      .map(
        (item) => `
        <div class="product__card" data-id="${item.id}">
          <img src="${item.img}" alt="${item.title}" />
          <h2>${item.title}</h2>
          <button class="like-btn">🤍 Like</button>
        </div>
      `
      )
      .join("");

    document
      .querySelectorAll(".laptops__wrapper .like-btn")
      .forEach((btn, index) => {
        btn.addEventListener("click", () => {
          saveToFavorites(limitedData[index]);
          btn.textContent = "❤️ Liked";
          btn.disabled = true;
        });
      });
  }

  function saveToFavorites(item) {
    const existing = JSON.parse(localStorage.getItem("favorites")) || [];
    const alreadyExists = existing.some((el) => el.id === item.id);
    if (!alreadyExists) {
      existing.push(item);
      localStorage.setItem("favorites", JSON.stringify(existing));
    }
  }

  favoriteBtn.addEventListener("click", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favoriteList.innerHTML = favorites.length
      ? favorites
          .map(
            (item) => `
        <div class="favorite-card">
          <img src="${item.img}" alt="${item.title}" />
          <span>${item.title}</span>
        </div>
      `
          )
          .join("")
      : "<p>Sevimli mahsulotlar yo'q.</p>";

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

  fetchBanner();
  renderPhone();
  renderSport();
});
console.log(favoriteBtn);
