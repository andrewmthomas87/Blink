
/*======================================================================
=============== CARD ===================================================
======================================================================*/

var Card = (function() {

	var numbers = [
		'one',
		'two',
		'three',
		'four',
		'five'
	]

	var colors = [
		'brown',
		'blue',
		'green',
		'grey',
		'red',
		'yellow'
	]

	var shapes = [
		'circle',
		'cross',
		'heart',
		'square',
		'star',
		'triangle'
	]

	var cardInnerHTML = '<div><span></span><span></span></div><div><span></span></div><div><span></span><span></span></div>'

	var similar = function(card1, card2) {
		return card1.number == card2.number || card1.color == card2.color || card1.shape == card2.shape
	}

	var toHTML = function(card, hidden) {
		if (card) {
			var classes = 'card ' + numbers[card.number] + ' ' + colors[card.color] + ' ' + shapes[card.shape] + (hidden ? ' hidden' : '')
			return '<div class="' + classes + '">' + cardInnerHTML + '</div>'
		}
		else {
			return ''
		}
	}

	return {
		'similar': similar,
		'toHTML': toHTML
	}

})()

/*======================================================================
=============== DECK ===================================================
======================================================================*/

var deck = (function() {

	var cards = []

	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 6; j++) {
			for (var k = 0; k < 6; k++) {
				cards.push({
					'number': i,
					'color': j,
					'shape': k
				})
			}
		}
	}

	var shuffle = function() {
		cards.sort(function() {
			return 0.5 - Math.random()
		})
	}

	var dealCard = function() {
		var dealtCard = cards.shift()
		cards.push(dealtCard)

		return dealtCard
	}

	var dealCards = function(number) {
		var dealtCards = []

		for (var i = 0; i < number; i++) {
			dealtCards.push(dealCard())
		}

		return dealtCards
	}

	return {
		'shuffle': shuffle,
		'dealCard': dealCard,
		'dealCards': dealCards
	}

})()

/*======================================================================
=============== COMPUTER ===============================================
======================================================================*/

var computer = (function() {

	var handElements, stackElement
	var hand, selected, stackHeight, analyzeTimeout

	var initialize = function() {
		var section = document.querySelector('section#computer')
		handElements = section.querySelectorAll('div:not(.stack)')
		stackElement = section.querySelector('div.stack')

		stackHeight = 30

		stackElement.innerHTML = stackHeight

		analyzeTimeout = true
	}

	var wait = function() {
		if (analyzeTimeout) {
			analyzeTimeout = setTimeout(analyze, 500 + Math.floor(Math.random() * 200) - 100)
		}
	}

	var analyze = function() {
		console.log('analyze')

		var index = Math.floor(Math.random() * 3)
		var playedIndex = Math.floor(Math.random() * 2)

		if (played.similar(hand[index], playedIndex)) {
			playCard(index, playedIndex)
		}
		else {
			wait()
		}
	}

	var playCard = function(index, playedIndex) {
		selected = index
		handElements[selected].classList.add('selected')

		setTimeout(function() {
			played.playCard(hand[selected], playedIndex)
		}, 1000)
	}

	var cardPlayed = function(success) {
		if (success) {
			if (reduceStack(1)) {
				hand[selected] = deck.dealCard()

				handElements[selected].children[0].classList.add('hidden')

				setTimeout(function() {
					handElements[selected].innerHTML = Card.toHTML(hand[selected], true)

					setTimeout(function() {
						handElements[selected].children[0].classList.remove('hidden')

						setTimeout(wait, 250)
					}, 100)
				}, 250)
			}
			else {
				handElements[selected].children[0].classList.add('hidden')

				setTimeout(function() {
					end(true)
				}, 250)
			}
		}
		else {
			wait()
		}

		handElements[selected].classList.remove('selected')
	}

	var reduceStack = function(number) {
		stackHeight -= number

		if (stackHeight == 0) {
			stackElement.classList.add('hidden')
		}
		else if (stackHeight == -3) {
			return false
		}

		if (stackHeight > 0) {
			stackElement.innerHTML = stackHeight
		}

		return true
	}

	var start = function(cards) {
		stackElement.classList.remove('hidden')

		hand = cards

		setTimeout(function() {
			for (var i = 0; i < 3; i++) {
				handElements[i].innerHTML = Card.toHTML(hand[i], true)

				setTimeout(function() {
					reduceStack(1)

					document.querySelector('section#computer div div.hidden').classList.remove('hidden')
				}, i * 250 + 100)
			}

			setTimeout(function() {
				played.start(deck.dealCards(2))

				reduceStack(1)

				setTimeout(function() {
					wait()
				}, 250)
			}, 850)
		}, 500)
	}

	var end = function(won) {
		if (won) {
			player.end(false)
		}

		clearTimeout(analyzeTimeout)

		analyzeTimeout = false
	}

	return {
		'initialize': initialize,
		'cardPlayed': cardPlayed,
		'start': start,
		'end': end
	}

})()

/*======================================================================
=============== PLAYER =================================================
======================================================================*/

var player = (function() {

	var handElements, stackElement
	var hand, selected, stackHeight

	var initialize = function() {
		var section = document.querySelector('section#player')
		handElements = section.querySelectorAll('div:not(.stack)')
		stackElement = section.querySelector('div.stack')

		for (var i = 0; i < 3; i++) {
			handElements[i].addEventListener('click', toggleSelected)
		}

		stackHeight = 30

		stackElement.innerHTML = stackHeight
	}

	var toggleSelected = function(event) {
		var index = parseInt(this.getAttribute('index'))

		if (hand[index]) {
			if (index != selected && selected != null) {
				handElements[selected].classList.remove('selected')
			}

			handElements[index].classList.toggle('selected')

			selected = index
		}
	}

	var getSelected = function() {
		return selected != null ? hand[selected] : false
	}

	var cardPlayed = function(success) {
		if (success) {
			if (reduceStack(1)) {
				if (stackHeight >= 0) {
					hand[selected] = deck.dealCard()
				}
				else {
					hand[selected] = false
				}

				handElements[selected].children[0].classList.add('hidden')

				setTimeout(function() {
					handElements[selected].innerHTML = Card.toHTML(hand[selected], true)

					setTimeout(function() {
						handElements[selected].children[0].classList.remove('hidden')
					}, 100)
				}, 250)
			}
			else {
				handElements[selected].children[0].classList.add('hidden')

				setTimeout(function() {
					end(true)
				}, 250)
			}
		}

		handElements[selected].classList.remove('selected')
	}

	var reduceStack = function(number) {
		stackHeight -= number

		if (stackHeight == 0) {
			stackElement.classList.add('hidden')
		}
		else if (stackHeight == -3) {
			return false
		}

		if (stackHeight > 0) {
			stackElement.innerHTML = stackHeight
		}

		return true
	}

	var start = function(cards) {
		stackElement.classList.remove('hidden')

		hand = cards

		setTimeout(function() {
			for (var i = 0; i < 3; i++) {
				handElements[i].innerHTML = Card.toHTML(hand[i], true)

				setTimeout(function() {
					reduceStack(1)

					document.querySelector('section#player div div.hidden').classList.remove('hidden')
				}, i * 250 + 100)
			}

			setTimeout(function() {
				reduceStack(1)
			}, 850)
		}, 500)
	}

	var end = function(won) {
		if (won) {
			computer.end(false)
		}

		done.show(won)
	}

	return {
		'initialize': initialize,
		'getSelected': getSelected,
		'cardPlayed': cardPlayed,
		'start': start,
		'end': end
	}

})()

/*======================================================================
=============== PLAYED =================================================
======================================================================*/

var played = (function() {

	var cardElements
	var cards

	var initialize = function() {
		var section = document.querySelector('section#played')
		cardElements = section.querySelectorAll('div')

		for (var i = 0; i < 2; i++) {
			cardElements[i].addEventListener('click', cardPlayed)
		}
	}

	var similar = function(card, index) {
		return Card.similar(card, cards[index])
	}

	var playCard = function(card, index) {
		if (Card.similar(card, cards[index])) {
			computer.cardPlayed(true)

		cards[index] = card
		cardElements[index].innerHTML = Card.toHTML(cards[index], false)
		}
		else {
			computer.cardPlayed(false)
		}
	}

	var cardPlayed = function() {
		var card = player.getSelected()

		if (card) {
			var index = parseInt(this.getAttribute('index'))

			if (Card.similar(card, cards[index])) {
				player.cardPlayed(true)

				cards[index] = card
				cardElements[index].innerHTML = Card.toHTML(cards[index], false)
			}
			else {
				player.cardPlayed(false)
			}
		}
	}

	var start = function(startingCards) {
		cards = startingCards

		cardElements[0].innerHTML = Card.toHTML(cards[0], true)
		cardElements[1].innerHTML = Card.toHTML(cards[1], true)

		setTimeout(function() {
			cardElements[0].children[0].classList.remove('hidden')
			cardElements[1].children[0].classList.remove('hidden')
		}, 100)
	}

	return {
		'initialize': initialize,
		'similar': similar,
		'playCard': playCard,
		'start': start
	}

})()

/*======================================================================
=============== DONE ===================================================
======================================================================*/

var done = (function() {

	var overlay, modal, message, done

	var initialize = function() {
		overlay = document.querySelector('div#overlay')
		modal = overlay.querySelector('div')
		message = modal.querySelector('h1')
		done = modal.querySelector('a')
	}

	var show = function(playerWon) {
		message.innerHTML = 'You ' + (playerWon ? '<span class="won">won!</span>' : '<span class="lost">lost</span>')

		overlay.style.display = 'block'

		setTimeout(function() {
			overlay.classList.remove('hidden')

			setTimeout(function() {
				modal.classList.remove('hidden')
			}, 500)
		}, 100)
	}

	return {
		'initialize': initialize,
		'show': show
	}

})()

window.addEventListener('load', function() {
	FastClick.attach(document.body)

	computer.initialize()
	player.initialize()
	played.initialize()
	done.initialize()

	setTimeout(function() {
		deck.shuffle()
		computer.start(deck.dealCards(3))
		player.start(deck.dealCards(3))
	}, 500)
})
