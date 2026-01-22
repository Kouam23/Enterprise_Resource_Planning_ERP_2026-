from app.core.security import verify_password

h = '$2b$12$8FHDBFB6zAuhAwmdZwwXk..SSdT2FHBjGYVA1dgyj6r5Thioby4YO'
print(f"Matches 'password123': {verify_password('password123', h)}")
print(f"Matches 'Staff123!':   {verify_password('Staff123!', h)}")
