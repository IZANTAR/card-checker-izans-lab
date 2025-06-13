
import os
import braintree
from dotenv import load_dotenv

# Cargar variables del entorno desde el archivo .env
load_dotenv()

# Configurar Braintree
gateway = braintree.BraintreeGateway(
    braintree.Configuration(
        environment=getattr(braintree.Environment, os.getenv("BT_ENVIRONMENT", "Sandbox").capitalize()),
        merchant_id=os.getenv("BT_MERCHANT_ID"),
        public_key=os.getenv("BT_PUBLIC_KEY"),
        private_key=os.getenv("BT_PRIVATE_KEY")
    )
)

def verify_card(card_number, exp_month, exp_year, cvv):
    try:
        result = gateway.payment_method.create({
            "customer_id": "test_user",
            "payment_method_nonce": "fake-valid-nonce",  # Esto es simulado, cambiar si se usa un tokenizador real
            "credit_card": {
                "number": card_number,
                "expiration_month": exp_month,
                "expiration_year": exp_year,
                "cvv": cvv,
                "options": {
                    "verify_card": True
                }
            }
        })
        
        if result.is_success:
            return {
                "status": "LIVE",
                "message": "Tarjeta válida - verificada con éxito",
                "response": result.payment_method.token
            }
        else:
            return {
                "status": "DIE",
                "message": result.message,
                "response": None
            }
    except Exception as e:
        return {
            "status": "ERROR",
            "message": str(e),
            "response": None
        }

# Prueba directa (opcional)
if __name__ == "__main__":
    test = verify_card("4111111111111111", "12", "2026", "123")
    print(test)
