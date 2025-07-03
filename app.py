from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Aktifkan CORS global

# Konfigurasi dari .env
NYANDRIVE_UPLOAD_URL = 'https://drive.nyanhosting.id/api/v1/file-entries'
NYANDRIVE_TOKEN = os.getenv('NYANDRIVE_TOKEN')

# Validasi token
if not NYANDRIVE_TOKEN:
    raise RuntimeError("Token NYANDRIVE_TOKEN belum diset di file .env")

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'File tidak ditemukan dalam form data'}), 400

    file = request.files['file']

    try:
        response = requests.post(
            NYANDRIVE_UPLOAD_URL,
            headers={
                'Authorization': f'Bearer {NYANDRIVE_TOKEN}'
            },
            files={'file': (file.filename, file.stream, file.mimetype)}
        )

        response.raise_for_status()

        data = response.json()
        entry_id = data['fileEntry']['id']

        # Ambil base URL dari request saat ini
        base_url = request.host_url.rstrip('/')
        custom_url = f'{base_url}/image/{entry_id}'

        return jsonify({
            'status': 'success',
            'custom_url': custom_url
        })

    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Gagal mengunggah file', 'detail': str(e)}), 500

@app.route('/image/<int:entry_id>', methods=['GET'])
def proxy_image(entry_id):
    target_url = f'https://drive.nyanhosting.id/api/v1/file-entries/{entry_id}'

    try:
        resp = requests.get(
            target_url,
            headers={'Authorization': f'Bearer {NYANDRIVE_TOKEN}'},
            stream=True
        )

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(k, v) for k, v in resp.raw.headers.items() if k.lower() not in excluded_headers]

        return Response(resp.content, resp.status_code, headers)

    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Gagal memuat file dari Nyandrive', 'detail': str(e)}), 502

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005, debug=True)
