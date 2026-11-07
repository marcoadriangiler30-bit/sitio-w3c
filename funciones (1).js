// Funciones del sitio. Todo se registra con addEventListener (sin onclick en línea).
// El contenido esencial sigue disponible si JavaScript falla.
'use strict';

/** Multiplica dos valores. */
function multiplicar(p1, p2) {
  return p1 * p2;
}

document.addEventListener('DOMContentLoaded', function () {
  iniciarSaludo();
  iniciarDias();
  iniciarMultiplicar();
  iniciarFormulario();
});

/* ---------- sucesos.html: saludo con nombre ---------- */
function iniciarSaludo() {
  var form = document.getElementById('form-saludo');
  if (!form) { return; }
  var campo = document.getElementById('nombre-saludo');
  var salida = document.getElementById('mensaje-saludo');

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    var nombre = campo.value.trim();
    if (nombre === '') {
      salida.textContent = 'Aún no nos has dicho tu nombre.';
    } else {
      salida.textContent = 'Hemos guardado tu nombre, ' + nombre + '.';
    }
  });
}

/* ---------- sucesos.html: lista de días con aria-expanded ---------- */
function iniciarDias() {
  var boton = document.getElementById('boton-dias');
  var panel = document.getElementById('panel-dias');
  var lista = document.getElementById('lista-dias');
  if (!boton || !panel || !lista) { return; }

  var dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  dias.forEach(function (dia) {
    var li = document.createElement('li');
    li.textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
    lista.appendChild(li);
  });

  // Mejora progresiva: sin JavaScript el contenido queda visible y el botón oculto.
  boton.hidden = false;
  panel.hidden = true;

  boton.addEventListener('click', function () {
    var abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', String(!abierto));
    panel.hidden = abierto;
    boton.textContent = abierto ? 'Mostrar los días de la semana' : 'Ocultar los días de la semana';
  });

  // Esc cierra el panel y devuelve el foco al botón (WCAG 2.1.1)
  panel.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
      boton.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      boton.textContent = 'Mostrar los días de la semana';
      boton.focus();
    }
  });
}

/* ---------- funcion.html: calculadora ---------- */
function iniciarMultiplicar() {
  var form = document.getElementById('form-multiplicar');
  if (!form) { return; }
  var salida = document.getElementById('demo');

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    var a = parseFloat(document.getElementById('factor1').value);
    var b = parseFloat(document.getElementById('factor2').value);
    if (isNaN(a) || isNaN(b)) {
      salida.textContent = 'Error: escribe dos números válidos.';
      return;
    }
    salida.textContent = 'Resultado: ' + a + ' × ' + b + ' = ' + multiplicar(a, b);
  });
}

/* ---------- formulario.html: validación con mensajes de texto ---------- */
function iniciarFormulario() {
  var form = document.getElementById('registro');
  if (!form) { return; }
  var estado = document.getElementById('estado-formulario');

  var reglas = [
    { id: 'correo', obligatorio: true, nombre: 'el correo electrónico' },
    { id: 'nombre', obligatorio: true, nombre: 'el nombre' },
    { id: 'apellido', obligatorio: true, nombre: 'el apellido' },
    { id: 'edad', obligatorio: false, nombre: 'la edad' },
    { id: 'web', obligatorio: false, nombre: 'la página web' }
  ];

  function limpiar(campo, msg) {
    campo.removeAttribute('aria-invalid');
    msg.hidden = true;
    msg.textContent = '';
  }

  function mostrar(campo, msg, texto) {
    campo.setAttribute('aria-invalid', 'true');
    msg.textContent = texto;
    msg.hidden = false;
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    estado.textContent = '';
    var primerError = null;

    reglas.forEach(function (r) {
      var campo = document.getElementById(r.id);
      var msg = document.getElementById('error-' + r.id);
      limpiar(campo, msg);
      var valor = campo.value.trim();
      var texto = '';

      if (r.obligatorio && valor === '') {
        texto = 'Escribe ' + r.nombre + '.';
      } else if (valor !== '' && !campo.checkValidity()) {
        texto = 'El valor de ' + r.nombre + ' no es válido.';
      }
      if (texto) {
        mostrar(campo, msg, texto);
        if (!primerError) { primerError = campo; }
      }
    });

    if (primerError) {
      estado.textContent = 'El formulario tiene errores. Corrígelos e inténtalo de nuevo.';
      estado.className = 'error';
      primerError.focus();
    } else {
      estado.className = 'estado';
      estado.textContent = 'Información guardada correctamente.';
    }
  });

  form.addEventListener('reset', function () {
    reglas.forEach(function (r) {
      limpiar(document.getElementById(r.id), document.getElementById('error-' + r.id));
    });
    estado.textContent = '';
  });
}
