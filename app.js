
var card = (function() {

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

	var toHTML = function(card) {
		var classes = 'card ' + numbers[card.number] + ' ' + colors[card.color] + ' ' + shapes[card.shape]
		return '<div class="' + classes + '">' + cardInnerHTML + '</div>'
	}

	return {
		'toHTML': toHTML
	}

})()

var deck = (function() {

	var cards = []

	var shuffle = function() {
		cards.sort(function() {
			return 0.5 - Math.random()
		})
	}

	var reset = function() {
		cards = []

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

		shuffle()

		cards = cards.slice(0, 60)
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

window.addEventListener('load', function() {
	var hand = document.querySelector('section#hand')

	deck.shuffle()
	hand.innerHTML = card.toHTML(deck.dealCard())
})
