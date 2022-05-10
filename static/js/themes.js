function change_theme(theme_id=1){
    if (theme_id == 0) {//Dark
        
    }else{ //Light
        $("body").css("background", "#cac6c6");
        $("#menu").css("background", "white");
        $(".block-arg").css("color", "black");
        $(".block").css("background", "rgb(217, 217, 217)");
        $(".blocks-wrapper").css("background", "#cac6c6");
        $(".panel").css("background", "white");
        $(".ionicon.s-ion-icon").css("stroke", "black");
        
        
    }
}