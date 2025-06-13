from flask import Flask, request, jsonify
from flask_cors import CORS
import braintree
import requests

app = Flask(__name__)
CORS(app)  # Habilita CORS para peticiones externas (Vercel)

# Configuración Braintree Sandbox
braintree.Configuration.configure(
    braintree.Environment.Sandbox,
    merchant_id="qc9v4mbp5v83kz2b",
    public_key="nbg9gxhxwyvfr7mb",
    private_key="882b9e6e8cd58fb1e9d4f5d727f1f5c4"
)

@app.route('/check', methods=['POST'])
def check_card():
    data = request.json
    card_number = data.get('number')
    exp_month = data.get('month')
    exp_year = data.get('year')
    cvv = data.get('cvv')

    try:
        customer_result = braintree.Customer.create({"first_name": "IZAN"})
        if not customer_result.is_success:
            return jsonify(status="UNKNOWN", message="No se pudo crear cliente")

        result = braintree.Transaction.sale({
            "amount": "1.00",
            "customer_id": customer_result.customer.id,
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

        if result.is_success:
            return jsonify(status="LIVE", message="Tarjeta válida")
        else:
            return jsonify(status="DIE", message=result.message)

    except Exception as e:
        return jsonify(status="UNKNOWN", message=str(e)), 500

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

if __name__ == "__main__":
    app.run()
