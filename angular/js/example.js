var myApp = angular.module('plumbApp', [])

myApp.controller('PlumbCtrl', function($scope) {
	$scope.states = [];
	$scope.index = 0;

	$scope.addState = function(event) {
		console.log("Add an additional state");
		$scope.states.push({
			name: $scope.index,
			x: event.pageX,
			y: event.pageY
		});
		$scope.index++;
	}

    $scope.removeState = function(index) {
		console.log("Remove state" + index);
		delete $scope.states[index];
		//$scope.states.splice(index, 1);
		//$scope.index--;
	}

})


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

			element.bind('dblclick', function(e) {
				jsPlumb.detachAllConnections($(this));
				$(this).remove();
				// stop event propagation, so it does not directly generate a new state
				e.stopPropagation();
				//controller.removeState(attrs.name); // or add to element ng-dblclick="removeState(attrs.name)"
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

