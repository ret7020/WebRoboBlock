function save_project(json_compiled_obj){
    console.log("Not usefull for some time");
}

function load_project(json_compiled_string){
    var project_data_json = JSON.parse($(".json_content").val());
    $.each(project_data_json, function(index, val){
        console.log(val);
        var block_def = logo["cmds"][val["action"]];
        block_def["params"][0]["val"] = val["data"];
        $("#code-contents").append(createBlock(val["action"], block_def));
        $("#code-contents").append(createDivider());
    });
    
}

var modal = document.getElementById("myModal");
var btn = document.getElementById("load_project");
var span = document.getElementsByClassName("close")[0]; 
btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
