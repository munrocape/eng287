var app = angular.module('engApp', []);
app.controller('engCtrl', function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
    $scope.init = function() {
        $scope.returning = localStorage.getItem('eng-returning')
        if ($scope.returning) {} else {
            localStorage.setItem('eng-returning', true)
        }

        function capitalize(category) {
            return category.charAt(0).toUpperCase() + category.slice(1);
        }

        function getTooltip(sets) {
            var mapping = {
                1: 'ergodic',
                2: 'electronic',
                4: 'interactive'
            }
            var tooltipText = ''
            for (i = 0; i < sets.length; i++) {
                if (i === 0) {
                    tooltipText = tooltipText + capitalize(mapping[sets[i]])
                } else {
                    if (i === sets.length - 1) {
                        tooltipText = tooltipText + ' and ' + mapping[sets[i]]
                    } else {
                        tooltipText = tooltipText + ', ' + mapping[sets[i]]
                    }
                }
            }
            return tooltipText
        }
        var chart = venn.VennDiagram()
            .width(500)
            .height(500);
        var sets = [{
            "sets": [1],
            "label": "Ergodic",
            "size": 10
        }, {
            "sets": [4],
            "label": "Electronic",
            "size": 10
        }, {
            "sets": [2],
            "label": "Interactive",
            "size": 10
        }, {
            "sets": [1, 4],
            "size": 2
        }, {
            "sets": [1, 2],
            "size": 2
        }, {
            "sets": [4, 2],
            "size": 2
        }, {
            "sets": [1, 4, 2],
            "size": 1
        }, ];
        var div = d3.select("#venn")
        div.datum(sets).call(chart);

        var tooltip = d3.select("body").append("div")
            .attr("class", "venntooltip").style('width', '250px');

        div.selectAll("path")
            .style("stroke-opacity", 0)
            .style("stroke", "#fff")
            .style("stroke-width", 0)

        div.selectAll("g")
            .on("mouseover", function(d, i) {
                venn.sortAreas(div, d);
                tooltip.transition().duration(4).style("opacity", .9);
                var t = getTooltip(d.sets)
                tooltip.text(t);
                var width = t.length * 8
                tooltip.style('width', width + 'px')
                var selection = d3.select(this).transition("tooltip").duration(400);
                selection.select("path")
                    .style("stroke-width", 3)
                    .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
                    .style("stroke-opacity", 1);
            })

        .on("mousemove", function() {
            tooltip.style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })

        .on("mouseout", function(d, i) {
                tooltip.transition().duration(400).style("opacity", 0);
                var selection = d3.select(this).transition("tooltip").duration(400);
                selection.select("path")
                    .style("stroke-width", 0)
                    .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
                    .style("stroke-opacity", 0);
            })
            .on('click', function(d, i) {
                $scope.showDetail(d)
            });
    }

    $scope.showDetail = function(data) {
        // ergodic -> 1
        // interactive -> 2
        // electronic -> 4
        // sum of overlapping circles -> index of swalContent to display
        total = 0
        for (i = 0; i < data['sets'].length; i++) {
            total += data['sets'][i]
        }
        $scope.presentSweetAlert(total)
    }

    $scope.presentSweetAlert = function(index) {
        swalContent = {
            0: {
                title: 'Non-ergodic, non-interactive, non-electronic',
                text: 'zero'
            },
            1: {
                title: 'Ergodic, non-interactive, non-electronic',
                text: 'one'
            },
            2: {
                title: 'Non-ergodic, interactive, non-electronic',
                text: 'two'
            },
            3: {
                title: 'Ergodic, interactive, non-electronic',
                text: 'three'
            },
            4: {
                title: 'Non-ergodic, non-interactive, electronic',
                text: 'four'
            },
            5: {
                title: 'Ergodic, non-interactive, electronic',
                text: 'five'
            },
            6: {
                title: 'Non-ergodic, interactive, electronic',
                text: 'six'
            },
            7: {
                title: 'Ergodic, interactive, electronic',
                text: 'seven <a aria-label="further reading on ergodic, interactive, electronic examples" target="_blank" href="http:// google.com">google</a>'
            }
        }
        content = swalContent[index]
        if (content != undefined) {
            swal({
                title: content.title,
                text: content.text,
                confirmButtonText: "Ok",
                html: true
            });
        }
    }

    $scope.toggleFirstVisit = function() {
        $scope.returning = !$scope.returning
        $scope.$apply()
        if ($scope.returning) {
            return 'back to the future . . . https://www.youtube.com/watch?v=k0kswK2aI08'
        } else {
            return 'Returning to square one . . . https://www.fasthorseinc.com/wp-content/uploads/2012/05/12bneuralizer.png'
        }
    }
    $scope.init();
});