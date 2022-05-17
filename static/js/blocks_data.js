const logo = {

  init(env) {
    env.x = env.width / 2;
    env.y = env.height / 2;
    env.direction = 90;
    env.drawing = false;
    env.ctx.strokeStyle = '#ffffff';
    env.ctx.moveTo(env.x, env.y);
  },
  
  cmds: {
    repeat: {
      color: '#0ebeff',
      params: [
        {
          id: 'reps',
          type: 'input',
          conv: parseInt,
          label: 'FOR loop',
          val: 2,
          suffix: 'times',
        }, {
          id: 'body',
          type: 'slot',
        }
      ],
      run(vm, times, blocks) {        
        var final_iter = [];
        for (let i = 0; i < times; i++) { 
          $.each(vm.runSeq(blocks), function(index, val){
            final_iter.push(val);
          });
          
        }
        return final_iter;
      },
    },

    forward: {
      color: '#e9c46a',
      params: [
        {
          id: 'distance',
          type: 'input',
          conv: parseFloat,
          label: 'Forward',
          val: 10,
          suffix: 'steps',
        },
        {
          id: 'speed',
          type: 'input',
          conv: parseFloat,
          label: 'Speed',
          val: 1000,
          suffix: '',
        },
	      {
          id: 'sensor_id',
          type: 'input',
          conv: parseFloat,
          label: 'Sensor id',
          val: -1,
          suffix: '',
        },
	      {
          id: 'sensor_val',
          type: 'input',
          conv: parseFloat,
          label: 'Sensor val',
          val: 1,
          suffix: '',
        }
      ],
      run(vm, distance) {
        const sx = vm.env.x;
        const sy = vm.env.y;
        const rad = vm.env.direction * Math.PI / 180;
        vm.env.x += distance * Math.cos(rad);
        vm.env.y -= distance * Math.sin(rad);
        if (vm.env.drawing) {
          vm.env.ctx.beginPath();
          vm.env.ctx.moveTo(sx, sy);
          vm.env.ctx.lineTo(vm.env.x, vm.env.y);
          vm.env.ctx.stroke();
        }
      }
    },


    left: {
      color: '#e76f51',
      params: [
        {
          id: 'angle',
          type: 'input',
          conv: parseFloat,
          label: 'Rotate left',
          val: 90,
          suffix: '°',
        },
        {
          id: 'speed',
          type: 'input',
          conv: parseFloat,
          label: 'Speed',
          val: 1000,
          suffix: '',
        },
        {
          id: 'sensor_id',
          type: 'input',
          conv: parseFloat,
          label: 'Sensor id',
          val: -1,
          suffix: '',
        },
	      {
          id: 'sensor_val',
          type: 'input',
          conv: parseFloat,
          label: 'Sensor val',
          val: 1,
          suffix: '',
        }
      ],
      run(vm, angle) {
        vm.env.direction += angle;
      }
    },

    right: {
      color: '#e76f51',
      params: [
        {
          id: 'angle',
          type: 'input',
          conv: parseFloat,
          label: 'Rotate right',
          val: 90,
          suffix: '°',
        },
        {
          id: 'speed',
          type: 'input',
          conv: parseFloat,
          label: 'Speed',
          val: 1000,
          suffix: '',
        },
        {
          id: 'sensor_id',
          type: 'input',
          conv: parseFloat,
          label: 'Sensor id',
          val: -1,
          suffix: '',
        },
	      {
          id: 'sensor_val',
          type: 'input',
          conv: parseFloat,
          label: 'Sensor val',
          val: 1,
          suffix: '',
        }
      ],
      run(vm, angle) {
        vm.env.direction -= angle;
      }
    },

    threaded_test: {
      color: 'blue',
      params: [
        {
          id: 'data',
          type: 'input',
          conv: parseFloat,
          label: 'Threading test',
          val: 90,
          suffix: 'print',
        },
        {
          id: 'time',
          type: 'input',
          conv: parseFloat,
          label: 'Wait time',
          val: 5,
          suffix: 'sec.',
        }
      ],
      run(vm, angle) {
        vm.env.direction -= angle;
      }
    },
    
    init_var: {
	color: 'red',
	params: [
	  {
	     id: 'var_name',
	     type: 'input',
	     conv: parseInt,
	     label: 'Var name',
	     val: "var_1",
	     suffix: ''
	  },
	  {
	     id: "var_value",
	     type: "input",
	     conv: parseInt,
	     label: 'Var value',
	     
	  }
	],
	run(vm){
	}
    }

    

 }
};
