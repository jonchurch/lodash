#!/bin/bash

# Script to process test files by adding require statements using Claude CLI agents
# Runs from repo root, but sets CWD to test/ so agents can discover test/utils/ files
# Usage: ./process-files.sh [batch_size] [start_index]

BATCH_SIZE=${1:-5}  # Default: 5 files at a time
START_INDEX=${2:-0} # Default: start from beginning
FILES_LIST="files-to-process.txt"
PROMPT_FILE="add-requires-prompt.md"
LOG_DIR="processing-logs"
TEST_DIR="test"

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Read the prompt template
if [ ! -f "$PROMPT_FILE" ]; then
    echo "Error: Prompt file not found at $PROMPT_FILE"
    exit 1
fi

PROMPT_TEMPLATE=$(cat "$PROMPT_FILE")

# Read files to process
if [ ! -f "$FILES_LIST" ]; then
    echo "Error: Files list not found at $FILES_LIST"
    exit 1
fi

# Convert to array (compatible with bash 3.2+)
FILES=()
while IFS= read -r line; do
    FILES+=("$line")
done < "$FILES_LIST"
TOTAL_FILES=${#FILES[@]}

echo "========================================="
echo "Claude CLI Test File Processor"
echo "========================================="
echo "Total files to process: $TOTAL_FILES"
echo "Batch size: $BATCH_SIZE"
echo "Starting at index: $START_INDEX"
echo "========================================="
echo ""

# Counter for successful/failed processing
SUCCESS_COUNT=0
FAIL_COUNT=0
CURRENT_INDEX=$START_INDEX

# Process files in batches
while [ $CURRENT_INDEX -lt $TOTAL_FILES ]; do
    BATCH_END=$((CURRENT_INDEX + BATCH_SIZE))
    if [ $BATCH_END -gt $TOTAL_FILES ]; then
        BATCH_END=$TOTAL_FILES
    fi

    echo "Processing batch: files $CURRENT_INDEX to $((BATCH_END - 1))"
    echo ""

    # Process each file in the current batch
    for i in $(seq $CURRENT_INDEX $((BATCH_END - 1))); do
        FILE="${FILES[$i]}"
        FILE_PATH="extracted/$FILE"
        LOG_FILE="$LOG_DIR/$(basename "$FILE" .js).log"

        echo "[$((i + 1))/$TOTAL_FILES] Processing: $FILE"

        # Create the full prompt with the file path
        FULL_PROMPT="$PROMPT_TEMPLATE

## File to Process

Please process the following file: $FILE_PATH

Read the file, analyze its dependencies, add the appropriate require() statements at the top (after the frontmatter comment), and write the updated file back."

        # Run Claude CLI in print mode with CWD set to test/
        # Use --dangerously-skip-permissions to avoid interactive prompts
        # Redirect output to log file
        if (cd "$TEST_DIR" && claude -p \
            --model haiku \
            --dangerously-skip-permissions \
            --tools "Read,Edit,Write" \
            -- "$FULL_PROMPT") > "$LOG_FILE" 2>&1; then
            echo "  ✓ Success"
            ((SUCCESS_COUNT++))
        else
            EXIT_CODE=$?
            echo "  ✗ Failed (exit code: $EXIT_CODE)"
            ((FAIL_COUNT++))
            echo "  See log: $LOG_FILE"
        fi
        echo ""
    done

    CURRENT_INDEX=$BATCH_END

    # Show progress
    echo "----------------------------------------"
    echo "Progress: $CURRENT_INDEX/$TOTAL_FILES files processed"
    echo "Success: $SUCCESS_COUNT | Failed: $FAIL_COUNT"
    echo "----------------------------------------"
    echo ""

    # Optional: pause between batches to avoid rate limits
    if [ $CURRENT_INDEX -lt $TOTAL_FILES ]; then
        echo "Pausing 2 seconds before next batch..."
        sleep 2
    fi
done

# Final summary
echo "========================================="
echo "Processing Complete!"
echo "========================================="
echo "Total: $TOTAL_FILES files"
echo "Success: $SUCCESS_COUNT"
echo "Failed: $FAIL_COUNT"
echo "========================================="
echo ""
echo "Logs saved to: $LOG_DIR/"

# Exit with error if any failed
if [ $FAIL_COUNT -gt 0 ]; then
    exit 1
fi
