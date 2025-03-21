from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# AnythingLLM API URL ve anahtar DÜZELTİLEN
ANYTHINGLLM_API_URL = "https://5gu2w6v6.rpcl.host/api/v1/workspace/lokman/chat"
API_KEY = "NMKH7EQ-5GD4R3Z-G6CVWRH-8ZPE22V"

@app.route('/')
def home():
    return "Flask çalışıyor! Chat için /chat rotasını kullanın (POST isteği)."

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    #EKLEDİĞİM YER
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'success'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
        

    try:
        user_message = request.json.get("message")
        if not user_message:
            return jsonify({"reply": "Mesaj boş olamaz."}), 400

        # AnythingLLM'ye istek gönder
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }

        payload = {
            "message": user_message,
            "mode": "chat",  # "chat" ya da "query" olarak değiştirebilirsiniz
        }
        
        response = requests.post(ANYTHINGLLM_API_URL, json={"message": user_message}, headers=headers, timeout=10)
        response.raise_for_status()
        
        llm_response = response.json()
        print(f"AnythingLLM yanıtı: {llm_response}")
        reply = llm_response.get("textResponse", "Yanıt alınamadı.")
        return jsonify({"reply": reply})
    
    except requests.exceptions.RequestException as e:
        error_msg = f"AnythingLLM hatası: {str(e)}"
        print(error_msg)
        return jsonify({"reply": error_msg}), 500
    except Exception as e:
        error_msg = f"Genel hata: {str(e)}"
        print(error_msg)
        return jsonify({"reply": error_msg}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)



