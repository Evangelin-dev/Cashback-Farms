from twilio.rest import Client
from django.conf import settings

def send_whatsapp_message(to_number: str, message: str):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    
    from_whatsapp_number = f"whatsapp:{settings.TWILIO_FROM_NUMBER}"
    to_whatsapp_number = f"whatsapp:{to_number}"

    try:
        message = client.messages.create(
            body=message,
            from_=from_whatsapp_number,
            to=to_whatsapp_number
        )
        return message.sid
    except Exception as e:
        print("Twilio WhatsApp error:", e)
        return None


# TWILIO = {
#     'ACCOUNT_SID': os.getenv('TWILIO_ACCOUNT_SID'),
#     'AUTH_TOKEN': os.getenv('TWILIO_AUTH_TOKEN'),
#     'FROM_NUMBER': os.getenv('TWILIO_FROM_NUMBER'),
# }
