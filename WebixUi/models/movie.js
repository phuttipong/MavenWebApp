define([], function () {

    // var collection = new webix.DataCollection({
    // 	url:"rest->/records.php",
    // 	save:"rest->/records.php"
    // });
    // url:"rest->/records.php" defines the URL of the data loading script
    // save:"rest->/records.php" defines the URL of the data saving script

    var collection = new webix.DataCollection({url: 'jsonSecure->sc/movie/list'});

    return {
        data: collection
    };
});