from app.core.auth import get_password_hash

password = "demo1234"
hashed = get_password_hash(password)

print("Plain password:", password)
print("Hashed password:", hashed)