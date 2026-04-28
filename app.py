import os
import uuid
import shutil
import time
from flask import Flask, render_template, request, jsonify, send_from_directory
from gradio_client import Client, handle_file
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuración
MI_TOKEN = os.getenv("MI_TOKEN")
if not MI_TOKEN:
    print("❌ WARNING: MI_TOKEN not found in .env file. Generation will likely fail.")

MODEL_SPACE = os.getenv("MODEL_SPACE", "Tencent/Hunyuan3D-2")
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'outputs'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY", "dev-secret-key")

# Asegurar directorios
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def cleanup_old_files(directory, max_age_seconds=3600):
    """Deletes files older than max_age_seconds in the specified directory."""
    now = time.time()
    for filename in os.listdir(directory):
        if filename == '.gitkeep':
            continue
        filepath = os.path.join(directory, filename)
        if os.path.getmtime(filepath) < now - max_age_seconds:
            try:
                os.remove(filepath)
                print(f"🧹 Auto-cleaned old file: {filename}")
            except Exception as e:
                print(f"⚠️ Error cleaning {filename}: {e}")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """Renders the main 3D Model Generator interface."""
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_3d():
    if not MI_TOKEN:
        return jsonify({'error': 'Servidor no configurado: Falta el Token de Hugging Face.'}), 503

    if 'image' not in request.files:
        return jsonify({'error': 'No se proporcionó ninguna imagen'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'Nombre de archivo vacío'}), 400
    
    if file and allowed_file(file.filename):
        # Mantenimiento preventivo
        cleanup_old_files(app.config['UPLOAD_FOLDER'])
        cleanup_old_files(app.config['OUTPUT_FOLDER'])

        # Crear un ID único para esta tarea
        task_id = str(uuid.uuid4())
        filename = secure_filename(f"{task_id}_{file.filename}")
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        print(f"🚀 Iniciando generación para {filename}...")
        
        try:
            # Connect to Hugging Face Model Space
            print(f"📡 Connecting to {MODEL_SPACE}...")
            client = Client(MODEL_SPACE, token=MI_TOKEN)
            
            # Intento de generación completa (con texturas)
            try:
                result = client.predict(
                    image=handle_file(filepath),
                    mv_image_front=None,
                    mv_image_back=None,
                    mv_image_left=None,
                    mv_image_right=None,
                    steps=30,
                    guidance_scale=5.0,
                    seed=1234,
                    octree_resolution=256,
                    check_box_rembg=True,
                    num_chunks=8000,
                    randomize_seed=True,
                    api_name="/generation_all"
                )
            except Exception as e:
                # Fallback: Si falla por las texturas, intentamos solo la forma (shape)
                if "tex_pipeline" in str(e) or "texture" in str(e).lower() or "NameError" in str(e):
                    print("⚠️ Texture pipeline failed, falling back to shape-only generation...")
                    result = client.predict(
                        image=handle_file(filepath),
                        mv_image_front=None,
                        mv_image_back=None,
                        mv_image_left=None,
                        mv_image_right=None,
                        steps=30,
                        guidance_scale=5.0,
                        seed=1234,
                        octree_resolution=256,
                        check_box_rembg=True,
                        num_chunks=8000,
                        randomize_seed=True,
                        api_name="/shape_generation"
                    )
                else:
                    raise e
            
            print(f"✅ Respuesta recibida: {result}")
            
            path_modelo_3d = None
            if isinstance(result, (list, tuple)) and len(result) >= 1:
                # Si es generación completa (5 elementos), el archivo está en result[1]
                # Si es generación de forma (4 elementos), el archivo está en result[0]
                file_info = result[1] if len(result) >= 5 else result[0]
                if isinstance(file_info, dict):
                    path_modelo_3d = file_info.get('value')
                elif isinstance(file_info, str):
                    path_modelo_3d = file_info

            if path_modelo_3d and os.path.exists(path_modelo_3d):
                output_filename = f"{task_id}.glb"
                output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
                shutil.copy(path_modelo_3d, output_path)
                
                return jsonify({
                    'success': True,
                    'model_url': f'/download/{output_filename}',
                    'task_id': task_id
                })
            else:
                return jsonify({'error': 'El modelo no se generó correctamente o la ruta no es válida'}), 500
                
        except Exception as e:
            error_msg = str(e)
            print(f"🧨 Error en la API: {error_msg}")
            
            # Map specific quota/API errors to user-friendly messages
            if "ZeroGPU quotas" in error_msg:
                return jsonify({'error': 'Cuota diaria de GPU agotada en Hugging Face. Vuelve a intentarlo mañana o usa una cuenta Pro.'}), 429
            
            return jsonify({'error': f"Error en la síntesis: {error_msg}"}), 500
        finally:
            # Limpiar el archivo subido inmediatamente después de procesar
            if os.path.exists(filepath):
                os.remove(filepath)
            
    return jsonify({'error': 'Extensión de archivo no permitida'}), 400

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
