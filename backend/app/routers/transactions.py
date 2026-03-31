from datetime import datetime, timedelta, timezone

from fastapi import APIRouter

from app.schemas.schemas import TransactionOut

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("/{child_id}", response_model=list[TransactionOut])
def list_transactions(child_id: str):
    now = datetime.now(timezone.utc)

    # Mock δεδομένα (μπορείς αργότερα να τα αντικαταστήσεις με DB query)
    return [
        TransactionOut(
            id="1",
            child_id=child_id,
            title="Χαρτζιλίκι από Μπαμπά",
            amount=10.00,
            category="general",
            type="income",
            inserted_at=now.isoformat(),
        ),
        TransactionOut(
            id="2",
            child_id=child_id,
            title="Βιβλιοπωλείο",
            amount=4.50,
            category="shopping",
            type="expense",
            inserted_at=(now - timedelta(days=1)).isoformat(),
        ),
        TransactionOut(
            id="3",
            child_id=child_id,
            title="Κυλικείο Σχολείου",
            amount=2.00,
            category="food",
            type="expense",
            inserted_at=(now - timedelta(days=1)).isoformat(),
        ),
        TransactionOut(
            id="4",
            child_id=child_id,
            title="Roblox",
            amount=5.00,
            category="gaming",
            type="expense",
            inserted_at=(now - timedelta(days=3)).isoformat(),
        ),
        TransactionOut(
            id="5",
            child_id=child_id,
            title="Δώρο Γιαγιάς",
            amount=20.00,
            category="general",
            type="income",
            inserted_at=(now - timedelta(days=5)).isoformat(),
        ),
    ]
