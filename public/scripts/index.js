const API = "/api/product";

//------------------------------ BUSCAR TODOS

const getAllBtn = document.getElementById("find-all");

getAllBtn.addEventListener("click", async () => {
  const res = await fetch(`${API}/find/all`);
  const data = await res.json();
  console.log(data);
});

//------------------------------- BUSCAR POR ID

const getIdBtn = document.getElementById("find-id");
const getIdInput = document.querySelector(".find-id input");

getIdBtn.addEventListener("click", async () => {
  const id = getIdInput.value;
  const res = await fetch(`${API}/find/id/${id}`);
  const data = await res.json();
  console.log(data);
});

//------------------------------- BUSCAR POR CODIGO

const getBarcodeBtn = document.getElementById("find-barcode");
const getBarcodeInput = document.querySelector(".find-barcode input");

getBarcodeBtn.addEventListener("click", async () => {
  const barcode = getBarcodeInput.value;
  const res = await fetch(`${API}/find/barcode/${barcode}`);
  const data = await res.json();
  console.log(data);
});

//------------------------------- BUSCAR POR NOMBRE

const getNameBtn = document.getElementById("find-name");
const getNameInput = document.querySelector(".find-name input");

getNameBtn.addEventListener("click", async () => {
  const name = getNameInput.value;
  const res = await fetch(`${API}/find/name/${name}`);
  const data = await res.json();
  console.log(data);
});

//-------------------------------- BORRAR POR ID

const deleteIdBtn = document.getElementById("delete-id");
const deleteIdInput = document.querySelector(".delete-id input");

deleteIdBtn.addEventListener("click", async () => {
  const id = deleteIdInput.value;
  const res = await fetch(`${API}/delete/id/${id}`, {
    method: "delete",
  });
  const data = await res.json();
  console.log(data);
});

//-------------------------------- BORRAR POR CODIGO

const deleteBarcodeBtn = document.getElementById("delete-barcode");
const deleteBarcodeInput = document.querySelector(".delete-barcode input");

deleteBarcodeBtn.addEventListener("click", async () => {
  const barcode = deleteBarcodeInput.value;
  const res = await fetch(`${API}/delete/barcode/${barcode}`, {
    method: "delete",
  });
  const data = await res.json();
  console.log(data);
});

//-------------------------------- CREAR PRODUCTO

const createBtn = document.getElementById("create");
const createInputs = {
  barcode: document.querySelector(".create input:nth-child(2)"),
  name: document.querySelector(".create input:nth-child(3)"),
  stock: document.querySelector(".create input:nth-child(4)"),
  costPrice: document.querySelector(".create input:nth-child(5)"),
  salePrice: document.querySelector(".create input:nth-child(6)"),
};

createBtn.addEventListener("click", async () => {
  const product = {
    barcode: createInputs.barcode.value,
    name: createInputs.name.value,
    stock: createInputs.stock.value,
    costPrice: createInputs.costPrice.value,
    salePrice: createInputs.salePrice.value,
  };
  const res = await fetch(`${API}/create`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  console.log(data);
});

//-------------------------------- EDITAR PRODUCTO

const updateBtn = document.getElementById("update");
const updateInputs = {
  id: document.querySelector(".update input:nth-child(2)"),
  barcode: document.querySelector(".update input:nth-child(3)"),
  name: document.querySelector(".update input:nth-child(4)"),
  stock: document.querySelector(".update input:nth-child(5)"),
  costPrice: document.querySelector(".update input:nth-child(6)"),
  salePrice: document.querySelector(".update input:nth-child(7)"),
};

updateInputs.id.addEventListener("focusout", async () => {
  const id = updateInputs.id.value;
  const res = await fetch(`${API}/find/id/${id}`);
  const data = await res.json();
  updateInputs.barcode.value = data.data.barcode;
  updateInputs.name.value = data.data.name;
  updateInputs.stock.value = data.data.stock;
  updateInputs.costPrice.value = data.data.costPrice;
  updateInputs.salePrice.value = data.data.salePrice;
});

updateBtn.addEventListener("click", async () => {
  const product = {
    id: updateInputs.id.value,
    barcode: updateInputs.barcode.value,
    name: updateInputs.name.value,
    stock: updateInputs.stock.value,
    costPrice: updateInputs.costPrice.value,
    salePrice: updateInputs.salePrice.value,
  };
  const res = await fetch(`${API}/update`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });
  const data = await res.json();
  console.log(data);
});
