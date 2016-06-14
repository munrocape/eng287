var app = angular.module('engApp', []);

app.controller('engCtrl', function($scope) {
    $scope.init = function() {
        $scope.step = 'introduction'
        $scope.returning = localStorage.getItem('eng-returning')
        if (!$scope.returning) {
            localStorage.setItem('eng-returning', true)
        }
        console.log($scope.returning)

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
                title: '<span class="underline">Non-ergodic, non-interactive, non-electronic</span>',
                text: '<div class="center"><img aria-label="Book cover for Shes Come Undone by Wally Lamb" class="sweet-vert-img" src="images/book.jpg"></img></div>(Lamb, 1992)<br><br> The absence of all three components - this can be represented as a printed out news article or book.'
            },
            1: {
                title: '<span class="underline">Ergodic, non-interactive, non-electronic</span>',
                text: '<div class="center"><img aria-label="three cows with one word painted on each. From left to right it reads THE STILL THE" class="sweet-img" src="images/THE-STILL-THE.jpg"></img></div>(Sommers, 1993)<br><br> Clear examples of ergodic yet non-iteractive and non-electronic are works in which the feedback mechanism is driven by non-human intervention and are in the physical world. <br><br> Ryan provides two examples - the first being wind chimes that reveal portions of a work depending on the wind. <br><br> The second is "Cow text/interaction" (pictured above) by the art group <span class="italics">Kunstwaffen</span> who painted words of a poem on cattle. The roaming of the cattle - combined with the weather - rearranged the words as well as hid them so the work appeared different on each viewing.'
            },
            2: {
                title: '<span class="underline">Non-ergodic, interactive, non-electronic</span>',
                text: '<div class="center"><img aria-label="Painting of four seated men talking" class="sweet-img" src="images/conversation.png"></img><br>(Lakhovsky, 1935)</div><br><br>'
                + 'Ryan subdivides interactive texts into two categories - into selective and productive interactivity. <br><br>'
                + ' Selective interactivity is a or the participant in a dialog can customize the text - the text being the story told by the orator (Ryan, 207). <br><br>' 
                + ' Productive interactivity can be viewed as free form discussions between participants. While one may consider this ergodic - the text is reacting to itself - Ryan makes the note that it lacks global design and perhaps may not even qualify as text (Ryan, 207).'
            },
            3: {
                title: 'Ergodic, interactive, non-electronic',
                text: '<div class="center"><img aria-label="Book cover for Hopscotch" class="sweet-vert-img" src="images/hopscotch.jpg"></img></div>(Cortezar, 1966)<br><br> Interactive ergodic texts are texts in which the user has input on the sequence of chunks of text are read (Ryan, 209). <br><br> An example of such a text is <span class="underline">Hopscotch</span> by <span class="italics">Julio Cortazar</span>. A reader selects one of two paths - read chapters 1 through 56, or read one through 56 and interweave chapters 57 and higher between each chapter (Ryan, 210).'
            },
            4: {
                title: 'Non-ergodic, non-interactive, electronic',
                text: '<div class="center"><img aria-label="Digital scan of Ryans article" class="sweet-img" src="images/scan.png"></img></div>(Ryan, 2001)<br><br> Electronic texts that are neither interactive nor ergodic involve no user interaction or work to deceipher. Examples include digitizied physical works like when books are scanned or television programs that are broadcast.'
            },
            5: {
                title: 'Ergodic, non-interactive, electronic',
                text: '<div class="center"><img aria-label="Screenshot of Cayleys ergodic clock" class="sweet-img" src="images/cayley.png"></img></div>(Cayley, 2016)<br><br> Non-interactive ergodic work requires a driving mechanism that does not involve the appreciator. Given the programatic nature of computers, electronic mediums are not as restricted as their non-electronic counterparts. <br><br> Ryan provides the example of <span class="italics">The Speaking Clock</span> by John Cayley. In it, the driving mechanism for change is the current timestamp. The text displayed is selected from a database and presented to the user (Ryan, 209). <br><br> While <span class="italics">The Speaking Clock</span> is no longer online, Cayley has worked on a successor project titled <span class="italics">Epigraphic Clock</span>. A video of the project in action can be viewed <a target="_blank" href="https://vimeo.com/111557768">here</a>. <br><br> Another work of his, <span class="italics">w o t c l o c k</span>, can be viewed with Quicktime (which is enabled by default in the Safari browser) <a target="_blank" href="http://programmatology.shadoof.net/works/wotclock/clock.html">here</a>. '
            },
            6: {
                title: 'Non-ergodic, interactive, electronic',
                text: '<div class="center"><img aria-label="Screenshot of an IRC client where users are discussing software development" class="sweet-img" src="images/irc.png"></img></div>(Viktor, 2013)<br><br> Similar to non-ergodic, interactive, non-electronic works, these works are broken down into two categories by Ryan - selective and productive interactivity. Selective interactivity can be observed in works like textual databases that a user can query - like Wikipedia. The same article is returned for the same search - each and every time (Ryan, 209). Productive interactivity is exhibited in online chatrooms. If we hold that conversation is non-ergodic, irrespective of the physical or digital world it occurs in, then it stays non-ergodic (Ryan, 209).'
            },
            7: {
                title: 'Ergodic, interactive, electronic',
                text: '<div class="center"><img aria-label="Network graph where nodes are websites and links are connections between the websites" class="sweet-img" src="images/internet.png"></img></div>Visualization of a subsection of the internet (OPTE Project, 2005)<br><br> The intersection of all three categories, with respect to selective interactivity, can be represented by a user browsing the internet (Ryan, 210). Productively interacting with the work can be observed through games like <span class="italics">World of Warcraft</span> where users do not directly modify the text but their actions - like raiding dungeons, collecting items, and quest completion - can be seen as leaving a tangible mark on the environment.'
            }
        }
        content = swalContent[index]
        var animationIndex = Math.floor(Math.random() * (3 - 0 + 1))
        var animation = ['false', 'slide-from-top', 'slide-from-bottom', 'pop'][animationIndex]
        if (content != undefined) {
            swal({
                animation: animation,
                title: content.title,
                text: content.text,
                confirmButtonText: "Ok",
                html: true
            });
        }
    }

    $scope.toggleFirstVisit = function() {
        $scope.returning = !$scope.returning
        $scope.step = 'introduction'
        $scope.$apply()
        if ($scope.returning) {
            return 'back to the future . . . https://www.youtube.com/watch?v=k0kswK2aI08'
        } else {
            return 'Returning to square one . . . https://www.fasthorseinc.com/wp-content/uploads/2012/05/12bneuralizer.png'
        }
    }

    $scope.toggleStep = function(newStep) {
        $scope.step = newStep
        if (newStep === 'full') {
            location.href = "#venn"
        }
    }
    
    $scope.init();
});