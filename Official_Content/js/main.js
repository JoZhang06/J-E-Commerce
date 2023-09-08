let productos = [];

fetch("./json/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numeroProducto = document.querySelector("#numeroproducto");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))

function cargarProductos(productosElegidos) {
    // Agrega la clase 'salida' para activar la animación de salida
    contenedorProductos.classList.add("salida");

    // Espera a que termine la animación de salida y luego actualiza el contenido
    setTimeout(() => {
        contenedorProductos.innerHTML = "";

        productosElegidos.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${producto.titulo}</h3>
                    <p class="producto-precio">$${producto.precio}</p>
                    <button class="producto-agregar" id="${producto.id}">Agregar</button>
                </div>
            `;

            contenedorProductos.append(div);
        });

        actualizarBotonesAgregar();

        // Después de un pequeño retraso, elimina la clase 'salida' para activar la animación de entrada
        setTimeout(() => {
            contenedorProductos.classList.remove("salida");
        }, 50);
    }, 300); // Ajusta el tiempo según la duración de tu transición de salida
}


botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }

    })
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlMiCarrito);
    });
}

let productosEnMiCarrito;

let productosEnMiCarritoLS = localStorage.getItem("productos-en-micarrito");

if (productosEnMiCarritoLS) {
    productosEnMiCarrito = JSON.parse(productosEnMiCarritoLS);
    actualizarNumeroProducto();
} else {
    productosEnMiCarrito = [];
}

function agregarAlMiCarrito(e) {

    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
        onClick: function () { } // Callback after click
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productosEnMiCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnMiCarrito.findIndex(producto => producto.id === idBoton);
        productosEnMiCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnMiCarrito.push(productoAgregado);
    }

    actualizarNumeroProducto();

    localStorage.setItem("productos-en-micarrito", JSON.stringify(productosEnMiCarrito));
}

function actualizarNumeroProducto() {
    let nuevoNumeroProducto = productosEnMiCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numeroProducto.innerText = nuevoNumeroProducto;
}

// Función para obtener la fecha actual en el formato deseado (Año y Día)
function obtenerFechaActual() {
    const fecha = new Date();
    const anho = fecha.getFullYear();   
    return `${anho}`;
} 

function actualizarFechaEnTitulo() {
    const tituloPrincipal = document.getElementById('fecha');
    if (tituloPrincipal) {
        tituloPrincipal.textContent = `© J-Gentleman - ${obtenerFechaActual()}`;
    }
}
 
actualizarFechaEnTitulo(); 
setInterval(actualizarFechaEnTitulo, 1000);
