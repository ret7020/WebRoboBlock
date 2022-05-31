function send_ajax(){
    run();
    var json_data_object = JSON.parse($(".raw_json").text());
    console.log(json_data_object);

    $.ajax({
        url: "/run",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(json_data_object),
        success: function(data){
            toastr.info('OK');
        },
        error: function(error){
            toastr.error("Fail; Check your local FLASK server.")
        }
    });

}

function stop_program(){
    $.ajax({
        url: "/stop_program",
        type: "GET",
        success: function(data){
            toastr.info('OK');
        },
        error: function(error){
            toastr.error("Fail; Check your local FLASK server.")
        }
    });
}