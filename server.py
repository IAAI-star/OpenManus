from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
import uvicorn

app = FastAPI()

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

# Store connected websockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        await websocket.send_json({
            'role': 'assistant',
            'content': 'Connected to OpenManus UI'
        })

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo back the message
            response = {
                'role': 'assistant',
                'content': f'Received your message: {data}'
            }
            await websocket.send_json(response)

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
            await websocket.send_json({'type': 'plan_update', 'data': plan})
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")