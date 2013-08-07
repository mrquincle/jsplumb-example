var myApp = angular.module('plumbApp', [])

// controllers manage an object $scope in AngularJS (this is the view model)
myApp.controller('PlumbCtrl', function($scope) {
	// state is [identifier, x position, y position, title, description]
	$scope.states = [];
	// index should always yield a unique identifier, can never be decreased
	$scope.index = 0; 
	// count is number of states, and gets decreased when states are removed
	$scope.count = 0;

	$scope.topleft = {
		x: 15,
		y: 145
	};

	$scope.margin = 5;
	$scope.statesize = 150;

    $scope.redraw = function() {
    	$scope.count = 0 ;
    	$scope.index = 0;
    	//jsPlumb.detachAllConnections($scope); // this scope is not correct
    	jsPlumb.detachEveryConnection();
    	$scope.states = [];
    	$scope.addState("Sum", "Aggregates an incoming sequences of values and returns the sum", 
    		$scope.topleft.x+$scope.margin, $scope.topleft.y+$scope.margin); 
    	$scope.addState("Camera", "Hooks up to hardware camera and sends out an image at 20 Hz", 
    		$scope.topleft.x+$scope.margin, $scope.topleft.y+$scope.margin+$scope.statesize); 
    }

	$scope.addEvent = function(event) {
		$scope.addState("Default " + $scope.index, "Default stuff", event.pageX, event.pageY);
	}

	$scope.addState = function(title, description, posX, posY) {
		console.log("Add state " + title + " at position " + posX + "," + posY);
		$scope.states.push({
			identifier: $scope.index,
			x: posX,
			y: posY,
			title: title,
			description: description
		});
		$scope.index++;
		$scope.count++;
		console.log("Count became " + $scope.count);		
	}

    $scope.removeState = function(identifier) {
		console.log("Remove state " + identifier + " in array of length " + $scope.states.length);
		for (var i = 0; i < $scope.states.length; i++) {
			// compare in non-strict manner
			if ($scope.states[i].identifier == identifier) {
				console.log("Remove state at position " + i);
				$scope.states.splice(i, 1);
			}
		}
		$scope.count--;
		console.log("Count became " + $scope.count);
		
	}

})

// directives link user interactions with $scope behaviours
// now we extend html with <div plumb-item>, we can define a template <> to replace it with "proper" html, or we can 
// replace it with something more sophisticated, e.g. setting jsPlumb arguments and attach it to a double-click 
// event
myApp.directive('plumbItem', function() {
	return {
		replace: true,
		controller: 'PlumbCtrl',
		link: function (scope, element, attrs) {
			console.log("Add plumbing for the 'item' element");

			jsPlumb.makeTarget(element, {
				anchor: 'Continuous'
			});
			jsPlumb.draggable(element, {
				containment: 'parent'
			});

			// this should actually done by a AngularJS template and subsequently a controller attached to the dbl-click event
			element.bind('dblclick', function(e) {
				jsPlumb.detachAllConnections($(this));
				$(this).remove();
				// stop event propagation, so it does not directly generate a new state
				e.stopPropagation();
				//we need the scope of the parent, here assuming <plumb-item> is part of the <plumbApp>			
				scope.$parent.removeState(attrs.identifier);
				scope.$parent.$digest();
			});

		}
	};
});

myApp.directive('plumbConnect', function() {
	return {
		replace: true,
		link: function (scope, element, attrs) {
			console.log("Add plumbing for the 'connect' element");

			jsPlumb.makeSource(element, {
				parent: $(element).parent(),
				anchor: 'Continuous'
			});
			//$scope.apply();
		}
	};
});

