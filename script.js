const categoriesContainer = document.getElementById("categoriesContainer");
const treesContainer = document.getElementById("treesContainer");
const loadingSpinner = document.getElementById("loadingSpinner");
const allTreesBtn = document.getElementById("allTreesBtn");
const treeDetailsModal = document.getElementById("tree-details-modal");
const modalImage = document.getElementById("modalImage");
const modalCategory = document.getElementById("modalCategory");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalTitle = document.getElementById("modalTitle");
const cartContainer = document.getElementById("cartContainer");
const totalPrice = document.getElementById("totalPrice");
const emptyCartMessage = document.getElementById("emptyCartMessage");

let cart = [];

function showLoading() {
  loadingSpinner.classList.remove("hidden");
  treesContainer.innerHTML = "";
}
function hideLoading() {
  loadingSpinner.classList.add("hidden");
}

async function loadCategories() {
  const res = await fetch(
    "https://openapi.programming-hero.com/api/categories",
  );
  const data = await res.json();
  data.categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline w-full";
    btn.textContent = category.category_name;
    btn.onclick = () => selectCategory(category.id, btn);
    categoriesContainer.appendChild(btn);
  });
}

async function selectCategory(categoryId, btn) {
  showLoading();

  // update active button style
  const allButtons = document.querySelectorAll(
    "#categoriesContainer button, #allTreesBtn",
  );
  allButtons.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });
  btn.classList.add("btn-primary");
  btn.classList.remove("btn-outline");

  const res = await fetch(
    `https://openapi.programming-hero.com/api/category/${categoryId}`,
  );
  const data = await res.json();
  displayTrees(data.plants);
  hideLoading();
}

allTreesBtn.addEventListener("click", () => {
  // update active button style
  const allButtons = document.querySelectorAll(
    "#categoriesContainer button, #allTreesBtn",
  );
  console.log(allButtons);
  allButtons.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });
  allTreesBtn.classList.add("btn-primary");
  allTreesBtn.classList.remove("btn-outline");
  loadTrees();
});

async function loadTrees() {
  showLoading();
  const res = await fetch("https://openapi.programming-hero.com/api/plants");
  const data = await res.json();
  hideLoading();
  displayTrees(data.plants);
}

function displayTrees(trees) {
  trees.forEach((tree) => {
    const card = document.createElement("div");
    card.className = `card bg-white shadow-sm border-b-2 ${tree.price>500?"border-red-500":"border-green-500"}`;
    card.innerHTML = `
    <figure>
                <img onClick="openTreeModal(${tree.id})"
                  src="${tree.image}"
                  alt ="${tree.name}"
                  title="${tree.name}"
                  class = "h-48 w-full object-cover cursor-pointer"
                />
              </figure>
              <div class="card-body">
                <h2 class="card-title cursor-pointer hover:text-green-500"  onClick="openTreeModal(${tree.id})">${tree.name}</h2>
                <p class="line-clamp-2">
                  ${tree.description}
                </p>
                <div class="badge badge-success badge-outline">${tree.category}</div>
                <div class="flex justify-between items-center">
                  <h2 class="text-xl font-bold ${tree.price>500 ? "text-red-500":"text-[#4ade80]"}" >$${tree.price}</h2>
                  <button class="btn btn-primary" onClick="addToCart(${tree.id},'${tree.name}',${tree.price})">Cart</button>
                </div>
              </div>
  `;
    treesContainer.appendChild(card);
  });
}

async function openTreeModal(treeId) {
  const res = await fetch(
    `https://openapi.programming-hero.com/api/plant/${treeId}`,
  );
  const data = await res.json();
  const plantDetails = data.plants;
  modalTitle.textContent = plantDetails.name;
  modalImage.src = plantDetails.image;
  modalCategory.textContent = plantDetails.category;
  modalDescription.textContent = plantDetails.description;
  modalPrice.textContent = plantDetails.price;
  treeDetailsModal.showModal();
}

function addToCart(id, name, price) {
  const existingItem = cart.find(item=>item.id === id)
  if(existingItem){
    existingItem.quantity+=1;
  }else{
  cart.push({
    id,
    name,
    price,
    quantity: 1
  });
  }

  updateCart();
}

function updateCart() {
  cartContainer.innerHTML = "";

  if(cart.length === 0){
  emptyCartMessage.classList.remove("hidden");
  totalPrice.textContent = `$${0}`;
  return;
  }
  emptyCartMessage.classList.add("hidden");

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;
    const cartItem = document.createElement("div");
    cartItem.className = "card card-body bg-slate-100";
    cartItem.innerHTML = `
    
                <div class="flex justify-between items-center">
                  <div>
                    <h2>${item.name}</h2>
                    <p>$ ${item.price} x ${item.quantity}</p>
                  </div>
                  <button class="btn btn-ghost" onClick="removeFromCart(${item.id})">x</button>
                </div>
                <p class="text-right font-semibold text-xl">$${item.price * item.quantity}</p>
    `;
    cartContainer.appendChild(cartItem)
  });
  totalPrice.innerText = `$${total}`;
}

function removeFromCart(treeId){
 const updatedCartElements = cart.filter(item =>item.id !==treeId);
 cart = updatedCartElements;
updateCart();
 
}
loadCategories();
loadTrees();
