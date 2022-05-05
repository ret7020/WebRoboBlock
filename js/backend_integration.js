function send_ajax(){
    try{
        var json_data_object = JSON.parse($(".raw_json").text());
        console.log(json_data_object);

        $.ajax({
            url: "http://127.0.0.1:5000/deploytorpi",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(json_data_object),
            success: function(data){
                alert("Transaction completed; Check status directly in local http server admin panel.");
            },
            error: function(error){
                alert("Check FLASK server");
            }
        });

    }catch (e){
        if (e instanceof SyntaxError) {
            alert("You have to run(compile) script first!");
            alert(e);
        }
    }
}