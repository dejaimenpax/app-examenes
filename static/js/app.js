/**
 * Aplicación de exámenes - Lógica del cliente
 * Soporta dos modos: sin revisión y con revisión
 */

// Estado global de la aplicación
let datosExamen = null;
let preguntaActual = 0;
let respuestasUsuario = {};
let resultadosExamen = null;
let preguntaRespondida = false;

// Elementos del DOM
const loader = document.getElementById('loader');
const preguntasContainer = document.getElementById('preguntas-container');
const feedbackContainer = document.getElementById('feedback-container');
const navegacion = document.getElementById('navegacion');
const btnAnterior = document.getElementById('btn-anterior');
const btnSiguiente = document.getElementById('btn-siguiente');
const btnResponder = document.getElementById('btn-responder');
const btnFinalizar = document.getElementById('btn-finalizar');
const modalResultados = document.getElementById('modal-resultados');
const vistaCorreccion = document.getElementById('vista-correccion');

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    cargarExamen();
});

/**
 * Carga 10 preguntas aleatorias desde la API
 */
async function cargarExamen() {
    try {
        const response = await fetch('/api/examen-aleatorio');
        
        if (!response.ok) {
            throw new Error('Error al cargar el examen');
        }
        
        datosExamen = await response.json();
        
        // Ocultar loader y mostrar contenido
        loader.style.display = 'none';
        preguntasContainer.style.display = 'block';
        navegacion.style.display = 'flex';
        
        // Renderizar preguntas
        renderizarPreguntas();
        mostrarPregunta(0);
        actualizarBotones();
        
    } catch (error) {
        console.error('Error:', error);
        loader.innerHTML = `
            <div class="error">
                <h3>❌ Error al cargar el examen</h3>
                <p>${error.message}</p>
                <a href="/" class="btn btn-primary">Volver al inicio</a>
            </div>
        `;
    }
}

/**
 * Renderiza todas las preguntas en el DOM
 */
function renderizarPreguntas() {
    preguntasContainer.innerHTML = '';
    
    datosExamen.preguntas.forEach((pregunta, index) => {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = 'pregunta';
        preguntaDiv.id = `pregunta-${index}`;
        
        // Texto de la pregunta
        const preguntaTexto = document.createElement('div');
        preguntaTexto.className = 'pregunta-texto';
        preguntaTexto.textContent = `${index + 1}. ${pregunta.pregunta}`;
        preguntaDiv.appendChild(preguntaTexto);
        
        // Opciones
        const opcionesDiv = document.createElement('div');
        opcionesDiv.className = 'opciones';
        opcionesDiv.id = `opciones-${index}`;
        
        pregunta.opciones.forEach((opcion, opcionIndex) => {
            const opcionDiv = document.createElement('div');
            opcionDiv.className = 'opcion';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `pregunta-${index}`;
            radio.id = `pregunta-${index}-opcion-${opcionIndex}`;
            radio.value = opcionIndex;
            
            // Recuperar respuesta guardada si existe
            if (respuestasUsuario[index] === opcionIndex) {
                radio.checked = true;
                opcionDiv.classList.add('seleccionada');
            }
            
            radio.addEventListener('change', () => {
                guardarRespuesta(index, opcionIndex);
                actualizarSeleccion(index, opcionIndex);
                actualizarBotones();
            });
            
            const label = document.createElement('label');
            label.htmlFor = radio.id;
            label.textContent = opcion;
            
            opcionDiv.appendChild(radio);
            opcionDiv.appendChild(label);
            opcionesDiv.appendChild(opcionDiv);
            
            // Click en toda la opción
            opcionDiv.addEventListener('click', (e) => {
                if (e.target !== radio && !opcionDiv.classList.contains('bloqueada')) {
                    radio.checked = true;
                    guardarRespuesta(index, opcionIndex);
                    actualizarSeleccion(index, opcionIndex);
                    actualizarBotones();
                }
            });
        });
        
        preguntaDiv.appendChild(opcionesDiv);
        preguntasContainer.appendChild(preguntaDiv);
    });
}

/**
 * Guarda la respuesta del usuario
 */
function guardarRespuesta(numeroPregunta, opcionSeleccionada) {
    respuestasUsuario[numeroPregunta] = opcionSeleccionada;
}

/**
 * Actualiza el estilo de la opción seleccionada
 */
function actualizarSeleccion(numeroPregunta, opcionSeleccionada) {
    const preguntaDiv = document.getElementById(`pregunta-${numeroPregunta}`);
    const opciones = preguntaDiv.querySelectorAll('.opcion');
    
    opciones.forEach((opcion, index) => {
        if (index === opcionSeleccionada) {
            opcion.classList.add('seleccionada');
        } else {
            opcion.classList.remove('seleccionada');
        }
    });
}

/**
 * Muestra una pregunta específica
 */
function mostrarPregunta(numero) {
    // Ocultar todas las preguntas
    const todasPreguntas = document.querySelectorAll('.pregunta');
    todasPreguntas.forEach(p => p.classList.remove('activa'));
    
    // Mostrar la pregunta actual
    const pregunta = document.getElementById(`pregunta-${numero}`);
    if (pregunta) {
        pregunta.classList.add('activa');
        preguntaActual = numero;
        preguntaRespondida = false;
        
        // Actualizar contador
        document.getElementById('pregunta-actual').textContent = numero + 1;
        document.getElementById('total-preguntas').textContent = datosExamen.preguntas.length;
        
        // Ocultar feedback si existe
        if (feedbackContainer) {
            feedbackContainer.style.display = 'none';
        }
        
        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Actualiza el estado de los botones de navegación
 */
function actualizarBotones() {
    const totalPreguntas = datosExamen.preguntas.length;
    const tieneRespuesta = respuestasUsuario.hasOwnProperty(preguntaActual);
    
    // Botón anterior
    btnAnterior.disabled = preguntaActual === 0;
    
    // Modo con revisión
    if (MODO_EXAMEN === 'con-revision') {
        if (btnResponder) {
            btnResponder.style.display = tieneRespuesta && !preguntaRespondida ? 'block' : 'none';
        }
        btnSiguiente.style.display = preguntaRespondida || !tieneRespuesta ? 'block' : 'none';
        
        if (preguntaActual === totalPreguntas - 1) {
            btnSiguiente.style.display = 'none';
            btnFinalizar.style.display = preguntaRespondida ? 'block' : 'none';
        } else {
            btnFinalizar.style.display = 'none';
        }
    }
    // Modo sin revisión
    else {
        if (btnResponder) {
            btnResponder.style.display = 'none';
        }
        
        if (preguntaActual === totalPreguntas - 1) {
            btnSiguiente.style.display = 'none';
            btnFinalizar.style.display = 'block';
        } else {
            btnSiguiente.style.display = 'block';
            btnFinalizar.style.display = 'none';
        }
    }
}

/**
 * Navega a la pregunta anterior
 */
btnAnterior.addEventListener('click', () => {
    if (preguntaActual > 0) {
        mostrarPregunta(preguntaActual - 1);
        actualizarBotones();
    }
});

/**
 * Navega a la siguiente pregunta
 */
btnSiguiente.addEventListener('click', () => {
    if (preguntaActual < datosExamen.preguntas.length - 1) {
        mostrarPregunta(preguntaActual + 1);
        actualizarBotones();
    }
});

/**
 * Comprueba la respuesta (solo modo con revisión)
 */
if (btnResponder) {
    btnResponder.addEventListener('click', async () => {
        const pregunta = datosExamen.preguntas[preguntaActual];
        const respuesta = respuestasUsuario[preguntaActual];
        
        if (respuesta === undefined) {
            return;
        }
        
        btnResponder.disabled = true;
        btnResponder.textContent = 'Verificando...';
        
        try {
            const response = await fetch('/api/verificar-respuesta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pregunta_id: pregunta.id,
                    respuesta_usuario: respuesta
                })
            });
            
            const resultado = await response.json();
            mostrarFeedback(resultado);
            preguntaRespondida = true;
            
            // Bloquear opciones
            const opciones = document.querySelectorAll(`#opciones-${preguntaActual} .opcion`);
            opciones.forEach((opcion, index) => {
                opcion.classList.add('bloqueada');
                
                // Marcar la correcta
                if (index === resultado.respuesta_correcta) {
                    opcion.classList.add('respuesta-correcta-mostrada');
                }
                
                // Marcar la incorrecta si es diferente
                if (!resultado.es_correcta && index === respuesta) {
                    opcion.classList.add('respuesta-incorrecta-mostrada');
                }
            });
            
            actualizarBotones();
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al verificar la respuesta');
            btnResponder.disabled = false;
            btnResponder.textContent = 'Comprobar Respuesta';
        }
    });
}

/**
 * Muestra el feedback inmediato
 */
function mostrarFeedback(resultado) {
    feedbackContainer.innerHTML = '';
    feedbackContainer.className = resultado.es_correcta ? 'correcto' : 'incorrecto';
    
    const feedbackHTML = `
        <div class="feedback-header">
            <div class="feedback-icono">${resultado.es_correcta ? '✅' : '❌'}</div>
            <div class="feedback-titulo ${resultado.es_correcta ? 'correcto' : 'incorrecto'}">
                ${resultado.es_correcta ? '¡Correcto!' : 'Incorrecto'}
            </div>
        </div>
        ${!resultado.es_correcta ? `
            <div class="feedback-respuesta">
                <strong>Respuesta correcta:</strong><br>
                ${resultado.explicacion_opcion_correcta}
            </div>
        ` : ''}
    `;
    
    feedbackContainer.innerHTML = feedbackHTML;
    feedbackContainer.style.display = 'block';
}

/**
 * Finaliza el examen
 */
btnFinalizar.addEventListener('click', async () => {
    // Modo con revisión: solo mostrar resultados finales
    if (MODO_EXAMEN === 'con-revision') {
        mostrarResultadosConRevision();
        return;
    }
    
    // Modo sin revisión: verificar preguntas sin contestar
    const totalPreguntas = datosExamen.preguntas.length;
    const respuestasContestadas = Object.keys(respuestasUsuario).length;
    
    if (respuestasContestadas < totalPreguntas) {
        const faltantes = totalPreguntas - respuestasContestadas;
        const confirmar = confirm(
            `Te faltan ${faltantes} pregunta(s) por contestar.\n\n` +
            `Las preguntas sin responder se contarán como incorrectas.\n\n` +
            `¿Deseas finalizar el examen de todas formas?`
        );
        
        if (!confirmar) {
            return;
        }
    }
    
    // Deshabilitar botón mientras se corrige
    btnFinalizar.disabled = true;
    btnFinalizar.textContent = 'Corrigiendo...';
    
    try {
        await corregirExamen();
    } catch (error) {
        console.error('Error al corregir:', error);
        alert('Error al corregir el examen. Por favor, inténtalo de nuevo.');
        btnFinalizar.disabled = false;
        btnFinalizar.textContent = '✓ Finalizar Examen';
    }
});

/**
 * Envía las respuestas al servidor y muestra los resultados (modo sin revisión)
 */
async function corregirExamen() {
    try {
        const response = await fetch('/api/corregir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                preguntas: datosExamen.preguntas,
                respuestas: respuestasUsuario
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al corregir el examen');
        }
        
        resultadosExamen = await response.json();
        mostrarResultados();
        
    } catch (error) {
        throw error;
    }
}

/**
 * Muestra resultados para modo con revisión
 */
function mostrarResultadosConRevision() {
    let aciertos = 0;
    const totalPreguntas = datosExamen.preguntas.length;
    
    // Contar aciertos basados en respuestas guardadas
    datosExamen.preguntas.forEach((pregunta, index) => {
        if (respuestasUsuario[index] === pregunta.respuesta_correcta) {
            aciertos++;
        }
    });
    
    const puntuacion = (aciertos / totalPreguntas) * 10;
    const porcentaje = (aciertos / totalPreguntas) * 100;
    const aprobado = puntuacion >= 5;
    
    const resultadosHTML = `
        <div class="resultado-stats">
            <h3>${aprobado ? '🎉 ¡APROBADO!' : '😞 SUSPENDIDO'}</h3>
            <div class="puntuacion-grande ${aprobado ? 'aprobado' : 'suspendido'}">
                ${puntuacion.toFixed(2)}
            </div>
            <p style="font-size: 1.2rem; color: var(--text-secondary);">sobre 10</p>
            
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-valor">${aciertos}</div>
                    <div class="stat-label">Correctas</div>
                </div>
                <div class="stat-item">
                    <div class="stat-valor">${totalPreguntas - aciertos}</div>
                    <div class="stat-label">Incorrectas</div>
                </div>
                <div class="stat-item">
                    <div class="stat-valor">${porcentaje.toFixed(2)}%</div>
                    <div class="stat-label">Porcentaje</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('resultados-body').innerHTML = resultadosHTML;
    
    // Ocultar botón de ver respuestas en modo con revisión
    document.getElementById('btn-ver-respuestas').style.display = 'none';
    
    modalResultados.classList.add('activo');
}

/**
 * Muestra el modal con los resultados (modo sin revisión)
 */
function mostrarResultados() {
    const aprobado = resultadosExamen.puntuacion >= 5;
    
    const resultadosHTML = `
        <div class="resultado-stats">
            <h3>${aprobado ? '🎉 ¡APROBADO!' : '😞 SUSPENDIDO'}</h3>
            <div class="puntuacion-grande ${aprobado ? 'aprobado' : 'suspendido'}">
                ${resultadosExamen.puntuacion}
            </div>
            <p style="font-size: 1.2rem; color: var(--text-secondary);">sobre 10</p>
            
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-valor">${resultadosExamen.aciertos}</div>
                    <div class="stat-label">Correctas</div>
                </div>
                <div class="stat-item">
                    <div class="stat-valor">${resultadosExamen.total - resultadosExamen.aciertos}</div>
                    <div class="stat-label">Incorrectas</div>
                </div>
                <div class="stat-item">
                    <div class="stat-valor">${resultadosExamen.porcentaje}%</div>
                    <div class="stat-label">Porcentaje</div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('resultados-body').innerHTML = resultadosHTML;
    document.getElementById('btn-ver-respuestas').style.display = 'inline-block';
    modalResultados.classList.add('activo');
}

/**
 * Ver respuestas detalladas (solo modo sin revisión)
 */
document.getElementById('btn-ver-respuestas').addEventListener('click', () => {
    modalResultados.classList.remove('activo');
    preguntasContainer.style.display = 'none';
    navegacion.style.display = 'none';
    vistaCorreccion.style.display = 'block';
    
    mostrarCorreccionDetallada();
});

/**
 * Muestra la corrección detallada de todas las preguntas
 */
function mostrarCorreccionDetallada() {
    const correccionContainer = document.getElementById('correccion-container');
    correccionContainer.innerHTML = '';
    
    resultadosExamen.resultados.forEach((resultado) => {
        const esCorrecta = resultado.es_correcta;
        
        const preguntaDiv = document.createElement('div');
        preguntaDiv.className = `pregunta-correccion ${esCorrecta ? 'correcta' : 'incorrecta'}`;
        
        preguntaDiv.innerHTML = `
            <div class="pregunta-correccion-header">
                <span class="numero-pregunta">Pregunta ${resultado.numero}</span>
                <span class="resultado-badge ${esCorrecta ? 'correcto' : 'incorrecto'}">
                    ${esCorrecta ? '✓ CORRECTA' : '✗ INCORRECTA'}
                </span>
            </div>
            <div class="pregunta-correccion-texto">${resultado.pregunta}</div>
            <div class="respuesta-detalle">
                ${resultado.respuesta_usuario !== -1 ? 
                    `<div class="respuesta-item tu-respuesta">
                        <strong>Tu respuesta:</strong> ${resultado.opciones[resultado.respuesta_usuario]}
                    </div>` : 
                    `<div class="respuesta-item tu-respuesta">
                        <strong>No contestaste esta pregunta</strong>
                    </div>`
                }
                ${!esCorrecta ? 
                    `<div class="respuesta-item correcta-es">
                        <strong>Respuesta correcta:</strong> ${resultado.opciones[resultado.respuesta_correcta]}
                    </div>` : ''
                }
            </div>
        `;
        
        correccionContainer.appendChild(preguntaDiv);
    });
}

/**
 * Cerrar vista de corrección
 */
document.getElementById('btn-cerrar-correccion').addEventListener('click', () => {
    vistaCorreccion.style.display = 'none';
    modalResultados.classList.add('activo');
});

/**
 * Reintentar examen
 */
document.getElementById('btn-reintentar').addEventListener('click', () => {
    location.reload();
});
