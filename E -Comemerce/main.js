const cart_el = document.querySelector("nav .cart")
const cartSidebar = document.querySelector(".cart-sidebar")
const closeCart = document.querySelector(".close-cart")
const burger = document.querySelector(".burger")
const menuSidebar = document.querySelector(".menu-sidebar")
const closeMenu = document.querySelector(".close-menu")
const cartItemsTotal = document.querySelector(".noi")
const cartPriceTotal = document.querySelector(".total-amount")
const cartUi = document.querySelector(".cart-sidebar .cart")
const totalDiv = document.querySelector(".total-sum")
const clearCartBtn = document.querySelector(".clear-cart-btn")
const cartContent = document.querySelector(".cart-content")



let Cart = []
let ButtonsDom = []

cart_el.addEventListener("click", () => {
    cartSidebar.style.transform = "translate(0%)"
    const overlayBody = document.createElement("div")
    overlayBody.classList.add("overlay")
    setTimeout(() => {
        document.querySelector("body").appendChild(overlayBody)
    }, 300)

})
closeCart.addEventListener("click", () => {
    cartSidebar.style.transform = "translate(100%)"
    const overlayBody = document.querySelector(".overlay")
    document.querySelector("body").removeChild(overlayBody)
})

burger.addEventListener("click", function() {
    menuSidebar.style.transform = "translate(0%)"
})
closeMenu.addEventListener("click", function() {
    menuSidebar.style.transform = "translate(-100%)"
})

// FETCHING DATA FROM PRODUCT.JSON

class Product {
    async getProduct() {
        const response = await fetch("./products.json")
        const data = await response.json();
        let products = data.items;
        const myproducts = products.map((item) => {
            const { title, price } = item.fields;
            const { id } = item.sys;
            const image = item.fields.image.fields.file.url;
            return { title, price, id, image };

        })
        return myproducts;
    }
}

class Ui {
    displayProduct(myproducts) {
        let result = "";
        myproducts.forEach((product) => {
            const productDiv = document.createElement("div")
            productDiv.innerHTML = `<div class = "product-card">
                                        <img src = "${product.image}" alt = "product">
                                      <span class = "add-to-cart" data-id = "${product.id}">
                                          <i class = "fa fa-cart-plus fa-1x"
                                          style = "margin-right:0.1em; font-size:1em;"></i>
                                          add to cart
                                       </span>
                                       <div class = "product-name">${product.title}</div>      
                                       <div class = "product-pricing">${product.price}</div>
                                   </div>   
                                    `
            const p = document.querySelector(".product")
            p.append(productDiv)
        })
    }

    getButtons() {
        const btns = document.querySelectorAll(".add-to-cart")
        Array.from(btns)
        ButtonsDom = btns

        // ButtonsDom.push(btns)
        btns.forEach(btn => {
            let id = btn.dataset.id;
            let inCart = Cart.find((item) => item.id === id)
            if (inCart) {
                btn.innerHTML = " In Cart";
                btn.dissabled = true

            }

            btn.addEventListener("click", function(e) {
                console.log(e.currentTarget)
                e.currentTarget.innerHTML = "In Cart"
                e.currentTarget.style.color = "white"
                e.currentTarget.style.pointerEvents = "none"
                let cartItem = {...Storage.getStorageProducts(id), 'amount': 1 }
                Cart.push(cartItem)
                Storage.saveCart(Cart)
                this.setCartValues(Cart)
                this.addCartItem(cartItem)

            })
        })

    }

    setCartValues(Cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        Cart.map((item) => {
            tempTotal += (item.price * item.amount);
            itemsTotal += item.amount;
            parseFloat(tempTotal.toFixed(2))
        })
        cartItemsTotal.innerHTML = itemsTotal
        cartPriceTotal.innerHTML = parseFloat(tempTotal.toFixed(2))
    }

    addCartItem(cartItem) {
        const cartItemUi = document.createElement("div");
        cartItemUi.innerHTML = `<div class = "product-cart">
                                    <div class ="product-image">
                                        <img src = "${cartItem.image}" alt = "product">
                                    </div>
                                    <div class ="cart-product-content">
                                        <div class = "cart-product-name"><h3>${cartItem.title}</h3></div>
                                        <div class = "cart-product-price"><h3>$${cartItem.price}</h3></div>
                                   
                                       <div class = "cart-product-remove" data-id = "${cartItem.id}"
                                       <a href="#" style = "color:red; ">remove cart</a> </div>
                                       
                                    </div>
                                
                                   <div class = "plus-minus">
                                    <i class="fa fa-angle-left add-amount"
                                    data-id= "${cartItem.id}"></i>
                                       <span class = "no-of-items">${cartItem.amount}</span>
                                        <i class="fa fa-angle-right reduce-amount"
                                    data-id= "${cartItem.id}"></i>
                                     </div>
                                </div>`
        cartContent.appendChild(cartItemUi)
    }

    setApp() {
        Cart = Storage.getCart();
        this.setCartValues(Cart);
        Cart.map((item) => {
            this.addCartItem(item)
        })
    }
    CartLogic() {
        clearCartBtn.addEventListener("click", () => {
            this.clearCart()
        })

        //const myBtns = document.querySelector(".product-cart")

        cartContent.addEventListener("click", (e) => {

            if (e.currentTarget.classList.contains("cart-product-remove")) {
                let id = e.target.dataset.id;

                this.removeItem(id)
                let div = e.target.parentElement.parentElement.parentElement.parentElement;
                div.removeChild(e.target.parentElement.parentElement.parentElement.parentElement)
            } else if (e.target.classList.contains("add-amount")) {
                let id = e.target.dataset.id;
                let item = Cart.find((item) => item.id === id)
                item.amount++;
                Storage.saveCart(Cart)
                this.setCartValues(Cart)
                e.target.nextElementSibling.innerHTML = item.amount
            } else if (e.target.classList.contains("reduce-amount")) {
                let id = e.target.dataset.id;
                let item = Cart.find((item) => item.id === id)
                if (item.amount > 1) {
                    item.amount--;
                    Storage.saveCart(Cart)
                    this.setCartValues(Cart)
                    e.target.previousElementSibling.innerHTML = item.amount
                } else {
                    this.removeItem(id)
                    let div = e.target.parentElement.parentElement.parentElement.parentElement;
                    div.removeChild(e.target.parentElement.parentElement.parentElement.parentElement)
                }
            }

        })
    }

    addAmount() {
        const addBtn = document.querySelectorAll(".add-amount")
        console.log(addBtn);

        addBtn.forEach((btn) => {
            btn.addEventListener("click", function(event) {
                let id = event.currentTarget.dataset.id;
                Cart.map((item) => {
                    if (item.id === id) {
                        item.amount++;
                        Storage.saveCart(Cart)
                        this.setCartValues(Cart)
                        const amountUi = event.currentTarget.parentElement.children[1]
                        amountUi.innerHTML = item.amount;
                    }
                })
            })
        })
    }
    reduceAmount() {
        const reduceBtn = document.querySelectorAll(".reduce-amount")
        console.log(reduceBtn);
        reduceBtn.forEach((btn) => {
            btn.addEventListener("click", function(event) {
                let id = event.currentTarget.dataset.id;
                Cart.map((item) => {
                    if (item.id === id) {
                        item.amount--;
                        if (item.amount > 0) {
                            Storage.saveCart(Cart)
                            this.setCartValues(Cart)
                            const amountUi = event.currentTarget.parentElement.children[1]
                            amountUi.innerHTML = item.amount;
                        } else {
                            event.target.parentElement.parentElement.parentElement.removeChild(event.currentTarget.parentElement.parentElement)
                            this.removeItem(id)
                        }

                    }
                })
            })
        })
    }

    clearCart() {
        let CartItem = Cart.map((item) => item.id)
        console.log(CartItem)
        CartItem.forEach((id) => this.removeItem(id))
        const cartProduct = document.querySelectorAll(".product-cart")

        cartProduct.forEach((item) => {
            if (item) {
                item.parentElement.removeChild(item)
            }
        })
    }

    removeItem(id) {
        Cart = Cart.filter((item) => item.id !== id)
        console.log(Cart)
        this.setCartValues(Cart)
        Storage.saveCart(Cart)
        let button = this.getSingleButton(id)

        button.style.pointerEvents = "unset"
        button.innerHTML = `<i class = "fa fa-cart-plus"></i> Add to cart`

    }

    getSingleButton(id) {
        let btn;
        ButtonsDom.forEach((button) => {
            if (button.dataset.id === id) {
                btn = button
            }
        })
        return btn;
    }

}

class Storage {
    static saveproducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getStorageProducts(id) {
        let products = JSON.parse(localStorage.getItem('products'))
        return products.find((item) => item.id === id)
    }

    static saveCart(Cart) {
        localStorage.setItem("Cart", JSON.stringify(Cart))
    }
    static getCart() {
        return localStorage.getItem("Cart") ? JSON.parse(localStorage.getItem("Cart")) : [];
    }

}

document.addEventListener("DOMContentLoaded", () => {

    const products = new Product()
    const ui = new Ui()
    ui.setApp()
    products.getProduct().then(products => {
        ui.displayProduct(products)
        Storage.saveproducts(products)
    }).then(() => {
        ui.getButtons()
        ui.CartLogic()

    })
})



let newButtons = [];

const btns = document.querySelectorAll(".new-btn")
Array.from(btns);
newButtons = btns;
btns.forEach((btn) => {
    btn.addEventListener("click", () => {
        console.log("button is clicked")
    })
})