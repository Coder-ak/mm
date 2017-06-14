document.addEventListener("DOMContentLoaded",function(){

	var colors = ["red", "green", "yellow", "purple", "orange", "violet"];
	var src_color = document.getElementById("src_color").getElementsByTagName('div');
	var tgt_color = document.getElementById("tgt_color").getElementsByTagName('div');
	var run = document.getElementById("run");
	var error = document.getElementById('error');
	var moves = document.getElementById('moves');
	var secret = [];
	var numbers = [0,1,2,3,4,5];

	clear.addEventListener("click", clearSetup);
	run.addEventListener("click", runPuzzle);

	function handleDragStart(e) {
		// this.style.opacity = '0.5';
		e.dataTransfer.setData('text', e.target.style.backgroundColor);
	}

	function handleDragOver(e) {
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.dataTransfer.dropEffect = 'copy';

		return false;
	}

	function handleDragEnter(e) {
		this.classList.add('over');
	}

	function handleDragLeave(e) {
		this.classList.remove('over');
	}

	function handleDrop(e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		e.preventDefault();
		this.classList.remove('over');
		this.style.backgroundColor = e.dataTransfer.getData("text");

		secret.splice(e.target.id.charAt(1)-1, 1, colors.indexOf(e.dataTransfer.getData("text")));
		if(secret.length == 4) {	
			run.disabled = false;
		}
		return false;
	}

	function handleClick(e){
		var full = false;
		for (var i = 0; i < tgt_color.length; i++) {
			if(tgt_color[i].style.backgroundColor == ''){
				tgt_color[i].style.backgroundColor = e.target.style.backgroundColor;
				full = true;
				break;
			}
		}
		if(full){
			secret.splice(i, 1, colors.indexOf(e.target.style.backgroundColor));
		}
		if(secret.length == 4 && full) {	
			run.disabled = false;
		}
	}

	Array.prototype.forEach.call(src_color, function(node, i) {
		node.style.backgroundColor = colors[i];
		node.setAttribute('draggable', true);
		node.addEventListener('dragstart', handleDragStart, false);
		node.addEventListener('click', handleClick, false);
	});


	Array.prototype.forEach.call(tgt_color, function(node) {
		node.addEventListener('dragenter', handleDragEnter, false);
		node.addEventListener('dragover', handleDragOver, false);
		node.addEventListener('dragleave', handleDragLeave, false);
		node.addEventListener('drop', handleDrop, false);
	});

	function clearSetup(){
		secret = [];
		Array.prototype.forEach.call(tgt_color, function(node) {
			node.style.backgroundColor = '';
		});

		while (moves.firstChild) {
			moves.removeChild(moves.firstChild);
		}
		error.style.display = 'none';
	}

	function runPuzzle(){
		run.disabled = true;
		var run_numbers = numbers.slice();
// secret = [1,1,2,3];
console.log(secret);
		for (var i = 0; i < 6; i++) {
			
			if(i == 0) {
				guess = [0,0,1,1];
			}
			else {
				guess = [randnumb(run_numbers), randnumb(run_numbers), randnumb(run_numbers), randnumb(run_numbers)];
			}

console.log(guess);

			answer = secret.slice().checkMove(guess.slice());//ne nu a huli on menyatsya!

			//remove absent numbers
			if(answer[0] == 0 && answer[1] == 0) {
				run_numbers.removeNumbers(guess);
			}
			else {
				//console.log(cartProd(guess, guess, guess, guess));
			}

			// console.log(answer);
			//console.log(numbers);
			

			//fill secret
			// Array.prototype.forEach.call(tgt_color, function(node, i) {
			// 	node.style.backgroundColor = colors[secret[i]]
			// });

			var m = document.createElement('div');
			m.className = 'move';
			m.id = 'move';

			m.innerHTML = '<div id="guess_color_'+ i +'" class="row"><span id="num">1</span> <div id="g1">&nbsp;</div> <div id="g2">&nbsp;</div> <div id="g3">&nbsp;</div> <div id="g4">&nbsp;</div> </div><div id="hint_'+ i +'" class="row_hint"> <div id="h1">&nbsp;</div> <div id="h2">&nbsp;</div> <div id="h3">&nbsp;</div> <div id="h4">&nbsp;</div> </div>';

			moves.appendChild(m);

			guess_color = document.getElementById('guess_color_' + i).getElementsByTagName('div');
			hint = document.getElementById('hint_' + i).getElementsByTagName('div');
			document.getElementById('guess_color_' + i).firstChild.innerText = i+1;

			Array.prototype.forEach.call(guess_color, function(node, i) {
				node.style.backgroundColor = colors[guess[i]]
			});
			Array.prototype.forEach.call(hint, function(node, i) {
				if(i<answer[0]){
					node.className = "b";
				}
				else if(i<(answer[0]+answer[1])){
					node.className = "w";
				}
			});

			if(answer[0] == 4) {
				error.innerHTML = 'You win!';
				error.style.display = 'block';
				break;
			}
		}
	}

	// function cartProd(paramArray) {

	//   function addTo(curr, args) {
	//     var i, copy, 
	//         rest = args.slice(1),
	//         last = !rest.length,
	//         result = [];

	//     for (i = 0; i < args[0].length; i++) {
	//       copy = curr.slice();
	//       copy.push(args[0][i]);

	//       if (last) {
	//         result.push(copy);

	//       } else {
	//         result = result.concat(addTo(copy, rest));
	//       }
	//     }
	//     return result;
	//   }

	//   return addTo([], Array.prototype.slice.call(arguments));
	// }

	function randnumb (numb) {
		r = Math.floor(Math.random() * numb.length);
		return numb[r];
	}

	Array.prototype.removeNumbers = function (array) {
		for (var i = 0; i < array.length; i++) {
			el = this.indexOf(array[i]);
			if(el !== -1) {
				this.splice(el, 1);
			}
		}
		return this;
	}

	Array.prototype.checkMove = function (array) {
		var out = [0,0];
		// if (!array)
		// 	return false;

		// if (this.length != array.length)
		// 	return false;

		//Blacks
		for (var i = 0; i < this.length; i++) {
// console.log(i  + " arr: " + array + " sec: " + this + " out: " + out);
			if (this[i] == array[i]) { 
				out[0]++;
				this.splice(i, 1, false);
				array.splice(i, 1, '');
			}
		}

		//Whites
		for (var i = 0; i < this.length; i++) {
			if(this.indexOf(array[i]) !== -1 ) {
				out[1]++;
				this.splice(this.indexOf(array[i]), 1, false);
			}
		}       
		return out;
	}

});