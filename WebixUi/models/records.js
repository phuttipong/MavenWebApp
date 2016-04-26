define([], function () {

    var collection = new webix.DataCollection({
        url: "http://localhost:8080/api/movie/getList"
    });

    return {
        data: collection
    };
});