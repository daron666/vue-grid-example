Vue.component("grid", {
    props: { lines: Array, header: Array, sortableColumns: Array },
    template: "#grid-template",
    data: function () {
        var sortOrders = {};
        _.forEach(this.sortableColumns, function(name) { sortOrders[name] = 1;});
        return {
            sortKey: "",
            sortOrders: sortOrders
        }
    },
    computed: {
        sortedLines: function () {
            var sortKey = this.sortKey;
            var order = this.sortOrders[sortKey] || 1;
            var lines = this.lines;
            if (sortKey) {
                lines = lines.sort(function (a, b) {
                    a = a[sortKey];
                    b = b[sortKey];
                    return (a === b ? 0 : a > b ? 1 : -1) * order;
                })
            }
            return lines;
        }
    },
    methods: {
        sortBy: function (key) {
            if (this.sortableColumns.indexOf(key) > -1 ) {
                this.sortKey = key;
                this.sortOrders[key] = this.sortOrders[key] * -1;
            }
        },
        showArrow: function (key) {
            return this.sortableColumns.indexOf(key) > -1;
        }
    }
});
