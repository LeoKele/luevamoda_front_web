//Ruta del JSON
const productosJSON = "../assets/json/productos_detalle.json";

const params = new URLSearchParams(window.location.search);
const productoId = params.get("id");

const tallesJSON = "../assets/json/talles.json";

const cargarProducto = async (id = productoId) => {
  try {
    const response = await fetch(productosJSON); //Obtener archivo JSON local
    if (!response.ok) {
      throw new Error("Error al cargar JSON");
    }
    const productos = await response.json();
    // console.log(productos);

    // const productos = await response.json(); // Convertimos la respuesta a JSON

    const ProductoElegido = binarySearchById(productos, id);
    // console.log(ProductoElegido);
    const producto = procesarProducto(ProductoElegido);

    //*Creamos carousel con las imgs del producto
    const detalle_list = document.getElementById("carousel_detalle_list");
    detalle_list.innerHTML = "";

    const bullets_list = document.getElementById("bullets_carousel");
    bullets_list.innerHTML = "";

    for (let index = 0; index < producto[0].imagenes.length; index++) {
      const li = document.createElement("li");
      li.classList.add("glide__slide");

      const img = document.createElement("img");
      img.alt = producto[0].nombre;
      img.src = `../assets/img/productos/${id}_${index + 1}.png`;

      detalle_list.appendChild(li);
      li.appendChild(img);

      //Creamos los bullets del carousel
      const btn = document.createElement("button");
      btn.classList.add("glide__bullet");
      btn.setAttribute("data-flide-dir", `=${index}`);

      bullets_list.appendChild(btn);
    }

    const config = {
      type: "carousel",
      perView: 1,
      width: 30,
      focusAt: "center",
      gap: 30,
    };
    new Glide(".images", config).mount();


    //*Demas detalles
    const responseTalles = await fetch(tallesJSON);
    const talles = await responseTalles.json();


    const titulo = document.getElementById("titulo");
    titulo.textContent = producto[0].nombre;


    const precio = document.getElementById("precio");
    // Agregamos a precio.textContent el precio que obtenemos de producto[0].precio y el texto "${precio}"
    precio.textContent = `Precio por talle: $${producto[0].precio}`
    // precio.textContent = producto[0].precio;

    // Encontrar la categoría correspondiente en el JSON de talles
    console.log(producto[0].id_categoria)
    const categoriaTalles = talles.find(t => t.id_categoria === producto[0].id_categoria);
    
    if (!categoriaTalles) {
      console.error("No se encontró la categoría de talles para el producto.");
      return;
    }

    // Referencias a las tablas de hombre, mujer y niño
    const tablaHombre = document.getElementById("tablaTallesHombre").getElementsByTagName("tbody")[0];
    const tablaMujer = document.getElementById("tablaTallesMujer").getElementsByTagName("tbody")[0];
    const tablaNino = document.getElementById("tablaTallesNiño").getElementsByTagName("tbody")[0];

    // Limpiar las tablas
    tablaHombre.innerHTML = "";
    tablaMujer.innerHTML = "";
    tablaNino.innerHTML = "";

    // Función para agregar filas a la tabla
    const agregarFila = (tabla, talles) => {
      talles.forEach((talle) => {
        const fila = document.createElement("tr");

        const celdaTalle = document.createElement("td");
        celdaTalle.textContent = talle.talle;
        celdaTalle.classList.add("p-2");
        fila.appendChild(celdaTalle);

        const celdaBusto = document.createElement("td");
        celdaBusto.textContent = talle.medidaBusto;
        celdaBusto.classList.add("p-2");
        fila.appendChild(celdaBusto);

        const celdaCintura = document.createElement("td");
        celdaCintura.textContent = talle.medidaCintura;
        celdaCintura.classList.add("p-2");
        fila.appendChild(celdaCintura);

        const celdaCadera = document.createElement("td");
        celdaCadera.textContent = talle.medidaCadera;
        celdaCadera.classList.add("p-2");
        fila.appendChild(celdaCadera);

        tabla.appendChild(fila);
      });
  };

  // Llenar las tablas de hombre, mujer y niño
  agregarFila(tablaHombre, categoriaTalles.hombre);
  agregarFila(tablaMujer, categoriaTalles.mujer);
  agregarFila(tablaNino, categoriaTalles.nino);

    // const tablaTalles = document
    //   .getElementById("tablaTallesHombre")
    //   .getElementsByTagName("tbody")[0];

    // // Agregar filas de talles
    // producto[0].talles.forEach((talle) => {
    //   const fila = document.createElement("tr");

    //   const celdaTalle = document.createElement("td");
    //   celdaTalle.textContent = talle.talle;
    //   celdaTalle.classList.add("p-2");
    //   fila.appendChild(celdaTalle);

    //   const celdaBusto = document.createElement("td");
    //   celdaBusto.textContent = talle.medidaBusto;
    //   celdaBusto.classList.add("p-2");
    //   fila.appendChild(celdaBusto);

    //   const celdaCintura = document.createElement("td");
    //   celdaCintura.textContent = talle.medidaCintura;
    //   celdaCintura.classList.add("p-2");
    //   fila.appendChild(celdaCintura);

    //   const celdaCadera = document.createElement("td");
    //   celdaCadera.textContent = talle.medidaCadera;
    //   celdaCadera.classList.add("p-2");
    //   fila.appendChild(celdaCadera);

    //   tablaTalles.appendChild(fila);
    // });

    const wspBtn = document.getElementById("wspBtn");
    wspBtn.href = `https://api.whatsapp.com/send?phone=+541133890751&text=Hola!,%20queria%20encargarte%20el%20producto%20%22${producto[0].nombre.replace(
      / /g,
      "%20"
    )}%22`;
    wspBtn.setAttribute("target", "_blank");
  } catch (error) {
    console.log(error);
  }
};

//! Convertimos la cadena de imagenes del JSON en un array para adaptarla al codigo ya creado
function procesarProducto(productos) {
  if (!Array.isArray(productos)) {
    productos = [productos];
  }
  return productos.map((producto) => ({
    ...producto,
    imagenes: producto.imagenes ? producto.imagenes.split(",") : [],
  }));
}

cargarProducto();

//! Buscamos la posicion en la que se encuentra el array con el id deseado
function binarySearchById(arr, targetId) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let midId = parseInt(arr[mid].id);

    if (midId === parseInt(targetId)) {
      return arr[mid];
    } else if (midId < parseInt(targetId)) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return null; // Si no se encuentra el id
}




