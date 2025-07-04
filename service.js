export async function getProducts(category) {
  try {
    const response = await fetch(`https://market-backend-zeta.vercel.app/${category}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Mahsulotlarni olishda xatolik:", err.message);
    return [];
  }
}
