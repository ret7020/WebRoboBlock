  let idCounter = 0;

  function blockDragStart(e) {
    e.target.style.opacity = '0.4';
    e.dataTransfer.setData('text', e.target.id);
    
    if (e.target.hasAttribute('data-instance')) {
      const trash = document.getElementById('trash');
      trash.classList.add('drop-zone');
    }

    document
      .querySelectorAll('#code-contents .divider')
      .forEach((d) => d.classList.add('drop-zone'));
  }
  
  function blockDragEnd(e) {
    e.target.style.opacity = '1';
    
    if (e.target.hasAttribute('data-instance')) {
      const trash = document.getElementById('trash');
      trash.classList.remove('drop-zone');
    }

    document
      .querySelectorAll('#code-contents .divider')
      .forEach((d) => d.classList.remove('drop-zone'));
  }

  function dividerDragOver(e) {
    // This allows us to drop.
    e.preventDefault();
  }

  function dividerDrop(e) {
    e.preventDefault();
    // Hide drop divider.
    e.target.classList.remove('drop-zone');
    // Get the template block ID.
    const data = e.dataTransfer.getData("text");
    // Get the template block.
    const elem = document.getElementById(data);

    if (elem.hasAttribute('data-instance')) {
      moveDrop(e, elem);
    } else {
      cloneDrop(e, elem);
    }
  }

  function moveDrop(e, elem) {
    // Get the divider after the element.
    const divider = elem.nextSibling;
    // Remove drag indicator from block.
    elem.style.opacity = '1';
    // Move block after the drop divider.
    e.target.insertAdjacentElement('afterend', elem);
    // Move the divider.
    elem.insertAdjacentElement('afterend', divider);
  }

  function cloneDrop(e, node) {
    const elem = node.cloneNode(true);
    // Assign a unique ID to the clone and increment global counter.
    elem.id = elem.id + idCounter++;
    // Indicate that this is an instance block.
    elem.setAttribute('data-instance', '')
    // Remove drag indicator from cloned block.
    elem.style.opacity = '1';
    // Add the cloned block after the drop divider.
    e.target.insertAdjacentElement('afterend', elem);
    // Add another copy of the divider.
    elem.insertAdjacentElement('afterend', e.target.cloneNode(true));
  }

  function removeDragOver(e) {
    // This allows us to drop.
    e.preventDefault();
  }

  function removeDrop(e) {
    e.preventDefault();
    // Hide drop divider.
    e.target.classList.remove('drop-zone');
    // Get the block ID.
    const data = e.dataTransfer.getData("text");
    // Get block.
    const elem = document.getElementById(data);
    // Remove the instance and divider.
    if (elem.hasAttribute('data-instance')) {
      const divider = elem.nextSibling;
      elem.remove();
      divider.remove();
    }
  }