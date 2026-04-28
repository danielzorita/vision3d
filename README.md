<div align="center">


# 🌌 Vision3D: Generación de Modelos 3D mediante IA

**Transforma imágenes estáticas 2D en modelos 3D inmersivos con un solo clic.**  
Desarrollado con Flask, potenciado por Hunyuan3D-2.1 de Hugging Face y visualizado con Google Model Viewer.

<br>

[![Python](https://img.shields.io/badge/Python-3.10%20%7C%203.11%20%7C%203.12-blue.svg?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-v3.0+-000000.svg?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![AI Model](https://img.shields.io/badge/AI-Hunyuan3D--2.1-orange.svg?logo=huggingface&logoColor=white)](https://huggingface.co/spaces/AliothTalks/Hunyuan3D-2.1)
[![Status](https://img.shields.io/badge/Sistema-Estable-brightgreen.svg)]()

</div>

---

## 📖 Descripción General

**Vision3D** es una aplicación web de alto rendimiento diseñada para convertir contenido digital 2D en activos 3D espaciales. Utilizando modelos de reconstrucción de última generación (**LRM**), el sistema sintetiza modelos `.GLB` de alta fidelidad a partir de una única imagen de referencia en menos de 60 segundos.

Este proyecto sirve como una infraestructura integral para:
- **Desarrolladores de Videojuegos**: Prototipado rápido de assets.
- **Artistas VFX**: Generación de mallas base para refinamiento posterior.
- **Desarrolladores Web**: Integración de vistas previas 3D interactivas en sitios modernos.

## ✨ Características Principales

| Característica | Descripción |
| :--- | :--- |
| 🚀 **Procesamiento Asíncrono** | Pipeline de generación no bloqueante gestionado mediante la API de Gradio. |
| 💎 **Alta Fidelidad** | Síntesis en múltiples etapas (Forma -> Textura) para resultados realistas. |
| 🛡️ **Limpieza Automática** | Sistema inteligente de mantenimiento que purga archivos temporales para optimizar el almacenamiento. |
| 🎭 **Interfaz Glassmorphic** | Diseño premium ultra-moderno con modo oscuro y respuesta fluida. |
| 🔍 **Inspector en Vivo** | Visor 3D integrado para interacción en tiempo real (rotación, zoom, desplazamiento). |
| 🔗 **Exportación GLB** | Los modelos se generan en formato estándar `.GLB`, compatible con Blender, Unity y Three.js. |

## 🛠️ Stack Tecnológico

- **Backend**: Python / [Flask](https://flask.palletsprojects.com/)
- **Núcleo de IA**: [Hunyuan3D-2.1](https://huggingface.co/spaces/AliothTalks/Hunyuan3D-2.1) vía `gradio_client`
- **Frontend**: [TailwindCSS](https://tailwindcss.com/) / Vanilla JS
- **Renderizado 3D**: [Google Model Viewer](https://modelviewer.dev/)
- **Entorno**: [Dotenv](https://pypi.org/project/python-dotenv/) para gestión segura de credenciales.

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para configurar tu instancia local de Vision3D.

### 1. Requisitos Previos
- Python 3.10 o superior.
- Un **Token de Hugging Face** (Read o Write). Consíguelo [aquí](https://huggingface.co/settings/tokens).

### 2. Instalación

Clona el repositorio y configura un entorno virtual:

```bash
# Clonar el proyecto
git clone https://github.com/danielzorita/vision3d.git
cd vision3d-main

# Crear entorno virtual
python -m venv venv
./venv/Scripts/activate  # En Windows

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Configuración

Crea un archivo `.env` en el directorio raíz:

```env
MI_TOKEN=tu_token_de_huggingface_aqui
MODEL_SPACE=Tencent/Hunyuan3D-2
SECRET_KEY=una_clave_secreta_aleatoria
```

### 4. Lanzamiento

Inicia el servidor de desarrollo:

```bash
python app.py
```
Accede a `http://localhost:5000` en tu navegador.

---

## 🎓 Tutorial de Uso: Generando tu primer Modelo 3D

1.  **Prepara tu Imagen**: Usa una imagen 2D clara (PNG/JPG) con un fondo limpio. Los objetos definidos, personajes o muebles funcionan mejor.
2.  **Subida**: Arrastra y suelta tu imagen en la zona de carga de Vision3D.
3.  **Sintetizar**: Haz clic en el botón **Generar Modelo 3D**. El sistema intentará primero una generación con texturas completas.
    > [!TIP]
    > Si el servidor de texturas está saturado, el sistema cambia automáticamente al modo **"Solo Forma"** para garantizar que siempre recibas un resultado.
4.  **Inspeccionar**: Una vez finalizado, el modelo aparecerá en el visor interactivo.
5.  **Descargar**: Guarda el archivo `.GLB` para usarlo en tu software 3D favorito.

---

## 🛠️ Solución de Problemas Comunes

### 🛑 "ZeroGPU quotas reached"
Significa que la cuota gratuita de GPU de Hugging Face se ha agotado para tu IP/Token.
- **Solución**: Espera a que se reinicie el ciclo de 24 horas o utiliza una cuenta Pro de Hugging Face.

### 🛑 "SSL: CERTIFICATE_VERIFY_FAILED"
Ocurre en algunos sistemas con certificados desactualizados.
- **Solución**: Ejecuta lo siguiente en Python:
  ```python
  import certifi, os
  os.environ['SSL_CERT_FILE'] = certifi.where()
  ```

---

## 🤝 Contribuciones y Soporte

Las contribuciones son las que hacen que la comunidad de código abierto sea un lugar increíble. Cualquier aporte es **bienvenido**.

1. Haz un Fork del proyecto.
2. Crea tu Rama de Funcionalidad (`git checkout -b feature/NuevaFuncion`).
3. Haz un Commit de tus cambios (`git commit -m 'Añadir NuevaFuncion'`).
4. Haz un Push a la rama (`git push origin feature/NuevaFuncion`).
5. Abre un Pull Request.

<p align="center">
  Desarrollado con ❤️ para la comunidad de IA y Visión 3D
</p>
