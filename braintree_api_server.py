from flask import Flask, request, jsonify, send_from_directory
import braintree
import requests

app = Flask(__name__)

# Configuración de Braintree Sandbox
braintree.Configuration.configure(
    braintree.Environment.Sandbox,
    merchant_id="qc9v4mbp5v83kz2b",
    public_key="nbg9gxhxwyvfr7mb",
    private_key="882b9e6e8cd58fb1e9d4f5d727f1f5c4"
)

# Ruta para verificar tarjetas (checker)
@app.route('/check', methods=['POST'])
def check_card():
    data = request.json
    card_number = data.get('number')
    exp_month = data.get('month')
    exp_year = data.get('year')
    cvv = data.get('cvv')

    try:
        # Log de depuración
        print(f"Verificando tarjeta: {card_number}, {exp_month}/{exp_year}, CVV: {cvv}")

        # Crear cliente en Braintree
        customer_result = braintree.Customer.create({"first_name": "Test"})
        if not customer_result.is_success:
            print(f"Error creando cliente: {customer_result.message}")
            return jsonify(status="UNKNOWN", message="No se pudo crear cliente")

        customer_id = customer_result.customer.id

        # Crear la transacción para verificar la tarjeta
        result = braintree.Transaction.sale({
            "amount": "1.00",
            "customer_id": customer_id,
            "credit_card": {
                "number": card_number,
                "expiration_month": exp_month,
                "expiration_year": exp_year,
                "cvv": cvv
            },
            "options": {
                "submit_for_settlement": False,
                "verify_card": True
            }
        })

        # Si la transacción es exitosa
        if result.is_success:
            print(f"Transacción exitosa: {result.transaction.id}")
            return jsonify(status="LIVE", message="Tarjeta válida")
        else:
            print(f"Error en la transacción: {result.message}")
            return jsonify(status="DIE", message=result.message)

    except Exception as e:
        print(f"Error en el servidor: {str(e)}")  # Log de error
        return jsonify(status="UNKNOWN", message=str(e)), 500

# Ruta para obtener info del BIN
@app.route('/bininfo', methods=['GET'])
def bininfo():
    bin_number = request.args.get('bin')
    if not bin_number or len(bin_number) < 6:
        return jsonify(error="BIN inválido"), 400

    try:
        response = requests.get(f'https://lookup.binlist.net/{bin_number}')
        if response.status_code != 200:
            return jsonify(error="BIN no encontrado"), 404
        return jsonify(response.json())
    except Exception as e:
        return jsonify(error=str(e)), 500

# Servir index.html y archivos estáticos
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

# Lanzar servidor Flask
if __name__ == "__main__":
    app.run(debug=True)
