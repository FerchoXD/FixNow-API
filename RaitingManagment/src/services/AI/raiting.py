import requests
import json
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import os

CREDENTIALS_PATH = "./src/services/AI/mineria.json"
SCOPES = ["https://www.googleapis.com/auth/generative-language"]
API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'

def get_access_token():
    if not os.path.exists(CREDENTIALS_PATH):
        raise FileNotFoundError(f"El archivo de credenciales no fue encontrado en la ruta: {CREDENTIALS_PATH}")

    credentials = service_account.Credentials.from_service_account_file(
        CREDENTIALS_PATH, scopes=SCOPES)
    credentials.refresh(Request())
    return credentials.token

def enviar_mensaje(mensaje_usuario):
    texto = preparar_texto(mensaje_usuario)

    token = get_access_token()
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    payload = {
        "contents": [
            {"parts": [{"text": texto}]}
        ]
    }

    try:
        response = requests.post(API_ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()

        data = response.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
        print("Respuesta cruda de la API:", raw_text)

        # Limpieza y decodificación del JSON
        respuesta_limpia = raw_text.replace("```json", "").replace("```", "").strip()
        respuesta_json = json.loads(respuesta_limpia)

        categoria = respuesta_json.get("categoria", "irrelevante")
        polaridad = respuesta_json.get("polaridad", None)

        if categoria == "grosero":
            print("Eliminar comentario: Contiene lenguaje inapropiado.")
            print("Esto es la polaridad: -1", polaridad)
            return polaridad
        elif categoria == "relevante":
            print(f"Comentario relevante. Polaridad: {polaridad}")
            return polaridad
        else:  # irrelevante
            print("El comentario no es relevante para el proveedor actual.")
            print("Esto es la polaridad: 0")
            return polaridad
    except json.JSONDecodeError as e:
        print("Error al decodificar la respuesta de la API:", e)
        print("Esto es la polaridad: None")
    except requests.exceptions.RequestException as e:
        print("Error al comunicarse con la API:", e)

    return None


PALABRAS_PROHIBIDAS = """
estúpido,imbécil,idiota,mierda,chingadera,chingar,maldito,basura,perro,puto,
perra,puta,cabrón,tarado,patético,chinga tu madre,chinga tu puta madre,
asqueroso,grosero,inepto,mediocre,ridículo,despreciable,malparido,ojete,pendejo,
tonto,cretino,sarnoso,traidor,huevón,maldito
""".strip()

PALABRAS_IRRELEVANTES = """
¿Cómo estás hoy?, Me gusta el clima, 
Ayer comí pizza., Mi color favorito es el azul.,
Hoy es martes., Me encanta la música clásica., ¿Tienes mascotas?, 
El cielo está despejado., Me gusta leer, Ayer llovió mucho., 
Me gustan las flores., ¿Te gusta viajar?, Hoy es un buen día., 
Me gustan los colores vivos., ¿Te gusta bailar?, El mar está en calma., 
Me encanta la pizza., Me gusta la moda., Ayer nevó.
""".strip()

def preparar_texto(texto):
    mensaje_usuario = (
        f"{texto} Evalúa este mensaje y clasifícalo en una de las siguientes categorías: "
        "'relevante' (si está relacionado con el servicio del proveedor actual), "
        "'irrelevante' (si no está relacionado con el servicio del proveedor y debe tener una polaridad de 0), "
        f"o 'grosero' (si contiene lenguaje inapropiado como {PALABRAS_PROHIBIDAS} y debe tener una polaridad de -1). "
        "Si el mensaje es relevante, proporciona también la polaridad del sentimiento en una escala del 1 al 5 (1=Muy negativo, 5=Muy positivo). "
        f"Ejemplos de texto irrelevante: {PALABRAS_IRRELEVANTES} "
        "Responde únicamente en un JSON con las claves 'categoria' y 'polaridad'. "
        "No des explicaciones ni detalles adicionales."
    )
    return mensaje_usuario
