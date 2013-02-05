/**
 * Origami - Wallpaper Generator
 * Andreas (Andy) Hulstkamp
 * http://www.hulstkamp.com
 */
 
(function () {

	var rows = 5,
		cols = 8,
		len = 25,
		colors = [
				"#8FE5FF",
				"#FF1088",
				"#FF570D",
				"#FFE10B",
				"#592642",
				],
		phons = "SA,TO,SHI,TA,MA,GO,KO,TA,GO,KA,TSU,MI,MI,KRI,KO,TAO,SA,TAI,YA,MO,TO,YA,MA,TU,TI,CO,CO,MO,SHI,SA,MAO,SAO,TAO,KAO,TI,TA,TO,SI,SA,SO,MI,MA,MO".split(","),
		grid,
		coords;

	var Point = function (x,y) {
		this.x = x;
		this.y = y;
	}

	Point.prototype.isEqual = function(p) {
		return this.x === p.x && this.y === p.y;
	}

	var Grid = function(rows, cols, len) {
		this.rows = rows;
		this.cols = cols;
		this.len = len;
		this.grid = [];
		this.create(this.rows, this.cols, this.len);
	};

	Grid.prototype.create = function(rows, cols, len) {
		var x,y;
		for (var r = 0; r < rows; r++) {
			for (var c = 0; c < cols; c++) {
				this.grid.push({
					x: c * len,
					y: r * len
				});
			}
		}
	};

	Grid.prototype.getCoord = function(x, y) {
		var c = this.grid[y * this.cols + x];
		if (c === undefined) {
			console.log("no coords found");
		} 
		else {
			return c;
		}
	} 

	grid = new Grid(rows, cols, len);
	coords = grid.grid;

	var Origami = function(paper, type) {
		this.paper = paper;
		this.type = type;
		this.createOrigami();
	}

	Origami.prototype.createPoint = function(x, y) {
		var p,	c,	cx,	cy;
		cx = x || Math.round(Math.random() * (cols-1)),
		cy = y || Math.round(Math.random() * (rows - 1));
		try {
			c = grid.getCoord(cx, cy);
			p = new Point(c.x, c.y);
		} catch (error) {
			console.log(error);
		}
		return p;
	}

	Origami.prototype.createTriangle = function(clr) {

		var c1,	c2,
			p1, p2,	p3,
			d1,	d2,	d3;
		
		//p1 is at the center
		c1 = grid.getCoord(4,3);
		p1 = new Point(c1.x, c1.y);

		//p2 has the same y as p1 but varies on x-axis
		do {
			p2 = this.createPoint(null, Math.round(Math.random() * (rows-1)));
		} while (p2.isEqual(p1))
		
		//p3 has full degree of freedomo
		do {
			p3 = this.createPoint();
		} while (p3.isEqual(p2) || p3.isEqual(p1))

		var pstr = "M" + p1.x + "," + p1.y + "L" + p2.x + "," + p2.y + "L" + p3.x + "," + p3.y + "Z";

		var path = this.paper.path(pstr);
		path.attr("fill", clr);
		path.attr("stroke-width", 0);

		return path;
	}
	
	Origami.prototype.createSquare = function(clr, filled) {
		
			var c1,	c2, p1, p2,	p3, p4;
			
			//p1 is at the center
			c1 = grid.getCoord(4,3);
			p1 = new Point(c1.x, c1.y);

			//p2 has the same y as p1 but varies on x-axis
			do {
				p2 = this.createPoint(null, Math.round(Math.random() * (rows-1)));
			} while (p2.isEqual(p1))
			
			//p3 has full degree of freedomo
			do {
				p3 = this.createPoint();
			} while (p3.isEqual(p2) || p3.isEqual(p1))

			do {
				p4 = this.createPoint();
			} while (p4.isEqual(p3) || p4.isEqual(p2) || p3.isEqual(p1))

			var pstr = "M" + p1.x + "," + p1.y + "L" + p2.x + "," + p2.y + "L" + p3.x + "," + p3.y + "L" + p4.x + "," + p4.y + "Z";

			var path = this.paper.path(pstr);
			if (filled) {
				path.attr("fill", clr);
			}
			path.attr("stroke", clr);
			path.attr("stroke-width", 1);

			return path;
	}

	Origami.prototype.createOrigami = function() {
		var clr;
		if (this.type === "a") {
			for (var i = 0; i < 5; i++) {
				this.createTriangle(colors[i]);
			}
		}
		else if (this.type === "b") {
			clr = "#000"; // colors[Math.round(Math.random() * (colors.length-1))];
			for (var i = 0; i < 3; i++) {
				this.createSquare(clr);
			}
		}
		else if (this.type === "c") {
			clr = colors[Math.round(Math.random() * (colors.length-1))];
			for (var i = 0; i < 3; i++) {
				this.createSquare(clr, i % 3 === 0);
			}
		}
		else {
			clr = colors[Math.round(Math.random() * (colors.length-1))];
			for (var i = 0; i < 4; i++) {
				this.createTriangle(clr);
			}
		}
	}

	var Artwork = function(type, numOfTiles) {
		this.type = type;
		this.createArtwork();
		this.canvasHolder = document.getElementById("canvas-holder");
		this.numOfTiles = numOfTiles || 18;
		
	}

	//create random title - a combination of 3 random phons
	Artwork.prototype.createTitle = function() {
		var t = "";
		for (var i = 0; i < 3; i++) {
			t += phons[Math.round(Math.random() * (phons.length-1))];
		}
		return t;
	}

	//creates a tile, which is in essence an origami wrapped in a holder with a click handler
	Artwork.prototype.createHolder = function() {
		var holder = $('<div></div>')
					.addClass("holder")
					.append($("<h1></h1>")
					.text(this.createTitle()));
		var paper = Raphael(holder.get(0), cols * len, rows * len);
		var origami = new Origami(paper, this.type);
		return holder;
	}

	//add a tile (origami within holder) to the container
	Artwork.prototype.createTile = function() {
		var holder = this.createHolder(),
			that = this;
		var clickHandler = function() {
			var tile = that.createHolder();
			$(tile).click(clickHandler);
			$(this).replaceWith(tile);
		}
		$(holder).click(clickHandler);
		return holder;
	}

	Artwork.prototype.createArtwork = function(type) {
		var holder;
		this.type = type;
		$(this.canvasHolder).empty();
		for (var i = 0; i < 18; i++) {
			holder = this.createTile();
			$(this.canvasHolder).append(holder);
		}
	}
	
	var artwork = new Artwork(0);

	$("nav.styles a").click(function(){
		var type = $(this).attr("data-art");
		artwork.createArtwork(type);
	});

	artwork.createArtwork("a");

})();
