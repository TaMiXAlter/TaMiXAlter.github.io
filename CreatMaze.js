var PlayerX,PlayerY,maze,cellWidth,fakemaze;
var Step;
//設定行列數量
const rows = 10;
const columns = 10;

function setup() {
    createCanvas(windowHeight,windowHeight);
	background(100);
	//格子寬度
	cellWidth = (width - 50) / max(rows, columns);
	//角色初始位置
	PlayerX = 0;
	PlayerY	= 0; 
	Step = 0;
	//開始生成真迷宮
	maze = new Maze(rows, columns);
	maze.backtracker();
	//  開始生成假迷宮
	fakemaze = new fakeMaze(rows,columns);
	fakemaze.setup()
}

function draw() {
	background(200)
	//數字
	push()
	translate(width/2,height/2)
	textSize(width/4);
	textAlign(CENTER, CENTER);
	noStroke()
	fill(255)
	text(str(Step),0,0);
	pop()
	//畫出迷宮
	if(PlayerX != columns-1 || PlayerY!=rows-1){
		push()
		strokeWeight(5);
		translate(width / 2 - maze.columns / 2 * cellWidth, height / 2 - maze.rows / 2 * cellWidth);
		drawMaze(fakemaze, cellWidth);
		fill(0,0,255)
		noStroke()
		circle(PlayerX * cellWidth+cellWidth/2, PlayerY * cellWidth+cellWidth/2,cellWidth/2)
		pop()
	}else{
		fill(255)
		textSize(width/4);
		textAlign(CENTER, CENTER);
		text("Step",width/2,width/4);
	}
	

	

	
}
function keyPressed() {///角色移動
	try{
		if (key == 'w') {
			var cellnow =maze.cells.find(cell => cell.x=== PlayerX && cell.y === PlayerY)
			if((cellnow.wallType == 'no_wall' ||cellnow.wallType == 'right_wall') && PlayerY<maze.columns ){
				fakemaze.breakWall(PlayerX,PlayerY,'right_wall')
				PlayerY -=1;
			}
		}
		if (key == 'a') {
			var cellLeft = maze.cells.find(cell => (cell.x+1) === PlayerX && cell.y === PlayerY)
			if(cellLeft!= undefined){
				if((cellLeft.wallType == 'no_wall' || cellLeft.wallType == 'top_wall') && PlayerX>0){
					fakemaze.breakWall(PlayerX-1,PlayerY,'top_wall')
					PlayerX -=1;
				}
			}
			
		}
		if (key == 's') {
			var cellDown = maze.cells.find(cell => cell.x=== PlayerX && (cell.y-1) === PlayerY)
			if(cellDown != undefined){
				if((cellDown.wallType == 'no_wall' || cellDown.wallType == 'right_wall') &&PlayerY>=0){
					fakemaze.breakWall(PlayerX,PlayerY+1,'right_wall')
					PlayerY +=1;
				}
			}
			
		}
		if (key == 'd') {
			var cellnow =maze.cells.find(cell => cell.x=== PlayerX && cell.y === PlayerY)
			if((cellnow.wallType == 'no_wall' || cellnow.wallType == 'top_wall') && PlayerY<maze.rows){
				fakemaze.breakWall(PlayerX,PlayerY,'top_wall')
				PlayerX +=1;
			}
		}
		Step +=1
	}catch{

	}
	

}

function cell(x, y, wallType) { //把資料包起來
    return {x, y, wallType};
}

class Maze {
    constructor(rows, columns) {//init
	    this.rows = rows;
		this.columns = columns;
	}
	
	
	backtracker(x = 0, y = 0) {//設定起始位置
        this.cells = [];
	    this.cells.push(cell(x, y, Maze.TOP_RIGHT_WALL));
		backtracker(this);
	}
}

//定義牆壁資訊(只有上跟右牆)
Maze.NO_WALL = 'no_wall';
Maze.TOP_WALL = 'top_wall';
Maze.RIGHT_WALL = 'right_wall';
Maze.TOP_RIGHT_WALL = 'top_right_wall';


//偵測區
function notVisited(maze, x, y) { //偵測有沒有造訪過
    return maze.cells.find(cell => cell.x === x && cell.y === y) === undefined;
}

function isVisitable(maze, x, y) { //偵測有沒有超出邊界
    return y >= 0 && y < maze.rows &&    
           x >= 0 && x < maze.columns && 
		   notVisited(maze, x, y); 
} 
//回傳下一個要去的位置
const R = 0; 
const T = 1; 
const L = 2; 
const B = 3; 

function nextX(x, dir) {
    return x + [1, 0, -1, 0][dir];
}

function nextY(y, dir) {
    return y + [0, -1, 0, 1][dir];
}

//往各個方向前進所發生的改變
function visitRight(maze, currentCell) {
    if(currentCell.wallType === Maze.TOP_RIGHT_WALL) {
	    currentCell.wallType = Maze.TOP_WALL;
	}
	else {
	    currentCell.wallType = Maze.NO_WALL;
	}
	maze.cells.push(cell(currentCell.x + 1, currentCell.y, Maze.TOP_RIGHT_WALL));
}

function visitTop(maze, currentCell) {
    if(currentCell.wallType === Maze.TOP_RIGHT_WALL) {
	    currentCell.wallType = Maze.RIGHT_WALL;
	}
	else {
	    currentCell.wallType = Maze.NO_WALL;
	}
	maze.cells.push(cell(currentCell.x, currentCell.y - 1, Maze.TOP_RIGHT_WALL));
}

function visitLeft(maze, currentCell) {
	maze.cells.push(cell(currentCell.x - 1, currentCell.y, Maze.TOP_WALL));
}

function visitBottom(maze, currentCell) {
	maze.cells.push(cell(currentCell.x, currentCell.y + 1, Maze.RIGHT_WALL));
}
//往哪個方向前進
function visit(maze, currentCell, dir) {
    switch(dir) {
	    case R:  
		    visitRight(maze, currentCell); break;
		case T:
		    visitTop(maze, currentCell); break;
		case L:
		    visitLeft(maze, currentCell); break;
		case B:
		    visitBottom(maze, currentCell); break;
	}
}

function backtracker(maze) {
    //最後造訪的細胞
    const currentCell = maze.cells[maze.cells.length - 1];
    //隨機方向
    const rdirs = shuffle([R, T, L, B]);
    // 可造訪的方向
	const vdirs = rdirs.filter(dir => {
	    const nx = nextX(currentCell.x, dir);
		const ny = nextY(currentCell.y, dir);
		return isVisitable(maze, nx, ny);
	});
	// 沒有可以造訪的方向(回到上一個細胞)
	if(vdirs.length === 0) {
	    return;
	}

	// 逐一造訪可行方向
	vdirs.forEach(dir => {
	    const nx = nextX(currentCell.x, dir);
		const ny = nextY(currentCell.y, dir);
		
        // 再次確認是否可以造訪
		if(isVisitable(maze, nx, ny)) {
            //造訪下個細胞
		    visit(maze, currentCell, dir);
            // 伊現在進度繼續推進
			backtracker(maze);
		}
	});
}

function drawCell(wallType, cellWidth) {
    if(wallType === Maze.TOP_WALL || wallType === Maze.TOP_RIGHT_WALL) {
        line(0, 0, cellWidth, 0);
    }

    if(wallType === Maze.RIGHT_WALL || wallType === Maze.TOP_RIGHT_WALL) {
        line(cellWidth, 0, cellWidth, cellWidth);
    }    
}

function drawMaze(maze, cellWidth, sx = 0, sy = 0, ex = maze.columns - 1, ey = maze.rows - 1) {
    maze.cells.forEach(cell => {
	    push();
      
		translate(cell.x * cellWidth, cell.y * cellWidth);
	    drawCell(cell.wallType, cellWidth);
		
		pop();
	});
    
    const totalWidth = cellWidth * maze.columns;
    const totalHeight = cellWidth * maze.rows;
  
	//邊線
    line(0, 0, 0, totalHeight);  
    line(0, totalHeight, totalWidth, totalHeight);
    line(totalWidth, totalHeight, totalWidth, totalHeight);  
    line(totalWidth, 0, 0, 0);  
  
    const halfWidth = cellWidth / 2;
    push();
        textSize(halfWidth);
        textAlign(CENTER, CENTER);
        text('S', sx * cellWidth + halfWidth, sy * cellWidth + halfWidth);
        text('E', ex * cellWidth + halfWidth, ey * cellWidth + halfWidth);
    pop();
}

class fakeMaze{
	constructor(rows, columns) {//init
	    this.rows = rows;
		this.columns = columns;
	}
	
	
	setup(){
		this.cells = [];
		for(var i =0;i<this.rows;i++){
			for(var j =0;j<this.columns;j++){
				this.cells.push(cell(j,i,Maze.TOP_RIGHT_WALL));
			}
		}
	}

	breakWall(x,y,way){
		var cellNeedChange =this.cells.find(cell => cell.x=== x && cell.y === y)
		if(cellNeedChange.wallType == 'top_right_wall'){
			cellNeedChange.wallType = way;
		}
		else if(cellNeedChange.wallType != way){
			cellNeedChange.wallType = 'no_wall';
		}
	}
}





