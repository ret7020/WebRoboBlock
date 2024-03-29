function downloadObjectAsJson() {
  var exportTextJSON = $(".raw_json").html();
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportTextJSON);
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "source.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

const vm = {
  env: {},
  cmds: {},
  plugins: [],


  init(canvas) { },


  initPlugins() {
    for (const plugin of this.plugins) {
      plugin.init(this.env);
    }
  },

  install(plugin) {
    this.cmds = Object.assign(this.cmds, plugin.cmds);
    this.plugins.push(plugin);
  },

  runSeq(blocks) { // Refractor this part (for loop support is badly implemented)
    var json_compiled = [];
    var temp_block_dt;
    var if_counter = 0;
    for (const block of blocks) {
      if (block.hasAttribute('data-cmd')) {
        temp_block_dt = this.run(block);
        
        if (temp_block_dt != null) {
          if (temp_block_dt[0] == "single") {
            var el = {};
            el["action"] = temp_block_dt[1]["action"];
            $.each(temp_block_dt[1]["data"], function (index, val) {
              $.each(val, function (index, val) {
                el[index] = val;
              });
            });
            json_compiled.push(el);
          } else if (temp_block_dt[0] == "multiple") {
            $.each(temp_block_dt[1], function (index, val) {
              json_compiled.push(val);
            });
          } else if (temp_block_dt[0] == "if") {
            json_compiled.push({"action": "if", "if_id": if_counter, "check_var": temp_block_dt[2]});
            $.each(temp_block_dt[1], function (index, val) {
              json_compiled.push(val);
            });
            json_compiled.push({"action": "endif", "if_id": if_counter});
            if_counter++;
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
    const params_names = [];

    for (const param of params) {
      const elem = block.querySelector(`[data-param-id="${param.id}"]`)
      switch (param.type) {
        case 'input':
          args.push(elem.value);
          var array_dt = {};
          try {
            array_dt[param.id] = math.evaluate(elem.value);
          } catch (e) {
            array_dt[param.id] = elem.value;
          }
          params_names.push(array_dt);
          break;
        case 'slot':
          args.push(childBlocks(elem));
          break;
      }

    }

    if (cmd != "repeat" && cmd != "if") {
      return ["single", { "action": cmd, "data": params_names }];
    } else if (cmd == "repeat") {
      var final_iter = this.cmds[cmd].run(this, ...args);
      return ["multiple", final_iter];
    } else if (cmd == "if"){
      var final_iter = this.cmds[cmd].run(this, ...args);
      return ["if", final_iter, params_names[0]["var_check"]];
    }


    //console.log(this.cmds); FOR SAVING IN FUTURE


  }
};
