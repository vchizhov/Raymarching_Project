// Библиотека WebGL-FMI v0.15.06
//
// Работа с контексти и шейдъри
//		getContext(id)
//		getShader(id,type)
//		getProgram(idv,idf)
//		getVariables()
//
// Математически функции и константи
//		random(a,b)
//		radians(degrees)
//		sin(a)
//		cos(a)
//		PI



var gl;				// глобален WebGL контекст
var glprog;			// глобална GLSL програма


// брой байтове в един WebGL FLOAT (трябва да са 4 байта)
var FLOATS = Float32Array.BYTES_PER_ELEMENT;


// връща WebGL контекст, свързан с HTML елемент с даден id
function getContext(id)
{
	var canvas = document.getElementById(id);
	if (!canvas)
	{
		alert("Искаме canvas с id=\""+id+"\", а няма!");
		return null;
	}

	var context = canvas.getContext("webgl");
	if (!context)
	{
		context = canvas.getContext("experimental-webgl");
	}
	
	if (!context)
	{
		alert("Искаме WebGL контекст, а няма!");
	}
	
	return context;
}


// връща компилиран шейдър
function getShader(id,type)
{
	var elem = document.getElementById(id);
	var source = elem?elem.text:id;
	var shader = gl.createShader(type);

	gl.shaderSource(shader,source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader,gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}


// връща готова програма
function getProgram(idv,idf)
{
	var vShader = getShader(idv,gl.VERTEX_SHADER);
	var fShader = getShader(idf,gl.FRAGMENT_SHADER);
			
	if (!vShader || !fShader) {return null;}
	
	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram,vShader);
	gl.attachShader(shaderProgram,fShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram,gl.LINK_STATUS))
	{
		alert(gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	gl.useProgram(shaderProgram);
	return shaderProgram;
}


// намира адресите на всички глобални и атрибутни променливи
function getVariables()
{
	for (var i=0; i<gl.getProgramParameter(glprog,gl.ACTIVE_UNIFORMS); i++)
	{
		var name = gl.getActiveUniform(glprog,i).name;
		window[name] = gl.getUniformLocation(glprog,name);
	}

	for (var i=0; i<gl.getProgramParameter(glprog,gl.ACTIVE_ATTRIBUTES); i++)
	{
		var name = gl.getActiveAttrib(glprog,i).name;
		window[name] = gl.getAttribLocation(glprog,name);
	}
}



// случайно дробно число в интервал
function random(a,b)
{
	return a+(b-a)*Math.random();
}


// преобразува градуси в радиани
function radians(degrees)
{
	return degrees*Math.PI/180;
}


// синус
function sin(a)
{
	return Math.sin(a);
}


// косинус
function cos(a)
{
	return Math.cos(a);
}


// пи
var PI = Math.PI;
//epsilon
var EPSILON = 0.0001;

function ZFromFov(fov, x_length)
{
	return x_length/Math.tan(fov);
}

Quad = function()
{
	//vertices
	v = [-1.0,-1.0, //triangle 1
	1.0, -1.0,
	1.0, 1.0,
	-1.0, -1.0, //triangle 2
	1.0,1.0,
	-1.0,1.0];
	
	var buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER,buf);
	gl.enableVertexAttribArray(aXY);
	gl.vertexAttribPointer(aXY,2,gl.FLOAT,false,2*FLOATS,0*FLOATS);
}

Quad.prototype.draw = function()
{	
	gl.drawArrays(gl.TRIANGLES,0,6);
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//VECTORS
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function AddVectors3(a,b)
{
	return [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
}

function NegateVector3(v)
{
	return [-v[0],-v[1],-v[2]];
}

function MultiplyVector3(k, v)
{
	return [k*v[0],k*v[1],k*v[2]];
}

function ScalarProduct3(v1,v2)
{
	return v1[0]*v2[0]+v1[1]*v2[1]+v1[2]*v2[2];
}

function Vector3Length(v)
{
	return Math.sqrt(ScalarProduct3(v,v));
}

function IsZeroVector3(v)
{
	return (-EPSILON<v[0] && v[0]<EPSILON && -EPSILON<v[1] && v[1]<EPSILON  && -EPSILON<v[2] && v[2]<EPSILON);
}

function NormalizeVector3(v)
{
	return MultiplyVector3(1/Vector3Length(v),v);
}

function AbsVector3(v)
{
	return [Math.abs(v[0]),Math.abs(v[1]),Math.abs(v[2])];
}

function MaxVector3(a,b)
{
	return [Math.max(a[0],b[0]),Math.max(a[1],b[1]),Math.max(a[2],b[2])];
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//MATRICES
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
function MatrixXVector3(m,v)
{
	return [m[0]*v[0]+m[1]*v[1]+m[2]*v[2],
	m[3]*v[0]+m[4]*v[1]+m[5]*v[2],
	m[6]*v[0]+m[7]*v[1]+m[8]*v[2]];
}

function MatrixFromColumns3(v1,v2,v3)
{
	return [v1[0],v2[0],v3[0],
	v1[1],v2[1],v3[1],
	v1[2],v2[2],v3[2]];
}

function IdentityMatrix3()
{
	return [1,0,0, 0,1,0, 0,0,1];
}

function TransposeMatrix3(m)
{
	return[m[0],m[3],m[6],
	m[1],m[4],m[7],
	m[2],m[5],m[8]];
}

function RotationMatrixX3(rx)
{
	return [1,0,0, 0,cos(rx),-sin(rx), 0,sin(rx),cos(rx)];
}

function RotationMatrixY3(ry)
{
	return [cos(ry),0,sin(ry), 0,1,0, -sin(ry),0,cos(ry)];
}

function RotationMatrixZ3(rz)
{
	return [cos(rz),-sin(rz),0, sin(rz),cos(rz),0, 0,0,1];
}

function MultiplyMatrix3(a, b)
{
	return [a[0]*b[0]+a[1]*b[3]+a[2]*b[6], a[0]*b[1]+a[1]*b[4]+a[2]*b[7], a[0]*b[2]+a[1]*b[5]+a[2]*b[8],
	a[3]*b[0]+a[4]*b[3]+a[5]*b[6], a[3]*b[1]+a[4]*b[4]+a[5]*b[7], a[3]*b[2]+a[4]*b[5]+a[5]*b[8],
	a[6]*b[0]+a[7]*b[3]+a[8]*b[6], a[6]*b[1]+a[7]*b[4]+a[8]*b[7], a[6]*b[2]+a[7]*b[5]+a[8]*b[8]];
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//My Objects
////////////////////////////////////////////////////////////////////////////////////////////////////////
Pivot = function(pos=[0,0,0])
{
	//parent
	this.father = undefined;
	//local position - relative to the parent pivot's coordinate system
	this.pos = pos;
	this.up = [0,1,0];
	this.right = [1,0,0];
	this.forward = [0,0,1];
	//local orientation - relative to the parent pivot's coordinate system
	this.mat = MatrixFromColumns3(this.right,this.up,this.forward);
	this.angles = [0,0,0];
	this.children = [];
}

Pivot.prototype.translate = function(v)
{
	this.pos = AddVectors3(this.pos,v);
}

Pivot.prototype.move = function(v)
{
	this.pos =  AddVectors3(this.pos,MatrixXVector3(TransposeMatrix3(this.mat),v));
}

Pivot.prototype.rotate = function(r, grot=undefined)
{

	this.angles = r;
	this.mat = IdentityMatrix3();
	if(this.angles[0]) this.mat = RotationMatrixX3(angles[0]);
	if(this.angles[1]) this.mat = MultiplyMatrix3(this.mat,RotationMatrixY3(this.angles[1]));
	if(this.angles[2]) this.mat = MultiplyMatrix3(this.mat,RotationMatrixZ3(this.angles[2]));
	
}

Pivot.prototype.turn = function(r)
{
	this.angles = AddVectors3(this.angles,r);
	this.mat = IdentityMatrix3();
	if(this.angles[0]) this.mat = MultiplyMatrix3(this.mat,RotationMatrixX3(this.angles[0]));
	if(this.angles[1]) this.mat = MultiplyMatrix3(this.mat,RotationMatrixY3(this.angles[1]));
	if(this.angles[2]) this.mat = MultiplyMatrix3(this.mat,RotationMatrixZ3(this.angles[2]));
}

Pivot.prototype.globalMatrix=function()
{
	if(this.father==undefined)
		return this.mat;
	else
	{
		var parentMatrix = this.father.globalMatrix();
		return MultiplyMatrix3(parentMatrix,this.mat);
	}
}

Pivot.prototype.globalPosition=function()
{
	if(this.father==undefined)
		return this.pos;
	else
	{
		var parentPos = this.father.globalPosition();
		var posRelativeToFather = MatrixXVector3(TransposeMatrix3(this.father.globalMatrix()),this.pos);
		return AddVectors3(parentPos, posRelativeToFather);
	}
}

Pivot.prototype.addChild = function(child)
{
	this.children.push(child);
	child.father = this;
	
}


Pivot.prototype.forwardVector = function()
{
	return [this.mat[6],this.mat[7],this.mat[8]];
}

Pivot.prototype.sideVector = function()
{
	return [this.mat[0],this.mat[1],this.mat[2]];
}

Pivot.prototype.upVector = function()
{
	return [this.mat[3],this.mat[4],this.mat[5]];
}

Player = function(pos=[0,0,0])
{
	this.pivot = new Pivot(pos);
}

Player.prototype.updatePosition = function()
{
	gl.uniform3fv(uPlayerPosition,this.pivot.pos);
}


Camera = function(pos=[0,0,0])
{
	this.pivot = new Pivot(pos);
}

Camera.prototype.updatePosition = function()
{
	gl.uniform3fv(uCameraPosition,this.pivot.globalPosition());
}

Camera.prototype.updateMatrix = function()
{
	gl.uniformMatrix3fv(uCameraMatrix,false,this.pivot.globalMatrix());
}

Camera.prototype.update = function()
{
	this.updatePosition();
	this.updateMatrix();
}

GeometryObject = function(pos=[0,0,0], size=[1,1,1])
{
	this.pos = pos.slice(0);this.size = size.slice(0);
}
