from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
import eventlet
eventlet.monkey_patch()
import json
import os
from html import escape

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", ping_timeout=60, ping_interval=25)

# In-memory storage
live_visitors_count = 0
viewers_per_room = {}
sid_to_room = {}

@app.route('/')
def home():
    return "Hello from the backend!"

@app.route('/video/<video_id>')
def video_seo(video_id):
    # Build absolute paths
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    videos_json_path = os.path.join(project_root, 'src', 'data', 'videos.json')
    index_html_path = os.path.join(project_root, 'public', 'index.html')

    try:
        with open(videos_json_path, 'r') as f:
            videos = json.load(f)
    except (IOError, json.JSONDecodeError):
        videos = []

    video = next((v for v in videos if v.get('id') == video_id), None)

    try:
        with open(index_html_path, 'r') as f:
            html_content = f.read()
    except IOError:
        return "Error: index.html not found", 500


    if video:
        # Replace meta tags
        title = escape(video.get('title', 'Suvojeet Sengupta - Official Website'))
        description = escape(video.get('description', 'The official website of Suvojeet Sengupta, a singer, performer, and composer. Explore his music, blog, and musical journey.'))
        if len(description) > 200:
            description = description[:197] + '...'
        
        # Dynamically generate thumbnail URL
        image_url = video.get('thumbnail')
        if not image_url and 'id' in video:
            image_url = f"https://i.ytimg.com/vi/{video['id']}/hqdefault.jpg"
        if not image_url:
            image_url = 'https://www.suvojeetsengupta.in/suvojeet.jpg'
        image = escape(image_url)

        url = f"https://www.suvojeetsengupta.in/video/{video_id}"

        # Regular meta description
        html_content = html_content.replace(
            'content="The official website of Suvojeet Sengupta, a singer, performer, and composer. Explore his music, blog, and musical journey."',
            f'content="{description}"'
        )

        # Open Graph
        html_content = html_content.replace(
            'property="og:title" content="Suvojeet Sengupta - Official Website"',
            f'property="og:title" content="{title}"'
        )
        html_content = html_content.replace(
            'property="og:image" content="https://www.suvojeetsengupta.in/suvojeet.jpg"',
            f'property="og:image" content="{image}"'
        )
        html_content = html_content.replace(
            'property="og:url" content="https://www.suvojeetsengupta.in/"',
            f'property="og:url" content="{url}"'
        )

        # Twitter Card
        html_content = html_content.replace(
            'name="twitter:title" content="Suvojeet Sengupta - Official Website"',
            f'name="twitter:title" content="{title}"'
        )
        html_content = html_content.replace(
            'name="twitter:image" content="https://www.suvojeetsengupta.in/suvojeet.jpg"',
            f'name="twitter:image" content="{image}"'
        )
        html_content = html_content.replace(
            'name="twitter:url" content="https://www.suvojeetsengupta.in/"',
            f'name="twitter:url" content="{url}"'
        )


    return html_content

# Existing comment endpoint - no changes needed here
@app.route('/api/comment', methods=['POST'])
def handle_comment():
    data = request.get_json()
    print("Received comment data:", data)
    return jsonify({'status': 'success', 'message': 'Comment received and will be processed.'})

# Socket.IO event handlers
@socketio.on('connect')
def handle_connect():
    global live_visitors_count
    live_visitors_count += 1
    emit('update_visitor_count', {'count': live_visitors_count}, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    global live_visitors_count
    live_visitors_count -= 1
    emit('update_visitor_count', {'count': live_visitors_count}, broadcast=True)

    if request.sid in sid_to_room:
        room = sid_to_room[request.sid]
        if room in viewers_per_room:
            viewers_per_room[room] -= 1
            if viewers_per_room[room] < 0:
                viewers_per_room[room] = 0
            emit('update_viewer_count', {'count': viewers_per_room.get(room, 0)}, to=room)
        del sid_to_room[request.sid]

@socketio.on('join_room')
def handle_join_room(data):
    room = data['room']
    join_room(room)
    sid_to_room[request.sid] = room
    
    if room not in viewers_per_room:
        viewers_per_room[room] = 0
    viewers_per_room[room] += 1
    
    # Broadcast the updated count to everyone in that room
    emit('update_viewer_count', {'count': viewers_per_room[room]}, to=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    room = data['room']
    leave_room(room)
    
    if request.sid in sid_to_room:
        del sid_to_room[request.sid]
        
    if room in viewers_per_room:
        viewers_per_room[room] -= 1
        if viewers_per_room[room] < 0:
            viewers_per_room[room] = 0
        
        # Broadcast the updated count to everyone in that room
        emit('update_viewer_count', {'count': viewers_per_room.get(room, 0)}, to=room)

@socketio.on('send_reaction')
def handle_send_reaction(data):
    room = data['room']
    emoji = data['emoji']
    # Broadcast the emoji to everyone in that room
    emit('new_reaction', {'emoji': emoji}, to=room)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5001)
