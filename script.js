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
		var pool = cartProd(numbers, numbers, numbers, numbers);
		var guess = [0,0,1,1];
		var i = 0;

// secret = [1,1,2,3];
console.log(secret);

		while(true){

			if(i > 0) {
				pool = filterPool(pool, guess, answer);

				guess = makeGuess(pool, answer);
			}

			answer = secret.slice().checkMove(guess.slice());//ne nu a huli on menyatsya!

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

			i++;

			if(answer[0] == 4) {
				error.innerHTML = 'You win in '+ i +' moves!';
				error.style.display = 'block';
				break;
			}	
		}
	}
	
	//https://stackoverflow.com/a/12305169/6797324
	function cartProd(paramArray) {

		function addTo(curr, args) {
			var i, copy, 
			rest = args.slice(1),
			last = !rest.length,
			result = [];

			for (i = 0; i < args[0].length; i++) {
				copy = curr.slice();
				copy.push(args[0][i]);

				if (last) {
					result.push(copy);

				} else {
					result = result.concat(addTo(copy, rest));
				}
			}
			return result;
		}

		return addTo([], Array.prototype.slice.call(arguments));
	}

	//Highly inspired by http://github.com/michael0x2a/mastermind-solver
	function filterPool(pool, guess, answer) {
		var output = [];
		pool.forEach(function(possible, index, list, callback) {
			if (poolMatch(guess, answer, possible) && (possible !== guess)) {
				output.push(possible);
			}
		});
		return output;
	}

	function makeGuess(pool, answer){
		var min_length = Number.POSITIVE_INFINITY;
		var best_choice = null;

		pool.forEach(function(possible, index, list) {
			var length = filterPool(pool, possible, answer).length;
			if (min_length > length) {
				min_length = length;
				best_choice = possible;
			}
		});
		
		return best_choice;
	}
	
	function poolMatch(guess, answer, possible) {
		var answer2 = possible.slice().checkMove(guess.slice());
		return (answer[0] === answer2[0]) && (answer[1] === answer2[1]);
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