function updateShotServerReq(){
    $.ajax({
        url: "/camera_shot",
        context: document.body
      }).done(function() {
        $("#rpi_camera").attr("src", $("#rpi_camera").attr("src")+"?timestamp=" + new Date().getTime());
        $("#camera_shot_title").html("Camera Screenshot at " + new Date().toLocaleString('ru-RU', {hour12: false}));
      });
}