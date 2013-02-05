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
		coords,
		canvasHolder = document.getElementById("canvas-holder");

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

	var createOrigami = function(paper) {

		var cr = colors.length - 1;

		//create a random point on the grid
		var createPoint = function(x, y) {
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

		var createSquare = function(clr, filled) {
			var c1,	c2,
				p1, p2,	p3, p4;
			
			//p1 is at the center
			c1 = grid.getCoord(4,3);
			p1 = new Point(c1.x, c1.y);

			//p2 has the same y as p1 but varies on x-axis
			do {
				p2 = createPoint(null, Math.round(Math.random() * (rows-1)));
			} while (p2.isEqual(p1))
			
			//p3 has full degree of freedomo
			do {
				p3 = createPoint();
			} while (p3.isEqual(p2) || p3.isEqual(p1))

			do {
				p4 = createPoint();
			} while (p4.isEqual(p3) || p4.isEqual(p2) || p3.isEqual(p1))

			var pstr = "M" + p1.x + "," + p1.y + "L" + p2.x + "," + p2.y + "L" + p3.x + "," + p3.y + "L" + p4.x + "," + p4.y + "Z";

			var path = paper.path(pstr);
			if (filled) {
				path.attr("fill", clr);
			}
			path.attr("stroke", clr);
			path.attr("stroke-width", 1);

			return path;
		}

		var c = colors[Math.round(Math.random() * cr)]

		for (var i = 0; i < 3; i++) {
			createSquare(c, i % 3 === 0);
		}
	}

	//create random title - a combination of 3 random phons
	var createTitle = function() {
		var t = "";
		for (var i = 0; i < 3; i++) {
			t += phons[Math.round(Math.random() * (phons.length-1))];
		}
		return t;
	}

	//creates a tile, which is in essence an origami wrapped in a holder with a click handler
	var createTile = function() {
		var holder = $('<div></div>')
					.addClass("holder")
					.append($("<h1></h1>")
					.text(createTitle()));
		var paper = Raphael(holder.get(0), cols * len, rows * len);
		createOrigami(paper);
		return holder;
	}

	//add a tile (origami within holder) to the container
	var addTile = function() {
		var holder = createTile();
		$(canvasHolder).append(holder);
		var clickHandler = function() {
			var tile = createTile();
			$(tile).click(clickHandler);
			$(this).replaceWith(tile);
		}
		$(holder).click(clickHandler);
	}

	for (var i = 0; i < 18; i++) {
		var holder = addTile();
	}

})();
