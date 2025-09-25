#!/usr/bin/env python3
"""
Spotify Token Generator
"""

import base64
import json
import os
import urllib.parse
import urllib.request
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import time

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("python-dotenv not found. Install with: pip install python-dotenv")
    print("Or make sure your .env variables are exported to the environment.")

CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')
REDIRECT_URI = "https://dvnl.work"

auth_code = None
server_running = True

class CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global auth_code, server_running
        
        if self.path.startswith('/callback'):
            parsed_url = urllib.parse.urlparse(self.path)
            query_params = urllib.parse.parse_qs(parsed_url.query)
            
            if 'code' in query_params:
                auth_code = query_params['code'][0]
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(b'''
                <html>
                <head><title>Authorization Successful</title></head>
                <body>
                    <h1>Authorization Successful!</h1>
                    <p>You can close this window and return to the terminal.</p>
                    <script>setTimeout(() => window.close(), 3000);</script>
                </body>
                </html>
                ''')
                server_running = False
            elif 'error' in query_params:
                error = query_params['error'][0]
                self.send_response(400)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(f'''
                <html>
                <head><title>Authorization Failed</title></head>
                <body>
                    <h1>Authorization Failed</h1>
                    <p>Error: {error}</p>
                    <p>Please try again.</p>
                </body>
                </html>
                '''.encode())
                server_running = False
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        pass

def get_authorization_code():
    global auth_code, server_running
    
    auth_params = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': REDIRECT_URI,
        'scope': SCOPE,
        'show_dialog': 'true'
    }
    
    auth_url = f"https://accounts.spotify.com/authorize?{urllib.parse.urlencode(auth_params)}"
    
    print(f"Opening Spotify authorization page...")
    print(f"If it doesn't open automatically, visit: {auth_url}")
    
    server = HTTPServer(('localhost', 8888), CallbackHandler)
    server_thread = threading.Thread(target=lambda: server.serve_forever())
    server_thread.daemon = True
    server_thread.start()
    
    webbrowser.open(auth_url)
    
    print("Waiting for authorization...")
    
    timeout = 120
    start_time = time.time()
    
    while server_running and auth_code is None:
        if time.time() - start_time > timeout:
            print("Timeout! Authorization took too long.")
            server.shutdown()
            return None
        time.sleep(0.5)
    
    server.shutdown()
    return auth_code

def exchange_code_for_tokens(code):
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI
    }
    
    credentials = f"{CLIENT_ID}:{CLIENT_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()
    
    headers = {
        'Authorization': f'Basic {encoded_credentials}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    data = urllib.parse.urlencode(token_data).encode()
    
    try:
        req = urllib.request.Request(
            'https://accounts.spotify.com/api/token',
            data=data,
            headers=headers
        )
        
        with urllib.request.urlopen(req) as response:
            token_response = json.loads(response.read().decode())
            return token_response
            
    except urllib.error.HTTPError as e:
        error_response = json.loads(e.read().decode())
        print(f"Token exchange failed: {error_response.get('error_description', 'Unknown error')}")
        return None
    except Exception as e:
        print(f"Token exchange failed: {str(e)}")
        return None

def test_token(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        req = urllib.request.Request(
            'https://api.spotify.com/v1/me',
            headers=headers
        )
        
        with urllib.request.urlopen(req) as response:
            user_data = json.loads(response.read().decode())
            return user_data.get('display_name', 'Unknown User')
            
    except Exception as e:
        print(f"Token test failed: {str(e)}")
        return None

def exchange_authorization_code(auth_code):
    token_data = {
        'grant_type': 'authorization_code',
        'code': auth_code,
        'redirect_uri': REDIRECT_URI
    }
    
    credentials = f"{CLIENT_ID}:{CLIENT_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode()).decode()
    
    headers = {
        'Authorization': f'Basic {encoded_credentials}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    data = urllib.parse.urlencode(token_data).encode()
    
    try:
        req = urllib.request.Request(
            'https://accounts.spotify.com/api/token',
            data=data,
            headers=headers
        )
        
        with urllib.request.urlopen(req) as response:
            token_response = json.loads(response.read().decode())
            return token_response
            
    except urllib.error.HTTPError as e:
        error_response = json.loads(e.read().decode())
        print(f"Token exchange failed: {error_response.get('error_description', 'Unknown error')}")
        return None
    except Exception as e:
        print(f"Token exchange failed: {str(e)}")
        return None

def main():
    if not CLIENT_ID or not CLIENT_SECRET:
        print("Client ID and Client Secret not found in .env file")
        print("Make sure your .env file contains:")
        print("SPOTIFY_CLIENT_ID=your_client_id")
        print("SPOTIFY_CLIENT_SECRET=your_client_secret")
        return
    
    auth_url = f"https://accounts.spotify.com/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri={urllib.parse.quote(REDIRECT_URI)}&scope=user-read-currently-playing%20user-read-playback-state&show_dialog=true"
    print(f"Visit this URL: {auth_url}")
    
    authorization_code = input("Paste authorization code: ").strip()
    
    if not authorization_code:
        print("Authorization code is required!")
        return
    
    token_response = exchange_authorization_code(authorization_code)
    
    if not token_response:
        print("Failed to exchange authorization code for tokens.")
        return
    
    access_token = token_response.get('access_token')
    refresh_token = token_response.get('refresh_token')
    
    if not access_token or not refresh_token:
        print("Invalid token response - missing access_token or refresh_token.")
        return
    
    username = test_token(access_token)
    if username:
        print(f"Token test successful: {username}")
    
    try:
        env_path = '../.env'
        
        env_content = []
        if os.path.exists(env_path):
            with open(env_path, 'r') as f:
                env_content = f.readlines()
        
        refresh_token_exists = False
        for i, line in enumerate(env_content):
            if line.strip().startswith('SPOTIFY_REFRESH_TOKEN='):
                env_content[i] = f"SPOTIFY_REFRESH_TOKEN={refresh_token}\n"
                refresh_token_exists = True
                break
        
        if not refresh_token_exists:
            env_content.append(f"SPOTIFY_REFRESH_TOKEN={refresh_token}\n")
        
        with open(env_path, 'w') as f:
            f.writelines(env_content)
        
        print("Updated .env file with refresh token.")
        
    except Exception as e:
        print(f"Couldn't update .env file: {e}")
        print(f"Manually add: SPOTIFY_REFRESH_TOKEN={refresh_token}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nInterrupted by user. Goodbye!")
    except Exception as e:
        print(f"\nUnexpected error: {e}")
        print("Please try again or check your Spotify app configuration.")