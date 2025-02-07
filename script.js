// Hàm để tạo và thêm các dòng vào bảng
function addRowToTable(table, rowData, isBold) {
    var row = table.insertRow();
    for (var i = 0; i < rowData.length; i++) {
        var cell = row.insertCell(i);
        cell.innerHTML = rowData[i];
        // Thêm lớp class selector nếu dòng cần in đậm
        if (isBold) {
            row.classList.add("bold-row");
        }
    }
}

// Hàm để xử lý nội dung XML và trình bày trên bảng HTML
function processXML(xmlContent) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlContent, "text/xml");

    // Tạo bảng HTML
    var table = document.createElement("table");
    table.classList.add("gold-table");

    // Thêm tiêu đề cho bảng
    var headerData = ["Giá vàng trong nước", "Mua", "Bán"];
    addRowToTable(table, headerData, true);

    // Lấy thông tin từ XML và thêm vào bảng
    var rows = xmlDoc.getElementsByTagName("Row");
    for (var i = 0; i < rows.length; i++) {
        var name = rows[i].getAttribute("Name");
        var buy = parseFloat(rows[i].getAttribute("Buy").replace(',', '')) * 1000;
        var sell = parseFloat(rows[i].getAttribute("Sell").replace(',', '')) * 1000;
        var rowData = [name, formatNumber(buy), formatNumber(sell)];
        addRowToTable(table, rowData, false);
    }

    // Thêm bảng vào thẻ có id là "goldTable" trên trang HTML
    document.getElementById("goldTable").appendChild(table);

    // Hiển thị thời gian cập nhật dưới phía dưới của bảng
    var updateTime = xmlDoc.querySelector("DateTime").textContent;
    var updateDiv = document.createElement("div");

    // Chuyển đổi định dạng thời gian
    var parsedDate = parseDateTime(updateTime);
    if (parsedDate) {
        updateTime = parsedDate.toLocaleString('vi-VN', { hour12: false });
        updateDiv.innerHTML = "Cập nhật lúc: " + updateTime;
    } else {
        updateDiv.innerHTML = "Không thể đọc được thời gian cập nhật.";
    }
    updateDiv.classList.add("update-time");
    document.getElement ById("goldTable").appendChild(updateDiv);
}

// Hàm để tải nội dung từ đường dẫn web và gọi hàm xử lý XML
function getGoldPrice() {
    var url = 'https://file.hstatic.net/200000567741/file/getgoldprice_1d56257d4a49409a84aa5856ff3d96ff.js';
    // Sử dụng XMLHttpRequest để tải nội dung
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Gọi hàm xử lý XML khi nội dung đã được tải về
            processXML(this.responseText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

// Gọi hàm để bắt đầu quá trình
getGoldPrice();

// Hàm để định dạng số theo kiểu Việt Nam
function formatNumber(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}

// Hàm để chuyển đổi định dạng thời gian
function parseDateTime(dateTimeStr) {
    var parts = dateTimeStr.match(/(\d{2}):(\d{2}) (\d{2})-(\d{2})-(\d{4})/);
    if (parts) {
        var year = parseInt(parts[5], 10);
        var month = parseInt(parts[4], 10) - 1;
        var day = parseInt(parts[3], 10);
        var hour = parseInt(parts[1], 10);
        var minute = parseInt(parts[2], 10);
        return new Date(year, month, day, hour, minute);
    }
    return null;
}