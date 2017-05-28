var app = new Vue({
    el: '#app',
    data: prepareData(rawData)
});

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function prepareLabel(label) {
    return _.capitalize(label.split("_").join(" "));
}

function prepareData(rawData) {
    var names = rawData.result[0].names
    var columns = rawData.result

    var lines = _.map(names, function (currentName) {
        var line = _.map(columns, function (column) {
            var value = _.find(column.values, function (value) {
                return value.name === currentName;
            });
            return _.merge(value, {dateTimeLabel: column.label, dateTime: column.start});
        });
        var sortedLine = _.sortBy(line, function (line) {
            return line.dateTime;
        });
        var total = _.reduce(sortedLine, function (acc, n) {
            return (acc + n.value);
        }, 0)
        return {
            name: prepareLabel(sortedLine[0].label),
            sortedValues: sortedLine,
            total: _.ceil(total / 1000)
        }
    });

    var header = ["Index", "Category"].concat(generateHeaderDates(lines)).concat(["Total"])

    var indexes = [];
    for (i = 0; i < lines.length; i ++ ) {
       indexes.push(i + 1);
    }

    var dataLines = _.zipWith(lines, indexes, function (line, index) {
        var datas = _.reduce(line.sortedValues, function (acc, elem) {
            var newObject = {};
            newObject[elem.dateTimeLabel] = _.ceil(elem.value / 1000);
            var merged = _.merge(acc, newObject);
            return merged;
        }, {});
        return _.merge(datas, {Index: index, Category: line.name, Total: line.total});
    });

    return {lines: dataLines, header: header, sortableColumns: ["Index", "Category", "Total"]};
}

function generateHeaderDates(preparedLines) {
    return _.map(preparedLines[0].sortedValues, function(value) { return value.dateTimeLabel; });
}






