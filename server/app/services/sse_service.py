import asyncio
import json
from typing import Dict, List, Set

class SSEBroadcaster:
    def __init__(self):
        # lot_id -> list of asyncio.Queue
        self._subscriptions: Dict[str, Set[asyncio.Queue]] = {}

    def subscribe(self, lot_id: str) -> asyncio.Queue:
        queue: asyncio.Queue = asyncio.Queue()
        if lot_id not in self._subscriptions:
            self._subscriptions[lot_id] = set()
        self._subscriptions[lot_id].add(queue)
        return queue

    def unsubscribe(self, lot_id: str, queue: asyncio.Queue):
        if lot_id in self._subscriptions:
            self._subscriptions[lot_id].discard(queue)
            if not self._subscriptions[lot_id]:
                del self._subscriptions[lot_id]

    async def broadcast_event(self, lot_id: str, event_data: dict):
        if lot_id in self._subscriptions:
            payload = json.dumps(event_data)
            for q in list(self._subscriptions[lot_id]):
                await q.put(payload)

sse_broadcaster = SSEBroadcaster()
