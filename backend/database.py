import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from config import Config
from models import Base

logger = logging.getLogger(__name__)

def init_database():
    """Initialize database: create DB if not exists, create tables, return engine and session factory"""
    try:
        # First, connect to master DB to check if database exists
        logger.info("Connecting to MySQL server...")
        master_engine = create_engine(Config.SQLALCHEMY_MASTER_URI, echo=False)
        
        with master_engine.connect() as connection:
            connection.autocommit = True
            
            # Check if database exists
            result = connection.execute(
                text(f"SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{Config.MYSQL_DB}'")
            )
            db_exists = result.scalar() is not None
            
            if not db_exists:
                logger.info(f"Database '{Config.MYSQL_DB}' not found. Creating...")
                connection.execute(text(f"CREATE DATABASE {Config.MYSQL_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
                logger.info(f"Database '{Config.MYSQL_DB}' created successfully.")
            else:
                logger.info(f"Database '{Config.MYSQL_DB}' already exists.")
        
        master_engine.dispose()
        
        # Now connect to the actual database and create tables
        logger.info(f"Connecting to {Config.MYSQL_DB} database...")
        app_engine = create_engine(Config.SQLALCHEMY_DATABASE_URI, echo=False)
        
        # Create all tables
        logger.info("Creating database tables...")
        Base.metadata.create_all(app_engine)
        logger.info("Database tables created successfully.")
        
        # Create session factory
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=app_engine)
        
        return app_engine, SessionLocal
        
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        raise

def get_db_session(SessionLocal):
    """Dependency to get DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
