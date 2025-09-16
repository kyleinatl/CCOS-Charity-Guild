#!/bin/bash

# CCOS Charity Guild - Automation System Demo Script
# This script demonstrates the automation system functionality

echo "🚀 CCOS Charity Guild Automation System Demo"
echo "============================================="
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Start the development server
echo "📦 Starting Next.js development server..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Function to check if server is running
check_server() {
    curl -s http://localhost:3000 > /dev/null
    return $?
}

# Wait up to 30 seconds for server to be ready
COUNTER=0
while [ $COUNTER -lt 6 ]; do
    if check_server; then
        echo "✅ Server is running!"
        break
    fi
    echo "⏳ Server not ready yet, waiting..."
    sleep 5
    COUNTER=$((COUNTER + 1))
done

if [ $COUNTER -eq 6 ]; then
    echo "❌ Server failed to start within 30 seconds"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎯 Testing Automation System Endpoints..."
echo ""

# Test 1: Get all automations
echo "1️⃣ Testing GET /api/automation"
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/automation)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ GET /api/automation - Success (200)"
    echo "📄 Response: $(echo "$BODY" | jq -r '. | length') automations found"
else
    echo "❌ GET /api/automation - Failed ($HTTP_CODE)"
    echo "📄 Response: $BODY"
fi

echo ""

# Test 2: Create a new automation
echo "2️⃣ Testing POST /api/automation"
NEW_AUTOMATION='{
  "name": "Demo Welcome Automation",
  "description": "Test automation for demo purposes",
  "trigger_type": "member_onboarding",
  "trigger_conditions": {"member_tier": "supporter"},
  "actions": [
    {"type": "send_email", "template": "welcome", "delay": 0},
    {"type": "create_task", "title": "Follow up with new member", "delay": "24 hours"}
  ]
}'

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d "$NEW_AUTOMATION" \
  http://localhost:3000/api/automation)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ POST /api/automation - Success (201)"
    AUTOMATION_ID=$(echo "$BODY" | jq -r '.id')
    echo "📄 Created automation ID: $AUTOMATION_ID"
else
    echo "❌ POST /api/automation - Failed ($HTTP_CODE)"
    echo "📄 Response: $BODY"
fi

echo ""

# Test 3: Get automation workflows
echo "3️⃣ Testing GET /api/automation/workflows"
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/automation/workflows)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ GET /api/automation/workflows - Success (200)"
    echo "📄 Available workflows: $(echo "$BODY" | jq -r '. | length')"
else
    echo "❌ GET /api/automation/workflows - Failed ($HTTP_CODE)"
    echo "📄 Response: $BODY"
fi

echo ""

# Test 4: Get automation logs
echo "4️⃣ Testing GET /api/automation/logs"
RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/automation/logs)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ GET /api/automation/logs - Success (200)"
    echo "📄 Log entries: $(echo "$BODY" | jq -r '. | length')"
else
    echo "❌ GET /api/automation/logs - Failed ($HTTP_CODE)"
    echo "📄 Response: $BODY"
fi

echo ""

# Test 5: Test member onboarding trigger (if automation was created)
if [ ! -z "$AUTOMATION_ID" ]; then
    echo "5️⃣ Testing automation trigger"
    TRIGGER_DATA='{
      "trigger_data": {
        "member_id": "demo-member-123",
        "member_name": "Demo User",
        "member_email": "demo@example.com",
        "member_tier": "supporter"
      }
    }'
    
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
      -H "Content-Type: application/json" \
      -d "$TRIGGER_DATA" \
      "http://localhost:3000/api/automation/$AUTOMATION_ID/trigger")
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n -1)
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ POST /api/automation/$AUTOMATION_ID/trigger - Success (200)"
        echo "📄 Automation triggered successfully"
    else
        echo "❌ POST /api/automation/$AUTOMATION_ID/trigger - Failed ($HTTP_CODE)"
        echo "📄 Response: $BODY"
    fi
else
    echo "5️⃣ Skipping automation trigger test (no automation created)"
fi

echo ""
echo "🎉 Demo completed! Here's what you can do next:"
echo ""
echo "🌐 Open the automation dashboard: http://localhost:3000/automation"
echo "🧪 Try the automation test page: http://localhost:3000/automation/test"
echo "📊 View analytics dashboard: http://localhost:3000/analytics"
echo "👥 Check member management: http://localhost:3000/members"
echo "💰 Review donations: http://localhost:3000/donations"
echo ""
echo "📚 For more information, see:"
echo "   - README.md"
echo "   - AUTOMATION_SYSTEM_GUIDE.md"
echo "   - PAYMENT_INTEGRATION_GUIDE.md"
echo ""

# Keep server running for manual testing
echo "🔄 Server is still running for manual testing..."
echo "   Press Ctrl+C to stop the server and exit"
echo ""

# Wait for user to stop
trap "echo ''; echo '🛑 Stopping server...'; kill $SERVER_PID 2>/dev/null; echo '✅ Demo script completed!'; exit 0" INT

# Keep the script running
while true; do
    sleep 1
done