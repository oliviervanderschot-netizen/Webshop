// Footy4theworld — gedeelde layout, productweergave en winkelmand

const FREE_SHIPPING = 75;
const CART_KEY = "f4w-cart";

const euro = (n) =>
  "€ " + n.toFixed(2).replace(".", ",");

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* --------------------------------------------------------------------------
   Header & footer
   -------------------------------------------------------------------------- */

const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="11" cy="11" r="6.5"/><line x1="20" y1="20" x2="15.8" y2="15.8"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/></svg>',
};

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const page = document.body.dataset.page || "";
  const link = (href, label, key) =>
    `<a href="${href}"${page === key ? ' aria-current="page"' : ""}>${label}</a>`;

  el.className = "site-header";
  el.innerHTML = `
    <div class="announcement">Gratis verzending vanaf ${euro(FREE_SHIPPING).replace(",00", "")} <span class="announce-extra">&nbsp;·&nbsp; 30 dagen retour</span></div>
    <div class="header-inner">
      <button class="menu-btn" id="menuToggle" aria-expanded="false" aria-controls="menuPanel">
        <span class="menu-lines" aria-hidden="true"></span><span class="menu-label">Menu</span>
      </button>
      <nav class="nav" aria-label="Hoofdnavigatie">
        ${link("shop.html", "Shop", "shop")}
        ${link("retro.html", "Retro", "retro")}
        ${link("shop.html?filter=nieuw", "Nieuw", "nieuw")}
      </nav>
      <a href="index.html" class="logo">Footy4theworld</a>
      <div class="header-actions">
        <button class="icon-btn" id="searchToggle" aria-label="Zoeken">${ICONS.search}</button>
        <button class="icon-btn" id="cartToggle" aria-label="Winkelmand">${ICONS.bag}<span class="cart-count" id="cartCount" hidden>0</span></button>
      </div>
    </div>

    <div class="menu-panel" id="menuPanel" hidden>
      <div class="menu-panel-inner">
        <div>
          <p class="eyebrow">Competities</p>
          <ul>
            ${Object.entries(LEAGUES)
              .map(([k, v]) => `<li>${link(k + ".html", v, k)}</li>`)
              .join("")}
          </ul>
        </div>
        <div>
          <p class="eyebrow">Collecties</p>
          <ul>
            <li>${link("shop.html", "Alle shirts", "shop")}</li>
            <li>${link("retro.html", "Retro", "retro")}</li>
            <li>${link("shop.html?filter=nieuw", "Nieuw seizoen", "nieuw")}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="search-panel" id="searchPanel" hidden>
      <div class="search-inner">
        <label for="searchInput" class="visually-hidden">Zoek op club, speler of seizoen</label>
        <input id="searchInput" type="search" placeholder="Zoek op club, speler of seizoen" autocomplete="off" />
        <button class="icon-btn" id="searchClose" aria-label="Sluiten">${ICONS.close}</button>
      </div>
      <div class="search-results" id="searchResults"></div>
    </div>`;
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.className = "site-footer";
  el.innerHTML = `
    <section class="newsletter" id="contact">
      <p class="eyebrow">Nieuwsbrief</p>
      <h2>Als eerste bij nieuwe drops</h2>
      <p class="newsletter-text">Ontvang 10% korting op je eerste bestelling.</p>
      <form class="newsletter-form" id="newsletterForm">
        <label for="newsletter-email" class="visually-hidden">E-mailadres</label>
        <input id="newsletter-email" type="email" placeholder="E-mailadres" required />
        <button type="submit" aria-label="Aanmelden">${ICONS.arrow}</button>
      </form>
    </section>
    <div class="footer-grid">
      <div>
        <a href="index.html" class="logo logo-footer">Footy4theworld</a>
        <p class="footer-note">Voetbalshirts met een verhaal — van Highbury tot het Bernabéu.</p>
      </div>
      <div>
        <p class="eyebrow">Shop</p>
        <a href="shop.html">Alle shirts</a>
        <a href="retro.html">Retro</a>
        <a href="shop.html?filter=nieuw">Nieuw seizoen</a>
      </div>
      <div>
        <p class="eyebrow">Service</p>
        <a href="#">Verzending</a>
        <a href="#">Retourneren</a>
        <a href="#">Maattabel</a>
        <a href="#">Contact</a>
      </div>
      <div>
        <p class="eyebrow">Volg ons</p>
        <a href="#">Instagram</a>
        <a href="#">TikTok</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Footy4theworld</p>
      <p class="payments">iDEAL · Visa · Mastercard · PayPal · Apple Pay</p>
      <p><a href="#">Voorwaarden</a> &nbsp;·&nbsp; <a href="#">Privacy</a></p>
    </div>`;
}

/* --------------------------------------------------------------------------
   Productkaarten & grids
   -------------------------------------------------------------------------- */

function productCard(p) {
  const [front, back] = productImages(p);
  const title = `${p.club} ${p.name}`;
  return `
    <article class="product-card">
      <a href="product.html?id=${p.id}" class="product-media">
        ${p.badge ? `<span class="product-badge">${esc(p.badge)}</span>` : ""}
        <img src="${front}" alt="${esc(title)}" loading="lazy" />
        <img src="${back}" alt="" class="product-back" loading="lazy" />
      </a>
      <div class="product-info">
        <h3><a href="product.html?id=${p.id}">${esc(p.club)}</a></h3>
        <p class="product-sub">${esc(p.name)}${p.player ? " · " + esc(p.player) : ""}</p>
        <p class="product-price">${euro(p.price)}</p>
      </div>
    </article>`;
}

function filterProducts(filter) {
  if (!filter || filter === "alle") return PRODUCTS;
  if (filter === "retro") return PRODUCTS.filter((p) => p.retro);
  if (filter === "nieuw") return PRODUCTS.filter((p) => !p.retro);
  return PRODUCTS.filter((p) => p.league === filter);
}

function renderGrids() {
  document.querySelectorAll("[data-products]").forEach((grid) => {
    const filter = grid.dataset.products;
    const limit = parseInt(grid.dataset.limit || "0", 10);
    let list = filterProducts(filter);
    if (limit) list = list.slice(0, limit);
    const count = document.querySelector(`[data-count-for="${grid.id}"]`);
    if (count) count.textContent = `${list.length} ${list.length === 1 ? "shirt" : "shirts"}`;
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<div class="empty-state">
           <p class="eyebrow">Binnenkort</p>
           <p>Deze collectie wordt op dit moment samengesteld.</p>
           <a href="shop.html" class="link-arrow">Bekijk alle shirts ${ICONS.arrow}</a>
         </div>`;
  });
}

// Shop-pagina: filterchips + sortering, met ?filter= in de URL
function initShop() {
  const grid = document.getElementById("shopGrid");
  const chips = document.querySelectorAll(".filter-chip");
  const sort = document.getElementById("sortSelect");
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  let filter = params.get("filter") || "alle";

  const apply = () => {
    let list = [...filterProducts(filter)];
    if (sort.value === "prijs-op") list.sort((a, b) => a.price - b.price);
    if (sort.value === "prijs-af") list.sort((a, b) => b.price - a.price);
    if (sort.value === "seizoen") list.sort((a, b) => b.season.localeCompare(a.season));
    grid.innerHTML = list.map(productCard).join("");
    document.getElementById("shopCount").textContent = `${list.length} shirts`;
    chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === filter)));
  };

  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      filter = chip.dataset.filter;
      const url = new URL(location.href);
      filter === "alle" ? url.searchParams.delete("filter") : url.searchParams.set("filter", filter);
      history.replaceState(null, "", url);
      apply();
    })
  );
  sort.addEventListener("change", apply);
  if (filter === "nieuw") document.body.dataset.page = "nieuw";
  apply();
}

/* --------------------------------------------------------------------------
   Productpagina
   -------------------------------------------------------------------------- */

function initProductPage() {
  const root = document.getElementById("productPage");
  if (!root) return;

  const p = findProduct(new URLSearchParams(location.search).get("id")) || PRODUCTS[0];
  const imgs = productImages(p);
  const title = `${p.club} ${p.name}`;
  document.title = `${title} — Footy4theworld`;

  root.innerHTML = `
    <nav class="breadcrumb" aria-label="Kruimelpad">
      <a href="index.html">Home</a><span>/</span>
      <a href="${p.league}.html">${LEAGUES[p.league]}</a><span>/</span>
      <span>${esc(p.club)}</span>
    </nav>
    <div class="pdp">
      <div class="pdp-gallery">
        <div class="pdp-main">
          <img src="${imgs[0]}" alt="${esc(title)}" id="pdpMain" />
        </div>
        <div class="pdp-thumbs">
          ${imgs
            .map(
              (src, i) =>
                `<button class="pdp-thumb${src.includes("details") ? " is-wide" : ""}" aria-label="Afbeelding ${i + 1}" aria-current="${i === 0}" data-src="${src}"><img src="${src}" alt="" loading="lazy" /></button>`
            )
            .join("")}
        </div>
      </div>

      <div class="pdp-info">
        <p class="eyebrow">${LEAGUES[p.league]} · ${p.season}${p.retro ? " · Retro" : ""}</p>
        <h1>${esc(p.club)}<span>${esc(p.name)}</span></h1>
        ${p.player ? `<p class="pdp-player">Bedrukking: ${esc(p.player)}</p>` : ""}
        <p class="pdp-price">${euro(p.price)}</p>

        <div class="size-picker">
          <div class="size-head"><span class="eyebrow">Maat</span><a href="#" class="size-guide">Maattabel</a></div>
          <div class="sizes" role="radiogroup" aria-label="Kies een maat">
            ${SIZES.map((s) => `<button type="button" role="radio" aria-checked="false" data-size="${s}">${s}</button>`).join("")}
          </div>
          <p class="size-hint" id="sizeHint" aria-live="polite"></p>
        </div>

        <button class="btn btn-dark btn-block" id="addToCart">In winkelmand</button>

        <ul class="pdp-usps">
          <li>Gratis verzending vanaf ${euro(FREE_SHIPPING).replace(",00", "")}</li>
          <li>Binnen 30 dagen kosteloos retour</li>
        </ul>

        <div class="accordion">
          <details open>
            <summary>Over dit shirt</summary>
            <p>${esc(p.description)}</p>
          </details>
          <details>
            <summary>Details</summary>
            <ul>${p.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
          </details>
          <details>
            <summary>Verzending &amp; retour</summary>
            <p>Bestellingen worden zorgvuldig verpakt verzonden. Niet tevreden? Retourneer je shirt ongedragen en met label binnen 30 dagen.</p>
          </details>
        </div>
      </div>
    </div>`;

  // Galerij
  const main = document.getElementById("pdpMain");
  root.querySelectorAll(".pdp-thumb").forEach((t) =>
    t.addEventListener("click", () => {
      main.src = t.dataset.src;
      main.parentElement.classList.toggle("is-wide", t.classList.contains("is-wide"));
      root.querySelectorAll(".pdp-thumb").forEach((x) => x.setAttribute("aria-current", String(x === t)));
    })
  );

  // Maat + toevoegen
  let size = null;
  const hint = document.getElementById("sizeHint");
  root.querySelectorAll("[data-size]").forEach((b) =>
    b.addEventListener("click", () => {
      size = b.dataset.size;
      hint.textContent = "";
      root.querySelectorAll("[data-size]").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    })
  );
  document.getElementById("addToCart").addEventListener("click", () => {
    if (!size) {
      hint.textContent = "Kies eerst een maat.";
      return;
    }
    addToCart(p.id, size);
  });

  // Gerelateerd: zelfde competitie, aangevuld met de rest
  const related = [
    ...PRODUCTS.filter((x) => x.id !== p.id && x.league === p.league),
    ...PRODUCTS.filter((x) => x.id !== p.id && x.league !== p.league && x.retro === p.retro),
  ].slice(0, 4);
  const rel = document.getElementById("relatedGrid");
  if (rel) rel.innerHTML = related.map(productCard).join("");
}

/* --------------------------------------------------------------------------
   Winkelmand
   -------------------------------------------------------------------------- */

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {}
  renderCart();
}

function addToCart(id, size) {
  const cart = readCart();
  const line = cart.find((l) => l.id === id && l.size === size);
  line ? line.qty++ : cart.push({ id, size, qty: 1 });
  writeCart(cart);
  openCart();
}

function renderCart() {
  const cart = readCart().filter((l) => findProduct(l.id));
  const count = cart.reduce((n, l) => n + l.qty, 0);
  const total = cart.reduce((n, l) => n + l.qty * findProduct(l.id).price, 0);

  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.textContent = count;
    badge.hidden = count === 0;
  }

  const body = document.getElementById("cartBody");
  if (!body) return;

  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty"><p>Je winkelmand is leeg.</p><a href="shop.html" class="link-arrow">Ontdek de collectie ${ICONS.arrow}</a></div>`;
    document.getElementById("cartFoot").hidden = true;
    return;
  }

  const left = FREE_SHIPPING - total;
  body.innerHTML = `
    <div class="shipping-meter">
      <p>${left > 0 ? `Nog ${euro(left)} tot gratis verzending` : "Je bestelling wordt gratis verzonden"}</p>
      <div class="meter"><span style="width:${Math.min(100, (total / FREE_SHIPPING) * 100)}%"></span></div>
    </div>
    <ul class="cart-lines">
      ${cart
        .map((l, i) => {
          const p = findProduct(l.id);
          return `
          <li class="cart-line">
            <img src="${productImages(p)[0]}" alt="" />
            <div>
              <p class="cart-title">${esc(p.club)}</p>
              <p class="cart-sub">${esc(p.name)} · Maat ${l.size}</p>
              <div class="qty">
                <button data-qty="${i}" data-d="-1" aria-label="Minder">−</button>
                <span>${l.qty}</span>
                <button data-qty="${i}" data-d="1" aria-label="Meer">+</button>
              </div>
            </div>
            <div class="cart-right">
              <p>${euro(p.price * l.qty)}</p>
              <button class="cart-remove" data-remove="${i}">Verwijder</button>
            </div>
          </li>`;
        })
        .join("")}
    </ul>`;

  document.getElementById("cartFoot").hidden = false;
  document.getElementById("cartTotal").textContent = euro(total);

  body.querySelectorAll("[data-qty]").forEach((b) =>
    b.addEventListener("click", () => {
      const c = readCart();
      const l = c[b.dataset.qty];
      l.qty += Number(b.dataset.d);
      if (l.qty < 1) c.splice(b.dataset.qty, 1);
      writeCart(c);
    })
  );
  body.querySelectorAll("[data-remove]").forEach((b) =>
    b.addEventListener("click", () => {
      const c = readCart();
      c.splice(b.dataset.remove, 1);
      writeCart(c);
    })
  );
}

function mountCartDrawer() {
  const drawer = document.createElement("div");
  drawer.innerHTML = `
    <div class="overlay" id="overlay" hidden></div>
    <aside class="cart-drawer" id="cartDrawer" aria-label="Winkelmand" aria-hidden="true">
      <div class="cart-head">
        <p class="eyebrow">Winkelmand</p>
        <button class="icon-btn" id="cartClose" aria-label="Sluiten">${ICONS.close}</button>
      </div>
      <div class="cart-body" id="cartBody"></div>
      <div class="cart-foot" id="cartFoot" hidden>
        <div class="cart-total"><span>Subtotaal</span><span id="cartTotal"></span></div>
        <button class="btn btn-dark btn-block" id="checkout">Afrekenen</button>
        <p class="cart-note">Verzendkosten worden berekend bij het afrekenen.</p>
      </div>
    </aside>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
  document.body.append(...drawer.children);

  document.getElementById("cartToggle")?.addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("overlay").addEventListener("click", closeCart);
  document.getElementById("checkout").addEventListener("click", () => toast("Afrekenen wordt binnenkort gekoppeld."));
  renderCart();
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
  document.getElementById("overlay").hidden = false;
  document.body.classList.add("no-scroll");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
  document.getElementById("overlay").hidden = true;
  document.body.classList.remove("no-scroll");
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2800);
}

/* --------------------------------------------------------------------------
   Menu & zoeken
   -------------------------------------------------------------------------- */

function initMenus() {
  const menuBtn = document.getElementById("menuToggle");
  const menu = document.getElementById("menuPanel");
  const searchBtn = document.getElementById("searchToggle");
  const search = document.getElementById("searchPanel");
  const input = document.getElementById("searchInput");
  const results = document.getElementById("searchResults");
  if (!menuBtn) return;

  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    if (open) search.hidden = true;
  };
  const setSearch = (open) => {
    search.hidden = !open;
    if (open) {
      setMenu(false);
      input.focus();
    }
  };

  menuBtn.addEventListener("click", () => setMenu(menu.hidden));
  searchBtn.addEventListener("click", () => setSearch(search.hidden));
  document.getElementById("searchClose").addEventListener("click", () => setSearch(false));

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) return (results.innerHTML = "");
    const hits = PRODUCTS.filter((p) =>
      [p.club, p.name, p.player, p.season, LEAGUES[p.league]].join(" ").toLowerCase().includes(q)
    );
    results.innerHTML = hits.length
      ? hits
          .slice(0, 6)
          .map(
            (p) => `<a href="product.html?id=${p.id}" class="search-hit">
              <img src="${productImages(p)[0]}" alt="" />
              <span><strong>${esc(p.club)}</strong>${esc(p.name)}${p.player ? " · " + esc(p.player) : ""}</span>
              <span>${euro(p.price)}</span></a>`
          )
          .join("")
      : `<p class="search-empty">Geen shirts gevonden voor “${esc(input.value)}”.</p>`;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    setMenu(false);
    setSearch(false);
    closeCart();
  });
  document.addEventListener("click", (e) => {
    if (!menu.hidden && !menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false);
  });
}

function initNewsletter() {
  document.getElementById("newsletterForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    e.target.reset();
    toast("Bedankt — je bent aangemeld.");
  });
}

// Header-schaduw zodra er gescrold wordt
function initScrollState() {
  const header = document.getElementById("site-header");
  const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

document.addEventListener("DOMContentLoaded", () => {
  initShop();
  renderHeader();
  renderFooter();
  renderGrids();
  initProductPage();
  mountCartDrawer();
  initMenus();
  initNewsletter();
  initScrollState();
});
