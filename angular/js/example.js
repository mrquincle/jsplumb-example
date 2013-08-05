var myApp = angular.module('plumbApp', [])

// controllers manage an object $scope in AngularJS (this is the view model)
myApp.controller('PlumbCtrl', function($scope) {
	// state is [identifier, x, y]
	$scope.states = [];
	// index should always yield a unique identifier, can never be decreased
	$scope.index = 0; 
	// count is number of states, and gets decreased when states are removed
	$scope.count = 0;

	$scope.addState = function(event) {
		console.log("Add an additional state");
		$scope.states.push({
			identifier: $scope.index,
			x: event.pageX,
			y: event.pageY
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

