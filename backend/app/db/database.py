from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from sqlalchemy.engine import Engine

from app.core.config import settings


def _create_engine() -> Engine:
    primary_url = settings.DATABASE_URL
    echo = settings.APP_ENV == "development"

    primary_engine = create_engine(
        primary_url,
        echo=echo,
        pool_pre_ping=True,
    )

    # Σε dev περιβάλλον, αν η remote DB δεν είναι προσβάσιμη (DNS/VPN/etc),
    # κάνουμε fallback σε τοπικό SQLite ώστε να μπορεί να τρέξει η εφαρμογή.
    if settings.APP_ENV != "development":
        return primary_engine

    try:
        with primary_engine.connect():
            pass
        return primary_engine
    except Exception:
        sqlite_url = "sqlite:///./dev.db"
        return create_engine(
            sqlite_url,
            echo=echo,
            pool_pre_ping=True,
            connect_args={"check_same_thread": False},
        )


engine = _create_engine()

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()