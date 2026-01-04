#!/bin/bash

# Test Google Apps Script Webhook
# This script sends a test POST request to verify the webhook is working

WEBHOOK_URL="https://script.google.com/macros/s/AKfycbyIEcGrAjTQ9_p9aYa_XHnAaRLUxdF9obHrk6BWcUGJErg/exec"

echo "Testing Google Apps Script Webhook..."
echo "URL: $WEBHOOK_URL"
echo ""

curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Test Event",
    "parentName": "Test Parent",
    "riderName": "Test Rider",
    "contact": "9999999999",
    "email": "test@example.com",
    "categoryName": "U-4 Balance Bike",
    "categoryPrice": 499
  }' \
  -v

echo ""
echo ""
echo "Check your Google Sheet for a new row with the test data!"
echo "Also check Apps Script Executions for a 'doPost' execution."
