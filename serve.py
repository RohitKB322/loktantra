import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and disable aggressive caching for local dev
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def translate_path(self, path):
        # Clean accidental markdown trailing characters like ) or * or >
        cleaned_path = path.rstrip(')*> \t')
        return super().translate_path(cleaned_path)

    def log_message(self, format, *args):
        # Suppress noise or WinError 10053 abort spam
        sys.stderr.write("%s - - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format%args))

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        url = f"http://localhost:{PORT}/"
        print("=" * 60)
        print(f" Loktantra: The Indian Election Simulator")
        print(f" Server running at: {url}")
        print(f" Press Ctrl+C in terminal to stop.")
        print("=" * 60)
        
        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    run_server()
