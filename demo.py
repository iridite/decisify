#!/usr/bin/env python3
"""
Decisify Demo Launcher
Quick start script for hackathon judges and reviewers
"""

import subprocess
import sys
import time
import webbrowser
from pathlib import Path


def print_banner():
    print("""
╔═══════════════════════════════════════════��═══════════════╗
║              DECISIFY - DEMO MODE                         ║
║      AI Decision Engine with Full Transparency            ║
╚═══════════════════════════════════════════════════════════╝
    """)

def check_port(port):
    """Check if a port is already in use"""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def main():
    print_banner()
    print("🚀 Starting Decisify in demo mode...\n")

    processes = []

    # Detect virtual environment
    venv_python = Path(__file__).parent / ".venv" / "bin" / "python"
    python_cmd = str(venv_python) if venv_python.exists() else sys.executable

    if venv_python.exists():
        print(f"✅ Using virtual environment: {venv_python}")
    else:
        print(f"⚠️  No .venv found, using system Python: {sys.executable}")

    try:
        # Start Dashboard
        if check_port(5173):
            print("✅ Dashboard already running on port 5173")
        else:
            print("📊 Starting Dashboard (Frontend)...")
            dashboard_dir = Path(__file__).parent / "dashboard"
            dashboard_proc = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=dashboard_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            processes.append(("Dashboard", dashboard_proc))
            print(f"   Dashboard PID: {dashboard_proc.pid}")
            time.sleep(2)

        # Start Backend
        if check_port(8000):
            print("✅ Backend already running on port 8000")
        else:
            print("🧠 Starting Decision Engine (Backend)...")
            backend_proc = subprocess.Popen(
                [python_cmd, "main.py", "--demo"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            processes.append(("Backend", backend_proc))
            print(f"   Backend PID: {backend_proc.pid}")
            time.sleep(3)

        print("\n" + "=" * 60)
        print("✨ Decisify is now running in DEMO MODE!")
        print("=" * 60)
        print("\n📍 Access Points:")
        print("   🌐 Dashboard:  http://localhost:5173/decisify/")
        print("   🔌 API:        http://localhost:8000")
        print("   📊 Metrics:    http://localhost:8000/metrics")
        print("\n🎯 What to Watch:")
        print("   • Real-time decision loop (5-second cycles)")
        print("   • AI reasoning explanations in natural language")
        print("   • Multi-source signal triangulation")
        print("   • Rust vs Python performance comparison")
        print("   • Safety gate interventions")
        print("\n⏹️  Press Ctrl+C to stop all services")
        print("=" * 60 + "\n")

        # Auto-open browser
        dashboard_url = "http://localhost:5173/decisify/"
        print(f"🌐 Opening dashboard: {dashboard_url}")
        try:
            webbrowser.open(dashboard_url)
        except Exception as e:
            print(f"⚠️  Could not auto-open browser: {e}")
            print(f"   Please manually open: {dashboard_url}")

        # Keep running
        print("\n⏳ Services running... (Press Ctrl+C to stop)\n")
        while True:
            time.sleep(1)
            # Check if any process died
            for name, proc in processes:
                if proc.poll() is not None:
                    print(f"⚠️  {name} process terminated unexpectedly")
                    return 1

    except KeyboardInterrupt:
        print("\n\n⏹️  Stopping services...")
        for name, proc in processes:
            print(f"   Stopping {name}...")
            proc.terminate()
            try:
                proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                proc.kill()
        print("✅ All services stopped. Goodbye!")
        return 0

    except Exception as e:
        print(f"\n❌ Error: {e}")
        for name, proc in processes:
            proc.terminate()
        return 1

if __name__ == "__main__":
    sys.exit(main())
