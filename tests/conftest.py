import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))
os.environ["ADMIN_API_KEY"] = "test-key"
os.environ["CONTACT_RATE_LIMIT"] = "3"

import pytest
from fastapi.testclient import TestClient
from mongomock_motor import AsyncMongoMockClient

import server


@pytest.fixture()
def client():
    server._contact_hits.clear()
    app = server.create_app(db=AsyncMongoMockClient()["test_db"])
    with TestClient(app) as c:  # runs lifespan -> auto-seed
        yield c


@pytest.fixture()
def admin():
    return {"X-Admin-Key": "test-key"}
