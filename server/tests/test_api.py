"""
Kabadiwala Connect - Integration Test Suite
Smart India Hackathon 2026 | Problem Statement 26229
"""

import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] in ("healthy", "HEALTHY")
        assert "Kabadiwala Connect" in data["service"]

@pytest.mark.asyncio
async def test_price_board_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/prices")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 7
        categories = [p["category"] for p in data]
        assert "PCB" in categories
        assert "BATTERIES" in categories
        assert "CABLES" in categories

@pytest.mark.asyncio
async def test_collector_login_and_create_lot():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Collector Login
        col_resp = await ac.post("/api/v1/auth/collector/login", json={
            "phone": "9876543210",
            "name": "Ramesh Kumar"
        })
        assert col_resp.status_code == 200
        col_data = col_resp.json()
        assert "access_token" in col_data
        token = col_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Create Scrap Lot
        lot_resp = await ac.post("/api/v1/lots", json={
            "client_uuid": "test-uuid-lot-001",
            "category": "PCB",
            "weight_kg": 8.5,
            "condition": "GOOD",
            "latitude": 28.6139,
            "longitude": 77.2090
        }, headers=headers)

        assert lot_resp.status_code == 200
        lot_data = lot_resp.json()
        assert lot_data["category"] == "PCB"
        assert lot_data["estimated_payout"] > 0
        assert "qr_token" in lot_data
        assert "fallback_code" in lot_data

@pytest.mark.asyncio
async def test_ml_anomaly_evaluation():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Normal lot
        resp_normal = await ac.post("/api/v1/ml/evaluate-anomaly", json={
            "category": "PCB",
            "condition": "GOOD",
            "weight_kg": 8.5,
            "unit_price": 280.0
        })
        assert resp_normal.status_code == 200
        data_normal = resp_normal.json()
        assert data_normal["is_flagged"] is False

        # Anomalous lot with absurdly high price
        resp_anomaly = await ac.post("/api/v1/ml/evaluate-anomaly", json={
            "category": "MIXED_PLASTICS",
            "condition": "BURNT",
            "weight_kg": 1500.0,
            "unit_price": 9999.0
        })
        assert resp_anomaly.status_code == 200
        data_anomaly = resp_anomaly.json()
        assert data_anomaly["is_flagged"] is True
        assert len(data_anomaly["violations"]) > 0

@pytest.mark.asyncio
async def test_recycler_login_and_handover_verification():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Collector creates a lot
        col_resp = await ac.post("/api/v1/auth/collector/login", json={
            "phone": "9876543210",
            "name": "Ramesh Kumar"
        })
        assert col_resp.status_code == 200
        col_token = col_resp.json()["access_token"]

        lot_resp = await ac.post("/api/v1/lots", json={
            "client_uuid": "test-uuid-lot-002",
            "category": "BATTERIES",
            "weight_kg": 14.0,
            "condition": "GOOD"
        }, headers={"Authorization": f"Bearer {col_token}"})

        assert lot_resp.status_code == 200
        lot = lot_resp.json()

        # 2. Recycler login
        rec_login = await ac.post("/api/v1/auth/recycler/login", json={
            "email": "delhi@ecorecycle.in",
            "password": "demo"
        })
        assert rec_login.status_code == 200
        rec_token = rec_login.json()["access_token"]
        rec_headers = {"Authorization": f"Bearer {rec_token}"}

        # 3. Recycler verifies handover
        verify_resp = await ac.post("/api/v1/handovers/verify", json={
            "qr_token": lot["qr_token"],
            "fallback_code": lot["fallback_code"],
            "actual_weight_kg": 14.0,
            "actual_condition": "GOOD",
            "notes": "Verified at Mayapuri Weighbridge station #1"
        }, headers=rec_headers)

        assert verify_resp.status_code == 200
        v_data = verify_resp.json()
        assert v_data["status"] == "COMPLETED"
        assert v_data["total_payout"] > 0
