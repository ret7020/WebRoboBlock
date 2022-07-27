let blocks = "";
if ($(document).width() <= 660){
    close_menu();
}

function close_menu(){
    blocks = $("#menu-contents").html();
    $("#aval_blocks_heading").html("<a onclick='open_menu()' style='cursor: pointer' id='menu_toggle'>#</a>");
    $("#menu-contents").html("");
    $("body").css("grid-template-columns", "9% auto");
}

function open_menu(){
    $("body").css("grid-template-columns", "35% auto");
    $("#menu_toggle").attr("onclick", "close_menu()");
    $("#menu-contents").html(blocks);
}
