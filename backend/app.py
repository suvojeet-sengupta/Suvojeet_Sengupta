# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # This will allow the frontend to make requests to the backend

@app.route('/')
def home():
    return "Hello from the backend!"

@app.route('/api/comment', methods=['POST'])
def handle_comment():
    data = request.get_json()
    
    # We will add the logic to post to YouTube here
    # For now, let's just print the data we receive
    print("Received comment data:", data)
    
    # TODO: Use the access token to post a comment to YouTube
    
    return jsonify({'status': 'success', 'message': 'Comment received and will be processed.'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
