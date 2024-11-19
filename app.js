let fechaActual = new Date();
let scheduleVisible = true; // Variable para controlar si el contenedor de agenda está visible
const citasPorDia = {
  "18-11-2024": [
    { hora: "9:00", texto: "Pedro<br>Peluquería" },
    { hora: "10:00", texto: "Luis<br>Peinado" },
    { hora: "12:00", texto: "Kevin<br>Corte cabello" },
    { hora: "13:00", texto: "Anegly<br>Manicura" },
  ],
};

function renderizarCalendario() {
  const mesAño = document.getElementById("mes-año");
  const diasCalendario = document.getElementById("dias-calendario");

  const mes = fechaActual.getMonth();
  const año = fechaActual.getFullYear();

  mesAño.textContent = `${fechaActual.toLocaleString("default", {
    month: "long",
  })} ${año}`;

  const primerDia = new Date(año, mes, 1).getDay(); // Primer día del mes
  const ultimoDia = new Date(año, mes + 1, 0).getDate(); // Último día del mes

  diasCalendario.innerHTML = "";

  // Crear las celdas vacías antes del primer día del mes
  for (let i = 0; i < primerDia; i++) {
    const divVacio = document.createElement("div");
    diasCalendario.appendChild(divVacio);
  }

  // Crear los días del mes
  for (let dia = 1; dia <= ultimoDia; dia++) {
    const diaDiv = document.createElement("div");
    diaDiv.textContent = dia;
    diaDiv.onclick = () => abrirCalendario(dia, mes + 1, año); // Se pasa el día, mes y año

    // Resaltar el día actual
    if (
      dia === new Date().getDate() &&
      mes === new Date().getMonth() &&
      año === new Date().getFullYear()
    ) {
      diaDiv.id = "hoy";
    }

    diasCalendario.appendChild(diaDiv);
  }

  // Crear celdas vacías para completar la cuadrícula
  const totalCeldas = primerDia + ultimoDia;
  const celdasRestantes = 42 - totalCeldas;

  for (let i = 0; i < celdasRestantes; i++) {
    const divVacio = document.createElement("div");
    diasCalendario.appendChild(divVacio);
  }
}

function cambiarMes(desplazamiento) {
  fechaActual.setMonth(fechaActual.getMonth() + desplazamiento);
  renderizarCalendario();
}

function abrirCalendario(dia, mes, año) {
  const fechaClave = formatDate(dia, mes, año);
  const citas = citasPorDia[fechaClave] || [];
  renderizarAgenda(citas, dia, mes, año);

  const scheduleDiv = document.getElementById("schedule");
  const mensajeInicial = document.getElementById("mensaje-inicial");
  const scheduleGrid = document.getElementById("scheduleGrid");

  // Ocultar el mensaje inicial y mostrar la agenda
  mensajeInicial.style.display = "none";
  scheduleGrid.style.display = "grid";
  scheduleDiv.style.display = "block";
  scheduleVisible = true;
}

function formatDate(dia, mes, año) {
  return `${String(dia).padStart(2, "0")}-${String(mes).padStart(
    2,
    "0"
  )}-${año}`;
}

function renderizarAgenda(citas, dia, mes, año) {
  const scheduleGrid = document.getElementById("scheduleGrid");
  scheduleGrid.innerHTML = "";

  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ]; // Agregar Domingo
  const hours = [
    "8:00",
    "9:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  // Crear la primera celda de 'HORARIO'
  scheduleGrid.appendChild(createCell("HORARIO", "header-cell"));

  // Obtener el primer día de la semana de la fecha seleccionada
  const primerDiaSemana = new Date(año, mes - 1, dia).getDay(); // Día de la semana del primer día seleccionado (0 = Domingo)

  // Mostrar los días de la semana (Lunes, Martes, etc.)
  const diasAMostrar = window.innerWidth <= 768 ? 3 : 7;  // 3 días para pantallas pequeñas

  for (let i = 0; i < diasAMostrar; i++) {
    const cell = createCell("", "header-cell");
    const diaSemana = (primerDiaSemana + i) % 7; // Alineamos los días con el primer día de la semana

    // Calculamos la fecha de cada día, y si es mayor al número de días del mes, lo dejamos vacío.
    const fechaFormateada = new Date(año, mes - 1, dia + i);
    const diaDelMes = fechaFormateada.getDate(); // Ahora obtenemos el día como número directamente del objeto Date

    // Si la fecha calculada es del siguiente mes, no la mostramos
    if (fechaFormateada.getMonth() !== mes - 1) {
      cell.innerHTML = ""; // Si es del mes siguiente, lo dejamos vacío
    } else {
      // Hacemos clickeable cada día de la semana
      cell.innerHTML = `<div class="day-header">${
        days[(primerDiaSemana + i) % 7]
      }</div><div class="day-number" onclick="actualizarAgenda(${diaDelMes}, ${mes}, ${año})">${fechaFormateada.getDate()}</div>`;
    }

    scheduleGrid.appendChild(cell);
  }

  // Recorrer las horas
  hours.forEach((hour) => {
    scheduleGrid.appendChild(createCell(hour, "time-cell")); // Columna de horas
    for (let i = 0; i < diasAMostrar; i++) {
      const fechaClave = formatDate(dia + i, mes, año); // Fecha del día seleccionado
      const cita = citasPorDia[fechaClave]
        ? citasPorDia[fechaClave].find((a) => a.hora === hour)
        : null; // Buscar la cita para esa hora

      if (cita) {
        // Crear la celda con la cita
        const cell = createCell(cita.texto, "day-cell appointment");
        cell.innerHTML = cita.texto;
        cell.style.backgroundColor = "#A88B73";
        scheduleGrid.appendChild(cell); // Insertar la cita solo en la celda correspondiente
      } else {
        scheduleGrid.appendChild(createCell("vacio", "day-cell diaVacio")); // Celda vacía si no hay cita
      }
    }
  });
}

function actualizarAgenda(dia, mes, año) {
  const fechaClave = formatDate(dia, mes, año);
  const citas = citasPorDia[fechaClave] || [];
  renderizarAgenda(citas, dia, mes, año); // Actualizar la agenda con las citas de ese día
}

function createCell(text, className) {
  const cell = document.createElement("div");
  cell.className = `grid-cell ${className}`;
  cell.textContent = text;
  return cell;
}

document.addEventListener("click", function (event) {
  const scheduleDiv = document.getElementById("schedule");
  const calendarioDiv = document.getElementById("dias-calendario");
  const mensajeInicial = document.getElementById("mensaje-inicial");
  const scheduleGrid = document.getElementById("scheduleGrid");

  // Verifica si el clic es fuera del calendario y del schedule
  if (
    scheduleVisible &&
    !scheduleDiv.contains(event.target) &&
    !calendarioDiv.contains(event.target)
  ) {
    scheduleGrid.style.display = "none";
    mensajeInicial.style.display = "block";
    scheduleVisible = false;
  }
});

// Prevenir que el clic en los días de la agenda cierre el modal
document
  .getElementById("scheduleGrid")
  .addEventListener("click", function (event) {
    event.stopPropagation(); // Esto evita que el clic en la agenda se propague al evento de cierre
  });

document.addEventListener("DOMContentLoaded", function () {
  renderizarCalendario();
  const scheduleDiv = document.getElementById("schedule");
  const mensajeInicial = document.getElementById("mensaje-inicial");
  const scheduleGrid = document.getElementById("scheduleGrid");

  // Mostrar el mensaje inicial y ocultar la agenda al cargar la página
  scheduleDiv.style.display = "block";
  mensajeInicial.style.display = "block";
  scheduleGrid.style.display = "none";
});
