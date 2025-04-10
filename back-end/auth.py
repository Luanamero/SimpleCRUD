from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, FastAPI, HTTPException, status, Cookie, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from database import get_db_cursor
from schemas import TokenData
from starlette.middleware.base import BaseHTTPMiddleware

# Configuration for JWT and password hashing
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"  # In production, use a secure key and store it in environment variables
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Password utilities
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# User authentication
def authenticate_user(email: str, password: str):
    with get_db_cursor() as cursor:
        cursor.execute(
            "SELECT * FROM cliente WHERE email = %s", 
            (email,)
        )
        user = cursor.fetchone()
        
        if not user:
            return False
            
        if not verify_password(password, user["senha"]):
            return False
            
        return user

# JWT token creation
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Get current user from token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=int(user_id))
    except JWTError:
        raise credentials_exception
        
    with get_db_cursor() as cursor:
        cursor.execute(
            "SELECT * FROM cliente WHERE id = %s",
            (token_data.user_id,)
        )
        user = cursor.fetchone()
        
        if user is None:
            raise credentials_exception
            
        return user

# Get current user from cookie
async def get_current_user_from_cookie(
    access_token: Optional[str] = Cookie(None, alias="access_token")
):
    if not access_token:
        return None
    
    try:
        # Extract token from "Bearer {token}"
        if access_token.startswith("Bearer "):
            token = access_token.replace("Bearer ", "")
        else:
            token = access_token
            
        # Decode the token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        token_data = TokenData(user_id=int(user_id))
    except JWTError:
        return None
    
    # Get user
    with get_db_cursor() as cursor:
        cursor.execute(
            "SELECT * FROM cliente WHERE id = %s",
            (token_data.user_id,)
        )
        user = cursor.fetchone()
        return user

# Authentication middleware
class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Paths that don't require authentication
        open_paths = ["/login", "/docs", "/openapi.json", "/redoc"]
        if any(request.url.path.startswith(path) for path in open_paths):
            return await call_next(request)
        
        # Check for GET methods (allow these without authentication)
        if request.method == "GET":
            return await call_next(request)
        
        # Get token from cookie
        access_token = request.cookies.get("access_token")
        if not access_token:
            return await call_next(request)  # No token, request will be handled by the API endpoint
        
        try:
            # Extract token from "Bearer {token}"
            if access_token.startswith("Bearer "):
                token = access_token.replace("Bearer ", "")
            else:
                token = access_token
                
            # Decode the token
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                return await call_next(request)  # Invalid token
                
            # Set user_id in request state
            request.state.user_id = int(user_id)
            
        except JWTError:
            pass  # Invalid token
            
        # Continue processing the request
        return await call_next(request)