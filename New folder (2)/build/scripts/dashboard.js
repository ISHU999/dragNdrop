$(function() {

    var supervisorData;
    var totalPersons;
    var prevTarget = null;

    load = function() {
        console.log(localStorage.admin);
        if (localStorage.admin === "true") {
            console.log("admin");
            var adminId = localStorage.id;
            renderProfile("admin", adminId);
            db.accessData("getData", "supervisor", {}, function(response) {
                    supervisorData = response;
                    totalPersons = response.length;
                    //console.log(supervisorData);
                    var sortedResponse = sorting(response)
                    populateSupervisor(sortedResponse);
                    pagination($('.supervisor-details'), $('#supervisor-next-button'), $('#supervisor-prev-button'));
                },
                function(error) {
                    console.error(error);
                });
            $("#supervisee-paginate-btn").hide();
        } else {
            console.log("supervisor");
            var supervisorId = localStorage.id;
            renderProfile("supervisor", supervisorId);
            $(".supervisor-division").addClass("hidden");
            $(".supervisee-division").removeClass("col-lg-6");
            $(".supervisee-division").addClass("col-lg-12");
            $(".supervisor-heading").hide();
            $(".supervisee-heading").addClass("supervisee-list-heading");
            
            db.accessData("getDataByAttribute", "supervisee", {attribute:{"supervisor":supervisorId}}, function(response){
                
                var sortedResponse=sorting(response)
                populateSupervisee(sortedResponse,$('#supervisee-list'));
                $("#add-supervisee-div").addClass("hidden");
                pagination($('.supervisee-details'),$('#supervisee-next-button'),$('#supervisee-prev-button'));
                
            },
            function(error){
                console.error(error)
            });
        }
    }

    // Sorting
    sorting = function(response) {
        response.sort(function(curr, next) {
            return curr["firstName"] <= next["firstName"] ? -1 : 1;
        });
        return response;
    }

    // Data population
    populateSupervisor = function(response){
        var container="";
        for(var i=0;i<response.length;i++)
        {
             
            container += createContainer(response[i].firstName, response[i].lastName, response[i].id, "supervisor-details", response[i].image);                        

        }
        $("#supervisor-list").html(container);
        $(".highlight").click(function() {
            var supervisorId = $(this).data('id');
            db.accessData("getDataByAttribute", "supervisee", { attribute: { "supervisor": supervisorId } }, function(response) {
                    var sortedResponse = sorting(response)
                    populateSupervisee(sortedResponse, $("#supervisee-list"));
                    $("#supervisee-paginate-btn").show();
                    pagination($('.supervisee-details'), $('#supervisee-next-button'), $('#supervisee-prev-button'));
                },
                function(error) {
                    console.error(error)
                });
        });
        $(".highlight").click(function() {

          
            if (!prevTarget) {
                $(this).addClass("selection");

                prevTarget = (event.currentTarget.className).slice(10);
                $("img[alt='Supervisor Edit Button']", $("." + prevTarget)).addClass("hidden");
                $("img[alt='Supervisor Delete Button']", $("." + prevTarget)).addClass("hidden");
                $(".glyphicon-chevron-right", $("." + prevTarget)).removeClass("hidden");
                console.log(prevTarget);
            } else {
                $(".glyphicon-chevron-right", $("." + prevTarget)).addClass("hidden");

                $("img[alt='Supervisor Edit Button']", $("." + prevTarget)).removeClass("hidden");
                $("img[alt='Supervisor Delete Button']", $("." + prevTarget)).removeClass("hidden");
                $("." + prevTarget).removeClass("selection");
                $(this).addClass("selection");
                console.log("here");
                prevTarget = (event.currentTarget.className).slice(10);
                $("img[alt='Supervisor Edit Button']", $("." + prevTarget)).addClass("hidden");
                $("img[alt='Supervisor Delete Button']", $("." + prevTarget)).addClass("hidden");
                $(".glyphicon-chevron-right", $("." + prevTarget)).removeClass("hidden");
            }
        });
    }

    populateSupervisee = function(response, parentContainer) {
        var container = "";
        console.log(response[0]);
        for (var i = 0; i < response.length; i++) {
            console.log(response[i].firstName);
            container += createContainer(response[i].firstName, response[i].lastName, response[i].id, "supervisee-details", response[i].image);
        }
        container += '<div class="row row-margin supervisor-border sup-div-height supervisee-details" id="add-supervisee-div">' +
            '<div>' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 div-height">' +
            '<img src="img/profile-default.png" alt="Supervisor pic" class="supervisor-pic img-circle">' +
            '</div>' +
            '<div class="col-lg-6 col-md-6 col-sm-5 col-xs-5 div-align ">' +
            '<p class="emp-name">Supervisee</p>' +
            '<p class="emp-id">XXXXXX</p>' +
            '</div>' +
            '<div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 div-height display-flex icon-padding">' +
            '<img src="img/add-button.png" alt="" class="icons">' +
            '</div>' +
            '</div>' +
            '</div>';
            console.log(parentContainer);
        parentContainer.html(container);
    }

    createContainer = function(firstName, lastName, id, type, image) {
        var container = "";
        container += '<div class="row row-margin supervisor-border sup-div-height ' + type + '" >' +
            '<div class="highlight" data-id="' + id + '" data-clicked="0">' +
            '<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 div-height info-hover">' +
            '<img src="' + image + '" alt="Supervisor pic" class="supervisor-pic img-circle">' +
            '</div>' +
            '<div class="col-lg-6 col-md-6 col-sm-5 col-xs-5 div-align info-hover">' +
            '<p class="emp-name">' + firstName + " " + lastName + '</p>' +
            '<p class="emp-id">' + id + '</p>' +
            '</div>' +
            '<div class="col-lg-2 col-md-2 col-sm-3 col-xs-3 div-height display-flex icon-padding">' +
            '<span class="icons glyphicon glyphicon-chevron-right hidden"></span>' +
            '<img src="img/edit-button.png" alt="Supervisor Edit Button" class="icons">' +
            '<img src="img/delete-button.png" alt="Supervisor Delete Button" class="icons">' +
            '</div>' +
            '</div>' +
            '</div>';
        return container;
    }

    // Search Functionality
    searchHandler = function() {
        var searchField = $("#search-bar").val().toLowerCase();
        var searchList = [];
        $.each(supervisorData, function(index, item) {
            if ((item.firstName.toLowerCase().indexOf(searchField) > -1) || (item.lastName.toLowerCase().indexOf(searchField) > -1) || ((item.id).toString().indexOf(searchField) > -1)) {
                searchList.push(item);
            }
        });
        if (searchList.length > 0) {
            var container = populateSupervisor(searchList);
        } else {
            container = "No results found";
        }
        $("#supervisor-list").html(container);
        pagination($('.supervisor-details'), $('#supervisor-next-button'), $('#supervisor-prev-button'));
        searchList = null;
    }

    // Populating profile
    renderProfile = function(table, id) {
        db.accessData("getDataByAttribute", table, { attribute: { "id": id } }, function(response) {
                $("#header-name").html(response[0].firstName + " " + response[0].lastName);
                $("#header-profile-picture").attr("src", response[0].image);
                $("#dropdown-profile-picture").attr("src", response[0].image);
                $("#profile-picture").attr("src", response[0].image);
                $("#name").html(response[0].firstName + " " + response[0].lastName);
                if (table === "admin") {
                    $("#user-type").html("Super User");
                } else if (table === "supervisor") {
                    $("#user-type").html("Supervisor");
                }
                $("#emp-id").html(response[0].id);
                $("#business-unit").html(response[0].businessUnit);
                $("#role").html(response[0].role);
                $("#unit").html(response[0].unit);
            },
            function(error) {
                console.log(error);
            });
    }

    // Pagination Function
    pagination = function(personDetails, next, prev) {
        var maxPersonsPerPage = 5;
        var currentPage = 1;
        personDetails.hide();
        var totalPersons = personDetails.length;
        var totalPages = Math.ceil(totalPersons / maxPersonsPerPage);

        changePage(maxPersonsPerPage, currentPage, personDetails, prev, next, totalPages);

        next.off('click').on('click', function() {
            if (currentPage < totalPages) {
               
                currentPage++;
                changePage(maxPersonsPerPage, currentPage, personDetails, prev, next, totalPages);
            }
        });
        prev.off('click').on('click', function() {
            if (currentPage > 1) {
                currentPage--;
                changePage(maxPersonsPerPage, currentPage, personDetails, prev, next, totalPages);
            }
        });
    }

    changePage = function(maxPersonsPerPage, currentPage, personDetails, prev, next, totalPages) {
        personDetails.hide();

        if (currentPage === 1)
            prev.addClass("btn-disabled");
        else
            prev.removeClass("btn-disabled");

        if (currentPage === totalPages)
            next.addClass("btn-disabled");
        else
            next.removeClass("btn-disabled");

        for (var i = 1; i <= maxPersonsPerPage; i++) {
            $(personDetails[currentPage * maxPersonsPerPage - i]).show();
        }
    }
    load();

    $("#search-bar").bind({ "keyup": searchHandler }, { "search": searchHandler });

    $(window).click(function() {
        if (!(event.target.matches('#dropdown-btn'))) {
            $("#dropdown-container").addClass("hidden");
        } else {
            $("#dropdown-container").toggleClass("hidden");
        }
    });

    $("#logout").on("click",function(){
        db.logout();
    });
    var dragAndDrop=function(){
        var toggle=$('#re-assign-toggle')
    }
    
//---------------------------------Drag and Drop--------------------------------------------//
var clicked=function(){
    console.log($(this).data("clicked"));
    debugger;
                    if(countClicks===0){
                        console.log($(this).data("clicked"));
                        debugger;
                        if($(this).data("clicked")===0){

                countClicks++;debugger;
                if($(this).hasClass("selection")){
                 $(this).data('clicked', 1);}
                 console.log($(this).data("clicked"));
                    $(this).addClass("selection-t");
                  
                var supervisorId = $(this).data('id');
                console.log(supervisorId);
                db.accessData("getDataByAttribute", "supervisee", {attribute:{"supervisor":supervisorId}}, function(response){
                    var sortedResponse=sorting(response);
                    populateSupervisee(sortedResponse,$("#first_supervisors_supervisee"));
                    $(".supervisee-details").addClass("display-important");
                    $("#supervisee-paginate-btn").show();
                    pagination($('.supervisee-details'),$('#supervisee-next-button'),$('#supervisee-prev-button'));
                },
                function(error){
                    console.error(error)
                });
                    }
                    else{
                        countClicks--;debugger;
                        if($(this).hasClass("selection")){
                 $(this).data('clicked', 0);}
                        
                        $(this).removeClass("selection");
                        $(this).removeClass("selection-t");
                          $(".glyphicon-chevron-right", $(this)).addClass("hidden");

                $("img[alt='Supervisor Edit Button']", $(this)).removeClass("hidden");
                $("img[alt='Supervisor Delete Button']", $(this)).removeClass("hidden");
                populateSupervisee(null,$("#second_supervisors_supervisee"));
                    $(".supervisee-details").addClass("display-important");
                    $("#supervisee-paginate-btn").show();
                    pagination($('.supervisee-details'),$('#supervisee-next-button'),$('#supervisee-prev-button'));
               


                    }
                
                
                }
                else if(countClicks===1){
                    debugger;
                        if($(this).data("clicked")==0){
                        console.log($(this).data("clicked"));
 if($(this).hasClass("selection")){
                 $(this).data('clicked', 1);}
                countClicks++;debugger;
                    $(this).addClass("selection-t");
                    
                var supervisorId = $(this).data('id');
                console.log(supervisorId);
                db.accessData("getDataByAttribute", "supervisee", {attribute:{"supervisor":supervisorId}}, function(response){
                    var sortedResponse=sorting(response);
                    populateSupervisee(sortedResponse,$("#second_supervisors_supervisee"));
                    $(".supervisee-details").addClass("display-important");
                    $("#supervisee-paginate-btn").show();
                    pagination($('.supervisee-details'),$('#supervisee-next-button'),$('#supervisee-prev-button'));
                },
                function(error){
                    console.error(error)
                });
                 
                 console.log($(this).data("clicked"));
                    }
                    else{
                        countClicks--;debugger;
                        if($(this).hasClass("selection")){
                 $(this).data('clicked', 0);}
                        $(this).removeClass("selection-t");
                        $(this).removeClass("selection");
                          $(".glyphicon-chevron-right", $(this)).addClass("hidden");

                $("img[alt='Supervisor Edit Button']", $(this)).removeClass("hidden");
                $("img[alt='Supervisor Delete Button']", $(this)).removeClass("hidden");
                populateSupervisee(null,$("#second_supervisors_supervisee"));
                    $(".supervisee-details").addClass("display-important");
                    $("#supervisee-paginate-btn").show();
                    pagination($('.supervisee-details'),$('#supervisee-next-button'),$('#supervisee-prev-button'));
               


                    }
                
                
                }

                else if(countClicks===2){
                    debugger;
                    if($(this).data("clicked")==0){
                         $(this).removeClass("selection");
                          $(".glyphicon-chevron-right", $(this)).addClass("hidden");

                $("img[alt='Supervisor Edit Button']", $(this)).removeClass("hidden");
                $("img[alt='Supervisor Delete Button']", $(this)).removeClass("hidden");
                    }
                    else{
                         countClicks--;debugger;
                        if($(this).hasClass("selection")){
                 $(this).data('clicked', 0);debugger;}
                        $(this).removeClass("selection-t");
                        $(this).removeClass("selection");
                          $(".glyphicon-chevron-right", $(this)).addClass("hidden");

                $("img[alt='Supervisor Edit Button']", $(this)).removeClass("hidden");
                $("img[alt='Supervisor Delete Button']", $(this)).removeClass("hidden");
                populateSupervisee(null,$("#second_supervisors_supervisee"));
                    $(".supervisee-details").addClass("display-important");
                    $("#supervisee-paginate-btn").show();
                    pagination($('.supervisee-details'),$('#supervisee-next-button'),$('#supervisee-prev-button'));
               

                    }
                }
            }
             var countClicks=0;debugger;
$("#re-assign-toggle").change(function(){

    if($("#re-assign-toggle").is(":checked")){
        countClicks=0;debugger;
       
        $(".supervisor-details").unbind('click');
        $('#div-toggle-off').addClass("hidden");
        $('#div-toggle-on').removeClass("hidden");
        var selectedSupervisor=$(".highlight");
        if(selectedSupervisor.hasClass("selection")){
           
                 console.log(selectedSupervisor.data("clicked"));
                   if(countClicks===0){
                        debugger;
                        console.log(selectedSupervisor.data("clicked"));
                        if(selectedSupervisor.data("clicked")===0){

                countClicks++;debugger;
                if(selectedSupervisor.hasClass("selection")){
                 selectedSupervisor.data('clicked', 1);}
                 console.log(selectedSupervisor.data("clicked"));
                 debugger;
                  $(this).addClass("selection-t");
                 
                var supervisorId = selectedSupervisor.data('id');
                console.log(supervisorId);
                db.accessData("getDataByAttribute", "supervisee", {attribute:{"supervisor":supervisorId}}, function(response){
                    var sortedResponse=sorting(response);
                    populateSupervisee(sortedResponse,$("#first_supervisors_supervisee"));
                    $(".supervisee-details").addClass("display-important");
                    $("#supervisee-paginate-btn").show();
                    pagination($('.supervisee-details'),$('#supervisee-next-button'),$('#supervisee-prev-button'));
                },
                function(error){
                    console.error(error)
                });
                    }
                    else{
                        countClicks--;debugger;
                        
                        selectedSupervisor.removeClass("selection");
                        selectedSupervisor.removeClass("selection-t");
                        selectedSupervisor.attr("data-clicked",0);
                          $(".glyphicon-chevron-right", selectedSupervisor).addClass("hidden");

                $("img[alt='Supervisor Edit Button']", selectedSupervisor).removeClass("hidden");
                $("img[alt='Supervisor Delete Button']", selectedSupervisor).removeClass("hidden");
                populateSupervisee(null,$("#second_supervisors_supervisee"));
                    $(".supervisee-details").addClass("display-important");
                    $("#supervisee-paginate-btn").show();
                    pagination($('.supervisee-details'),$('#supervisee-next-button'),$('#supervisee-prev-button'));
               


                    }
                
                
                }
        }
        
                 selectedSupervisor.click(clicked);
    }
    else{
        if($(".highlight").hasClass("selection")){
             
                 $(this).attr("data-clicked",0);
                 console.log($(this).data("clicked"));
                 selectedSupervisor.removeClass("selection");
                        selectedSupervisor.removeClass("selection-t");
                        selectedSupervisor.attr("data-clicked",0);
                          $(".glyphicon-chevron-right", selectedSupervisor).addClass("hidden");

                $("img[alt='Supervisor Edit Button']", selectedSupervisor).removeClass("hidden");
                $("img[alt='Supervisor Delete Button']", selectedSupervisor).removeClass("hidden");
        }
            $('#div-toggle-on').addClass("hidden");
        $('#div-toggle-off').removeClass("hidden");
            
        $(".highlight").click(function(){
                var supervisorId = $(this).data('id');
                db.accessData("getDataByAttribute", "supervisee", {attribute:{"supervisor":supervisorId}}, function(response){
                    var sortedResponse=sorting(response)
                    populateSupervisee(sortedResponse,$('#supervisee-list'));
                    $("#supervisee-paginate-btn").show();
                    pagination($('.supervisee-details'),$('#supervisee-next-button'),$('#supervisee-prev-button'));
                },
                function(error){
                    console.error(error)
                });
            });
    }
});
 
    
});





// var draggingElementParent;
// function dragOver(){
//     event.preventDefault();
//    
// }
// function dragStart(){
//     draggingElementParent="#"+$("#"+event.target.id).parent().prop("id");
//     event.dataTransfer.setData("text", event.target.id);
// }
// function drop(){
//     event.preventDefault();
//     var droppingElement="#"+event.target.id;
//     var data = event.dataTransfer.getData("text");
//     var droppingElementParent="#"+$(droppingElement).parent().prop("id");
//       if(droppingElement=="#sub1"||droppingElement=="#sub2"){
//          if(droppingElement!== draggingElementParent){
//               $(droppingElement).append($("#"+data));
//         }
//      }  
//      else{
//       if(droppingElementParent!== draggingElementParent){
//          $(droppingElement).parent().append($("#"+data));
//       }
//      }
// }
// $(function(){
//     $(document).on("dragover","#first_supervisors_supervisee,#second_supervisors_supervisee",dragOver);
//     $(document).on("drop","#first_supervisors_supervisee,#second_supervisors",drop);
//     $("#blank,#user1,#user2,#user3,#user4,#user5,#user6,#user7").on("dragstart",dragStart);   //instead of this put a for loop and add event listeneras.
// });
//---------------------------------End------------------------------------------------------//
