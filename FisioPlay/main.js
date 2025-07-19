// Configuración de Firebase (pon tus datos reales)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "XXXXXXXXXXX",
  appId: "TU_APP_ID",
};
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore ? firebase.firestore() : null;

// Simulación de roles para login
const roles = {
  "estudiante@correo.com": "estudiante",
  "profesor@correo.com": "profesor",
  "admin@correo.com": "admin",
};

document.addEventListener("DOMContentLoaded", function () {
  // --- LOGIN ---
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;
      if (roles[email]) {
        if (roles[email] === "estudiante") {
          window.location.href = "estudiante.html";
        } else if (roles[email] === "profesor") {
          window.location.href = "profesor.html";
        } else if (roles[email] === "admin") {
          window.location.href = "admin.html";
        }
      } else {
        document.getElementById("login-error").innerText =
          "Usuario o contraseña incorrectos.";
      }
    });
  }

  // --- REGISTRO ESTUDIANTE ---
  const btnRegistrar = document.getElementById("btn-registrar");
  const btnJugar = document.getElementById("btn-jugar");
  const liJugar = document.getElementById("li-jugar");
  const modal = document.getElementById("modal-registro");
  const cerrarModal = document.getElementById("cerrar-modal");
  const registrarEstudiante = document.getElementById("registrar-estudiante");

  if (btnRegistrar && modal) {
    btnRegistrar.onclick = () => {
      modal.style.display = "block";
    };
  }
  if (cerrarModal && modal) {
    cerrarModal.onclick = () => {
      modal.style.display = "none";
    };
  }
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  if (registrarEstudiante && liJugar && modal) {
    registrarEstudiante.onclick = () => {
      const nombre = document.getElementById("nombre").value.trim();
      const correo = document.getElementById("correo").value.trim();
      if (nombre && correo && db) {
        db.collection("estudiantes").add({ nombre, correo, fecha: new Date() });
        localStorage.setItem("correoEstudiante", correo);
        modal.style.display = "none";
        liJugar.style.display = "list-item";
        alert("¡Registro exitoso! Ahora puedes jugar.");
      } else {
        alert("Completa todos los campos.");
      }
    };
  }
  if (btnJugar) {
    btnJugar.onclick = () => {
      alert("¡Bienvenido al juego!");
    };
  }

  // --- JUEGOS ---
  // Palabras dinámicas desde Firestore
  let palabrasGuia = [];
  async function cargarPalabrasGuia() {
    if (!db) return;
    const snapshot = await db.collection("guias").get();
    palabrasGuia = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.palabra) palabrasGuia.push(data.palabra.toLowerCase());
    });
  }

  // Sopa de Letras
  const btnSopa = document.getElementById("btn-sopa");
  const sopaContainer = document.getElementById("sopa-container");
  let palabraActual = 0;

  if (btnSopa && sopaContainer) {
    btnSopa.onclick = async () => {
      await cargarPalabrasGuia();
      ocultarJuegos();
      sopaContainer.style.display = "block";
      palabraActual = 0;
      mostrarPalabra();
    };
  }
  function crearSopa(palabra) {
    let letras = palabra.split("");
    while (letras.length < 8) {
      letras.push(String.fromCharCode(97 + Math.floor(Math.random() * 26)));
    }
    letras = letras.sort(() => Math.random() - 0.5);
    let html = '<div style="font-size:2em;letter-spacing:1em;">';
    letras.forEach((l, i) => {
      html += `<span class="letra-sopa" data-letra="${l}" data-pos="${i}">${l.toUpperCase()}</span>`;
    });
    html += "</div>";
    return html;
  }
  function mostrarPalabra() {
    if (palabraActual < palabrasGuia.length) {
      sopaContainer.innerHTML =
        `<h3>Encuentra: <span style="color:#2a7f62">${palabrasGuia[
          palabraActual
        ].toUpperCase()}</span></h3>` + crearSopa(palabrasGuia[palabraActual]);
      document.querySelectorAll(".letra-sopa").forEach((span) => {
        span.onclick = function () {
          if (this.dataset.letra === palabrasGuia[palabraActual][0]) {
            palabraActual++;
            setTimeout(mostrarPalabra, 500);
          } else {
            this.style.color = "red";
          }
        };
      });
    } else {
      sopaContainer.innerHTML =
        "<h3>¡Felicidades! Has completado la sopa de letras.</h3>";
      guardarProgreso("sopa_letras", "completado");
    }
  }

  // Autocompletar Palabras (puedes cargar de Firestore igual que palabrasGuia)
  let palabrasAuto = [
    { palabra: "fisioterapia", pista: "Disciplina que trata lesiones físicas" },
    { palabra: "columna", pista: "Parte central del esqueleto axial" },
  ];
  const btnAuto = document.getElementById("btn-autocompletar");
  const autoContainer = document.getElementById("autocompletar-container");
  let autoActual = 0;

  if (btnAuto && autoContainer) {
    btnAuto.onclick = () => {
      ocultarJuegos();
      autoContainer.style.display = "block";
      autoActual = 0;
      mostrarAuto();
    };
  }
  function mostrarAuto() {
    if (autoActual < palabrasAuto.length) {
      let p = palabrasAuto[autoActual];
      let incompleta =
        p.palabra[0] +
        "_".repeat(p.palabra.length - 2) +
        p.palabra[p.palabra.length - 1];
      autoContainer.innerHTML = `<h3>Pista: ${p.pista}</h3>
        <div style="font-size:2em;letter-spacing:0.5em;">${incompleta}</div>
        <input id="input-auto" placeholder="Completa la palabra">
        <button id="btn-auto-ok">Comprobar</button>
        <div id="auto-feedback"></div>`;
      document.getElementById("btn-auto-ok").onclick = function () {
        let val = document
          .getElementById("input-auto")
          .value.trim()
          .toLowerCase();
        if (val === p.palabra) {
          document.getElementById("auto-feedback").innerHTML =
            "<span style='color:green'>¡Correcto!</span>";
          autoActual++;
          setTimeout(mostrarAuto, 1000);
        } else {
          document.getElementById("auto-feedback").innerHTML =
            "<span style='color:red'>Intenta de nuevo</span>";
        }
      };
    } else {
      autoContainer.innerHTML = "<h3>¡Completaste todas las palabras!</h3>";
      guardarProgreso("autocompletar", "completado");
    }
  }

  // Nombrar Partes del Cuerpo (puedes cargar de Firestore si lo deseas)
  let partesCuerpo = [
    {
      nombre: "húmero",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Humerus_ant_left.png/120px-Humerus_ant_left.png",
      pista: "Hueso largo del brazo",
    },
    {
      nombre: "fémur",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Femur_front.png/120px-Femur_front.png",
      pista: "Hueso más largo del cuerpo",
    },
  ];
  const btnCuerpo = document.getElementById("btn-cuerpo");
  const cuerpoContainer = document.getElementById("cuerpo-container");
  let cuerpoActual = 0;

  if (btnCuerpo && cuerpoContainer) {
    btnCuerpo.onclick = () => {
      ocultarJuegos();
      cuerpoContainer.style.display = "block";
      cuerpoActual = 0;
      mostrarCuerpo();
    };
  }
  function mostrarCuerpo() {
    if (cuerpoActual < partesCuerpo.length) {
      let p = partesCuerpo[cuerpoActual];
      cuerpoContainer.innerHTML = `<h3>Pista: ${p.pista}</h3>
        <img src="${p.img}" alt="Parte del cuerpo" style="display:block;margin:10px auto;">
        <input id="input-cuerpo" placeholder="¿Qué parte es?">
        <button id="btn-cuerpo-ok">Comprobar</button>
        <div id="cuerpo-feedback"></div>`;
      document.getElementById("btn-cuerpo-ok").onclick = function () {
        let val = document
          .getElementById("input-cuerpo")
          .value.trim()
          .toLowerCase();
        if (val === p.nombre) {
          document.getElementById("cuerpo-feedback").innerHTML =
            "<span style='color:green'>¡Correcto!</span>";
          cuerpoActual++;
          setTimeout(mostrarCuerpo, 1000);
        } else {
          document.getElementById("cuerpo-feedback").innerHTML =
            "<span style='color:red'>Intenta de nuevo</span>";
        }
      };
    } else {
      cuerpoContainer.innerHTML = "<h3>¡Completaste todas las partes!</h3>";
      guardarProgreso("partes_cuerpo", "completado");
    }
  }

  // Ocultar todos los juegos al abrir uno
  function ocultarJuegos() {
    if (sopaContainer) sopaContainer.style.display = "none";
    if (autoContainer) autoContainer.style.display = "none";
    if (cuerpoContainer) cuerpoContainer.style.display = "none";
  }

  // Guardar progreso en Firestore
  function guardarProgreso(juego, estado) {
    const correo = localStorage.getItem("correoEstudiante");
    if (!correo || !db) return;
    db.collection("progreso").add({
      correo,
      juego,
      estado,
      fecha: new Date(),
    });
  }

  // --- PROFESOR: Subir palabras/guías ---
  const btnSubirPalabra = document.getElementById("btn-subir-palabra");
  const palabraGuiaInput = document.getElementById("palabra-guia");
  const subirFeedback = document.getElementById("subir-feedback");
  const listaPalabras = document.getElementById("lista-palabras");

  if (btnSubirPalabra && palabraGuiaInput && db) {
    btnSubirPalabra.onclick = async () => {
      const palabra = palabraGuiaInput.value.trim().toLowerCase();
      if (palabra) {
        await db.collection("guias").add({ palabra });
        subirFeedback.innerText = "¡Palabra subida!";
        palabraGuiaInput.value = "";
        cargarListaPalabras();
      }
    };
    cargarListaPalabras();
  }
  async function cargarListaPalabras() {
    if (!listaPalabras || !db) return;
    listaPalabras.innerHTML = "";
    const snapshot = await db.collection("guias").get();
    snapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      li.textContent = data.palabra;
      listaPalabras.appendChild(li);
    });
  }
});
