/* ===============================
   SRI LALITHA TRADERS - APP.JS
   Supabase Owner Authentication
================================= */

let whatsappSettings =
  JSON.parse(localStorage.getItem("slt_whatsapp_settings")) ||
  { ownerNumber: "" };

function saveWhatsappSettings() {
  localStorage.setItem(
    "slt_whatsapp_settings",
    JSON.stringify(whatsappSettings)
  );
}


/* ===============================
   DEFAULT DATA
================================= */

const defaults = [
  {
    id: 1,
    name: "0.5 HP Water Pump",
    category: "Pumps & Motors",
    price: 4500,
    stock: 8,
    image: ""
  },
  {
    id: 2,
    name: "1 HP Motor",
    category: "Pumps & Motors",
    price: 7200,
    stock: 5,
    image: ""
  },
  {
    id: 3,
    name: "3/4 PVC Elbow",
    category: "PVC",
    price: 35,
    stock: 100,
    image: ""
  },
  {
    id: 4,
    name: "1 Inch PVC Pipe",
    category: "PVC",
    price: 180,
    stock: 50,
    image: ""
  },
  {
    id: 5,
    name: "HDPE Pipe",
    category: "HDPE",
    price: 250,
    stock: 30,
    image: ""
  },
  {
    id: 6,
    name: "CPVC Elbow",
    category: "CPVC",
    price: 55,
    stock: 80,
    image: ""
  },
  {
    id: 7,
    name: "SWR Pipe",
    category: "SWR",
    price: 320,
    stock: 40,
    image: ""
  },
  {
    id: 8,
    name: "Electrical Wire 1.5 sq mm",
    category: "Wires",
    price: 850,
    stock: 25,
    image: ""
  }
];


const defaultLocations = [
  { name: "Gajwel", charge: 50 },
  { name: "Siddipet", charge: 150 },
  { name: "Jagdevpur", charge: 100 }
];


/* ===============================
   APP DATA
================================= */

let products =
  JSON.parse(localStorage.getItem("slt_products")) || defaults;

let locations =
  JSON.parse(localStorage.getItem("slt_locations")) || defaultLocations;

let cart =
  JSON.parse(localStorage.getItem("slt_cart")) || [];

let orders =
  JSON.parse(localStorage.getItem("slt_orders")) || [];

let lang = "en";
let activeCategory = "All";

let customerCurrentLocation = null;

/* Supabase will control this */
let isOwnerLoggedIn = false;


/* ===============================
   SAVE DATA
================================= */

function save() {

  localStorage.setItem(
    "slt_products",
    JSON.stringify(products)
  );

  localStorage.setItem(
    "slt_locations",
    JSON.stringify(locations)
  );

  localStorage.setItem(
    "slt_cart",
    JSON.stringify(cart)
  );

  localStorage.setItem(
    "slt_orders",
    JSON.stringify(orders)
  );

  if (typeof syncAllToSupabase === "function") {
    syncAllToSupabase();
  }

}


/* ===============================
   OWNER UI
================================= */

function updateOwnerUI() {

  const cartBtn =
    document.getElementById("cartButton");

  const loginBtn =
    document.getElementById("ownerLoginButton");

  const dashBtn =
    document.getElementById("ownerDashboardButton");

  const logoutBtn =
    document.getElementById("ownerLogoutButton");


  if (isOwnerLoggedIn) {

    cartBtn.classList.add("hidden");
    loginBtn.classList.add("hidden");

    dashBtn.classList.remove("hidden");
    logoutBtn.classList.remove("hidden");

  } else {

    cartBtn.classList.remove("hidden");
    loginBtn.classList.remove("hidden");

    dashBtn.classList.add("hidden");
    logoutBtn.classList.add("hidden");

  }

}


/* ===============================
   BASIC FUNCTIONS
================================= */

function money(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}


function toast(t) {

  const x = document.getElementById("toast");

  x.textContent = t;

  x.style.display = "block";

  setTimeout(() => {
    x.style.display = "none";
  }, 2200);

}


/* ===============================
   PAGE NAVIGATION
================================= */

function showPage(p) {

  if (p === "admin" && !isOwnerLoggedIn) {
    showLogin();
    return;
  }

  [
    "shopPage",
    "cartPage",
    "checkoutPage",
    "adminPage"
  ].forEach(x => {
    document
      .getElementById(x)
      .classList.add("hidden");
  });


  document
    .getElementById(p + "Page")
    .classList.remove("hidden");


  if (p === "shop") {
    renderProducts();
  }

  if (p === "admin") {
    renderAdmin();
  }

}


/* ===============================
   LANGUAGE
================================= */

function toggleLanguage() {

  lang = lang === "en" ? "te" : "en";

  document
    .querySelectorAll("[data-en]")
    .forEach(e => {
      e.textContent = e.dataset[lang];
    });


  toast(
    lang === "te"
      ? "తెలుగు ఎంచుకోబడింది"
      : "English selected"
  );

}


/* ===============================
   LOCATIONS
================================= */

function renderLocations() {

  const s =
    document.getElementById("locationSelect");

  const old = s.value;


  s.innerHTML =
    '<option value="">Select delivery location</option>' +
    locations
      .map(l =>
        `<option value="${l.name}">
          ${l.name}
        </option>`
      )
      .join("");


  s.value = old;

}


function updateLocationInfo() {

  const l =
    locations.find(
      x => x.name === locationSelect.value
    );


  document
    .getElementById("locationInfo")
    .textContent =
      l
        ? `Delivery available – ${money(l.charge)}`
        : "Please select a supported location";

}


/* ===============================
   CATEGORIES
================================= */

function renderCategories() {

  const cats = [
    "All",
    ...new Set(products.map(p => p.category))
  ];


  document
    .getElementById("categories")
    .innerHTML =
      cats
        .map(c =>
          `<button
            onclick="activeCategory='${c}';renderProducts()">
            ${c}
          </button>`
        )
        .join("");

}


/* ===============================
   PRODUCTS
================================= */

function renderProducts() {

  renderCategories();


  const q =
    document
      .getElementById("search")
      .value
      .toLowerCase();


  const list =
    products.filter(p =>

      (activeCategory === "All" ||
        p.category === activeCategory)

      &&

      (p.name + " " + p.category)
        .toLowerCase()
        .includes(q)

    );


  document
    .getElementById("products")
    .innerHTML =

    list.map(p => `

      <article class="product">

        <img
          src="${
            p.image ||
            "https://placehold.co/400x250?text=" +
            encodeURIComponent(p.name)
          }"
          alt="${p.name}"
        >

        <h3>${p.name}</h3>

        <p>${p.category}</p>

        <div class="price">
          ${money(p.price)}
        </div>

        <p class="stock">
          ${
            p.stock > 0
              ? p.stock + " in stock"
              : "Out of stock"
          }
        </p>

        <button
          class="primary"
          ${p.stock <= 0 ? "disabled" : ""}
          onclick="addToCart(${p.id})"
        >
          Add to Cart
        </button>

      </article>

    `).join("")
    || "<p>No products found.</p>";

}


function addToCart(id) {

  const p =
    products.find(x => x.id === id);

  const c =
    cart.find(x => x.id === id);


  if (!p || p.stock < 1) {
    return toast("Out of stock");
  }


  if (c) {

    if (c.qty < p.stock) {
      c.qty++;
    }

  } else {

    cart.push({
      id: id,
      qty: 1
    });

  }


  save();

  updateCartCount();

  toast("Added to cart");

}


function updateCartCount() {

  document
    .getElementById("cartCount")
    .textContent =

    cart.reduce(
      (a, x) => a + x.qty,
      0
    );

}


function cartDetails() {

  return cart
    .map(c => {

      const product =
        products.find(
          p => p.id === c.id
        );

      return product
        ? {
            ...product,
            qty: c.qty
          }
        : null;

    })
    .filter(Boolean);

}


/* ===============================
   CART
================================= */

function showCart() {

  showPage("cart");

  renderCart();

}


function renderCart() {

  const d = cartDetails();


  const total =
    d.reduce(
      (a, x) =>
        a + x.price * x.qty,
      0
    );


  document
    .getElementById("cartItems")
    .innerHTML =

    d.map(x => `

      <div class="cart-row">

        <div>

          <b>${x.name}</b>

          <br>

          ${money(x.price)}
          ×
          ${x.qty}

        </div>


        <div>

          <button
            onclick="changeQty(${x.id},-1)">
            −
          </button>

          ${x.qty}

          <button
            onclick="changeQty(${x.id},1)">
            +
          </button>

          <button
            onclick="removeCart(${x.id})">
            Remove
          </button>

        </div>

      </div>

    `).join("")
    || "<p>Your cart is empty.</p>";


  document
    .getElementById("cartTotal")
    .textContent =
      "Items Total: " + money(total);

}


function changeQty(id, n) {

  const c =
    cart.find(x => x.id === id);

  const p =
    products.find(x => x.id === id);


  if (!c || !p) return;


  c.qty =
    Math.max(
      1,
      Math.min(
        p.stock,
        c.qty + n
      )
    );


  save();

  renderCart();

  updateCartCount();

}


function removeCart(id) {

  cart =
    cart.filter(x => x.id !== id);

  save();

  renderCart();

  updateCartCount();

}


/* ===============================
   CHECKOUT
================================= */

function showCheckout() {

  if (!cart.length) {
    return toast("Cart is empty");
  }


  if (!locationSelect.value) {
    return toast(
      "Please select a supported delivery location first"
    );
  }


  showPage("checkout");

  renderCheckout();

}


function renderCheckout() {

  const items =
    cartDetails();


  const sub =
    items.reduce(
      (a, x) =>
        a + x.price * x.qty,
      0
    );


  const loc =
    locations.find(
      x =>
        x.name === locationSelect.value
    );


  const delivery =
    document.getElementById("deliveryType").value === "delivery"
      ? (loc?.charge || 0)
      : 0;


  document
    .getElementById("checkoutSummary")
    .innerHTML = `

      <h3>Order Summary</h3>

      <p>
        Items: ${money(sub)}
      </p>

      <p>
        Delivery: ${money(delivery)}
      </p>

      <h3>
        Total: ${money(sub + delivery)}
      </h3>

    `;

}


/* ===============================
   CUSTOMER LOCATION
================================= */

function getCurrentLocation() {

  if (!navigator.geolocation) {

    document
      .getElementById("currentLocationStatus")
      .textContent =
        "Your browser does not support location sharing.";

    return;

  }


  document
    .getElementById("currentLocationStatus")
    .textContent =
      "Getting your current location...";


  navigator.geolocation.getCurrentPosition(

    position => {

      const lat =
        position.coords.latitude;

      const lng =
        position.coords.longitude;


      customerCurrentLocation = {

        lat,
        lng,

        mapUrl:
          `https://www.google.com/maps?q=${lat},${lng}`

      };


      document
        .getElementById("currentLocationStatus")
        .textContent =
          "✅ Current location captured successfully.";


      document
        .getElementById("locationPreview")
        .innerHTML =

        `📍 <a
          href="${customerCurrentLocation.mapUrl}"
          target="_blank">
          View shared location on Google Maps
        </a>`;

    },


    error => {

      let message =
        "Unable to get your location. Please allow location permission.";


      if (error.code === 1) {

        message =
          "Location permission was denied. Please allow it and try again.";

      }


      document
        .getElementById("currentLocationStatus")
        .textContent =
          message;

    },


    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }

  );

}


/* ===============================
   PLACE ORDER
================================= */

function placeOrder() {

  const name =
    customerName.value.trim();

  const phone =
    document
      .getElementById("phone")
      .value
      .trim();

  const addr =
    address.value.trim();


  if (!name || !phone) {

    return toast(
      "Enter name and mobile number"
    );

  }


  if (
    deliveryType.value === "delivery" &&
    !customerCurrentLocation
  ) {

    return toast(
      "Please share your current location for delivery"
    );

  }


  const items =
    cartDetails();


  const sub =
    items.reduce(
      (a, x) =>
        a + x.price * x.qty,
      0
    );


  const delivery =
    deliveryType.value === "delivery"

      ? (
          locations.find(
            x => x.name === locationSelect.value
          )?.charge || 0
        )

      : 0;


  const order = {

    id:
      "SLT" + Date.now(),

    date:
      new Date().toLocaleString(),

    name,

    phone,

    address:
      deliveryType.value === "delivery"
        ? addr
        : "Store Pickup",

    location:
      locationSelect.value,

    currentLocation:
      customerCurrentLocation,

    payment:
      paymentMethod.value,

    items,

    subtotal:
      sub,

    delivery,

    total:
      sub + delivery,

    status:
      "Order Placed"

  };


  orders.unshift(order);


  items.forEach(i => {

    const product =
      products.find(
        p => p.id === i.id
      );

    if (product) {
      product.stock -= i.qty;
    }

  });


  cart = [];


  save();

  updateCartCount();


  toast(
    "Order placed successfully!"
  );


  sendOwnerOrderMessage(order);


  showPage("shop");

}


/* ==========================================
   SUPABASE OWNER LOGIN
========================================== */

function showLogin() {

  document
    .getElementById("loginModal")
    .classList.remove("hidden");

}


function closeLogin() {

  document
    .getElementById("loginModal")
    .classList.add("hidden");

}


/* LOGIN USING SUPABASE EMAIL + PASSWORD */

async function login() {

  const email =
    document
      .getElementById("username")
      .value
      .trim();


  const passwordValue =
    document
      .getElementById("password")
      .value;


  if (!email || !passwordValue) {

    toast(
      "Enter email and password"
    );

    return;

  }


  if (!window.supabaseClient) {

    toast(
      "Supabase is not connected"
    );

    return;

  }


  try {

    const {
      data,
      error
    } =
      await window.supabaseClient.auth.signInWithPassword({

        email: email,

        password: passwordValue

      });


    if (error) {

      console.error(error);

      toast(
        "Invalid email or password"
      );

      return;

    }


    if (!data.session) {

      toast(
        "Login failed. Please try again."
      );

      return;

    }


    isOwnerLoggedIn = true;


    /* Clear password field */

    document
      .getElementById("password")
      .value = "";


    closeLogin();

    updateOwnerUI();

    showPage("admin");

    toast(
      "Welcome Owner"
    );

  }

  catch (error) {

    console.error(error);

    toast(
      "Unable to login. Please try again."
    );

  }

}


/* ==========================================
   SUPABASE LOGOUT
========================================== */

async function logout() {

  try {

    if (window.supabaseClient) {

      await window.supabaseClient.auth.signOut();

    }

  }

  catch (error) {

    console.error(error);

  }


  isOwnerLoggedIn = false;


  updateOwnerUI();


  showPage("shop");


  toast(
    "Logged out"
  );

}


/* ===============================
   ADMIN TABS
================================= */

function adminTab(id) {

  document
    .querySelectorAll(".admin-tab")
    .forEach(x => {
      x.classList.add("hidden");
    });


  document
    .getElementById(id)
    .classList.remove("hidden");

}


/* ===============================
   WHATSAPP SETTINGS
================================= */

function saveOwnerWhatsappNumber() {

  const n =
    document
      .getElementById("ownerWhatsappNumber")
      .value
      .trim();


  if (!n) {

    return toast(
      "Enter a WhatsApp number"
    );

  }


  whatsappSettings.ownerNumber = n;


  saveWhatsappSettings();


  const status =
    document.getElementById(
      "whatsappSaveStatus"
    );


  if (status) {

    status.textContent =
      "✅ WhatsApp number saved successfully.";

  }


  toast(
    "Owner WhatsApp number saved"
  );

}


/* ===============================
   OWNER DASHBOARD
================================= */

function renderAdmin() {

  if (!isOwnerLoggedIn) return;


  const w =
    document.getElementById(
      "ownerWhatsappNumber"
    );


  if (w) {
    w.value =
      whatsappSettings.ownerNumber;
  }


  /* PRODUCTS */

  document
    .getElementById("adminProducts")
    .innerHTML =

    products.map(p => `

      <div class="admin-row">

        <span>

          <b>${p.name}</b>

          – ${p.category}

          <br>

          ${money(p.price)}

          |

          Stock: ${p.stock}

        </span>


        <span>

          <button
            onclick="editProduct(${p.id})">
            Edit
          </button>

          <button
            onclick="deleteProduct(${p.id})">
            Delete
          </button>

        </span>

      </div>

    `).join("");


  /* LOCATIONS */

  document
    .getElementById("adminLocations")
    .innerHTML =

    locations.map((l, i) => `

      <div class="admin-row">

        <span>

          <b>${l.name}</b>

          –

          Delivery ${money(l.charge)}

        </span>

        <button
          onclick="deleteLocation(${i})">
          Delete
        </button>

      </div>

    `).join("");


  /* ORDERS */

  document
    .getElementById("adminOrders")
    .innerHTML =

    orders.map(o => `

      <div class="admin-row">

        <span>

          <b>${o.id}</b>

          <br>

          ${o.name}

          |

          ${o.phone}

          <br>

          ${o.location}

          |

          ${o.payment}

          <br>


          ${
            o.currentLocation

              ? `📍 <a
                  href="${o.currentLocation.mapUrl}"
                  target="_blank">
                  Open Customer Current Location
                </a>
                <br>`

              : ""
          }


          Total:
          ${money(o.total)}

          <br>

          ${o.items
            .map(
              i =>
                i.name +
                " × " +
                i.qty
            )
            .join(", ")}

        </span>


        <select
          onchange="updateOrder('${o.id}',this.value)"
        >

          <option
            ${o.status === "Order Placed" ? "selected" : ""}>
            Order Placed
          </option>

          <option
            ${o.status === "Confirmed" ? "selected" : ""}>
            Confirmed
          </option>

          <option
            ${o.status === "Picked Up" ? "selected" : ""}>
            Picked Up
          </option>

          <option
            ${o.status === "Packed" ? "selected" : ""}>
            Packed
          </option>

          <option
            ${o.status === "Out for Delivery" ? "selected" : ""}>
            Out for Delivery
          </option>

          <option
            ${o.status === "Delivered" ? "selected" : ""}>
            Delivered
          </option>

        </select>

      </div>

    `).join("")

    || "<p>No orders yet.</p>";

}


/* ===============================
   PRODUCT MANAGEMENT
================================= */

function addProduct() {

  const name =
    pName.value.trim();

  const price =
    Number(pPrice.value);

  const stock =
    Number(pStock.value);


  if (
    !name ||
    price < 0 ||
    stock < 0 ||
    Number.isNaN(price) ||
    Number.isNaN(stock)
  ) {

    return toast(
      "Enter valid product details"
    );

  }


  products.push({

    id:
      Date.now(),

    name,

    category:
      pCategory.value,

    price,

    stock,

    image:
      pImage.value.trim()

  });


  save();

  renderAdmin();

  renderProducts();


  [
    "pName",
    "pPrice",
    "pStock",
    "pImage"
  ].forEach(x => {

    document
      .getElementById(x)
      .value = "";

  });


  toast(
    "Product added"
  );

}


function editProduct(id) {

  const p =
    products.find(
      x => x.id === id
    );


  if (!p) return;


  const name =
    prompt(
      "Product name",
      p.name
    );


  const price =
    prompt(
      "Price",
      p.price
    );


  const stock =
    prompt(
      "Stock",
      p.stock
    );


  if (
    name !== null &&
    price !== null &&
    stock !== null
  ) {

    p.name = name;

    p.price = Number(price);

    p.stock = Number(stock);


    save();

    renderAdmin();

    renderProducts();

  }

}


function deleteProduct(id) {

  if (
    confirm(
      "Delete this product?"
    )
  ) {

    products =
      products.filter(
        p => p.id !== id
      );


    save();

    renderAdmin();

    renderProducts();

  }

}


/* ===============================
   LOCATION MANAGEMENT
================================= */

function addLocation() {

  const n =
    locName.value.trim();

  const c =
    Number(locCharge.value);


  if (!n) {

    return toast(
      "Enter location"
    );

  }


  locations.push({

    name: n,

    charge:
      Number.isNaN(c)
        ? 0
        : c

  });


  save();

  renderLocations();

  renderAdmin();


  locName.value = "";

  locCharge.value = "";

}


function deleteLocation(i) {

  locations.splice(i, 1);

  save();

  renderLocations();

  renderAdmin();

}


/* ===============================
   WHATSAPP
================================= */

function cleanPhone(number) {

  return String(number || "")
    .replace(/\D/g, "")
    .replace(/^0+/, "");

}


function whatsappUrl(number, message) {

  let n =
    cleanPhone(number);


  if (n.length === 10) {
    n = "91" + n;
  }


  return n

    ? "https://wa.me/" +
      n +
      "?text=" +
      encodeURIComponent(message)

    : "";

}


/* OWNER NEW ORDER MESSAGE */

function sendOwnerOrderMessage(order) {

  if (!whatsappSettings.ownerNumber) {

    toast(
      "Order saved. Add Owner WhatsApp number in Settings to receive notifications."
    );

    return;

  }


  const itemsText =
    order.items
      .map(
        i =>
          "• " +
          i.name +
          " × " +
          i.qty +
          " = " +
          money(i.price * i.qty)
      )
      .join("\n");


  const message =
`🛒 *NEW ORDER – SRI LALITHA TRADERS*

Order ID: *${order.id}*

Customer: ${order.name}
Phone: ${order.phone}
Location: ${order.location}
Address: ${order.address}
Payment: ${order.payment}

*Items:*
${itemsText}

Items Total: ${money(order.subtotal)}
Delivery: ${money(order.delivery)}

*Final Total: ${money(order.total)}*`;


  window.open(
    whatsappUrl(
      whatsappSettings.ownerNumber,
      message
    ),
    "_blank"
  );

}


/* CUSTOMER ORDER STATUS MESSAGE */

function sendCustomerStatusMessage(
  order,
  status
) {

  if (!order.phone) return;


  let message = "";


  if (status === "Confirmed") {

    message =
`✅ *SRI LALITHA TRADERS*

Hello ${order.name},

Your order *${order.id}* has been *CONFIRMED*.

Total: ${money(order.total)}
Payment: ${order.payment}

Thank you for shopping with us!`;

  }

  else if (status === "Picked Up") {

    message =
`📦 *SRI LALITHA TRADERS*

Hello ${order.name},

Your order *${order.id}* has been marked as *PICKED UP*.

Thank you!`;

  }

  else {

    message =
`📦 *SRI LALITHA TRADERS*

Hello ${order.name},

Your order status is now: *${status}*

Order ID: ${order.id}

Thank you for shopping with us!`;

  }


  window.open(
    whatsappUrl(
      order.phone,
      message
    ),
    "_blank"
  );

}


/* ===============================
   UPDATE ORDER
================================= */

function updateOrder(id, status) {

  const order =
    orders.find(
      o => o.id === id
    );


  if (!order) return;


  order.status = status;


  save();


  toast(
    "Order updated"
  );


  if (
    status === "Confirmed" ||
    status === "Picked Up"
  ) {

    sendCustomerStatusMessage(
      order,
      status
    );

  }


  renderAdmin();

}


/* ==========================================
   START WEBSITE
========================================== */

renderLocations();

renderProducts();

updateCartCount();

updateOwnerUI();


/* ==========================================
   LOAD DATA FROM SUPABASE
========================================== */

window.addEventListener(
  "load",
  async () => {

    if (
      typeof loadSupabaseData === "function" &&
      window.SUPABASE_READY
    ) {

      await loadSupabaseData();

      renderLocations();

      renderProducts();

      updateCartCount();

      if (isOwnerLoggedIn) {
        renderAdmin();
      }

    }

  }
);


/* ==========================================
   CHECK EXISTING SUPABASE LOGIN
========================================== */

window.addEventListener(
  "load",
  async () => {

    if (!window.supabaseClient) {

      console.error(
        "Supabase client not found"
      );

      updateOwnerUI();

      return;

    }


    try {

      const {
        data: {
          session
        }
      } =
        await window
          .supabaseClient
          .auth
          .getSession();


      isOwnerLoggedIn =
        !!session;


      updateOwnerUI();


      if (isOwnerLoggedIn) {

        renderAdmin();

      }


      /* Listen for login/logout changes */

      window
        .supabaseClient
        .auth
        .onAuthStateChange(
          (event, session) => {

            isOwnerLoggedIn =
              !!session;

            updateOwnerUI();

          }
        );

    }

    catch (error) {

      console.error(
        "Authentication check failed:",
        error
      );

      isOwnerLoggedIn = false;

      updateOwnerUI();

    }

  }
);