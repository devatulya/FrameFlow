from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import tempfile
import base64

# Add python engine directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'python'))
from generator import PPTGenerator

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))

            with tempfile.NamedTemporaryFile(suffix='.pptx', delete=False) as tmp:
                out_pptx_path = tmp.name

            generator = PPTGenerator()
            generator.generate(data, out_pptx_path)

            with open(out_pptx_path, 'rb') as f:
                pptx_bytes = f.read()

            try:
                os.remove(out_pptx_path)
            except Exception:
                pass

            response_data = {
                "success": True,
                "pptx_base64": base64.b64encode(pptx_bytes).decode('utf-8')
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"status": "FrameFlow Python PPT Engine Active"}).encode('utf-8'))
