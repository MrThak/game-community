import os
import shutil

target_dir = r"f:\my-game-community\app\games\[gameId]"
trash_dir = r"f:\my-game-community\app\games\_trash_gameId"

if os.path.exists(target_dir):
    try:
        print(f"Renaming {target_dir} to {trash_dir}")
        os.rename(target_dir, trash_dir)
        print("Rename successful")
    except Exception as e:
        print(f"Rename failed: {e}")

    if os.path.exists(trash_dir):
        try:
            print(f"Deleting {trash_dir}")
            shutil.rmtree(trash_dir)
            print("Deletion successful")
        except Exception as e:
            print(f"Deletion failed: {e}")
else:
    print("Target directory not found")
