import { getProducts } from "./service.js";

const phones__wrapper = document.querySelector(".phones__wrapper");
const laptops__wrapper = document.querySelector(".laptops__wrapper");
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

    const selected = banners[Math.floor(Math.random() * banners.length)];
    bannerElement.innerHTML = `<img src="${selected.img}" alt="Banner">`;
  } catch (err) {
    console.error("Banner xatosi:", err.message);
    bannerElement.textContent = "Banner yuklanmadi.";
  }
}

function getFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem("favorites"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function toggleFavorite(item, btn) {
  let favorites = getFavorites();

  const index = favorites.findIndex((el) => el.id === item.id);
  if (index !== -1) {
    favorites.splice(index, 1);
    btn.textContent = "🤍 Like";
    btn.disabled = false;
  } else {
    favorites.push(item);
    btn.textContent = "❤️ Liked";
    btn.disabled = false;
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function renderCards(wrapper, data) {
  wrapper.innerHTML = data
    .map(
      (item) => `
      <div class="product__card" data-id="${item.id}">
        <img src="${item.img}" alt="${item.title}" />
        <h2>${item.title}</h2>
        <span class="product__price">${item.price}</span>
        <p>${item.brand}</p>
        <button class="like-btn">🤍 Like</button>
      </div>
    `
    )
    .join("");

  wrapper.querySelectorAll(".like-btn").forEach((btn, index) => {
    const item = data[index];
    const isLiked = getFavorites().some((el) => el.id === item.id);
    btn.textContent = isLiked ? "❤️ Liked" : "🤍 Like";

    btn.addEventListener("click", () => {
      toggleFavorite(item, btn);
    });
  });
}

async function renderPhone() {
  const data = await getProducts("phones");
  const limited = data.slice(0, 12);
  renderCards(phones__wrapper, limited);
}

async function renderSport() {
  const data = await getProducts("sport");
  renderCards(laptops__wrapper, data);
}

favoriteBtn.addEventListener("click", () => {
  const favorites = getFavorites();

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
