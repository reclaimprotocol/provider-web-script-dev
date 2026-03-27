#!/bin/bash

# Ensure we exit cleanly on Ctrl+C
trap "echo -e '\nExiting...'; exit 0" SIGINT

while true; do
    echo ""
    echo "=============================================="
    echo "📱 iOS Simulator Utility"
    echo "=============================================="
    echo "1. Copy from iOS simulator to macOS pasteboard"
    echo "2. Copy from macOS to iOS simulator pasteboard"
    echo "3. Launch URL in iOS simulator"
    echo "0. Exit"
    echo "=============================================="
    read -p "Select an option [0-3]: " option

    echo ""
    case "$option" in
        1)
            # Copy simulator's pasteboard and pipe to macOS pbcopy
            xcrun simctl pbpaste booted | pbcopy
            echo "✅ Successfully copied from iOS Simulator to macOS pasteboard."
            ;;
        2)
            # Take macOS pbpaste and pipe to simulator's pbcopy
            pbpaste | xcrun simctl pbcopy booted
            echo "✅ Successfully copied from macOS pasteboard to iOS Simulator."
            ;;
        3)
            read -p "Enter URL to launch: " url
            if [ -n "$url" ]; then
                xcrun simctl openurl booted "$url"
                echo "✅ Launched '$url' in iOS Simulator."
            else
                echo "❌ Please provide a valid URL."
            fi
            ;;
        0|q|quit|exit)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "❌ Invalid option '$option'. Please try again."
            ;;
    esac
done
