from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# API Key ve Gemini URL ayarları
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyB3PrvUYsD_3nbmsSr8cb4s3Vm5oqGJd7k")  # Burada kendi API anahtarınızı kullanın
genai.configure(api_key=GEMINI_API_KEY)

# Gemini 1.5 Pro Model URL
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key={GEMINI_API_KEY}"

# Generation config
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

@app.route('/')
def home():
    return "Flask çalışıyor! Gemini Chat için /chat rotasını kullanın (POST isteği)."

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'success'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response

    try:
        # 'contents' içinde kullanıcı mesajını alın
        user_message = request.json.get("contents", [{}])[0].get("parts", [{}])[0].get("text", "")
        
        if not user_message:
            return jsonify({"reply": "Mesaj boş olamaz."}), 400
        
        # Dinamik System Instruction: Örneğin, kullanıcı mesajına göre değişebilir.
        system_instruction = f"Kullanıcının belirttiği semptomlar doğrultusunda '{user_message}', yalnızca sağlık alanında yanıt ver. Semptomlarla ilişkili olası hastalıkları tahmin et, belirtileri azaltmak için önerilerde bulun ve hangi polikliniğe başvurulması gerektiğini belirt. Eğer mümkünse, reçetesiz satılan ilaçlar veya destekleyici tedaviler hakkında öneriler yap ancak kesinlikle ilaç isimlerini verirken 'Bu sadece belirtilerinizi hafifletmeniz için söylenen bir öneridir, ilacı kullanmadan önce doktor onayı almanızı öneririm.' şeklinde uyarıda bulun. Cevaplarının sonunda mutlaka şunu ekle: 'Bu sadece Lokman'ın tahminidir. Kesin bir teşhis için doktora görünmelisiniz.'"

        # Model oluşturma
        model = genai.GenerativeModel(
            model_name="gemini-1.5-pro",
            generation_config=generation_config,
            system_instruction=system_instruction
        )

        # Chat oturumu başlat
        chat_session = model.start_chat(history=[])
        response = chat_session.send_message(user_message)

        # Yanıtı JSON formatında dön
        return jsonify({"reply": response.text})

    except Exception as e:
        return jsonify({"reply": f"Genel hata: {str(e)}"}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
