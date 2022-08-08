# Blocks documentation
## Frontend part (JS)
All blocks data stored in [blocks_data.js](https://github.com/ret7020/WebRoboBlock/blob/master/static/js/blocks_data.js) file in section `cmds`
</br>
__Lets look into 2 blocks(for loop and forward block)__</br>
### Code of `for loop` block </br>
```
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
```
`Color`: block color </br>
`Params`: block arguments array:
1. `id` - block uniq name(used to identify block action)
2. `type` - "What you can fo with this block"; `input` - data input(Only it supported now)
3. `conv` - value preprocessing. This if js function name.
4. `label` - visual block name(shown in block header)
5. `val` - current argument value(default)
6. `suffix` - for example value unit of measure

In for loop we have 2 params: `reps` - cycle iterations count and `body` - this params create children block inside this block that can contain another blocks inside it(in for loop it is actions to repeat).
</br>
___run method:___ </br>
This method execute when you run your program("compile" from block to JSON file). </br>
When we are talking about for loop we have to repeat blocks inside loop block.
### Code of `forward` block 
```
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
```
You can see many different params in this block, but they have understandable names. `sensors` params are hardware distance meters on robot. </br>
run method not used for now, it will be used when we implement simulator.

## Backend blocks execution(Python)
After program compiled(in frontend part by JS) to JSON like this:
```
[
   {
      action: "forward",
      distance: 14,
      speed: 2300,
      sensor_id: -1,
      sensor_val: 1
   },
   {
      action: "forward",
      distance: 14,
      speed: 2300,
      sensor_id: -1,
      sensor_val: 1
   },
   {
      action: "left",
      angle: 45,
      speed: 100,
      sensor_id: -1,
      sensor_val: 1
   }
]
```
Web site makes POST requet to web server, that working on robot(raspberry pi). Web server implemented in Python using Flask. </br>
Web sites send this JSON file</br>
![image](https://user-images.githubusercontent.com/55328925/183444403-20ecd25d-1ab3-476c-a7d6-298b57a94509.png)
</br>
After that this code passed to [Interpreter class](https://github.com/ret7020/WebRoboBlock/blob/master/interpreter.py)

