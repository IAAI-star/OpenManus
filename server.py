import asyncio
import json
from typing import List, Optional

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Initialize FastAPI and Socket.IO
app = FastAPI()
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio, app)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/", StaticFiles(directory="dist", html=True), name="static")

# Store connected clients
connected_clients: List[str] = []

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    connected_clients.append(sid)
    await sio.emit('message', {'role': 'assistant', 'content': 'Connected to OpenManus UI'}, room=sid)

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    if sid in connected_clients:
        connected_clients.remove(sid)

@sio.event
async def message(sid, data):
    print(f"Received message from {sid}: {data}")
    # Echo back the message for now
    response = {
        'role': 'assistant',
        'content': f'Received your message: {data}'
    }
    await sio.emit('message', response, room=sid)

    # Send a sample plan update
    plan = {
        'id': '1',
        'title': 'Sample Plan',
        'steps': [
            {'text': 'First step', 'status': 'completed'},
            {'text': 'Current step', 'status': 'in_progress'},
            {'text': 'Next step', 'status': 'not_started'}
        ]
    }
    await sio.emit('plan_update', plan, room=sid)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=8000)