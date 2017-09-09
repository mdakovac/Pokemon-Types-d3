var img_h = 30
var img_w = 90

var defs = canvas.append("defs")
var defs2 = statsCanvas.append("defs")

var typeImages = ["bug","dark","dragon","electric","fairy","fighting","fire","flying","ghost","grass","ground","ice","normal","poison","psychic","rock","steel","water"]

for(var i=0; i<typeImages.length; i++){
    defs.append("pattern")
    .attr("id", "t"+typeImages[i])
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patterContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", img_h)
    .attr("width", img_w)
    .attr("x", 0)
    .attr("y", 0)
    .attr("preserveAspectRatio", "none")
    .attr("xmlns:xlink", "http://www.w3.org/1999/xLink")
    .attr("xlink:href", "img/"+typeImages[i]+".png")

    defs2.append("pattern")
    .attr("id", typeImages[i])
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patterContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", img_h)
    .attr("width", img_w)
    .attr("x", 0)
    .attr("y", 0)
    .attr("preserveAspectRatio", "none")
    .attr("xmlns:xlink", "http://www.w3.org/1999/xLink")
    .attr("xlink:href", "img/"+typeImages[i]+".png")
}

