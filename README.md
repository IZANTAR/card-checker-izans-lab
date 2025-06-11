# 💳 Verificador de Tarjetas - Braintree y Consulta de BIN  
Script en Python para la verificación de tarjetas de crédito mediante integración con el sistema de donaciones de Braintree. También proporciona detalles completos del BIN (Número de Identificación Bancaria) usando scraping desde [bincheck.io](https://bincheck.io).

---

## 🌐 Verificador Web  
Si lo prefieres, puedes usar la versión web del verificador:  
🔗 **[https://checker-card.vercel.app/](https://checker-card.vercel.app/)**

---

## ⚙️ Características  
- ✅ Validación de tarjetas utilizando un endpoint de pago real.  
- 🔍 Consulta de información del BIN: banco emisor, país, tipo de tarjeta y mucho más.  
- 📄 Lectura masiva de tarjetas desde archivo `.txt`.  
- ⏱️ Retraso configurable entre pruebas para evitar bloqueos.  
- 📌 No se utiliza proxy.

---

## 📦 Instalación  
```bash
git clone https://github.com/IZANTAR/card-checker-izans-lab.git
cd card-checker
pip install -r requirements.txt
```

---

## ▶️ Cómo Usar  
Formato de tarjeta en el archivo `list.txt`:
```
6011014595997500|02|2027|720
```

Ejecución:
```bash
python checker.py list.txt [delay_in_seconds]
```

Ejemplo:
```bash
python checker.py list.txt 5
```

---

## 📊 Ejemplo de Salida  
```bash
> BIN/IIN: 601101
> Marca de Tarjeta: Discover
> Tipo de Tarjeta: Crédito
> Nivel de Tarjeta: Platinum
> Nombre del Emisor / Banco: NOVUS BANK
> País ISO: Estados Unidos
[✓] ¡Aprobada!
```

---

## 🛑 Aviso Legal  
Este proyecto es estrictamente **educativo**. El uso indebido de esta herramienta para probar tarjetas de terceros sin autorización es ilegal y va en contra de los Términos de Uso de la mayoría de las APIs involucradas. El autor no se hace responsable del uso indebido.

---

## ✨ Autor  
- Creado por ®️ 𝙄𝙕𝘼𝙉'𝙎 𝙇𝘼𝘽 ®️  
- Grupo Telegram: 💳 ESCUELA BINS Y CCS SOLO AMIGOS 💸  
- Año 2025®️®️
