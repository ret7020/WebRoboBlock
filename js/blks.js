// TODO: variables

const menu = document.getElementById('menu-contents');
const code = document.getElementById('code-contents');
const canvas = document.getElementById("canvas");

function setup(plugin) {
  addBlocks(menu, plugin.cmds);
  vm.install(plugin);
}

function run() {
  vm.init(canvas);
  vm.runSeq(code.children);
}

function purge() {
  code.innerHTML = '';
  code.appendChild(createDivider());
}

function purgeOnConfirm() {
  if (confirm('Clear script?')) {
    purge();
  }
}

purge();
setup(logo);