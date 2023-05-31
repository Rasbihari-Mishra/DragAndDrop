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

	function generateRandomNumber() {
		return Math.floor(Math.random() * 900) + 100;
	}
	
	function generateRandomColor() {
		const letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	
	function addRow() {
		const table = document.getElementById('table');
		const newRow = document.createElement('tr');
	
		for (let i = 1; i <= 3; i++) {
			const newCell = document.createElement('td');
			const newBox = document.createElement('div');
			const randomNumber = generateRandomNumber();
			const randomColor = generateRandomColor();
	
			newBox.id = `box-${randomNumber}`;
			newBox.className = 'box';
			newBox.draggable = true;
			newBox.innerText = randomNumber;
			newBox.style.backgroundColor = randomColor;
	
			newCell.appendChild(newBox);
			newRow.appendChild(newCell);
		}
	
		table.appendChild(newRow);
	}
	
	const addRowButton = document.getElementById('addRowButton');
	addRowButton.addEventListener('click', addRow);
	boxes.forEach((box) => {
		box.addEventListener('dragstart', handleDragStart);
		box.addEventListener('dragover', handleDragOver);
		box.addEventListener('drop', handleDrop);
		box.addEventListener('dragend', handleDragEnd);
	});
});

