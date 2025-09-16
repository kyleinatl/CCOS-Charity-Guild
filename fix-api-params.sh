#!/bin/bash

# Fix API route files to handle async params in Next.js 15

# Function to fix params in a single file
fix_params_in_file() {
    local file="$1"
    echo "Fixing params in $file"
    
    # Use sed to replace { params }: { params: { with { params }: { params: Promise<{
    sed -i 's/{ params }: { params: {/{ params }: { params: Promise<{/g' "$file"
    
    # Add await params destructuring after the function signature
    # This is more complex and requires careful handling
    # For now, we'll do this manually for critical files
}

# Find all route.ts files in the API directory
find src/app/api -name "route.ts" -type f | while read -r file; do
    # Check if file contains dynamic params
    if grep -q "{ params }" "$file"; then
        fix_params_in_file "$file"
    fi
done

echo "API route param fixes completed"