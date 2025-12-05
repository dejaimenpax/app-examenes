"""
Aplicación web de exámenes tipo test
Sistema con dos modos: examen sin revisión y con revisión
"""

from flask import Flask, render_template, jsonify, request
import json
import os
import random
import time
import copy

app = Flask(__name__)

# Inicializar semilla aleatoria con el tiempo actual
random.seed(time.time())

# Cargar datos al iniciar la aplicación
def cargar_preguntas():
    """Carga todos los archivos JSON de temas y combina las preguntas"""
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    todas_preguntas = []
    
    # Cargar todos los archivos de temas
    archivos_temas = ['tema1.json', 'tema2.json', 'tema3.json', 'tema4.json', 
                      'tema5.json', 'tema6.json', 'tema7.json', 'legislacion.json']
    
    for archivo in archivos_temas:
        ruta = os.path.join(data_dir, archivo)
        if os.path.exists(ruta):
            with open(ruta, 'r', encoding='utf-8') as f:
                tema_data = json.load(f)
                todas_preguntas.extend(tema_data['preguntas'])
    
    return {'preguntas': todas_preguntas}

def cargar_preguntas_tema(tema):
    """Carga las preguntas de un tema específico"""
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    archivo = f'{tema}.json'
    ruta = os.path.join(data_dir, archivo)
    
    if not os.path.exists(ruta):
        return None
    
    with open(ruta, 'r', encoding='utf-8') as f:
        return json.load(f)

def obtener_temas_disponibles():
    """Obtiene la lista de temas disponibles"""
    return [
        {'id': 'tema1', 'nombre': 'Tema 1'},
        {'id': 'tema2', 'nombre': 'Tema 2'},
        {'id': 'tema3', 'nombre': 'Tema 3'},
        {'id': 'tema4', 'nombre': 'Tema 4'},
        {'id': 'tema5', 'nombre': 'Tema 5'},
        {'id': 'tema6', 'nombre': 'Tema 6'},
        {'id': 'tema7', 'nombre': 'Tema 7'},
        {'id': 'legislacion', 'nombre': 'Legislación'}
    ]

# Cargar datos en memoria
PREGUNTAS = cargar_preguntas()

@app.route('/')
def index():
    """Página principal con opciones de examen"""
    return render_template('index.html')

@app.route('/examen/<modo>')
def examen(modo):
    """Página del examen (sin-revision o con-revision)"""
    if modo not in ['sin-revision', 'con-revision']:
        return "Modo no válido", 404
    
    tema = request.args.get('tema', None)
    return render_template('examen.html', modo=modo, tema=tema)

@app.route('/api/examen-aleatorio')
def api_examen_aleatorio():
    """API para obtener 10 preguntas aleatorias"""
    # Reinicializar semilla aleatoria con timestamp para cada petición
    random.seed(time.time())
    
    tema = request.args.get('tema', None)
    
    # Si se especifica un tema, cargar preguntas de ese tema
    if tema:
        tema_data = cargar_preguntas_tema(tema)
        if not tema_data:
            return jsonify({'error': 'Tema no encontrado'}), 404
        todas_preguntas = copy.deepcopy(tema_data['preguntas'])
    else:
        # Seleccionar de todas las preguntas
        todas_preguntas = copy.deepcopy(PREGUNTAS['preguntas'])
    
    # Seleccionar 10 preguntas aleatorias (ya randomizadas por tema o todas)
    preguntas_seleccionadas = random.sample(todas_preguntas, min(10, len(todas_preguntas)))

    # Barajar las opciones de cada pregunta seleccionada
    for pregunta in preguntas_seleccionadas:
        opciones = pregunta['opciones']
        respuesta_correcta_texto = opciones[pregunta['respuesta_correcta']]

        # Barajar opciones con nueva semilla
        random.shuffle(opciones)

        # Actualizar el índice de la respuesta correcta después de barajar
        pregunta['respuesta_correcta'] = opciones.index(respuesta_correcta_texto)

    
    return jsonify({
        'preguntas': preguntas_seleccionadas
    })

@app.route('/api/verificar-respuesta', methods=['POST'])
def verificar_respuesta():
    """API para verificar una respuesta individual (modo con revisión)"""
    data = request.json
    pregunta_data = data.get('pregunta')
    respuesta_usuario = data.get('respuesta_usuario')
    
    if not pregunta_data:
        return jsonify({'error': 'Datos de la pregunta no proporcionados'}), 400

    #usar la pregunta que enviamos desde el cliente (con opciones barajadas)
    es_correcta = respuesta_usuario == pregunta_data['respuesta_correcta']
    
    return jsonify({
        'es_correcta': es_correcta,
        'respuesta_correcta': pregunta_data['respuesta_correcta'],
        'explicacion_opcion_correcta': pregunta_data['opciones'][pregunta_data['respuesta_correcta']]
    })

@app.route('/api/corregir', methods=['POST'])
def corregir_examen():
    """API para corregir un examen completo (modo sin revisión)"""
    data = request.json
    preguntas = data.get('preguntas', [])
    respuestas = data.get('respuestas', {})
    
    # Corregir respuestas
    resultados = []
    aciertos = 0
    
    for i, pregunta in enumerate(preguntas):
        respuesta_usuario = int(respuestas.get(str(i), -1))
        es_correcta = respuesta_usuario == pregunta['respuesta_correcta']
        
        if es_correcta:
            aciertos += 1
        
        resultados.append({
            'numero': i + 1,
            'pregunta': pregunta['pregunta'],
            'opciones': pregunta['opciones'],
            'respuesta_usuario': respuesta_usuario,
            'respuesta_correcta': pregunta['respuesta_correcta'],
            'es_correcta': es_correcta
        })
    
    total_preguntas = len(preguntas)
    puntuacion = (aciertos / total_preguntas) * 10 if total_preguntas > 0 else 0
    porcentaje = (aciertos / total_preguntas) * 100 if total_preguntas > 0 else 0
    
    return jsonify({
        'aciertos': aciertos,
        'total': total_preguntas,
        'puntuacion': round(puntuacion, 2),
        'porcentaje': round(porcentaje, 2),
        'resultados': resultados
    })

@app.route('/api/temas')
def api_temas():
    """API para obtener la lista de temas disponibles"""
    return jsonify({
        'temas': obtener_temas_disponibles()
    })

@app.route('/bateria-preguntas')
def bateria_preguntas():
    """Página con todas las preguntas disponibles"""
    return render_template('bateria.html')

@app.route('/api/todas-preguntas')
def api_todas_preguntas():
    """API para obtener todas las preguntas organizadas por tema"""
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    archivos_temas = ['tema1.json', 'tema2.json', 'tema3.json', 'tema4.json', 
                      'tema5.json', 'tema6.json', 'tema7.json', 'legislacion.json']
    
    temas_data = []
    for archivo in archivos_temas:
        ruta = os.path.join(data_dir, archivo)
        if os.path.exists(ruta):
            with open(ruta, 'r', encoding='utf-8') as f:
                tema_data = json.load(f)
                temas_data.append(tema_data)
    
    return jsonify({
        'temas': temas_data
    })

if __name__ == '__main__':
    # Ejecutar en modo debug para desarrollo
    app.run(debug=True, host='0.0.0.0', port=5000)
