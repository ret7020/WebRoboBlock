function save_project(json_compiled_obj){
    console.log("Not usefull for some time");
}

function load_project(json_compiled_string){
    var project_data_json = JSON.parse($(".json_content").val());
    var opts_tmp;
    $.each(project_data_json, function(index, val){
        opts_tmp = logo.cmds[val["action"]];
        $.each(val, function(arg){
          if (arg != "action"){
              opts_tmp["params"][opts_tmp["params"].findIndex(x => x.id == arg)].val = val[arg];
          }
        });
        $("#code-contents").append(createBlock(val["action"], opts_tmp, true, index));
        $("#code-contents").append(createDivider());
        //var block_def = logo["cmds"][val["action"]];
        //block_def["params"][0]["val"] = val["data"];
        //$("#code-contents").append(createBlock(val["action"], block_def));
        //$("#code-contents").append(createDivider());
    });
    
}

function export_as_html(){
  var source = $("#code-contents").clone();
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(source));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", "project.html");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function import_project(json_prj_string){
  var obj = JSON.parse(json_prj_string);
  $("#code-contents").html(obj);
}



var modal = document.getElementById("myModal");
var btn = document.getElementById("load_project");
var span = document.getElementById("close_modal");
btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}


var modal_settings = document.getElementById("settinsgModal");
var btn = document.getElementById("settings");
var span = document.getElementById("close_settings");
btn.onclick = function() {
  modal_settings.style.display = "block";
}
span.onclick = function() {
  modal_settings.style.display = "none";
}





window.onclick = function(event) {
  if (event.target == modal_settings || event.target == modal) {
    modal_settings.style.display = "none";
    modal.style.display = "none";
  }
}
