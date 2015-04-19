// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    var query = {
        "securities": [
            "QKK5 Comdty", // GB GBP
            "W N5 Comdty", // US USD
            "EBK5 Comdty", // ZA ZAR
            "WHI1 Comdty", // AU AUD
            "VNK5 Comdty", // CN CNY
            "USDGBP Curncy",
            "ZARGBP Curncy",
            "AUDGBP Curncy",
            "CNYGBP Curncy"
        ],
        "fields": [
            //"PX_HIGH",
            //"PX_LOW",
            //"PX_MID",
            "PX_LAST"
        ],
        "startDate": "20150401",
        "endDate": "20150401",
        "periodicitySelection": "DAILY"
    };
/*
    var query = {
        "securities": ["QKK5 Comdty"],
        "fields": ["PX_LAST"],
        "startDate": "20150401",
        "endDate": "20150401",
        "periodicitySelection": "DAILY"
    };
*/
    // jQuery AJAX call for JSON
    $.ajax({
        type: 'GET',
        url: '/blp/api',
        data: query,
        dataType: "JSON"
    })
        .done(function(data) {
            // Stick our user data array into a userlist variable in the global object
            userListData = data;

            // For each item in our JSON, add a table row and cells to the content string
            $.each(data, function(){
                tableContent += '<tr>';
                tableContent += '<td>' + this.key + '</td>';
                tableContent += '<td>' + this.data + '</td>';
                tableContent += '</tr>';
            });

            // Inject the whole content string into our existing HTML table
            $('#userList table tbody').html(tableContent);
        });

};
