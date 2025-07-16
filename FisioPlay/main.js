// Configurar Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "XXXXXXXXXXX",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Quiz interactivo
const preguntas = [
  {
    pregunta: "¿Cuál músculo forma parte del suelo pélvico?",
    opciones: ["Trapecio", "Pubococcígeo", "Deltoides"],
    correcta: "Pubococcígeo"
  },
  {
    pregunta: "¿Dónde está el músculo psoas?",
    opciones: ["Pierna", "Abdomen", "Brazo"],
    correcta: "Abdomen"
  }
];

function iniciarQuiz() {
  const juego = document.getElementById("juego");
  let index = 0;
  let puntaje = 0;

  function mostrarPregunta() {
    if (index >= preguntas.length) {
      juego.innerHTML = `<h3>Tu puntuación: ${puntaje}/${preguntas.length}</h3>`;
      guardarResultados("usuarioEjemplo", puntaje, "Quiz de Anatomía");
      return;
    }

    const actual = preguntas[index];
    let html = `<h2>${actual.pregunta}</h2>`;
    actual.opciones.forEach(op => {
      html += `<button onclick="elegirRespuesta('${op}')">${op}</button>`;
    });

    juego.innerHTML = html;
  }

  window.elegirRespuesta = function(opcion) {
    if (opcion === preguntas[index].correcta) puntaje++;
    index++;
    mostrarPregunta();
  };

  mostrarPregunta();
}

// Guardar resultados en Firestore
function guardarResultados(usuarioId, puntaje, juego) {
  db.collection("resultados").add({
    usuario: usuarioId,
    juego: juego,
    puntaje: puntaje,
    fecha: new Date().toISOString()
  })
  .then(() => alert("✅ Resultado guardado correctamente"))
  .catch(error => console.error("Error al guardar: ", error));
}

// Mostrar resultados en el panel
function mostrarResultados(usuarioId) {
  const contenedor = document.getElementById("resultados");
  db.collection("resultados").where("usuario", "==", usuarioId)
    .get()
    .then(snapshot => {
      contenedor.innerHTML = "<h2>📊 Resultados:</h2>";
      snapshot.forEach(doc => {
        const data = doc.data();
        contenedor.innerHTML += `
          <p><strong>${data.juego}</strong>: ${data.puntaje} puntos<br><em>${data.fecha}</em></p>
        `;
      });
    })
    .catch(err => console.error("Error cargando resultados:", err));
}