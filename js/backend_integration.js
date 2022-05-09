function send_ajax(){
    run();
    var json_data_object = JSON.parse($(".raw_json").text());
    console.log(json_data_object);

    $.ajax({
        url: "http://127.0.0.1:5000/deploytorpi",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(json_data_object),
        success: function(data){
            toastr.info('Transaction completed; Check status directly in local FLASK server admin panel.');
        },
        error: function(error){
            toastr.error("Fail; Check your local FLASK server.")
        }
    });

}