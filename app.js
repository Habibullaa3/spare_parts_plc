// Google API Client Library uchun sozlamalar
const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com'; // o'zingizning CLIENT_ID ni qo'ying
const API_KEY = 'YOUR_API_KEY'; // o'zingizning API kalitini qo'ying
const SPREADSHEET_ID = 'YOUR_SHEET_ID'; // o'zingizning Google Sheets ID ni qo'ying
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID'; // o'zingizning Google Drive papka ID ni qo'ying

// Google API-iga autentifikatsiya qilish
function authenticate() {
    return gapi.auth2.getAuthInstance().signIn()
        .then(function() {
            console.log('Google API orqali autentifikatsiya muvaffaqiyatli amalga oshirildi.');
        });
}

// Google API-ni yuklash
function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load('https://content.googleapis.com/discovery/v1/apis/sheets/v4/rest')
        .then(function() {
            console.log('Google Sheets API muvaffaqiyatli yuklandi');
        });
}

// Google Sheets-dan ma'lumotlarni olish
function loadSheetsData() {
    authenticate().then(function() {
        loadClient().then(function() {
            const request = gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A1:D5' // Google Sheets-dan kerakli diapazonni belgilang
            });
            request.then(function(response) {
                const data = response.result.values;
                displayData(data);
            });
        });
    });
}

// Google Drive-dan fayllarni olish
function loadDriveFiles() {
    authenticate().then(function() {
        loadClient().then(function() {
            const request = gapi.client.drive.files.list({
                q: `'${DRIVE_FOLDER_ID}' in parents`,
                fields: "nextPageToken, files(id, name)"
            });
            request.then(function(response) {
                const files = response.result.files;
                displayFiles(files);
            });
        });
    });
}

// Ma'lumotlarni ekranda ko'rsatish
function displayData(data) {
    let output = '<h2>Google Sheets Ma\'lumotlari:</h2>';
    if (data && data.length > 0) {
        output += '<table>';
        data.forEach(function(row) {
            output += '<tr>';
            row.forEach(function(cell) {
                output += `<td>${cell}</td>`;
            });
            output += '</tr>';
        });
        output += '</table>';
    } else {
        output += '<p>No data found.</p>';
    }
    document.getElementById('output').innerHTML = output;
}

// Drive fayllarini ekranda ko'rsatish
function displayFiles(files) {
    let output = '<h2>Google Drive Fayllari:</h2>';
    if (files && files.length > 0) {
        output += '<ul>';
        files.forEach(function(file) {
            output += `<li>${file.name} (ID: ${file.id})</li>`;
        });
        output += '</ul>';
    } else {
        output += '<p>No files found.</p>';
    }
    document.getElementById('output').innerHTML = output;
}

// Google API-ni yuklash va boshlash
function start() {
    gapi.load('client:auth2', function() {
        gapi.auth2.init({ client_id: CLIENT_ID });
    });
}

// Button-larga listener qo'shish
document.getElementById('loadSheets').addEventListener('click', loadSheetsData);
document.getElementById('loadDrive').addEventListener('click', loadDriveFiles);

