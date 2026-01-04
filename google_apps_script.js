/**
 * Google Apps Script to capture Event Registration Data
 * 
 * Instructions:
 * 1. Go to https://sheets.google.com and create a new Sheet
 * 2. In the Sheet, go to Extensions > Apps Script
 * 3. Paste this code into the Code.gs file
 * 4. Save the project (Cmd/Ctrl + S)
 * 5. Run the 'setup' function once to create headers (Select 'setup' in toolbar, click Run)
 * 6. Click 'Deploy' > 'New deployment'
 * 7. Select type: 'Web app'
 * 8. Description: 'Event Registration'
 * 9. Execute as: 'Me' (your email)
 * 10. Who has access: 'Anyone' (IMPORTANT)
 * 11. Click 'Deploy', authorize permissions, and COPY the Web App URL.
 * 12. Paste this URL into the Admin Panel 'Google Script Webhook URL' field.
 */

function doGet(e) {
    return ContentService.createTextOutput("Success");
}

function doPost(e) {
    try {
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        const data = JSON.parse(e.postData.contents);

        // Data Capture: Timestamp, EventName, ParentName, RiderName, Contact, Email, Category, Status
        const timestamp = new Date();

        sheet.appendRow([
            timestamp,
            data.eventName,
            data.parentName,
            data.riderName,
            data.contact,
            data.email,
            data.categoryName,
            data.categoryPrice,
            "Pending" // Payment Status default
        ]);

        return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function setup() {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    // Setup Headers
    sheet.appendRow(["Timestamp", "Event Name", "Parent Name", "Rider Name", "Contact", "Email", "Category", "Price", "Payment Status"]);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold");
}
