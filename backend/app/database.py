import os

from motor.motor_asyncio import AsyncIOMotorClient

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
MONGODB_DB = os.getenv("MONGODB_DB", "idea_validator")

_client = AsyncIOMotorClient(MONGODB_URI)
_db = _client[MONGODB_DB]


def get_db():
    return _db
