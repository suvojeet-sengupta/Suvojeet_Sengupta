from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
import eventlet
eventlet.monkey_patch()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

# In-memory storage
live_visitors_count = 0
viewers_per_room = {}
sid_to_room = {}

@app.route('/')
def home():
    return "Hello from the backend!"

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