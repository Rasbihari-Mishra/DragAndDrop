window.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.box');
  let sourceBox = null;
	let previousMove = null;

  function handleDragStart(event) {
    sourceBox = this;
    this.classList.add('fade');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', this.innerHTML);
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    return false;
  }


	function handleDrop(event) {
		event.preventDefault();
		if (sourceBox !== this) {
			previousMove = {
				sourceBox: sourceBox,
				sourceContent: sourceBox.innerHTML,
				sourceColor: window.getComputedStyle(document.getElementById(sourceBox.id)).backgroundColor,
				destinationBox: this,
				destinationContent: this.innerHTML,
				destinationColor: window.getComputedStyle(document.getElementById(this.id)).backgroundColor,
			};

			this.innerHTML = event.dataTransfer.getData('text/html');
			sourceBox.innerHTML = previousMove.destinationContent;
			document.getElementById(sourceBox.id).style.backgroundColor = previousMove.destinationColor;
			document.getElementById(this.id).style.backgroundColor = previousMove.sourceColor;
			this.classList.add('animate');
			setTimeout(() => {
				this.classList.remove('animate');
			}, 500);
		}
		sourceBox.classList.remove('fade');
		sourceBox = null;

		// Enable the undo button
		undoButton.disabled = false;
		return false;
	}

	function handleDragEnd() {
		sourceBox = null;
	}

	function handleUndo() {
		if (previousMove) {
			const { sourceBox, sourceContent,sourceColor, destinationBox, destinationContent, destinationColor } = previousMove;
			sourceBox.innerHTML = sourceContent;
			destinationBox.innerHTML = destinationContent;
			document.getElementById(sourceBox.id).style.backgroundColor = sourceColor;
			document.getElementById(destinationBox.id).style.backgroundColor = destinationColor;
			previousMove = null;
			undoButton.disabled = true;
		}
	}

	const undoButton = document.getElementById('undoButton');
	undoButton.addEventListener('click', handleUndo);
	boxes.forEach((box) => {
		box.addEventListener('dragstart', handleDragStart);
		box.addEventListener('dragover', handleDragOver);
		box.addEventListener('drop', handleDrop);
		box.addEventListener('dragend', handleDragEnd);
	});
});