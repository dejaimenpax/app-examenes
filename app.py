"""
Aplicación web de exámenes tipo test
Sistema con dos modos: examen sin revisión y con revisión
"""

from flask import Flask, render_template, jsonify, request
import json
import os
import random

app = Flask(__name__)

# Cargar datos al iniciar la aplicación
def cargar_preguntas():
    """Carga el archivo JSON con todas las preguntas"""
    ruta = os.path.join(os.path.dirname(__file__), 'data', 'preguntas.json')
    with open(ruta, 'r', encoding='utf-8') as f:
        return json.load(f)

# Cargar datos en memoria (hardcoded en JSON)
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
    
    return render_template('examen.html', modo=modo)

@app.route('/api/examen-aleatorio')
def api_examen_aleatorio():
    """API para obtener 10 preguntas aleatorias"""
    # Seleccionar 10 preguntas aleatorias
    todas_preguntas = PREGUNTAS['preguntas'].copy()
    preguntas_seleccionadas = random.sample(todas_preguntas, min(10, len(todas_preguntas)))
    
    return jsonify({
        'preguntas': preguntas_seleccionadas
    })

@app.route('/api/verificar-respuesta', methods=['POST'])
def verificar_respuesta():
    """API para verificar una respuesta individual (modo con revisión)"""
    data = request.json
    pregunta_id = data.get('pregunta_id')
    respuesta_usuario = data.get('respuesta_usuario')
    
    # Buscar la pregunta
    pregunta = next((p for p in PREGUNTAS['preguntas'] if p['id'] == pregunta_id), None)
    
    if not pregunta:
        return jsonify({'error': 'Pregunta no encontrada'}), 404
    
    es_correcta = respuesta_usuario == pregunta['respuesta_correcta']
    
    return jsonify({
        'es_correcta': es_correcta,
        'respuesta_correcta': pregunta['respuesta_correcta'],
        'explicacion_opcion_correcta': pregunta['opciones'][pregunta['respuesta_correcta']]
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

if __name__ == '__main__':
    # Ejecutar en modo debug para desarrollo
    app.run(debug=True, host='0.0.0.0', port=5000)
