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
perra,puta,cabrón,tarado,patético, chinga tu madre,chinga tu puta madre,
asqueroso,grosero,inepto,mediocre,ridículo,despreciable,malparido,ojete,pendejo,
tonto,cretino,sarnoso,inútil,corrupto,sucio,traidor,huevón,cobarde,infeliz,zángano,
idiot,dumb,stupid,trash,bastard,scumbag,jerk,loser,moron,idiotic,fool,useless,
worthless,ignorant,dirty,corrupt,incompetent,lame,stupid-ass,motherf***er,asshole,
dickhead,f***er,b***h,a**hole,crap,crappy,trashbag,bullshit,damn,hell,numbskull,
dork,prick,weirdo,jackass,scumbag,P3nd3j0,Kk,Pu+0,M!erda,B@$t@rd0,C@bR0n,M0th3rf***3r,
F00l,Idi0+,@$$,Sh!t,Bu!!sh!t,Cr@ppy,1d10t,F**k,T@r@d0,B@st@rdo,H3ll,A$$h0l3,P3rr@,
S!lly,0je+e,Ch1ng@,F@k3,Lo$3r,F00lish,L@m3,Stup1d,1gn0rant,Scumb@g,D1ckh3@d,B***h,
P00r@,P@t3t1c,Cr4p,Inf3l1z,Huev0n,D!rty,Z@ngan0,Tra!d0r,S4rn0s0,B!z@rr0,R!d!cuL0,
P3razo,R3c3rdo,Cr1ppl3d,Lam3r,F***u,0v3rsh!t,Gr0$$3r,Fl@ker,Bu77sh!t,R@tchet,@ssh@t,
B!zzar3,Bum@$$,P@th3tic,Sc@rb@g,Ch1mp,1mb3c!l,Bu77f@c3,Ug1y4ss,T@rd,P3rd1d0,Cr!pp13,
M@lw@r3d,N00b,L@zy@$$,F@t@$$,Fr3@k,@ssh01e,Tr@$hb@g,Br@1nF@rt,Dump@$$,0v3rc0mp3ns@t3d,
H0tSh!t,P!ss3d@$$,D00f,Ch@v0,P3rra$$,@**w!p3,T@rd@$$,L@m3br@1n,M@1nm@n1@c,D0rk@$$,
H0rr1bl3,N4sty@$$,maldito,inservible,torpe,arrogante,grosero,sarcástico,necio,vulgar,
amargado,tonto,inculto,desleal,farsante,infame,traicionero,engreído,abusivo,cruel,
mezquino,asqueroso,desgraciado,despreciable,insoportable,hipócrita,falso,mentiroso,
exagerado,narcisista,pretencioso,absurdo,payaso,cobarde,rastrero,desalmado,vicioso,
repugnante,inmundicia,mediocre,incapaz,insensato,bruto,inadaptado,sobrado,repelente,
ladino,corrupto,egoísta,débil,incompetente,desordenado,irresponsable,caprichoso,bestia,
venenoso,dictador,abominable,insidioso,egocéntrico,imprudente,cretino,nefasto,inmaduro,
burlón,desvergonzado,bufón,traidor,loco,incoherente,grotesco,irrespetuoso,maleducado,
charlatán,infantil,pervertido,insatisfecho,odioso,desquiciado,iluso,calumniador,dañino,
injusto,ignorante,desagradable,infractor,mentecato,abusador,desatinado,extravagante,
petulante,paleto,soberbio,pésimo,corrompido,detestable,perdedor,gamberro,tumultuoso,
estrafalario,arisco,asocial,ególatra,atrabiliario,sádico,burro,desmadrado,impertinente,
cínico,maleducado,analfabeto,desconfiado,inútil,repelente,pesado,insaciable,traidor,
bribón,pendenciero,rata,malandrín,soez,usurero,patán,maledicente,malcriado,prostituto,
extorsionador,grosero,murmurador,pecador,despiadado
""".strip()


def preparar_texto(texto):
    mensaje_usuario = (
        f"{texto} Evalúa este mensaje y clasifícalo en una de las siguientes categorías: "
        "'relevante' (si está relacionado con el servicio del proveedor actual), "
        "'irrelevante' (si no está relacionado con el servicio del proveedor y debe tener una polaridad de 0), "
        f"o 'grosero' (si contiene lenguaje inapropiado como {PALABRAS_PROHIBIDAS} y debe tener una polaridad de -1). "
        "Si el mensaje es relevante, proporciona también la polaridad del sentimiento en una escala del 1 al 5 (1=Muy negativo, 5=Muy positivo). "
        "Ejemplos de texto irrelevante: '¿Cómo estás hoy?', 'Me gusta el clima'. "
        "Responde únicamente en un JSON con las claves 'categoria' y 'polaridad'. "
        "No des explicaciones ni detalles adicionales."
    )
    return mensaje_usuario
