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
        for (let i = 0; i < times; i++) { 
          vm.runSeq(blocks); 
        }
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

    backward: {
      color: '#e9c46a',
      params: [
        {
          id: 'distance',
          type: 'input',
          conv: parseFloat,
          label: 'Backward',
          val: 10,
          suffix: 'steps',
        }
      ],
      run(vm, distance) {
        vm.cmds.forward.run(vm, -distance);
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
        }
      ],
      run(vm, angle) {
        vm.env.direction -= angle;
      }
    },
 }
};
