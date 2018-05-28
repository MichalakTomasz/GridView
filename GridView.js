/*

created by Tomasz Michalak


-----------------------GridView style example---------------------

<style>
    #AquariumsTable table {
        border-collapse: collapse;
        text-align: center;
    }

    #AquariumsTable th {
        background: lightgray;
        border-bottom: 1px solid black;
        line-height: 2em;
    }

    #AquariumsTable tr:nth-child(even) {
        background-color: #f2f2f2;
    }

    #AquariumsTable .gridViewFooter:last-child {
        background: lightgray;
    }

    #AquariumsTable a {
        color: darkgray;
        cursor: pointer;
    }

    #AquariumsTable tr:hover:not(:first-of-type) {
        background: #6f7072;
        border: black;
        color: white;
    }
</style>

------------------------tableSettings example---------------------------

var tableSettings = {
        tableID: "tabelka",
        showCheckBox: true,
        rowsPerPage: 5,
        lastRowOnTop: true,
        columns: [
            { name: "ID", visible: false, dataType: "bool", readOnly: true, width: 100 },
            { name: "Data", visible: true, dataType: "date", readOnly: false, width: 100 },
            { name: "NO3", visible: true, dataType: "numeric", readOnly: false, width: 100 }
        ]
    };

------------------------dataSource example------------------------------

 var ds = [{ ID: 0, data: "03.01.2017", no3: 20 }, { ID: 1, data: "02.02.2017", no3: 10 }, { ID: 2, data: "02.03.2017", no3: 12 }, { ID: 3, data: "01.04.2017", no3: 23 }, { ID: 4, data: "01.05.2017", no3: 13 }];

*/

function GridView(dataSource, tableSettings) {
    this.tableHandle = document.createElement("table");
    this.tableID = tableSettings.tableID;
    this.showCheckBox = tableSettings.showCheckBox;
    this.rowsPerPage = tableSettings.rowsPerPage;
    this.lastRowOnTop = tableSettings.lastRowOnTop;
    this.columns = tableSettings.columns;
    document.getElementById(this.tableID).appendChild(this.tableHandle);
    this.tableSettings = tableSettings;
    this.dataSource = dataSource;
    this.dataSourceKeys = Object.keys(this.dataSource[0]);
    if (this.lastRowOnTop) {
        this.dataSource.reverse();
    }
    if (tableSettings.width != undefined) this.width = tableSettings.width;
    this._activePage = 0;
    if (this.rowsPerPage == undefined ||
        parseInt(this.rowsPerPage) == NaN ||
        this.rowsPerPage == 0 ||
        this.rowsPerPage == "auto") this._createAllRows();//allRows
    else {//rowsPerPage
        if (this.rowsPerPage < this.dataSource.length) {
            this.createHeader();
            this.createRows(this.firstRowIndexOfPage(1));
            this.createFooter();
        }
        else this._createAllRows();
    }
    this._onRowClick = null;
    this._onRowDeleting = null;
    this._onRowdding = null;
    this._onRowUpdating = null;
    this._onCheckedChanged = null;
}
GridView.prototype = {
    set onRowClick(value){ 
        this._onRowClick = value;
    },
    get onRowClick(){
        return this._onRowClick;
    },
    set onRowDeleting(value) {
        this._onRowDeleting = value;
    },
    get onRowDeleting() {
        return this._onRowDeleting;
    },
    set onRowAdding(value) {
        this._onRowAdding = value;
    },
    get onRowAdding() {
        return this._onRowAdding;
    },
    get onRowUpdating() {
        return this._onRowUpdating;
    },
    set onRowUpdating(value) {
        this._onRowUpdating = value;
    },
    get onCheckedChanged() {
        return this._onCheckedChanged;
    },
    set onCheckedChanged(value) {
        this._onCheckedChanged = value;
    },
    get selectedJsonRows() {
        if (this.showCheckBox) {
            var _rowValuesJson = [];
            var _parentRows = this.tableHandle;
            for (var i = 1; i < _parentRows.childNodes.length; i++) {
                if (_parentRows.childNodes[i].firstChild.firstChild.checked) {
                    _rowValuesJson.push(this.rowDataToJson(_parentRows.childNodes[i]));
                }
            }
            return _rowValuesJson;
        }
        return null;
    },
    get selectedRows() {
        if (this.showCheckBox) {
            var _selectedRows = [];
            var _parentRow = this.tableHandle;
            for (var i = 1; i < _parentRow.childNodes.length; i++) {
                if (_parentRow.childNodes[i].firstChild.firstChild.checked) {
                    var _row = _parentRow.childNodes[i];
                    _selectedRows.push(_row);
                }
            }
            return _selectedRows;
        }
        return null;
    },
    get pagesCount() {
        return Math.ceil(this.dataSource.length / this.rowsPerPage);
    },
    get rowsCount() {
        return this.dataSource.length;
    },
    get activePage() {
        return this._activePage;
    },
    get notActiveLinkStyle() {
        const notActiveLink = "pointer-events: none; cursor: default; text-decoration : none; color: black;";
        return notActiveLink;
    }
}
//---------------------------------------body--------------------------------------------------------------------------
GridView.prototype._createAllRows = function () {
    this.createHeader();
    for (var i = 0; i < dataSource.length; i++) {
        this.tableHandle.appendChild(this._createRow(dataSource[i]));
    }
}
GridView.prototype._createCheckBox = function () {
    var input = document.createElement("input");
    input.type = "checkbox";
    input.name = this.tableID + "checkBoxRow";
    input.onchange = this._checkedChanged.bind(this);;
    return input;
}
GridView.prototype._createRow = function (dataSourceRow) {
    var tr = document.createElement("tr");
    if (this.showCheckBox) {
        var td = document.createElement("td");
        td.appendChild(this._createCheckBox());
        tr.appendChild(td);
    }
    var rowKeys = this.dataSourceKeys;
    for (var i = 0; i < this.columns.length; i++) {
        var td = document.createElement("td");
        td.onclick = this._rowClick.bind(this);
        if (this.columns[i].width != undefined) td.style.width = this.columns[i].width + "px";
        if (!this.columns[i].visible) td.style.display = "none";
        td.setAttribute("name", rowKeys[i])
        td.innerHTML = dataSourceRow[rowKeys[i]];
        tr.appendChild(td);
    }
    return tr;
}
GridView.prototype.createRows = function (startRowIndex){
    for (var i = startRowIndex; i < this.dataSource.length && i < startRowIndex + this.rowsPerPage; i++) {
        this.tableHandle.appendChild(this._createRow(this.dataSource[i]));
    }
    this._activePage = this.pageNumberFromRowIndex(startRowIndex);
}
GridView.prototype.updatePage = function (pageNumber) {
    var startRow = this.firstRowIndexOfPage(pageNumber);
    var optionalColumn = 0;
    if (this.showCheckBox) optionalColumn = 1;
    for (var i = 1; i <= this.rowsPerPage; i++) {
        if (this.showCheckBox) this.tableHandle.childNodes[i].childNodes[0].firstChild.checked = false;
        var rowKeys = this.dataSourceKeys;
        for (var j = 0; j < this.tableHandle.childNodes[i].childNodes.length - optionalColumn; j++) {
            if (startRow + i - 1 < this.dataSource.length) {
                this.tableHandle.childNodes[i].childNodes[j + optionalColumn].innerHTML = this.dataSource[startRow + i - 1][rowKeys[j]];
            }
            else {
                this.tableHandle.childNodes[i].childNodes[j + optionalColumn].innerHTML = "-";
            }
        }
    }
}
GridView.prototype.updateAllRows = function () {
    this.removeChildNodes(this.tableHandle);
    this._createAllRows();
}
GridView.prototype.updateTable = function () {
    if (this.rowsPerPage == undefined || this.rowsPerPage >= this.dataSource.length) {
        this.updateAllRows();
    }
    else {
        this.updatePage(1);
        this.createFooter();
    }
}
GridView.prototype.goToPage = function (pageNumber) {
    var name;
    if (isNaN(pageNumber)) name = event.target.name;
    else name = pageNumber;
    this.updatePage(parseInt(name));
    this._activePage = parseInt(name);
    this.updateFooter();
}
//---------------------------------------Header-----------------------------------------------------------------
GridView.prototype.createHeader = function () {
    var tr = document.createElement("tr");
    if (this.showCheckBox) {
        var th = document.createElement("th");
        th.setAttribute("name", "checkBoxColumn");
        tr.appendChild(th);
    }
    for (var i = 0; i < this.columns.length; i++) {
        var th = document.createElement("th");
        th.setAttribute("style", "text-align:center;");
        if (!this.columns[i].visible) th.style = "display:none";
        if (this.columns[i].width != undefined) th.style.width = this.columns[i].width + "px";
        th.innerText = this.columns[i].name;
        tr.appendChild(th);
    }
    this.tableHandle.appendChild(tr);
}
//-------------------------------------footer-------------------------------------------------------------------------------
GridView.prototype.createFooter = function () {
    if (this.hasFooter()) return;
    var tr = document.createElement("tr");
    var optionalColumn = 0;
    if (this.showCheckBox) optionalColumn = 1;
    var td = document.createElement("td");
    td.setAttribute("class", "gridViewFooter");
    td.setAttribute("style", "text-align:center;");
    td.setAttribute("colspan", this.columns.length + optionalColumn);
    tr.appendChild(td);
    this.tableHandle.appendChild(tr);
    this.updateFooter();
}
GridView.prototype.updateFooter = function () {
    var footerColumn = this.tableHandle.lastChild.firstChild;
    var firstShowPage = Math.floor(this.activePage / 6) * 5 + 1;
    this.removeChildNodes(this.tableHandle.lastChild.firstChild);
    if (this.activePage > 1){
        var pageLinkPrev = document.createElement("a");
        pageLinkPrev.innerHTML = "&#9666;";
        pageLinkPrev.name = this.activePage - 1;
        footerColumn.appendChild(pageLinkPrev);
    }
    for (var i = firstShowPage ; i <= this.pagesCount && i < firstShowPage + 5; i++) {
        var pageLink = document.createElement("a");
        pageLink.innerText = i;
        pageLink.name = i;
        footerColumn.appendChild(pageLink);
    }
    if (this.activePage < this.pagesCount) {
        var pageLinkNext = document.createElement("a");
        pageLinkNext.innerHTML = "&#9656;";
        pageLinkNext.name = this.activePage + 1;
        footerColumn.appendChild(pageLinkNext);
    }
    this.refreshPageLinksActivation();
    this.updateLinkFooterEvents();
}
GridView.prototype.hasFooter = function () {
    if (this.tableHandle.lastChild.firstChild.className != "gridViewFooter") return false;
    else return true;
}
/*
------removeChildNodes--------
- if you want remove all child nodes set only htmlElement parameter
- if you want remove child nodes at specifited index to end collection, set htmlElement and startIndex
- set all 3 parameters to remove child nodes at startIndex and count
*/
GridView.prototype.removeChildNodes = function (htmlElement, startIndex, count) {
    if (htmlElement == undefined) {
        console.log('nie podano parametru "htmlElement"');
        return;
    }
    if (startIndex == undefined && count == undefined) {
        while (htmlElement.childNodes.length > 0) {
            htmlElement.removeChild(htmlElement.firstChild);
        }
    }
    if (!isNaN(startIndex) && count == undefined) {
        var i = startIndex;
        while (i < htmlElement.childNodes.length) {
            htmlElement.removeChild(htmlElement.childNodes[i]);
            i++;
        }
    }
    if (!isNaN(startIndex) && !isNaN(count)){
        if (count < 1) {
            console.log('podano za mala wartosc parametru "count"');
            return;
        }
        var i = startIndex;
        var _count = 1;
        while (i < htmlElement.childNodes.length && _count < count) {
            htmlElement.removeChild(htmlElement.childNodes[i]);
            i++;
            _count++;
        }
    }
}
GridView.prototype.updateLinkFooterEvents = function () {
    var footerColumn = this.tableHandle.lastChild.firstChild;
    for (var i = 0; i < footerColumn.childNodes.length; i++) {
        footerColumn.childNodes[i].onclick = this.goToPage.bind(this);
    }
}
GridView.prototype.refreshPageLinksActivation = function () {
    var pageLinks = this.tableHandle.lastChild.firstChild;
    for (var i = 0; i < pageLinks.childNodes.length; i++) {
        if (parseInt(pageLinks.childNodes[i].name) == this.activePage)
            pageLinks.childNodes[i].setAttribute("style", this.notActiveLinkStyle);
        else pageLinks.childNodes[i].removeAttribute("style");
    }
}
GridView.prototype.pageNumberFromRowIndex = function (rowIndex) {
    var pageNumber = 1;
    while (rowIndex + 1 > this.rowsPerPage) {
        rowsPerPage += rowsPerPage;
        pageNumber++;
    }
    return pageNumber;
}
GridView.prototype.firstRowIndexOfPage = function (pageNumber) {
    return pageNumber * this.rowsPerPage - this.rowsPerPage;
}
GridView.prototype.updateDataSource = function (dataSource) {
    this.dataSource = dataSource;
    this.dataSourceKeys = Object.keys(dataSource[0]);
    if (this.lastRowOnTop) {
        this.dataSource.revers();
    }
}
GridView.prototype.getRowValues = function (row) {
    var i = 0;
    var _rowValues = [];
    if (this.showCheckBox) i = 1;
    for (i; i < row.childNodes.length; i++) {
        _rowValues.push(row.childNodes[i].innerText);
    }
    return _rowValues;
}
GridView.prototype.rowDataToJson = function (row) {
    var i = 0;
    var _json = {};
    if (this.showCheckBox) i = 1;
    for (i; i < row.childNodes.length; i++){
        _json[row.childNodes[i].attributes.name.value] = row.childNodes[i].innerText;
    }
    return _json;
}
GridView.prototype.findRowDataSourceIndex = function (row) {
    var _index = 0;
    var _rowValues = this.getRowValues(row);
    while (_index < this.dataSource.length && !this.compareRowValues(this.dataSource[_index], _rowValues)) _index++;
    if (_index == this.dataSource.length) return -1;
    else return _index;
}
GridView.prototype.compareRowValues = function (dataSourceRow, rowValuesArray) {
    var _keys = this.dataSourceKeys;
    var _i = 0;
    while (_i < _keys.length && dataSourceRow[_keys[_i]] == rowValuesArray[_i]) _i++;
    if (_i == _keys.length) return true;
    else return false;
}
GridView.prototype.setDataSourceStructure = function (dataSourceJsonRow) {
    var _dataSourceJsonRowKeys = this.dataSourceKeys;
    var _newJsonRow = {};
    var _i;
    for (var _j = 0; _j < this.dataSourceKeys.length; _j++) {
        _i = 0;
        while (_i < this.dataSourceKeys.length && this.dataSourceKeys[_j] != _dataSourceJsonRowKeys[_i]) _i++;
        if (_i < this.dataSourceKeys.length) _newJsonRow[_dataSourceJsonRowKeys[_j]] = dataSourceJsonRow[_dataSourceJsonRowKeys[_i].toString()];
        else _newJsonRow[_dataSourceJsonRowKeys
            [_j]] = "";
    }
    return _newJsonRow;
}
GridView.prototype.addRow = function (jsonRow) {
    var _rowEventArgs = new rowEventArgs();
    _rowEventArgs.jsonRow = jsonRow;
    _rowEventArgs._gridViewHandle = this.tableHandle;
    _rowEventArgs._dataSource = this.dataSource;
    if (this.onRowAdding != null) (this.onRowAdding)(_rowEventArgs);
    if (_rowEventArgs.cancel) return;
    if (this.lastRowOnTop){
        this.dataSource.unshift(this.setDataSourceStructure(jsonRow));
    }
    else{
        this.dataSource.push(this.setDataSourceStructure(jsonRow));
    }
    this.updateTable();
}
GridView.prototype.deleteRow = function (row) {
    var _rowDeletingEventArgs = new rowEventArgs();
    _rowDeletingEventArgs._gridViewHandle = this.tableHandle;
    _rowDeletingEventArgs.jsonRow = this.rowDataToJson(row);
    _rowDeletingEventArgs._dataSource = this.dataSource;
    if (this.onRowDeleting != null) (this.onRowDeleting)(_rowDeletingEventArgs);
    if (_rowDeletingEventArgs.cancel) return;
    var _rowIndex = this.findRowDataSourceIndex(row);
    if (_rowIndex > -1) this.dataSource.splice(_rowIndex, 1);
    this.updateTable();
}
GridView.prototype.updateRow = function (rowToUpdate, newJsonRow) {
    var _rowKeys = this.dataSourceKeys;
    var _updatingRowEventArgs = new updatingRowEventArgs();
    _updatingRowEventArgs.jsonRow = this.setDataSourceStructure(newJsonRow);
    _updatingRowEventArgs._oldJsonRow = this.rowDataToJson(rowToUpdate);
    _updatingRowEventArgs._gridViewHandle = this.tableHandle;
    _updatingRowEventArgs._dataSource = this.dataSource;
    if (this.onRowUpdating != null) (this.onRowUpdating)(_updatingRowEventArgs);
    var _dataSourceIndexToUpdate = this.findRowDataSourceIndex(rowToUpdate);
    this.dataSource[_dataSourceIndexToUpdate] = _updatingRowEventArgs.jsonRow;
    this.updateTable();
}
//--------------------------------------events------------------------------------------------
GridView.prototype._rowClick = function () {
    var _jsonRow = this.rowDataToJson(e.target.parentNode);
    var _rowClickEventArgs = {
        gridViewHandle: this.tableHandle,
        rowHandle: e.target.parentNode,
        jsonRow: _jsonRow,
        dataSource:this.dataSource
    };
    if (this.onRowClick != null) (this.onRowClick)(_rowClickEventArgs);
}
GridView.prototype._checkedChanged = function (e) {
    if (this.showCheckBox){
        var _checkedChangedEventArgs = new checkedChangedEventArgs();
        _checkedChangedEventArgs._gridViewHandle = this.tableHandle;
        _checkedChangedEventArgs._dataSource = this.dataSource;
        _checkedChangedEventArgs.jsonRow = this.rowDataToJson(e.target.parentNode);
        _checkedChangedEventArgs._checked = e.target.checked;
        if (this.onCheckedChanged != null) (this.onCheckedChanged)(_checkedChangedEventArgs);
    }
}

//-----------------------------------eventObjects----------------------------------------------
function rowEventArgs() {
    this._gridViewHandle = null;
    this._dataSource = null;
    this._jsonRow = null;
    this._cancel = false;
}
rowEventArgs.prototype = {
    get jsonRow() {
        return this._jsonRow;
    },
    set jsonRow(value) {
        this._jsonRow = value;
    },
    get gridViewHandle() {
        return this._gridViewHandle;
    },
    get dataSource() {
        return this._dataSource;
    },
    set dataSource(value) {
        this._dataSource = value;
    },
    get cancel() {
        return this._cancel;
    },
    set cancel(value) {
        this._cancel = value;
    }
}
function updatingRowEventArgs() {
    this._oldJsonRow = null;
}
updatingRowEventArgs.prototype = new rowEventArgs();
Object.defineProperty(updatingRowEventArgs.prototype, "oldJsonRow", {
    get: function () {
        return this._oldJsonRow;
    }
})
function checkedChangedEventArgs() {
    this._checked = false;
}
checkedChangedEventArgs.prototype = new rowEventArgs();
Object.defineProperty(checkedChangedEventArgs.prototype, "checked", {
    get: function () {
        return this._checked;
    }
})