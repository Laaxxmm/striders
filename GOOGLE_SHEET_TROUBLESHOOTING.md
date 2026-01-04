# Google Sheet Integration Troubleshooting

## Issue: Data Not Being Captured

If your Google Sheet is not receiving registration data, follow these steps:

### 1. Verify Script Deployment

1. Open your Google Sheet
2. Go to **Extensions > Apps Script**
3. Make sure the script from `google_apps_script.js` is pasted in `Code.gs`
4. Click **Run** on the `setup` function (only needed once to create headers)
5. Click **Deploy > Manage deployments**
6. Check that:
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** ← CRITICAL!
   
### 2. Get the Correct URL

1. In Apps Script, click **Deploy > Manage deployments**
2. Click the **Copy** button next to the Web App URL
3. The URL should look like: `https://script.google.com/macros/s/AKfycby.../exec`
4. Paste this EXACT URL in the Admin Panel "Google Script Webhook URL" field

### 3. Test the Integration

1. Create a test event with the Google Script URL
2. Go to the event page (`/event/:id`)
3. Fill out the registration form
4. Click "Proceed to Payment"
5. Check your Google Sheet - a new row should appear

### 4. Common Issues

**Problem**: "Access Denied" error
- **Solution**: Make sure "Who has access" is set to "Anyone" in deployment settings

**Problem**: No data appears in sheet
- **Solution**: 
  - Check browser console for errors (F12 > Console tab)
  - Verify the URL is exactly as copied from Apps Script
  - Make sure you ran the `setup` function to create headers

**Problem**: Data appears but some fields are missing
- **Solution**: The script expects these fields:
  - eventName, parentName, riderName, contact, email, categoryName, categoryPrice
  - Check that your event has categories defined

### 5. Manual Test

You can test the script directly:
1. Go to Apps Script
2. Click **Deploy > Test deployments**
3. Click the Web App URL
4. You should see "Success"

If you see an error page, the deployment is not configured correctly.
