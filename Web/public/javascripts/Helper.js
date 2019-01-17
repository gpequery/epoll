function getDateHtmlFromTimeStamp(timestamp) {
    let date = new Date(parseInt(timestamp));

    let day = addPadding(date.getDate());
    let month = addPadding(date.getMonth() + 1);
    let year = date.getFullYear();

    return day + '-' + month + '-' + year;
}

function addPadding(number, size = 2 , char = '0', before = true) {
    while (number.toString().length < size) {
        number = before ? char + number : number + char;
    }

    return number;
}