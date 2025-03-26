from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Database URL (replace with your PostgreSQL connection string)
DATABASE_URL = "postgresql://postgres:mZBjOkplBsJjNleAUqAbbeMXkeDzrcso@mainline.proxy.rlwy.net:46512/railway"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()