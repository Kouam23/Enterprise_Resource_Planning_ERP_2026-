
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    password = "password123"
    hashed = pwd_context.hash(password)
    print(f"Hashed: {hashed}")
    verified = pwd_context.verify(password, hashed)
    print(f"Verified: {verified}")
except Exception as e:
    print(f"Caught error: {e}")
    import traceback
    traceback.print_exc()
