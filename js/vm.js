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
 
  
  init(canvas) {
    //this.initCanvas(canvas);
    //this.initPlugins();
  },


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
    for (const block of blocks) {
      if (block.hasAttribute('data-cmd')) {
        json_compiled.push(this.run(block));
      }     
    }
    $(".json_source").html(prettyPrintJson.toHtml(json_compiled));
    $(".download_json").css("display", "block");
    $(".raw_json").html(JSON.stringify(json_compiled))

    //downloadObjectAsJson(json_compiled, "source");

  },
  run(block) {
    const cmd = block.getAttribute('data-cmd');
    const params = this.cmds[cmd].params || [];
    const args = [];
    //var json_compiled = [];

    for (const param of params) {
      const elem = block.querySelector(`[data-param-id="${param.id}"]`)
      switch (param.type) {
        case 'input':
          args.push(param.conv(elem.value));
          return {"action": cmd, "data": elem.value};
          
      }
    }
    //console.log(this.cmds); FOR SAVING IN FUTURE
    //this.cmds[cmd].run(this, ...args);
  }
};
