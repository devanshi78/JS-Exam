let title = document.getElementById('title');
let price = document.getElementById('price');
let pimage = document.getElementById('p_image');
let categories = document.getElementById("categories");
let search = document.getElementById('search');
let editId = null;

let productTable = document.getElementById('productTable');
let products = JSON.parse(localStorage.getItem("products")) || [];

function sumbmitProduct(e) {
    e.preventDefault();

    if (!title.value || !price.value || !categories.value) {
        alert("Please fill all required fields!");
        return;
    }

    if (editId !== null) {
        let index = products.findIndex(p => p.id === Number(editId));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                title: title.value,
                price: price.value,
                pimage: pimage.value,
                category: categories.value
            };
            alert("Product Updated Successfully!");
        }
        editId = null;
    } else {
        let product = {
            id: Date.now(),
            title: title.value,
            price: price.value,
            pimage: pimage.value,
            category: categories.value
        };
        products.push(product);
        alert("Product Added Successfully!");
    }

    localStorage.setItem("products", JSON.stringify(products));

    e.target.reset(); // form reset
    displayProducts();
}

function displayProducts(list = products) {
    const container = document.querySelector(".allprod .container .row");
    if (!container) return;

    container.innerHTML = ""; // clear previous cards

    if (list.length === 0) {
        container.innerHTML = `<p class="text-center">No products available</p>`;
        return;
    }

    list.forEach(prod => {
        const cardDiv = document.createElement("div");
        cardDiv.className = "col-md-3 mb-3";

        cardDiv.innerHTML = `
            <div class="card">
                <img src="${prod.pimage || 'https://via.placeholder.com/150'}" class="card-img-top object-fit-cover" height="300px" alt="${prod.title}">
                <div class="card-body">
                    <h5 class="card-title">${prod.title}</h5>
                    <p class="card-text">Price: ₹${prod.price}</p>
                    <p class="card-text">Category: ${prod.category}</p>
                    <button class="btn btn-warning btn-sm me-2" onclick="editProduct(${prod.id})">Update</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${prod.id})">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(cardDiv);
    });
}

// Edit product
function editProduct(id) {
    id = Number(id);
    let prod = products.find(p => p.id === id);
    if (!prod) return;

    title.value = prod.title;
    price.value = prod.price;
    pimage.value = prod.pimage || '';
    categories.value = prod.category;

    editId = id;
}

// Delete product
function deleteProduct(id) {
    id = Number(id);
    products = products.filter(prod => prod.id !== id);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}

// Search products
if (search) {
    search.addEventListener("input", () => {
        let keyword = search.value.toLowerCase();
        let filtered = products.filter(p =>
            p.title.toLowerCase().includes(keyword) ||
            p.category.toLowerCase().includes(keyword)
        );
        displayProducts(filtered);
    });
}

displayProducts();