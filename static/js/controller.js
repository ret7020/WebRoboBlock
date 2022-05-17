function send_direction(direction, steps_cnt, speed=1000){
    if ($('#enabled_status')[0].checked){
        let data = [{"action": direction, "speed": speed}];
        if (direction == "forward" || direction == "backward"){
            data[0]["distance"] = steps_cnt;
        }else{
            data[0]["angle"] = steps_cnt;
        }
        console.log(data);
        $.ajax({
            url: "/run",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(data){
                toastr.info('OK');
            },
            error: function(error){
                toastr.error("Fail; Check your RPI.");
            }
        });
    }else{
        toastr.warning("You do not turn on manual controller mode")
    }
}

document.onkeydown = checkKey;

function checkKey(e) {
    if ($('#enabled_status')[0].checked){
        e = e || window.event;
        let dir = null;
        let steps_cnt = 1000;

        if (e.keyCode == '38') {
            dir = "forward";
        }
        else if (e.keyCode == '40') {
            dir = "forward";
            steps_cnt *= -1;
        }
        else if (e.keyCode == '37') {
            dir = "left";
            steps_cnt = 90;
        }
        else if (e.keyCode == '39') {
            dir = "right";
            steps_cnt = 90;
        }
        if (dir != null){
            send_direction(dir, steps_cnt);
        }
    }else{
        toastr.warning("You do not turn on manual controller mode");
    }


}