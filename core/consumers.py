# core/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import asyncio
import psutil
from datetime import datetime

class MetricsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("HOLY SHIT, SOMEONE'S TRYING TO CONNECT!")
        print(f"🔍 Connection ID: {id(self)}")  #
        await self.accept()
        print("CONNECTION FUCKING ACCEPTED!")
        asyncio.create_task(self.send_metrics())
    async def send_metrics(self):
        print(f"📊 Starting metrics stream for connection {id(self)}")
        try:
            while True:
                metrics = {
                    "type": "metrics_update",
                    "data": {
                        "cpu": psutil.cpu_percent(interval=1),
                        "memory": psutil.virtual_memory().percent,
                        "disk": psutil.disk_usage('/').percent,
                        "timestamp": str(datetime.now()),
                        "connection_id": id(self)  # Track which connection sent what
                    }
                }
                print(f"📡 Sending metrics: {metrics}")
                await self.send(text_data=json.dumps(metrics))
                await asyncio.sleep(1)  # Wait a second between updates
        except Exception as e:
            print(f"💥 METRICS STREAM FUCKED UP: {str(e)}")

    async def disconnect(self, close_code):
        print(f"💔 Connection {id(self)} fucked off with code: {close_code}")
        pass

    async def receive(self, text_data):
        print(f"GOT SOME FUCKING DATA: {text_data}")
        try:
            await self.send(text_data=json.dumps({
                "type": "metrics_update",
                "data": "Your metrics here, you magnificent bastard"
            }))
        except Exception as e:
            print(f"SHIT BROKE: {str(e)}")