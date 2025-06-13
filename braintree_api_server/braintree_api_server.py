from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

@app.route('/api/verify', methods=['POST'])
def verify():
    card = request.json.get('card')
    if not card:
        return jsonify({'status': 'error', 'message': 'No card provided'}), 400
    return jsonify({'status': 'success', 'message': f'Card {card} verified'}), 200

if __name__ == '__main__':
    print("Iniciando servidor Flask...")
    app.run(debug=False)