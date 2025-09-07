const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));
const YEAR = $("#year"); if (YEAR) YEAR.textContent = new Date().getFullYear();

const DATA = [
  { id:1, name:"Noise-Cancel Headphones", category:"electronics", price:1499, rating:4.6, img:"https://picsum.photos/id/1080/600/450" },
  { id:2, name:"Smart Lamp", category:"home", price:89, rating:4.1, img:"https://picsum.photos/id/1060/600/450" },
  { id:3, name:"Yoga Mat Pro", category:"fitness", price:39, rating:4.7, img:"https://picsum.photos/id/102/600/450" },
  { id:4, name:"Stainless Kettle", category:"home", price:55, rating:4.3, img:"https://picsum.photos/id/434/600/450" },
  { id:5, name:"Bluetooth Speaker", category:"electronics", price:99, rating:4.4, img:"https://picsum.photos/id/1084/600/450" },
  { id:6, name:"Resistance Bands", category:"fitness", price:25, rating:4.5, img:"https://picsum.photos/id/483/600/450" },
  { id:7, name:"Clean Architecture", category:"books", price:45, rating:4.8, img:"https://picsum.photos/id/24/600/450" },
  { id:8, name:"Wireless Mouse", category:"electronics", price:29, rating:4.2, img:"https://picsum.photos/id/250/600/450" },
  { id:9, name:"Ceramic Planter", category:"home", price:35, rating:4.0, img:"https://picsum.photos/id/1062/600/450" }
];

const productGrid = $("#productGrid");
const prodCount = $("#prodCount");
const search = $("#search");
const price = $("#price");
const priceVal = $("#priceVal");
const rating = $("#rating");
const sort = $("#sort");
const resetBtn = $("#resetFilters");

let state = {
  cat: "all",
  minRating: 0,
  maxPrice: Number(price.value),
  q: "",
  sortBy: "featured",
};

function renderProducts(list) {
  productGrid.innerHTML = "";
  if (!list.length) {
    productGrid.innerHTML = `<p class="muted">No products match your filters.</p>`;
    prodCount.textContent = "";
    return;
  }
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "product";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="meta">
        <h3>${p.name}</h3>
        <p class="muted">${p.category[0].toUpperCase()+p.category.slice(1)}</p>
        <p class="rating">★ ${p.rating.toFixed(1)}</p>
        <p class="price">$${p.price}</p>
        <button class="btn small">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
  prodCount.textContent = `${list.length} product(s) shown`;
}

function applyFilters() {
  const q = state.q.toLowerCase();
  let list = DATA.filter(p =>
    (state.cat === "all" || p.category === state.cat) &&
    p.price <= state.maxPrice &&
    p.rating >= state.minRating &&
    (p.name.toLowerCase().includes(q))
  );

  switch (state.sortBy) {
    case "price-asc": list.sort((a,b)=>a.price-b.price); break;
    case "price-desc": list.sort((a,b)=>b.price-a.price); break;
    case "name-asc": list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case "name-desc": list.sort((a,b)=>b.name.localeCompare(a.name)); break;
    case "rating-desc": list.sort((a,b)=>b.rating-a.rating); break;
    default: /* featured: stable order */ break;
  }
  renderProducts(list);
}

function bindControls() {
  // Category radios
  $$("input[name=cat]").forEach(r => {
    r.addEventListener("change", () => { state.cat = r.value; applyFilters(); });
  });

  // Search with small debounce
  let t; search.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(()=>{ state.q = search.value.trim(); applyFilters(); }, 200);
  });

  // Price range
  priceVal.textContent = `$${price.value}`;
  price.addEventListener("input", () => {
    state.maxPrice = Number(price.value);
    priceVal.textContent = `$${price.value}`;
    applyFilters();
  });

  // Rating
  rating.addEventListener("change", () => { state.minRating = Number(rating.value); applyFilters(); });

  // Sort
  sort.addEventListener("change", () => { state.sortBy = sort.value; applyFilters(); });

  // Reset
  resetBtn.addEventListener("click", () => {
    state = { cat:"all", minRating:0, maxPrice:Number(price.max), q:"", sortBy:"featured" };
    $("input[name=cat][value=all]").checked = true;
    search.value = "";
    price.value = price.max;
    priceVal.textContent = `$${price.value}`;
    rating.value = "0";
    sort.value = "featured";
    applyFilters();
  });
}

bindControls();
applyFilters();
