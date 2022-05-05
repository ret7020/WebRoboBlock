function downloadObjectAsJson(){
  var exportTextJSON =  $(".raw_json").html();
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportTextJSON);
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", "source.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

const vm = {
  env: {},
  cmds: {},
  plugins: [],
 
  
  init(canvas) {},


  initPlugins() {
    for (const plugin of this.plugins) {
      plugin.init(this.env);
    }
  },

  install(plugin) {
    this.cmds = Object.assign(this.cmds, plugin.cmds);
    this.plugins.push(plugin);
  },
    
  runSeq(blocks) {
    var json_compiled = [];
    var temp_block_dt;
    for (const block of blocks) {
      if (block.hasAttribute('data-cmd')) {
        temp_block_dt = this.run(block);
        if (temp_block_dt != null){
          if (temp_block_dt[0] == "single"){
            json_compiled.push(temp_block_dt[1]);
          }else if (temp_block_dt[0] == "multiple"){
            $.each(temp_block_dt[1], function(index, val){
                json_compiled.push(val);
              });
          }
        }
      }     
    }
    $(".json_source").html(prettyPrintJson.toHtml(json_compiled));
    $(".download_json").css("display", "block");
    $(".raw_json").html(JSON.stringify(json_compiled));
    
    return json_compiled;
  },
  run(block) {
    const cmd = block.getAttribute('data-cmd');
    const params = this.cmds[cmd].params || [];
    const args = [];

    for (const param of params) {
      const elem = block.querySelector(`[data-param-id="${param.id}"]`)
      
      switch (param.type) {
        case 'input':
          args.push(param.conv(elem.value));
          break;
        case 'slot':
            args.push(childBlocks(elem)); 
            break;
      }
      
    }
    
      if (cmd != "repeat"){
        return ["single", {"action": cmd, "data": args[0]}];
      }else{
        var final_iter = this.cmds[cmd].run(this, ...args);
        return ["multiple", final_iter];
      }
      
      
    //console.log(this.cmds); FOR SAVING IN FUTURE
   
    
  }
};