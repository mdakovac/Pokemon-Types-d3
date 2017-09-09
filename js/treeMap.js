
var width = 1300
var height = 500

// svg za treemap
var canvas = d3.select("#treeMapSvg").append("svg")
	.attr("width", width)
	.attr("height", height)

// tooltip za treemap
var tooltip = d3.select("#treeMapSvg").append("div")
    .attr("class", "svgTooltip")
    .style("display", "none"); 

// legend za treemap
var legendGroup = canvas.append("g")
	.attr("class", "legendGroup");

legendGroup.selectAll(".legendRect")
	.data(createLegend(1020,0))
	.enter()
	.append("rect")
	.attr("class", "legendRect")
	.attr("x", function(d){ return d.x })
	.attr("y", function(d){ return d.y })
	.attr("width", 90)
	.attr("height", 30)
	.attr("fill", function(d){ return "url(#t"+d.fill+")" })
	.on("mouseover", function(d) {
		d3.selectAll("[data-primary="+d.fill+"]").attr("fill", function(){ return d3.rgb(this.getAttribute("data-color")).brighter(2)})
	})
	.on("mouseout", function(d) {
		d3.selectAll("[data-primary="+d.fill+"]").attr("fill", function(){ return d3.rgb(this.getAttribute("data-color"))})
	})

// dohvaćanje varijabli iz vanjskih skripti
var allPokemon = pokemon;
var allTypeCount = typeCount;

var lastGen = 0
// na klik tipke za promjenu generacije za prikaz
function changeGen(gen){
	showTreeMap()
	hideStats()
	$("button").removeClass("active");
	$("[data-gen="+gen+"]").addClass("active")

	// filtriranje generacija i brojanje 
	var currentGeneration = filterByGeneration(gen)
	var currentTypeCount = doTypeCount(currentGeneration)

	var treeMapWidth = 1000
	var treeMapHeight = 500

	if(gen!=0){
		newWidth = 500
		newHeight = 320

	}else{
		newWidth = treeMapWidth
		newHeight = treeMapHeight
	}

	// proširenje i smanjenje treemapa
	if(lastGen == 0 && gen != 0){
		d3.selectAll(".legendGroup")
			.transition()
			.delay(0)
			.duration(500)
			.attr("transform", function(d){ return "translate(-490,0)"; });


	}else if(lastGen!=0 && gen == 0){
		d3.selectAll(".legendGroup")
			.transition()
			.delay(0)
			.duration(500)
			.attr("transform", function(d){ return "translate(0,0)"; });
	}

	lastGen = gen


	$("#desc").html("<h3>Number of Pokemon in this category: "+currentTypeCount.count+"</h3>")

	// kreiranje podataka za treemap
	newTreemap = d3.layout.treemap()
		.size([newWidth, newHeight])
		.nodes(currentTypeCount)

	d3.selectAll(".label").remove();
	d3.selectAll(".tPath").remove();
	d3.selectAll("textPath").remove();

	// update podataka postojećih rectova
	var rects = canvas.selectAll(".mapRect")
		.data(newTreemap)

	var groups = canvas.selectAll(".mapGroup")
		.data(newTreemap)

	// tranzicija postojećih rectova
	rects.transition().duration(500)
		.attr("x", function(d){ return d.x;})
		.attr("y", function(d){ return d.y;})
		.attr("data-primary", function(d) { if(d.parent) return d.parent.name })
			.attr("data-color", function(d) { 
				if(!d.children){
					for(var i=0; i<type_colors.length; i++)
					{
						if(type_colors[i].name == d.parent.name)
						{
							return type_colors[i].color
						}
					}
				}
			})
		.attr("width", function(d){ return d.dx;})
		.attr("height", function(d){ return d.dy;})
		.attr("fill", function(d) { 
			//console.log(d.name); 
			if(!d.children){
				for(var i=0; i<type_colors.length; i++)
				{
					if(type_colors[i].name == d.parent.name)
					{
						return type_colors[i].color
					}
				}
			}
		})

	// dodavanje novih rectova
	groups.enter()
		.append("g")
			.attr("class", "mapGroup")
		.append("rect")
			.attr("class", "mapRect")
			.attr("data-primary", function(d) { if(d.parent) return d.parent.name })
			.attr("data-color", function(d) { 
				if(!d.children){
					for(var i=0; i<type_colors.length; i++)
					{
						if(type_colors[i].name == d.parent.name)
						{
							return type_colors[i].color
						}
					}
				}
			})
			.attr("x", function(d){ return d.x;})
			.attr("y", function(d){ return d.y;})
			.attr("width", function(d){ return d.dx;})
			.attr("height", function(d){ return d.dy;})
			.attr("fill", function(d) { 
				//console.log(d.name); 
				if(!d.children){
					for(var i=0; i<type_colors.length; i++)
					{
						if(type_colors[i].name == d.parent.name)
						{
							return type_colors[i].color
						}
					}
				}
			})
			.attr("stroke", "white")
		    .on("mouseover", mouseover)
		    .on("mousemove", mousemove)
		    .on("mouseout", mouseout);
		
	// odstranjivanje rectova za koje podaci ne postoje
	groups.exit().remove()

	// funkcija linije za textpath
	var line = d3.svg.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; })

	// dodavanje patha za tekst
	canvas.selectAll("tPath")
		.data(newTreemap)
		.enter()
		.append("path")
		.attr("class", "tPath")
	    .attr("d", function(d, i) { 
	    		return line([{"x":d.x, "y":d.y+15}, {"x":d.x +d.dx -4, "y":d.y+15}])
		})
		.attr("id", function(d,i) { return "p"+i; })

	// dodavanje teksta i tekstpatha
	d3.selectAll(".mapGroup")
		.append("text")
			.attr("class", "label")
			.attr("x", function(d){ return d.x + 7 })
			.attr("y", function(d){ return d.y + 14 })
		.append("textPath")
			.attr("class", "textpath")
			.attr("xlink:href", function(d,i){return "#p"+i})
			.style("font-weight", function(d){
				if(d.name.substr(0,4) == "only"){
					return 900
				}else{
					return "normal"
				}
			})
			.text(function(d){ 
				if(d.dy>16){
					return d.children ? null : d.name
				}
			})

	function mouseover() {
		tooltip.style("display", "inline");
	}

	function mousemove(d) 
	{
		var w=20
		var h=60

		var sec = '';
		if(d.name != d.parent.name && d.name != "only " + d.parent.name){
			var sec = '<img src="img/'+d.name+'.png" height="'+w+'" width="'+h+'">';
		}

		$(".svgTooltip").html('');
		$(".svgTooltip").append('<br><p>Type: <img src="img/'+d.parent.name+'.png" height="'+w+'" width="'+h+'">'+sec+'</p>');

		$(".svgTooltip").append('<p>Total in group: ' + d.parent.all + '</p>');
		$(".svgTooltip").append('<p>Total in subgroup: ' + d.value + '</p>');

		tooltip
			.style("left", (d3.event.pageX) + "px")
			.style("top", (d3.event.pageY) + "px");
	}

	function mouseout() {
		tooltip.style("display", "none");
	}
}

function filterByGeneration(gen){
	if(gen == 0){
		return allPokemon
	}
	
	var newArr = []
	for(var i=0; i<allPokemon.length; i++){
		if(pokemon[i].generation == gen){
			newArr.push(pokemon[i])
		}
	}

	return newArr;
}

// stvaranje hijerarhijske strukture za treemap
function doTypeCount(pokemon){
	typeCount = []
	for(var i=0; i<type_names.length; i++)
	{
		typeCount.push({
			name: type_names[i].identifier,
			all: 0,
			children: []		
		})

		for(var j=0; j<type_names.length; j++){
			if(type_names[i].identifier == type_names[j].identifier){
				typeCount[i].children.push({
					name: "only " + type_names[j].identifier,
					value: 0,
				})
			}
			typeCount[i].children.push({
				name: type_names[j].identifier,
				value: 0,
			})
		}
	}

	for(var i=0; i<typeCount.length; i++)
	{
		var type = typeCount[i].name;

		//console.log(type)
		for(var j=0; j<pokemon.length; j++){
			if(pokemon[j].primary_type == type){
				typeCount[i].all += 1;
			}
		}

		for(var j=0; j<pokemon.length; j++){

			var secondary_type = pokemon[j].secondary_type

			for(var k=0; k<typeCount[i].children.length; k++){

				if(typeCount[i].children[k].name == secondary_type && pokemon[j].primary_type == type){

					typeCount[i].children[k].value += 1;
				}
				if(typeCount[i].children[k].name == "only " + type && !pokemon[j].secondary_type && pokemon[j].primary_type == type){

					typeCount[i].children[k].value += 1;
				}
			}
			
		}
	}

	for(var i=typeCount.length-1; i>-1; i--){

		if(typeCount[i].all == 0){
			console.log("Splicing")
			typeCount.splice(i, 1);
		}
		
	}

	for(var i=0; i<typeCount.length; i++){

		for(var j=typeCount[i].children.length-1; j>-1; j--){
			if(typeCount[i].children[j].value == 0){
				typeCount[i].children.splice(j, 1);
			}
		}
		
	}

	typeCount = { "name":"root", "count":pokemon.length, "children": typeCount}
	console.log(typeCount)
	return typeCount;
}

