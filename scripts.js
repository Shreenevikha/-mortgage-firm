// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBEqs6P0CqmAkJKsHmK8SbI6FPRtZpEq8c",
    authDomain: "mortgagefirm-e7223.firebaseapp.com",
    databaseURL: "https://mortgagefirm-e7223-default-rtdb.firebaseio.com",
    projectId: "mortgagefirm-e7223",
    storageBucket: "mortgagefirm-e7223.appspot.com",
    messagingSenderId: "19051470003",
    appId: "1:19051470003:web:ac124e8951e8a319f3e4c6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function showPanel(panelId) {
    document.querySelectorAll('.tab-content').forEach(panel => {
        panel.style.display = 'none';
    });
    document.getElementById(panelId).style.display = 'block';
}

function saveMortgage() {
    const customerName = document.getElementById('customerName').value;
    const jewelryWeight = parseFloat(document.getElementById('jewelryWeight').value);
    const metalPrice = parseFloat(document.getElementById('metalPrice').value);
    const mortgageDate = document.getElementById('mortgageDate').value;
    const status = document.getElementById('status').value;

    const mortgageData = {
        customerName,
        jewelryWeight,
        metalPrice,
        mortgageDate,
        status
    };

    const newMortgageKey = database.ref().child('mortgages').push().key;
    database.ref('mortgages/' + newMortgageKey).set(mortgageData);
    alert('Mortgage data saved successfully!');
}

function calculatePledge() {
    const weight = parseFloat(document.getElementById('jewelryWeight').value);
    const pricePerGram = parseFloat(document.getElementById('metalPrice').value);
    const pledgedAmount = 0.60 * weight * pricePerGram;
    document.getElementById('pledgedAmount').innerText = pledgedAmount.toFixed(2);
}

function calculateInterest() {
    const calcDate = new Date(document.getElementById('calcDate').value);
    const pledgedAmount = parseFloat(document.getElementById('pledgedAmount').innerText);
    const initialInterestRate = 0.05; // 5% per month

    if (isNaN(pledgedAmount)) {
        alert("Please calculate the pledged amount first.");
        return;
    }

    const today = new Date();
    let months = (today.getFullYear() - calcDate.getFullYear()) * 12;
    months -= calcDate.getMonth();
    months += today.getMonth();
    
    let totalPayment = pledgedAmount;
    let monthlyInterest = pledgedAmount * initialInterestRate;
    let currentInterestRate = initialInterestRate;

    for (let i = 0; i < months; i++) {
        totalPayment += monthlyInterest;
        currentInterestRate += (currentInterestRate * 0.50);
        monthlyInterest = pledgedAmount * currentInterestRate;
    }
    
    document.getElementById('interestRateDisplay').innerText = (currentInterestRate * 100).toFixed(2) + '%';
    document.getElementById('totalPayment').innerText = totalPayment.toFixed(2);
}

function releaseMortgage() {
    const releaseDate = document.getElementById('releaseDate').value;

    if (!releaseDate) {
        alert("Please enter the release date.");
        return;
    }

    const customerName = document.getElementById('customerName').value;
    const pledgedAmount = parseFloat(document.getElementById('pledgedAmount').innerText);

    if (isNaN(pledgedAmount)) {
        alert("Please calculate the pledged amount first.");
        return;
    }

    const initialInterestRate = 0.05; // 5% per month
    const today = new Date();
    const releaseDateObj = new Date(releaseDate);

    let months = (today.getFullYear() - releaseDateObj.getFullYear()) * 12;
    months -= releaseDateObj.getMonth();
    months += today.getMonth();
    
    let totalPayment = pledgedAmount;
    let monthlyInterest = pledgedAmount * initialInterestRate;
    let currentInterestRate = initialInterestRate;

    for (let i = 0; i < months; i++) {
        totalPayment += monthlyInterest;
        currentInterestRate += (currentInterestRate * 0.50);
        monthlyInterest = pledgedAmount * currentInterestRate;
    }
    
    document.getElementById('releaseTotalPayment').innerText = totalPayment.toFixed(2);

    // Update status to 'Release mortgage'
    const mortgageData = {
        status: 'Release mortgage',
        releaseDate: releaseDate
    };

    // Assuming you have the mortgage ID stored somewhere
    const mortgageId = document.getElementById('mortgageId').value;
    if (mortgageId) {
        database.ref('mortgages/' + mortgageId).update(mortgageData)
            .then(() => alert('Mortgage status updated to "Release mortgage".'))
            .catch((error) => console.error('Error updating mortgage status:', error));
    } else {
        alert('Mortgage ID not found.');
    }
}
