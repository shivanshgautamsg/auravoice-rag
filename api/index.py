import os
import sys

# Add api directory to sys.path so 'app' package is found directly
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from app.main import app

# Export handler for Vercel
app = app
