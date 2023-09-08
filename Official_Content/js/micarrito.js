let productosEnMiCarrito = localStorage.getItem("productos-en-micarrito");
productosEnMiCarrito = JSON.parse(productosEnMiCarrito);

const contenedorMiCarritoVacio = document.querySelector("#micarrito-vacio");
const contenedorMiCarritoProductos = document.querySelector("#micarrito-productos");
const contenedorMiCarritoAcciones = document.querySelector("#micarrito-acciones");
const contenedorMiCarritoComprado = document.querySelector("#micarrito-comprado");
let botonesEliminar = document.querySelectorAll(".micarrito-producto-eliminar");
const botonVaciar = document.querySelector("#micarrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#micarrito-acciones-comprar");

function cargarProductosMiCarrito() {
    if (productosEnMiCarrito && productosEnMiCarrito.length > 0) {
        contenedorMiCarritoVacio.classList.add("disabled");
        contenedorMiCarritoProductos.classList.remove("disabled");
        contenedorMiCarritoAcciones.classList.remove("disabled");
        contenedorMiCarritoComprado.classList.add("disabled");

        contenedorMiCarritoProductos.innerHTML = "";

        productosEnMiCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("micarrito-producto");
            div.innerHTML = `
                <img class="micarrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="micarrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="micarrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="micarrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="micarrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="micarrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;

            contenedorMiCarritoProductos.append(div);
        })

        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        contenedorMiCarritoVacio.classList.remove("disabled");
        contenedorMiCarritoProductos.classList.add("disabled");
        contenedorMiCarritoAcciones.classList.add("disabled");
        contenedorMiCarritoComprado.classList.add("disabled");
    }
}

cargarProductosMiCarrito();

function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".micarrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelMiCarrito);
    });
}

function eliminarDelMiCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".5rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function () { } // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const index = productosEnMiCarrito.findIndex(producto => producto.id === idBoton);

    productosEnMiCarrito.splice(index, 1);
    cargarProductosMiCarrito();

    localStorage.setItem("productos-en-micarrito", JSON.stringify(productosEnMiCarrito));
}

botonVaciar.addEventListener("click", vaciarMiCarrito);

function vaciarMiCarrito() {
    const cantidadProductos = productosEnMiCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);

    let title, html;

    if (cantidadProductos === 1) {
        title = '¿Estás seguro?';
        html = `Se va a borrar del carrito ${cantidadProductos} producto.`;
    } else {
        title = '¿Estás seguro?';
        html = `Se van a borrar del carrito ${cantidadProductos} productos.`;
    }

    Swal.fire({
        title: title,
        icon: 'warning',
        html: html,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnMiCarrito.length = 0;
            localStorage.setItem("productos-en-micarrito", JSON.stringify(productosEnMiCarrito));
            cargarProductosMiCarrito();
        }
    })
}


function actualizarTotal() {
    const totalCalculado = productosEnMiCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

botonComprar.addEventListener("click", comprarMiCarrito);

function comprarMiCarrito() {
    productosEnMiCarrito.length = 0;
    localStorage.setItem("productos-en-micarrito", JSON.stringify(productosEnMiCarrito));

    contenedorMiCarritoVacio.classList.add("disabled");
    contenedorMiCarritoProductos.classList.add("disabled");
    contenedorMiCarritoAcciones.classList.add("disabled");
    contenedorMiCarritoComprado.classList.remove("disabled");
}
