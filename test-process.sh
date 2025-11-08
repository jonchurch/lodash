#!/bin/bash

# Test script to process just 2 files as a proof of concept
# This will help verify the orchestration works before running all 302 files
# Run from repo root
# Usage: ./test-process.sh

echo "========================================="
echo "Testing Claude CLI orchestration"
echo "Processing 2 test files..."
echo "========================================="
echo ""

# Check we're in the right directory
if [ ! -d "test/utils" ] || [ ! -d "test/extracted" ]; then
    echo "Error: Must run from repo root"
    echo "Usage: ./test-process.sh"
    exit 1
fi

# Run the main script with batch size 2 and process only first 2 files
./process-files.sh 2 0

EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "✓ Test successful! You can now run the full batch."
    echo ""
    echo "To process all 302 files, run:"
    echo "  ./process-files.sh 5 0"
    echo ""
    echo "Or to continue from where you left off:"
    echo "  ./process-files.sh 5 2  # Start from file index 2"
else
    echo "✗ Test failed. Check the logs in processing-logs/"
fi

exit $EXIT_CODE
