import json
import os
from datetime import datetime
from http.server import BaseHTTPRequestHandler

DATA_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'server', 'messages.json')

def load_messages():
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_messages(messages):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(messages, f, ensure_ascii=False, indent=2)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        messages = load_messages()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(messages, ensure_ascii=False).encode())

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        data = json.loads(body.decode())
        
        name = data.get('name', '').strip()
        text = data.get('text', '').strip()
        
        if not name or not text:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Name and text are required'}).encode())
            return
        
        messages = load_messages()
        now = datetime.now()
        message = {
            'id': int(now.timestamp() * 1000),
            'name': name,
            'text': text,
            'time': now.strftime('%Y/%m/%d %H:%M')
        }
        messages.insert(0, message)
        save_messages(messages)
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(message, ensure_ascii=False).encode())

    def log_message(self, format, *args):
        pass