var draggingElementParent;
function dragOver(){
    event.preventDefault();
}
function dragStart(){
    draggingElementParent="#"+$("#"+event.target.id).parent().prop("id");
    event.dataTransfer.setData("text", event.target.id);
}
function drop(){
    event.preventDefault();
    var droppingElement="#"+event.target.id;
    var data = event.dataTransfer.getData("text");
    var droppingElementParent="#"+$(droppingElement).parent().prop("id");
      if(droppingElement=="#sub1"||droppingElement=="#sub2"){
         if(droppingElement!== draggingElementParent){
              $(droppingElement).append($("#"+data));
        }
     }  
     else{
      if(droppingElementParent!== draggingElementParent){
         $(droppingElement).parent().append($("#"+data));
      }
     }
}
$(document).ready(function(){
    $(document).on("dragover","#sub2,#sub1",dragOver);
    $(document).on("drop","#sub2,#sub1",drop);
    $("#blank,#user1,#user2,#user3,#user4,#user5,#user6,#user7").on("dragstart",dragStart);   //instead of this put a for loop and add event listeneras.
});
