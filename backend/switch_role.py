
import asyncio
import sys
from sqlalchemy import select, update
from app.db.session import AsyncSessionLocal
from app.models.user import User
from app.models.role import Role

async def setup_test_users():
    async with AsyncSessionLocal() as db:
        # Get all roles for mapping
        role_result = await db.execute(select(Role))
        roles = role_result.scalars().all()
        role_map = {r.name: r.id for r in roles}
        
        print("\n--- Available Roles ---")
        for name, rid in role_map.items():
            print(f"{rid}: {name}")
            
        # Get current users
        user_result = await db.execute(select(User))
        users = user_result.scalars().all()
        
        if not users:
            print("No users found in database. Please register first.")
            return

        print("\n--- Current Users ---")
        for idx, u in enumerate(users):
            current_role = next((r.name for r in roles if r.id == u.role_id), "Unknown")
            print(f"{idx}: {u.email} (Current Role: {current_role})")

        user_idx = input("\nSelect User index to modify (or 'q' to quit): ")
        if user_idx.lower() == 'q': return
        
        role_id = input("Enter new Role ID for this user: ")
        
        selected_user = users[int(user_idx)]
        selected_role_id = int(role_id)
        
        await db.execute(
            update(User)
            .where(User.id == selected_user.id)
            .values(role_id=selected_role_id)
        )
        await db.commit()
        
        new_role_name = next((r.name for r in roles if r.id == selected_role_id), "Unknown")
        print(f"\nSUCCESS: User {selected_user.email} is now a {new_role_name}!")
        print("Please log out and log back in on the frontend to see changes.")

if __name__ == "__main__":
    asyncio.run(setup_test_users())
