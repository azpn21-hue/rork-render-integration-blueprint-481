#!/bin/bash

# Master Startup Script for R3AL App
# Handles all common issues automatically

set -e  # Exit on error

echo "╔════════════════════════════════════════╗"
echo "║     R3AL App - Master Startup          ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to kill Metro processes
kill_metro() {
    echo "🔪 Killing any running Metro processes..."
    pkill -f metro 2>/dev/null || true
    pkill -f "node.*expo" 2>/dev/null || true
    sleep 1
}

# Function to clear caches
clear_caches() {
    echo "🧹 Clearing caches..."
    rm -rf node_modules/.cache 2>/dev/null || true
    rm -rf .expo 2>/dev/null || true
    rm -rf $TMPDIR/metro-* 2>/dev/null || true
    rm -rf $TMPDIR/haste-* 2>/dev/null || true
    rm -rf $TMPDIR/react-* 2>/dev/null || true
    
    if command_exists watchman; then
        echo "🔄 Clearing watchman..."
        watchman watch-del-all 2>/dev/null || true
    fi
}

# Function to check dependencies
check_dependencies() {
    echo "📦 Checking dependencies..."
    if [ ! -d "node_modules" ]; then
        echo "⚠️  node_modules not found! Installing dependencies..."
        if command_exists bun; then
            echo "Using bun..."
            bun install
        elif command_exists npm; then
            echo "Using npm..."
            npm install
        else
            echo "❌ Error: Neither bun nor npm found!"
            exit 1
        fi
    else
        echo "✅ node_modules found"
    fi
}

# Function to verify environment
check_env() {
    echo "🔐 Checking environment variables..."
    if [ ! -f ".env" ]; then
        echo "⚠️  Warning: .env file not found!"
        echo "   The app may not work correctly without environment variables."
        read -p "   Continue anyway? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        echo "✅ .env file found"
    fi
}

# Main execution
main() {
    echo "Step 1/5: Killing Metro processes"
    kill_metro
    
    echo ""
    echo "Step 2/5: Clearing caches"
    clear_caches
    
    echo ""
    echo "Step 3/5: Checking dependencies"
    check_dependencies
    
    echo ""
    echo "Step 4/5: Verifying environment"
    check_env
    
    echo ""
    echo "Step 5/5: Starting Expo"
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║  Starting R3AL App Development Server  ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    
    # Start Expo with npx (works everywhere)
    if command_exists npx; then
        npx expo start --clear
    else
        echo "❌ Error: npx not found!"
        echo "Please install Node.js from https://nodejs.org/"
        exit 1
    fi
}

# Handle arguments
case "${1:-}" in
    --help|-h)
        echo "R3AL App Master Startup Script"
        echo ""
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  (none)    Start development server"
        echo "  --web     Start for web only"
        echo "  --tunnel  Start with tunnel for device testing"
        echo "  --deep    Deep clean (removes node_modules)"
        echo "  --help    Show this help message"
        exit 0
        ;;
    --deep)
        echo "🔥 Deep clean requested"
        kill_metro
        clear_caches
        echo "Removing node_modules..."
        rm -rf node_modules
        echo "Clearing npm cache..."
        npm cache clean --force 2>/dev/null || true
        check_dependencies
        check_env
        npx expo start --clear
        ;;
    --web)
        kill_metro
        clear_caches
        check_dependencies
        check_env
        npx expo start --web --clear
        ;;
    --tunnel)
        kill_metro
        clear_caches
        check_dependencies
        check_env
        npx expo start --tunnel --clear
        ;;
    *)
        main
        ;;
esac
