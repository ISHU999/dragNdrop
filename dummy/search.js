
    function search(superviseesData) {
        console.log("inside function search");
        $("#"+searchBarDesk).bind({"keyup": searchHandler},
        {"search":searchBarDeskHandler}
        );
        searchBarDesk.data = superviseesData;
    }
    function searchHandler() {
          console.log("inside function searchHandler");
        var searchField;
        superviseesData = event.currentTarget.data;
            searchField = searchBarDesk.value.toLowerCase();
        var searchList = [];
        superviseesData.forEach(function(item,index) {
            if ((item.name.toLowerCase().indexOf(searchField) > -1) || (item.id.indexOf(searchField) > -1)) {
                searchList.push(item);
            }
        });
        if (searchList.length > 0) {
            renderSuperviseesDivision(searchList);
            searchList = null;
        } else {
            superviseeList.innerHTML = "<h3>No results found</h3>";
        }
    }
    function searchBarDeskHandler() {
        console.log("inside function searchBarDeskHandler");
        superviseesData = event.currentTarget.data;
        renderSuperviseesDivision(superviseesData);
    }