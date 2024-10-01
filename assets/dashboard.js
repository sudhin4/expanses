// Declare arrays
let datearray = [];
let amountarray = [];
let expansesarray = [];
let categoryarray = [];
let accountarray = [];

// Add values to arrays
function addvalue() {
    let date_value = document.getElementById("date_input").value;
    let amount_value = document.getElementById("amount_input").value;
    let category_value = document.getElementById("Category_input").value;
    let account_value = document.getElementById("dropdown_account").value;

    // Push values to arrays based on account type
    if (account_value === "Cash") {
        datearray.push(date_value);
        amountarray.push(amount_value);  // Push to amountarray for "Cash"
    } else {
        datearray.push(date_value);
        expansesarray.push(amount_value); // Push to expansesarray for other accounts
    }

    categoryarray.push(category_value);
    accountarray.push(account_value);

    displayvalue();

}
// Display values in the table
function displayvalue() {
    let tables = document.querySelector("#last_activites_section tbody");
    tables.innerHTML = ''; // Clear the table before populating

    // Initialize two indices for amountarray and expansesarray
    let amountIndex = 0;
    let expenseIndex = 0;

    // Loop through the date array to populate the table
    for (let i = 0; i < datearray.length; i++) {
        let row = document.createElement("tr");
        let datecell = document.createElement("td");
        let accountcell = document.createElement("td");
        let categorycell = document.createElement("td");
        let amountcell = document.createElement("td");
        let deletecell = document.createElement("td")



        datecell.textContent = datearray[i];
        accountcell.textContent = accountarray[i];
        categorycell.textContent = categoryarray[i];

        // Check which array to pull amount from based on account type
        if (accountarray[i] === "Cash") {
            amountcell.textContent = amountarray[amountIndex];  // Pull from amountarray
            amountIndex++;
            amountcell.style.color = "Green"
            amountcell.style.fontWeight = "600"
        } else {
            amountcell.textContent = expansesarray[expenseIndex];  // Pull from expansesarray
            expenseIndex++;
            amountcell.style.color = "red"
            amountcell.style.fontWeight = "600"
        }

        let removecell = document.createElement("button");
        removecell.textContent = "Remove";
        removecell.className = "remove_btn"
        removecell.setAttribute("data-index", i);
        removecell.addEventListener('click', openDeleteConfirmation);

        deletecell.appendChild(removecell); // add a
        // Append cells to the row
        row.appendChild(datecell);
        row.appendChild(accountcell);
        row.appendChild(categorycell);
        row.appendChild(amountcell);
        row.appendChild(deletecell)

        // Append the row to the table
        tables.appendChild(row);
    }
}

// Form validation and adding values
let amount = document.getElementById("amount_input");
let save_btn = document.getElementById("save");
let valid = document.getElementById("valid");

save_btn.addEventListener('click', () => {
    if (amount.value == "") {
        valid.innerHTML = "Enter an amount*";
        save_btn.style.cursor = "not-allowed";
    } else {
        valid.innerHTML = "";
        save_btn.style.cursor = "pointer";
        addvalue();// add value
        clear();// clear a value
        sumcash();// sum of the cash
        expansessum();// sum of the expanses
        netinocme(); // net income calculate
        updateDonutChart(); // chart update
    }
});

// Open and close card on button click
let card = document.getElementById("card_cont");
let add_btn = document.getElementById("addbutton");

add_btn.addEventListener('click', () => {
    card.style.display = card.style.display === "none" ? "block" : "none";
});

// Clear input fields
function clear() {
    document.getElementById("date_input").value = '';
    document.getElementById("amount_input").value = '';
    document.getElementById("Category_input").value = '';
}

// Close the card on button click
let close_btn = document.getElementById("close_marks");
close_btn.addEventListener('click', () => {
    card.style.display = card.style.display === "none" ? "block" : "none";
});


// add and display the value 
// reference 

let cash_display = document.getElementById("cash");
let expanses_display = document.getElementById("expanses");
let netincome_display = document.getElementById("Total");


// cash adding

// reference of amount let amountarray = [];

function sumcash() {
    let sum = 0;
    for (let i = 0; i < amountarray.length; i++) {
        sum += parseFloat(amountarray[i]);
    }
    cash_display.innerHTML = sum;

}
// expanses sum
function expansessum() {
    let sum = 0;
    for (let i = 0; i < expansesarray.length; i++) {
        sum += parseFloat(expansesarray[i])
    }
    expanses_display.innerHTML = sum;

}

//calculate the net income

function netinocme() {
    let cashsum = 0;
    for (let i = 0; i < amountarray.length; i++) {
        cashsum += parseFloat(amountarray[i]);
    }

    let expansescash = 0;
    for (let i = 0; i < expansesarray.length; i++) {
        expansescash += parseFloat(expansesarray[i])
    }
    // calculate the net income
    let netincome = cashsum - expansescash;

    //  display the net income
    netincome_display.innerHTML = netincome;



}
// chart creation
// Create the donut chart

let doughnutChart;  // To keep a reference to the chart so we can update it

function updateDonutChart() {
    let cashSum = 0;
    for (let i = 0; i < amountarray.length; i++) {
        cashSum += parseFloat(amountarray[i]);
    }

    let expensesSum = 0;
    for (let i = 0; i < expansesarray.length; i++) {
        expensesSum += parseFloat(expansesarray[i]);
    }

    // Chart.js requires the data in a specific format
    const data = {
        labels: ['Cash', 'Expenses'],
        datasets: [{
            label: 'Cash vs Expenses',
            data: [cashSum, expensesSum],  // Array of values to display in the chart
            backgroundColor: ['rgb(4, 136, 56)', 'rgb(255, 0, 0)'],  // Colors for the segments
        }]
    };

    const config = {
        type: 'doughnut',  // The chart type
        data: data,  // The data
        options: {
            responsive: false,  // Disable responsive behavior
            maintainAspectRatio: false,  // Allow custom dimensions without keeping aspect ratio    
            plugins: {
                legend: {
                    position: 'top',  // Position of the legend
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.label + ": $" + tooltipItem.raw.toFixed(2);
                        }
                    }
                }
            }
        },
    };

    // Check if the chart already exists. If so, destroy it before creating a new one
    if (doughnutChart) {
        doughnutChart.destroy();
    }

    // Get the canvas context and create the chart
    let ctx = document.getElementById('myDoughnutChart').getContext('2d');
    doughnutChart = new Chart(ctx, config);
}


function deleteTransaction(index) {
    // Remove the transaction from the arrays
    if (accountarray[index] === "Cash") {
        amountarray.splice(index, 1);  // Remove from amountarray if Cash
    } else {
        expansesarray.splice(index, 1);  // Remove from expansesarray if Expense
    }
    datearray.splice(index, 1);
    accountarray.splice(index, 1);
    categoryarray.splice(index, 1);

    

    // Re-render the table
    displayvalue();

    // Recalculate sums and net income
    sumcash();
    expansessum();
    netinocme();
    updateDonutChart(); // Update the chart if necessary
}



// remove button function
function openDeleteConfirmation(event) {
    let index = event.target.getAttribute("data-index");  // Get the transaction index
    let deleteDialog = document.getElementById("delete_btn_div");  // Get delete dialog div

    deleteDialog.style.display = "block";  // Show the confirmation dialog

    // Attach a temporary event listener to the confirm delete button
    let confirmDeleteBtn = document.getElementById("delete_btn");
    confirmDeleteBtn.onclick = function () {
        deleteTransaction(index);  // Call delete function with the index
        deleteDialog.style.display = "none";  // Hide the dialog after deletion
    };

    // If user clicks cancel, hide the dialog
    let cancelDeleteBtn = document.getElementById("cancel_btn");
    cancelDeleteBtn.onclick = function () {
        deleteDialog.style.display = "none";  // Just hide the dialog
    };
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}