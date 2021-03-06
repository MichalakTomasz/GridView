# GridView

JavaScript DataGridView with Events

PROPERTIES:

- activePage
- pagesCount
- rowsCount
- selectedJsonRows - returns array of selected json rows
- selectedRows

METHODS:

- addRow(jsonRow) - jsonRow is optional parameter, possible injecting jsonRow in onRowAdding event
- updateRow(rowElementToUpdate, newJsonRow)
- deleteRow(rowElement)
- findRowDataSourceIndex(rowElemement)
- getRowValues(rowElement) - returns row values array
- rowDataToJson(rowElement)

EVENTS:

- onCheckedChanged
- onRowAdding
- onRowUpdating
- onRowDeleting
- onRowClick

These events have special arguments


INSTALATION

- add link to GridView.js script in Head element:

<script type="text/javascript" src="GridView.js"></script>

- create GridView HTML element in <body>:
  
  <div id="myDataGridView"></div>

- add json object table settings in <script> element:

  var tableSettings = {
            tableID: "myDataGridView",
            showCheckBox: true,
            rowsPerPage: 5,
            lastRowOnTop: true,
            columns: [
                { name: "ID", visible: false, dataType: "bool", readOnly: true, width: 100 },
                { name: "Date", visible: true, dataType: "date", readOnly: false, width: 100 },
                { name: "NO3", visible: true, dataType: "numeric", readOnly: false, width: 100 }
            ]
        }; 

- next add dataSource, json objects array in <script> element:
  
  var dataSource = [{ ID: 0, data: "03.01.2017", no3: 20 },
            { ID: 1, data: "02.02.2017", no3: 10 },
            { ID: 2, data: "02.03.2017", no3: 12 },
            { ID: 3, data: "01.04.2017", no3: 23 },
            { ID: 4, data: "01.05.2017", no3: 13 },
            { ID: 5, data: "05.07.2017", no3: 23 },
            { ID: 6, data: "02.09.2017", no3: 13 }];
            
- create GridView object in <script> element:
  
  var myGrid = new GridView(dataSource, tableSettings);
  
 - add <style> typical CSS <table> styling:
  
  <style>
        #myDataGridView table {
            border-collapse: collapse;
            text-align: center;
        }
        #myDataGridView th {
            background: lightgray;
            line-height: 2em;
        }
        #myDataGridView tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        #myDataGridView .gridViewFooter:last-child {
            background: lightgray;
        }
        #myDataGridView a {
            color: darkgray;
            cursor: pointer;
        }
        #myDataGridView tr:hover:not(:first-of-type) {
            background: #6f7072;
            border: black;
            color: white;
        }
    </style>
  
  
  
  EXAMPLE:
  
<!DOCTYPE html>
<html lang="pl" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title>Slide Show</title>
    <script type="text/javascript" src="GridView.js"></script>
    <style>
        #myDataGridView table {
            border-collapse: collapse;
            text-align: center;
        }
        #myDataGridView th {
            background: lightgray;
            line-height: 2em;
        }
        #myDataGridView tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        #myDataGridView .gridViewFooter:last-child {
            background: lightgray;
        }
        #myDataGridView a {
            color: darkgray;
            cursor: pointer;
        }
        #myDataGridView tr:hover:not(:first-of-type) {
            background: #6f7072;
            border: black;
            color: white;
        }
    </style>
</head>
<body>
    <div id="myDataGridView"></div>
    <script>
        var tableSettings = {
            tableID: "myDataGridView",
            showCheckBox: true,
            rowsPerPage: 5,
            lastRowOnTop: true,
            columns: [
                { name: "ID", visible: false, dataType: "bool", readOnly: true, width: 100 },
                { name: "Date", visible: true, dataType: "date", readOnly: false, width: 100 },
                { name: "NO3", visible: true, dataType: "numeric", readOnly: false, width: 100 }
            ]
        };
        var dataSource = [{ ID: 0, data: "03.01.2017", no3: 20 },
            { ID: 1, data: "02.02.2017", no3: 10 },
            { ID: 2, data: "02.03.2017", no3: 12 },
            { ID: 3, data: "01.04.2017", no3: 23 },
            { ID: 4, data: "01.05.2017", no3: 13 },
            { ID: 5, data: "05.07.2017", no3: 23 },
            { ID: 6, data: "02.09.2017", no3: 13 }];
        var myGrid = new GridView(dataSource, tableSettings);
    </script>
</body>
</html>
  
  
  
            
 
 
  





