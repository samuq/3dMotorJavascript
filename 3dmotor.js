var motor = (function () {
  var MainCamera;
  var canvas;
  let obj;
  var width;
  var height;
  var rotIndex = 0;
  var canvases = new Array();
  var rotDegree = 0;
  var imageArray1 = new Array();
  var myvar;
  var scene1;
  var isSet;
  var y3;
  var y4;
  var YH1, YH2;
  var x4 = 7;
  var x5;
  var picSizeY;
  var description;
  var texts, text;
  function camera(x, y, z, view, up, fieldOfView, aspectRatio) {
    this.transform = new Transform();
    this.transform.position = new Vector3();
    this.transform.position.initialize(x, y, z);
    this.view = initializeAxis(view);
    this.up = initializeAxis(up);
    this.fieldOfView = fieldOfView;
    this.aspectRatio = aspectRatio;
    this.transform.rotation = new Vector3();
    this.transform.rotation.initialize(0, 0, 360);
  }

  function initializeMainCamera(x, y, z, view, up, fieldOfView, aspectRatio) {
    MainCamera = new camera(x, y, z, view, up, fieldOfView, aspectRatio);
  }

  function initializeAxis(axis) {
    var newAxis = new Vector3();
    if (axis === "x") {
      newAxis.initialize(1, 0, 0);
    }
    if (axis === "-x") {
      newAxis.initialize(-1, 0, 0);
    } else if (axis === "y") {
      newAxis.initialize(0, 1, 0);
    } else if (axis === "-y") {
      newAxis.initialize(0, -1, 0);
    } else if (axis === "z") {
      newAxis.initialize(0, 0, 1);
    } else if (axis === "-z") {
      newAxis.initialize(0, 0, -1);
    }
    return newAxis;
  }

  function Vector3() {
    this.vector3 = new Array();

    this.initialize = initialize;
    this.rotate = rotate;
    this.add = add;
    this.substract = substract;
    this.multiply = multiply;
    this.getLength = getLength;
    function initialize(x, y, z) {
      this.vector3.push(x);
      this.vector3.push(y);
      this.vector3.push(z);
    }
    function rotate(quaternion) {
      var newPosition = vectorToComplexPresentation(this.vector3);
      newPosition = quaternionMultiplication(newPosition, quaternion);
      quaternion.inverse();
      newPosition = quaternionMultiplication(newPosition, quaternion);
      this.vector3 = ComplexPresentationToVector(newPosition);
    }
    function add(vector) {
      this.vector3[0] += vector.vector3[0];
      this.vector3[1] += vector.vector3[1];
      this.vector3[2] += vector.vector3[2];
    }

    function substract(vector) {
      this.vector3[0] -= vector.vector3[0];
      this.vector3[1] -= vector.vector3[1];
      this.vector3[2] -= vector.vector3[2];
    }
    function multiply(scalar) {
      this.vector3[0] *= scalar;
      this.vector3[1] *= scalar;
      this.vector3[2] *= scalar;
    }
    function getLength() {
      this.length = Math.sqrt(
        Math.pow(this.vector3[0], 2) +
          Math.pow(this.vector3[2], 2) +
          Math.pow(this.vector3[2], 2)
      );
    }
  }

  function Vector2() {
    this.vector2 = new Array();
    this.initialize = initialize;
    function initialize(x, y) {
      this.vector2.push(x);
      this.vector2.push(y);
    }
  }

  function imageCoordinates() {
    this.imageCoords = new Array();
    this.depth;
    this.add = add;
    this.normal = new Vector3();
    this.center = new Vector3();
    this.color = new Vector3();
    this.initdepth = initdepth;
    this.initnormal = initnormal;
    this.initcenter = initcenter;
    this.initcolor = initcolor;
    function add(vector) {
      this.imageCoords.push(vector);
    }
    function initdepth(depth) {
      this.depth = depth;
    }
    function initcolor(color) {
      this.color.initialize(color[0], color[1], color[2]);
    }
    function initnormal(normal) {
      this.normal.initialize(normal[0], normal[1], normal[2]);
    }
    function initcenter(center) {
      this.center.initialize(center[0], center[1], center[2]);
    }
  }

  function addVectors(vector1, vector2) {
    var vectorA = new Vector3();
    var a = vector1.vector3[0] + vector2.vector3[0];
    var b = vector1.vector3[1] + vector2.vector3[1];
    var c = vector1.vector3[2] + vector2.vector3[2];
    vectorA.initialize(a, b, c);
    return vectorA;
  }
  function substractVectors(vector1, vector2) {
    var vectorA = new Vector3();
    var a = vector1.vector3[0] - vector2.vector3[0];
    var b = vector1.vector3[1] - vector2.vector3[1];
    var c = vector1.vector3[2] - vector2.vector3[2];
    vectorA.initialize(a, b, c);
    return vectorA;
  }
  function scalarMultiplication(vectorX, scalar) {
    var vectorA = new Vector3();
    var a = vectorX.vector3[0] * scalar;
    var b = vectorX.vector3[1] * scalar;
    var c = vectorX.vector3[2] * scalar;
    vectorA.initialize(a, b, c);
    return vectorA;
  }

  function scalarDivision(vectorX, scalar) {
    var vectorA = new Vector3();
    var a = vectorX.vector3[0] / scalar;
    var b = vectorX.vector3[1] / scalar;
    var c = vectorX.vector3[2] / scalar;
    vectorA.initialize(a, b, c);
    return vectorA;
  }

  function averageOfVectors(vector1, vector2) {
    var average = new Vector3();
    average = addVectors(vector1, vector2);
    average = scalarDivision(average, 2);
    return average;
  }

  function crossProduct(vector1, vector2) {
    var vectorX = new Vector3();
    vectorX.initialize(0, 0, 0);
    var vectorX = vectorToComplexPresentation(vectorX);
    var vectorA = vectorToComplexPresentation(vector1);
    var vectorB = vectorToComplexPresentation(vector2);
    var complexC = new complex(1);
    for (var i = 0; i < vectorA.quaternion.length; i++) {
      for (var j = 0; j < vectorB.quaternion.length; j++) {
        complexC = crossMultiply(vectorA.quaternion[i], vectorB.quaternion[j]);
        for (var k = 0; k < vectorX.quaternion.length; k++) {
          if (complexC.complex === vectorX.quaternion[k].complex) {
            vectorX.quaternion[k] = complexAdd(vectorX.quaternion[k], complexC);
          }
        }
      }
    }
    vectorX = complexPresentationToVector(vectorX);
    return vectorX;
  }

  function crossMultiply(quat1, quat2) {
    var complexX = new complex(1);
    var complex1 = quat1.complex;
    var complex2 = quat2.complex;
    var scalar1 = quat1.scalar;
    var scalar2 = quat2.scalar;

    if (
      (complex1 === "i" && complex2 === "i") ||
      (complex1 === "j" && complex2 === "j") ||
      (complex1 === "k" && complex2 === "k")
    ) {
      complexX.complex = 0;
    } else if (complex1 === "j" && complex2 === "k") {
      complexX.complex = "i";
    } else if (complex1 === "k" && complex2 === "i") {
      complexX.complex = "j";
    } else if (complex1 === "i" && complex2 === "j") {
      complexX.complex = "k";
    } else if (complex1 === "k" && complex2 === "j") {
      complexX.complex = "i";
      scalar1 *= -1;
    } else if (complex1 === "i" && complex2 === "k") {
      complexX.complex = "j";
      scalar1 *= -1;
    } else if (complex1 === "j" && complex2 === "i") {
      complexX.complex = "k";
      scalar1 *= -1;
    }
    complexX.scalar = scalar1 * scalar2;
    return complexX;
  }

  function dotProduct(vector1, vector2) {
    var a =
      vector1.vector3[0] * vector2.vector3[0] +
      vector1.vector3[1] * vector2.vector3[1] +
      vector1.vector3[2] * vector2.vector3[2];
    return a;
  }

  function angleBetween(vector1, vector2) {
    var vector3 = substractVectors(vector1, vector2);
    var a = getLength(vector1);
    var b = getLength(vector2);
    var c = getLength(vector3);
    cosY = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
    var Y = Math.acos(cosY);
    var angle = toDegrees(Y);
    return angle;
  }

  function distanceBetween(vector1, vector2) {
    var vectorX = substractVectors(vector1, vector2);
    var a = getLength(vectorX);
    return a;
  }

  function getLength(vector) {
    var length = Math.sqrt(
      Math.pow(vector.vector3[0], 2) +
        Math.pow(vector.vector3[1], 2) +
        Math.pow(vector.vector3[2], 2)
    );
    return length;
  }
  function unitVector(vector) {
    var length = getLength(vector);
    var unitvectorA = new Vector3();
    unitvectorA.vector3[0] = vector.vector3[0] / length;
    unitvectorA.vector3[1] = vector.vector3[1] / length;
    unitvectorA.vector3[2] = vector.vector3[2] / length;
    return unitvectorA;
  }

  function toRGB(vector) {
    for (var i = 0; i < 3; i++) {
      if (vector.vector3[i] > 255) {
        vector.vector3[i] = 255;
      }
      if (vector.vector3[i] < 0) {
        vector.vector3[i] = 0;
      }
    }
    var r = Math.round(vector.vector3[0]);
    var g = Math.round(vector.vector3[1]);
    var b = Math.round(vector.vector3[2]);
    var color = "rgb(" + r + "," + g + "," + b + ")";
    return color;
  }

  function Edge() {
    this.edge = new Array();
    this.edge[0] = 1;
    this.edge[1] = 1;
    this.initialize = initialize;
    function initialize(a, b) {
      var a1 = new Vector3();
      a1.initialize(a[0], a[1], a[2]);
      var b1 = new Vector3();
      b1.initialize(b[0], b[1], b[2]);
      this.edge.splice(0, 2, a1, b1);
    }
  }

  function Face() {
    this.center = new Vector3();
    this.setCenter = setCenter;
    this.color = new Vector3();
    this.changeColor = changeColor;
    this.face = new Array();
    this.uvs = new Array();
    this.initialize = initialize;
    this.initializeUvs = initializeUvs;
    function initialize(a, b, c) {
      var a1 = new Vector3();
      a1.initialize(a[0], a[1], a[2]);
      var b1 = new Vector3();
      b1.initialize(b[0], b[1], b[2]);
      var c1 = new Vector3();
      c1.initialize(c[0], c[1], c[2]);
      this.face.splice(0, 3, a1, b1, c1);
    }
    function initializeUvs(a, b, c) {
      var a1 = new Vector2();
      a1.initialize(a[0], a[1]);
      var b1 = new Vector2();
      b1.initialize(b[0], b[1]);
      var c1 = new Vector2();
      c1.initialize(c[0], c[1]);
      this.uvs.splice(0, 3, a1, b1, c1);
    }
    function changeColor(color) {
      this.color = color;
    }
    function setCenter() {
      var a = averageOfVectors(this.face[0], this.face[1]);
      a = averageOfVectors(a, this.face[2]);
      this.center = a;
    }
  }

  function Transform() {
    this.position = new Vector3();
    this.rotation = new Vector3();
    this.scale = new Vector3();
    this.initialize = initialize;
    function initialize(position, rotation, scale) {
      this.position = position;
      this.rotation = rotation;
      this.scale = scale;
    }
  }

  function light(distance, transform, color, attenuation, magnitude) {
    this.distance = distance;
    this.transform = transform;
    this.color = color;
    this.attenuation = attenuation;
    this.magnitude = magnitude;
    this.initialize = initialize;
    function initialize(distance, transform, color, attenuation, magnitude) {
      this.distance = distance;
      this.transform = transform;
      this.color = color;
      this.attenuation = attenuation;
      this.magnitude = magnitude;
    }
  }

  function mesh() {
    this.transform = new Transform();
    this.vertices = new Array();
    this.edges = new Array();
    this.faces = new Array();
    this.Uvs = new Array();
    this.vertexNormals = new Array();
    this.normals = new Array();
    this.CreatePlane = CreatePlane;
    this.CreatePlaneGrid = CreatePlaneGrid;
    this.LoadObj = LoadObj;
    this.CreateObj = CreateObj;
    this.Createcube = Createcube;
    this.CreateSphere = CreateSphere;
    this.edgesAndFaces = edgesAndFaces;
    this.edgesAndFacesPlane = edgesAndFacesPlane;
    this.edgesAndFacesPlaneGrid = edgesAndFacesPlaneGrid;
    this.calculateNormals = calculateNormals;
    this.calculateFaceNormals = calculateFaceNormals;
    this.sphereMap = sphereMap;
    function LoadObj(e) {
      readSingleFile(e);
      //console.log(contents);
    }
    //this.cubeMap=cubeMap;
    function CreateObj(text) {
      let vertexData = text.split("v");
      vertexData.shift();
      let faceData = vertexData.pop();
      faceData = faceData.split("f");
      let midData = faceData.shift();
      console.log(midData);
      vertexData.push(midData);
      for (let i = 0; i < vertexData.length; i++) {
        const vertexArray = vertexData[i].trim().split(" ");
        const newVertex = new Vector3();
        newVertex.initialize(
          Number(vertexArray[0]),
          Number(vertexArray[1]),
          Number(vertexArray[2])
        );
        this.vertices.push(newVertex);
      }
      //console.log(this.vertices);
      for (let i = 0; i < faceData.length; i++) {
        const faceArray = faceData[i].trim().split(" ");
        //console.log(faceArray);
        const newFace = new Face();

        newFace.initialize(
          this.vertices[Number(faceArray[0]) - 1].vector3,
          this.vertices[Number(faceArray[1]) - 1].vector3,
          this.vertices[Number(faceArray[2]) - 1].vector3
        );
        this.faces.push(newFace);
      }
      this.calculateFaceNormals();
    }
    function CreatePlane(x, y, z) {
      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
          var vertexNew = new Vector3();
          var x1 = -x / 2 + i * x;
          var y1 = -y / 2 + j * y;
          vertexNew.initialize(x1, y1, z);
          this.vertices.push(vertexNew);
          var uv = new Vector2();
          uv.initialize(i, j);
          this.Uvs.push(uv);
        }
      }
    }
    function CreatePlaneGrid(width1, height1, depth, x) {
      console.log(width1);
      var y2 = Math.round((height1 / width1) * x);
      if (y2 < 2) y2 = 2;
      for (var i = 0; i < x; i++) {
        for (var j = 0; j < y2; j++) {
          var vertexNew = new Vector3();
          var x1 = -width1 / 2 + i * (width1 / (x - 1));
          var y1 = -height1 / 2 + j * (height1 / (y2 - 1));
          vertexNew.initialize(x1, y1, depth);
          this.vertices.push(vertexNew);
          var uv = new Vector2();
          uv.initialize(i * (1 / (x - 1)), j * (1 / (y2 - 1)));
          this.Uvs.push(uv);
          console.log(x1);
        }
      }
    }
    function Createcube(x, y, z) {
      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
          for (var k = 0; k < 2; k++) {
            var vertexNew = new Vector3();
            var x1 = -x / 2 + i * x;
            var y1 = -y / 2 + j * y;
            var z1 = -z / 2 + k * z;
            vertexNew.initialize(x1, y1, z1);
            this.vertices.push(vertexNew);
          }
        }
      }
    }
    function CreateSphere(slices, sections, radius) {
      if (sections < 3) {
        sections = 3;
      }
      if (slices < 2) {
        slices = 2;
      }
      this.slices = slices;
      this.sections = sections;
      this.radius = radius;
      var sliceAngle = 360.0 / (slices * 2);
      var sectionAngle = 360.0 / sections;
      var subHeight;
      var subRadius;
      var offsetX = 1 / sections;
      var offsetY = 1 / slices;
      for (var i = 0; i <= slices; i++) {
        var angle = toRadians(90 - i * sliceAngle);
        subRadius = radius * Math.cos(angle);
        if (subRadius <= 0.001) {
          subRadius = 0;
        }
        subHeight = radius * Math.sin(angle);

        for (var j = 0; j < sections; j++) {
          var uvx;
          var uvy;
          var uv = new Vector2();
          var newVertex = new Vector3();
          var x;
          var y = subHeight;
          var z;
          var angle1 = toRadians(j * sectionAngle);
          if (subRadius === 0 && j === 0) {
            var uvx = 0.5;
            if (i > 0) {
              uvy = 1;
            } else {
              uvy = 0;
            }
            uv.initialize(uvx, uvy);
            this.Uvs.push(uv);
            x = 0;
            z = 0;
            newVertex.initialize(x, y, z);
            this.vertices.push(newVertex);
          } else if (subRadius !== 0) {
            uvx = j * offsetX;
            uvy = i * offsetY;
            uv.initialize(uvx, uvy);
            this.Uvs.push(uv);
            x = subRadius * Math.cos(angle1);
            z = subRadius * Math.sin(angle1);
            newVertex.initialize(x, y, z);
            this.vertices.push(newVertex);
          }
        }
      }
    }
    function edgesAndFacesPlaneGrid(x) {
      this.faces.splice(0, this.faces.length);
      this.edges.splice(0, this.edges.length);
      var everyOtherX = true;
      var everyOtherY = true;
      var y = this.vertices.length / x;

      for (var i = 0; i < x - 1; i++) {
        everyOtherX = !everyOtherX;
        everyOtherY = everyOtherX;
        for (var j = 0; j < y - 1; j++) {
          var face = new Face();
          var face2 = new Face();
          if (everyOtherY) {
            face.initialize(
              this.vertices[i * y + j].vector3,
              this.vertices[i * y + j + 1].vector3,
              this.vertices[i * y + j + y + 1].vector3
            );
            face.initializeUvs(
              this.Uvs[i * y + j].vector2,
              this.Uvs[i * y + j + 1].vector2,
              this.Uvs[i * y + j + y + 1].vector2
            );
            this.faces.push(face);
            face2.initialize(
              this.vertices[i * y + j].vector3,
              this.vertices[i * y + j + y + 1].vector3,
              this.vertices[i * y + j + y].vector3
            );
            face2.initializeUvs(
              this.Uvs[i * y + j].vector2,
              this.Uvs[i * y + j + y + 1].vector2,
              this.Uvs[i * y + j + y].vector2
            );
            //console.log(everyOtherY, face2.uvs);
            //console.log(everyOtherY, face.uvs);
          } else {
            //face.initialize(this.vertices[i * y + j].vector3, this.vertices[i * y + j + 1].vector3, this.vertices[i * y + j + y].vector3);
            //face.initializeUvs(this.Uvs[i * y + j].vector2, this.Uvs[i * y + j + 1].vector2, this.Uvs[i * y + j + y].vector2);
            //this.faces.push(face);
            //face2.initialize(this.vertices[i * y + j + 1].vector3, this.vertices[i * y + j + y + 1].vector3, this.vertices[i * y + j + y].vector3);
            //face2.initializeUvs(this.Uvs[i * y + j + 1].vector2, this.Uvs[i * y + j + y + 1].vector2, this.Uvs[i * y + j + y].vector2);
            //console.log(everyOtherY,face2.uvs);
            //console.log(everyOtherY, face.uvs);
            face.initialize(
              this.vertices[i * y + j].vector3,
              this.vertices[i * y + j + 1].vector3,
              this.vertices[i * y + j + y + 1].vector3
            );
            face.initializeUvs(
              this.Uvs[i * y + j].vector2,
              this.Uvs[i * y + j + 1].vector2,
              this.Uvs[i * y + j + y + 1].vector2
            );
            this.faces.push(face);
            face2.initialize(
              this.vertices[i * y + j].vector3,
              this.vertices[i * y + j + y + 1].vector3,
              this.vertices[i * y + j + y].vector3
            );
            face2.initializeUvs(
              this.Uvs[i * y + j].vector2,
              this.Uvs[i * y + j + y + 1].vector2,
              this.Uvs[i * y + j + y].vector2
            );
            //console.log(everyOtherY, face2.uvs);
            //console.log(everyOtherY, face.uvs);
          }
          this.faces.push(face2);
          everyOtherY = !everyOtherY;
        }
      }
    }
    function edgesAndFacesPlane() {
      this.faces.splice(0, this.faces.length);
      this.edges.splice(0, this.edges.length);
      var edge = new Edge();
      edge.initialize(this.vertices[0].vector3, this.vertices[1].vector3);
      this.edges.push(edge);
      var edge2 = new Edge();
      edge2.initialize(this.vertices[1].vector3, this.vertices[3].vector3);
      this.edges.push(edge2);
      var edge3 = new Edge();
      edge3.initialize(this.vertices[3].vector3, this.vertices[2].vector3);
      this.edges.push(edge3);
      var edge4 = new Edge();
      edge4.initialize(this.vertices[2].vector3, this.vertices[0].vector3);
      this.edges.push(edge4);
      var edge5 = new Edge();
      edge5.initialize(this.vertices[1].vector3, this.vertices[2].vector3);
      this.edges.push(edge5);
      var face = new Face();
      face.initialize(
        this.vertices[0].vector3,
        this.vertices[1].vector3,
        this.vertices[2].vector3
      );
      face.initializeUvs(
        this.Uvs[0].vector2,
        this.Uvs[1].vector2,
        this.Uvs[2].vector2
      );
      this.faces.push(face);
      var face2 = new Face();
      face2.initialize(
        this.vertices[1].vector3,
        this.vertices[3].vector3,
        this.vertices[2].vector3
      );
      face2.initializeUvs(
        this.Uvs[1].vector2,
        this.Uvs[3].vector2,
        this.Uvs[2].vector2
      );
      console.log(face2.uvs);
      this.faces.push(face2);
    }
    function edgesAndFaces() {
      this.faces.splice(0, this.faces.length);
      this.edges.splice(0, this.edges.length);
      for (var i = 0; i <= this.slices; i++) {
        //document.write(this.slices);
        for (var j = 0; j < this.sections; j++) {
          //document.write("i"+i+"j"+j);

          if (i - 1 === 0) {
            //document.write(i);

            if (j === this.sections - 1) {
              //document.write("jsec:");document.write(j);
              var d = this.vertices[1].vector3.slice(); //document.write(d[1]);
              var e = this.vertices[0].vector3.slice();
              var edge = new Edge();
              edge.initialize(d, e);
              this.edges.push(edge);
              var a = this.vertices[j + 1].vector3.slice(); //document.write(a);
              var b = this.vertices[0].vector3.slice();
              var c = this.vertices[1].vector3.slice();
              var face = new Face();
              face.initialize(a, b, c);
              this.faces.push(face);
              var d1 = this.vertices[1].vector3.slice();
              var e1 = this.vertices[j + 1].vector3.slice();
              var edge1 = new Edge();
              edge1.initialize(d1, e1);
              this.edges.push(edge1);
              //document.write(this.edges[1].edge[1].vector3[0]);
            } else if (j >= 0 && j !== this.sections - 1) {
              //document.write("j:");document.write(j-1);
              var d = this.vertices[j + 2].vector3.slice();
              var e = this.vertices[0].vector3.slice();
              var edge = new Edge();
              edge.initialize(d, e);
              this.edges.push(edge);
              var a = this.vertices[j + 1].vector3.slice();
              var b = this.vertices[0].vector3.slice(); //document.write(e);
              var c = this.vertices[j + 2].vector3.slice(); //document.write("edge:");
              var face = new Face();
              face.initialize(a, b, c);
              this.faces.push(face);
              var d1 = this.vertices[j + 1].vector3.slice();
              var e1 = this.vertices[j + 2].vector3.slice();
              var edge1 = new Edge();
              edge1.initialize(d1, e1);
              this.edges.push(edge1); //document.write(this.edges[j-1].edge[0].vector3[0]);
            }
          } else if (i > 1 && i !== this.slices) {
            //document.write("i>1:");document.write(i);
            var index = (i - 1) * this.sections + 1;
            var index2 = (i - 2) * this.sections + 1;
            if (j === this.sections - 1) {
              //document.write(j);
              var d = this.vertices[index + j].vector3.slice();
              var e = this.vertices[index2 + j].vector3.slice();
              var edge = new Edge();
              edge.initialize(d, e);
              this.edges.push(edge);
              var a = this.vertices[index + j].vector3.slice();
              var b = this.vertices[index2 + j].vector3.slice();
              var c = this.vertices[index2].vector3.slice();
              var face = new Face();
              face.initialize(a, b, c);
              this.faces.push(face);
              var a1 = this.vertices[index + j].vector3.slice();
              var b1 = this.vertices[index2].vector3.slice();
              var c1 = this.vertices[index].vector3.slice();
              var face1 = new Face();
              face1.initialize(a1, b1, c1);
              this.faces.push(face1);
              var d1 = this.vertices[index + j].vector3.slice();
              var e1 = this.vertices[index2].vector3.slice();
              var edge1 = new Edge();
              edge1.initialize(d1, e1);
              this.edges.push(edge1);
              var d2 = this.vertices[index + j].vector3.slice();
              var e2 = this.vertices[index].vector3.slice();
              var edge2 = new Edge();
              edge2.initialize(d2, e2);
              this.edges.push(edge2);
            } else if (j >= 0 && j !== this.sections - 1) {
              d = this.vertices[index + j].vector3.slice();
              e = this.vertices[index2 + j].vector3.slice();
              var edge = new Edge();
              edge.initialize(d, e);
              this.edges.push(edge);
              var a = this.vertices[index + j].vector3.slice();
              var b = this.vertices[index2 + j].vector3.slice();
              var c = this.vertices[index2 + j + 1].vector3.slice();
              var face = new Face();
              face.initialize(a, b, c);
              this.faces.push(face);
              var a1 = this.vertices[index + j].vector3.slice();
              var b1 = this.vertices[index2 + j + 1].vector3.slice();
              var c1 = this.vertices[index + j + 1].vector3.slice();
              var face1 = new Face();
              face1.initialize(a1, b1, c1);
              this.faces.push(face1);
              var d1 = this.vertices[index + j].vector3.slice();
              var e1 = this.vertices[index2 + j + 1].vector3.slice();
              var edge1 = new Edge();
              edge1.initialize(d1, e1);
              this.edges.push(edge1);
              var d2 = this.vertices[index + j].vector3.slice();
              var e2 = this.vertices[index + j + 1].vector3.slice();
              var edge2 = new Edge();
              edge2.initialize(d2, e2);
              this.edges.push(edge2);
            }
          } else if (i === this.slices) {
            var index = this.sections * (this.slices - 1) + 1;
            if (j === this.sections - 1) {
              var d = this.vertices[index].vector3.slice();
              var e = this.vertices[index - 1].vector3.slice();
              var edge = new Edge();

              edge.initialize(d, e);
              this.edges.push(edge);
              var a = this.vertices[index].vector3.slice();
              var b = this.vertices[index - 1].vector3.slice();
              var c = this.vertices[index - this.sections].vector3.slice();
              var face = new Face();
              face.initialize(a, b, c);
              this.faces.push(face);
              //if(this.slices>2){
              //var d1=this.vertices[index-1].vector3.slice();
              //var e1=this.vertices[index-this.sections].vector3.slice();
              //var edge1=new Edge();
              //edge1.initialize(d1,e1);
              //this.edges.push(edge1);
              //}
            } else if (j >= 0 && j !== this.sections - 1) {
              //document.write("i=slices"+j);
              //if(this.slices>2){
              //var d=this.vertices[index-this.sections+j].vector3.slice();
              //var e=this.vertices[index-this.sections+j+1].vector3.slice();
              //var edge1=new Edge();
              //edge.initialize(d,e);
              //this.edges.push(edge);
              //}
              var a = this.vertices[index].vector3.slice();
              var b = this.vertices[index - this.sections + j].vector3.slice();
              var c =
                this.vertices[index - this.sections + j + 1].vector3.slice();
              var face = new Face();
              face.initialize(a, b, c);
              this.faces.push(face);
              var d1 = this.vertices[index].vector3.slice();
              var e1 = this.vertices[index - this.sections + j].vector3.slice();
              var edge1 = new Edge();
              edge1.initialize(d1, e1);
              this.edges.push(edge1);
            }
          }
        }
      }
    }
    function sphereMap() {}
    function calculateNormals() {
      //this.transform.position-=this.transform.position;
      this.normals.splice(0, this.normals.length);
      for (var i = 0; i < this.vertices.length; i++) {
        var normal = unitVector(this.vertices[i]);
        this.normals.push(normal);
      }
    }
    function calculateFaceNormals() {
      this.normals.splice(0, this.normals.length);
      for (var i = 0; i < this.faces.length; i++) {
        this.faces[i].setCenter();
        var normalA = calculateFaceNormal(this.faces[i]);
        this.normals.push(normalA);
      }
    }
  }
  function readSingleFile(e) {
    if (!e || !e.target) {
      return;
    }
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      var contents = e.target.result;
      //console.log(contents);
      obj.CreateObj(contents);
      return contents;
    };
    reader.readAsText(file);
  }
  function calculateFaceNormal(face) {
    var a = substractVectors(face.face[1], face.face[0]);
    var b = substractVectors(face.face[2], face.face[0]);
    var normal1 = crossProduct(a, b);
    normal1 = unitVector(normal1);
    return normal1;
  }

  function startscene(e) {
    console.log("start!");
    var scene1 = new scene();
    canvas = document.getElementById("view");
    width = canvas.width;
    console.log(width);
    height = canvas.height;
    var ratio = height / width;
    initializeMainCamera(0, 0, -100, "z", "x", 90, ratio);

    obj = new mesh();
    obj.LoadObj(e);
    var cube = new mesh();
    cube.Createcube(1, 1, 1);
    //scene1.add(cube);
    var cube2 = new mesh();
    cube2.Createcube(2, 2, 2);
    //scene1.add(cube2);
    var sphere = new mesh();
    sphere.CreateSphere(14, 14, 1.5);
    sphere.edgesAndFaces(); //document.write(sphere.uvs.length);
    sphere.calculateFaceNormals(); //document.write(sphere.normals.length);
    var transform = new Transform();
    var pos = new Vector3();
    pos.initialize(3.5, 0, 7);
    var rot = new Vector3();
    rot.initialize(0, 0, 0);
    var scale = new Vector3();
    scale.initialize(1, 1, 1);
    transform.initialize(pos, rot, scale);
    var color = new Vector3();
    color.initialize(175, 205, 255);
    var light1 = new light(150, transform, color, 0.5, 1);
    scene1.addLight(light1);
    scene1.add(obj);
    //scene1.add(sphere);//document.write(scene1.lights[0]);
    rotateObjects(scene1);
    var myvar = setInterval(function () {
      rotateObjects(scene1);
    }, 50);
  }

  function scene() {
    this.objects = new Array();
    this.lights = new Array();
    this.add = add;
    this.addLight = addLight;
    this.remove = remove;
    this.removeLight = removeLight;
    function add(object) {
      this.objects.push(object);
    }
    function addLight(light) {
      this.lights.push(light);
    }
    function remove(object) {
      var x = this.objects.indexOf(object);
      if (x !== undefined) {
        this.objects.splice(x, 1);
      }
    }
    function removeLight(light) {
      var x = this.lights.indexOf(light);
      if (x !== undefined) {
        this.lights.splice(x, 1);
      }
    }
  }

  function quaternion() {
    this.quaternion = new Array(4);
    this.quaternion[0] = new complex(1);
    this.quaternion[1] = new complex("i");
    this.quaternion[2] = new complex("j");
    this.quaternion[3] = new complex("k");
    this.initialize = initialize;

    this.inverse = inverse;
    function initialize(angle, vector) {
      angle = toRadians(angle);
      var a = new complex(1);
      a.initialize(Math.cos(angle), 1);
      this.quaternion[0] = a;
      var b = new complex("i");
      uVector = unitVector(vector);
      var angle1 = Math.sin(angle);
      var vector1 = scalarMultiplication(uVector, angle1);
      b.initialize(vector1.vector3[0], "i");
      this.quaternion[1] = b;
      var c = new complex("j");
      c.initialize(vector1.vector3[1], "j");
      this.quaternion[2] = c;
      var d = new complex("k");
      d.initialize(vector1.vector3[2], "k");
      this.quaternion[3] = d;
    }
    function inverse() {
      this.quaternion[1].scalar *= -1;
      this.quaternion[2].scalar *= -1;
      this.quaternion[3].scalar *= -1;
    }
  }

  function complex(c) {
    this.scalar = 0;
    this.complex = c;
    this.initialize = initialize;
    function initialize(s, c) {
      this.scalar = s;
      this.complex = c;
    }
  }

  function complexAdd(complex1, complex2) {
    var complexI = new complex(1);
    complexI.complex = complex1.complex;
    complexI.scalar = complex1.scalar + complex2.scalar;
    return complexI;
  }

  function vectorToComplexPresentation(vector) {
    var vectorA = new complexVector();

    var a = new complex("i");
    a.initialize(vector.vector3[0], "i");
    var b = new complex("j");
    b.initialize(vector.vector3[1], "j");
    var c = new complex("k");
    c.initialize(vector.vector3[2], "k");
    vectorA.quaternion.push(a);
    vectorA.quaternion.push(b);
    vectorA.quaternion.push(c);

    return vectorA;
  }
  function complexVector() {
    this.quaternion = new Array();
  }
  function ComplexPresentationToVector(quaternion) {
    if (Math.abs(quaternion.quaternion[0].scalar) <= 0.001) {
      var vector = new Vector3();
      vector.vector3[0] = quaternion.quaternion[1].scalar;
      vector.vector3[1] = quaternion.quaternion[2].scalar;
      vector.vector3[2] = quaternion.quaternion[3].scalar;
      return vector;
    } else {
      return;
    }
  }

  function complexPresentationToVector(quaternion) {
    var vector = new Vector3();
    vector.vector3[0] = quaternion.quaternion[0].scalar;
    vector.vector3[1] = quaternion.quaternion[1].scalar;
    vector.vector3[2] = quaternion.quaternion[2].scalar;
    return vector;
  }

  function complexMultiplication(complex1, complex2, scalar1, scalar2) {
    var complexX = new complex(1);
    if (complex1 === 1 && complex2 === 1) {
      complexX.complex = 1;
    } else if (
      (complex1 === "i" && complex2 === "i") ||
      (complex1 === "j" && complex2 === "j") ||
      (complex1 === "k" && complex2 === "k")
    ) {
      complexX.complex = 1;
      scalar1 *= -1;
    } else if (
      (complex1 === 1 && complex2 === "i") ||
      (complex1 === "i" && complex2 === 1) ||
      (complex1 === "j" && complex2 === "k")
    ) {
      complexX.complex = "i";
    } else if (
      (complex1 === 1 && complex2 === "j") ||
      (complex1 === "j" && complex2 === 1) ||
      (complex1 === "k" && complex2 === "i")
    ) {
      complexX.complex = "j";
    } else if (
      (complex1 === 1 && complex2 === "k") ||
      (complex1 === "k" && complex2 === 1) ||
      (complex1 === "i" && complex2 === "j")
    ) {
      complexX.complex = "k";
    } else if (complex1 === "k" && complex2 === "j") {
      complexX.complex = "i";
      scalar1 *= -1;
    } else if (complex1 === "i" && complex2 === "k") {
      complexX.complex = "j";
      scalar1 *= -1;
    } else if (complex1 === "j" && complex2 === "i") {
      complexX.complex = "k";
      scalar1 *= -1;
    }
    complexX.scalar = scalar1 * scalar2;
    return complexX;
  }

  function quaternionMultiplication(quaternion1, quaternion2) {
    //document.write("multiply:");
    var quaternionX = new quaternion();
    var complexA;
    for (var i = 0; i < quaternion1.quaternion.length; i++) {
      for (var j = 0; j < quaternion2.quaternion.length; j++) {
        complexA = complexMultiplication(
          quaternion1.quaternion[i].complex,
          quaternion2.quaternion[j].complex,
          quaternion1.quaternion[i].scalar,
          quaternion2.quaternion[j].scalar
        );

        for (var k = 0; k < quaternionX.quaternion.length; k++) {
          if (complexA.complex === quaternionX.quaternion[k].complex) {
            quaternionX.quaternion[k] = complexAdd(
              quaternionX.quaternion[k],
              complexA
            );
          }
        }
      }
    }
    return quaternionX;
  }

  function applyRotation(vector1, axis1, angle) {
    var newPosition = vectorToComplexPresentation(vector1);
    var rotation1 = new quaternion();
    rotation1.initialize(angle / -2, axis1);
    newPosition = quaternionMultiplication(rotation1, newPosition);
    rotation1.inverse();
    newPosition = quaternionMultiplication(newPosition, rotation1);
    newPosition = ComplexPresentationToVector(newPosition);
    return newPosition;
  }

  function rotate() {}

  function projection(camera, point) {
    var vector2 = new Vector2();
    var position = substractVectors(point, camera.transform.position);
    //var xAxis=new Vector3();
    //xAxis.initialize(1,0,0);
    //var yAxis=new Vector3();
    //yAxis.initialize(0,1,0);
    //var zAxis=new Vector3();
    //zAxis.initialize(0,0,1);
    //var newPosition=applyRotation(position,xAxis,camera.rotation.vector3[0]/-2);
    //newPosition=applyRotation(newPosition,yAxis,camera.rotation.vector3[1]/-2);
    //newPosition=applyRotation(newPosition,zAxis,camera.rotation.vector3[2]/-2);
    var x = position.vector3[0];
    var y = position.vector3[1];
    var z = position.vector3[2];
    if (z > 0) {
      var hypo = Math.sqrt(Math.pow(z, 2) + Math.pow(x, 2));
      var sin = Math.abs(x) / hypo;
      var radians = Math.asin(sin);
      var alpha = toDegrees(radians);
      var fov = camera.fieldOfView / 2;
      var angle = toRadians(fov);
      if (alpha <= fov) {
        var hypo1 = 1 / Math.cos(angle);
        var width1 = Math.sin(angle) / hypo1;
        var newX = (x / z + width1) / (width1 * 2);
        var ratio = height / width;
        fov *= ratio;
        var angle = toRadians(fov);
        hypo1 = 1 / Math.cos(angle);
        var height1 = width1 * ratio;
        var newY = (y / z + height1) / (height1 * 2);
        vector2.initialize(newX, newY);
        return vector2;
      } else {
        return;
      }
    } else {
      return;
    }
  }

  function reProjection(camera, face) {
    var imgCoord = new imageCoordinates();
    var center = centerPoint(face);
    imgCoord.initcenter(center.vector3); //document.write(imgCoord.center.vector3);
    imgCoord.initdepth(center.vector3[2]);
    imgCoord.initcolor(face.color.vector3);
    var normal = calculateFaceNormal(face);
    imgCoord.initnormal(normal.vector3);
    for (var i = 0; i < face.face.length; i++) {
      var vector2 = new Vector2();
      var position = face.face[i];
      var x = position.vector3[0];
      var y = position.vector3[1];
      var z = position.vector3[2];

      var hypo = Math.sqrt(Math.pow(z, 2) + Math.pow(x, 2));
      var sin = Math.abs(x) / hypo;
      var radians = Math.asin(sin);
      var alpha = toDegrees(radians);
      var fov = camera.fieldOfView / 2;
      var angle = toRadians(fov);
      var hypo1 = 1 / Math.cos(angle);
      var width1 = Math.sin(angle) / hypo1;
      var newX = (x / z + width1) / (width1 * 2);
      var ratio = height / width;
      fov *= ratio;
      var angle = toRadians(fov);
      hypo1 = 1 / Math.cos(angle);
      var height1 = width1 * ratio;
      var newY = (y / z + height1) / (height1 * 2);
      vector2.initialize(newX, newY);
      imgCoord.add(vector2);
    }
    return imgCoord;
  }

  function rotateObjects(scene1) {
    axis1 = new Vector3();
    axis1.initialize(1, 0, 0);
    angle = 2;

    for (var i = 0; i < scene1.objects.length; i++) {
      //console.log(scene1.objects[i]);
      for (var j = 0; j < scene1.objects[i].faces.length; j++) {
        //console.log(scene1.objects[i].faces[j], i, j);
        for (var k = 0; k < scene1.objects[i].faces[j].face.length; k++) {
          //console.log(scene1.objects[i].faces[j].face[k], i, j, k);
          scene1.objects[i].faces[j].face[k] = applyRotation(
            scene1.objects[i].faces[j].face[k],
            axis1,
            angle
          );
        }
      }
      scene1.objects[i].calculateFaceNormals();
    }

    drawPolygons(scene1);
    //drawEdges(scene1);
    //drawVertices(scene1);
  }
  function rotatePlanes(scene1, images, rotDegree1) {
    axis1 = new Vector3();
    axis1.initialize(0, 1, 0);
    rotDegree += rotDegree1;

    if (rotDegree < 0) {
      rotDegree = 360;
    }
    if (rotDegree > 360) {
      rotDegree = 0;
    }
    console.log(rotDegree);
    console.log(rotIndex);
    if (rotIndex <= 0 && rotDegree1 < 0) {
      rotIndex = images.length;
    }
    if (rotIndex >= images.length && rotDegree1 > 0) {
      rotIndex = 0;
    }
    //if (rotIndex <= 0 && rotDegree1 > 0) { rotIndex++; }
    if (rotDegree >= (360 / images.length) * (rotIndex + 1) && rotDegree1 > 0) {
      clearInterval(myvar);

      //if (rotIndex >= images.length) rotIndex = 0;
      rotIndex++;
    }
    if (rotDegree <= (360 / images.length) * (rotIndex - 1) && rotDegree1 < 0) {
      clearInterval(myvar);

      //if (rotIndex <= 0) rotIndex = images.length;
      rotIndex--;
    }
    console.log(rotIndex);
    for (var i = 0; i < scene1.objects.length; i++) {
      for (var j = 0; j < scene1.objects[i].faces.length; j++) {
        for (var k = 0; k < scene1.objects[i].faces[j].face.length; k++) {
          scene1.objects[i].faces[j].face[k] = applyRotation(
            scene1.objects[i].faces[j].face[k],
            axis1,
            -rotDegree1
          );
        }
      }
      scene1.objects[i].calculateFaceNormals();
    }

    drawPlanes(scene1, images);
  }
  function rotatePlaneGrids(scene1, images1, rotDegree1) {
    axis1 = new Vector3();
    axis1.initialize(0, 1, 0);
    //rotDegree += rotDegree1;
    //rotDegree = Math.round(rotDegree);
    //var X = rotDegree % 180;
    //var Y = Math.sin(X * (Math.PI / 180));
    ////rotDegree -= rotDegree1;
    //rotDegree1 *= Y;
    rotDegree += rotDegree1;
    var rotate = true;
    if (rotDegree < 0) {
      rotDegree += 360;
    }
    if (rotDegree > 360) {
      rotDegree -= 360;
    }
    console.log(rotDegree);
    //console.log(rotIndex);
    if (rotIndex <= 0 && rotDegree1 < 0) {
      rotIndex = images1.length;
    }
    if (rotIndex >= images1.length && rotDegree1 > 0) {
      rotIndex = 0;
    }
    //if (rotIndex <= 0 && rotDegree1 > 0) { rotIndex++; }
    if (
      rotDegree >= (360 / images1.length) * (rotIndex + 1) &&
      rotDegree1 > 0
    ) {
      clearInterval(myvar);
      rotate = false;
      //if (rotIndex >= images.length) rotIndex = 0;
      rotIndex++;
    }
    if (
      rotDegree <= (360 / images1.length) * (rotIndex - 1) &&
      rotDegree1 < 0
    ) {
      clearInterval(myvar);
      rotate = false;
      //if (rotIndex <= 0) rotIndex = images.length;
      rotIndex--;
    }
    //console.log(rotIndex);
    //if (rotate) {

    for (var i = 0; i < scene1.objects.length; i++) {
      for (var j = 0; j < scene1.objects[i].faces.length; j++) {
        for (var k = 0; k < scene1.objects[i].faces[j].face.length; k++) {
          scene1.objects[i].faces[j].face[k] = applyRotation(
            scene1.objects[i].faces[j].face[k],
            axis1,
            -rotDegree1
          );
        }
      }
      scene1.objects[i].calculateFaceNormals();
    }
    // }

    drawPlaneGrids(scene1, images1);
    if (rotIndex == images1.length) {
      texts = images1[0].id.toString().split("_");
    } else {
      texts = images1[rotIndex].id.toString().split("_");
    }
    text = texts[2].split(".");
    description = document.getElementById("description");
    description.innerHTML =
      "<i>" + texts[1] + "</i>" + "<br>" + text[0] + ", " + texts[0];
  }
  function rotateObjects1(scene1) {
    for (var i = 0; i < scene1.objects.length; i++) {
      for (var j = 0; j < scene1.objects[i].edges.length; j++) {
        axis1 = new Vector3();
        axis1.initialize(0, 1, 0);
        angle = 2;
        scene1.objects[i].edges[j].edge[0] = applyRotation(
          scene1.objects[i].edges[j].edge[0],
          axis1,
          angle
        );
        scene1.objects[i].edges[j].edge[1] = applyRotation(
          scene1.objects[i].edges[j].edge[1],
          axis1,
          angle
        );
        document.write("draw");
      }
    }
    drawEdges(scene1);
  }

  function projection1(cam, pos) {
    document.write("projection");
    var VectorN = "string";
    return VectorN;
  }
  function toDegrees(radians) {
    var degrees = radians * (180 / Math.PI);
    return degrees;
  }

  function toRadians(degrees) {
    var rads = degrees / (180 / Math.PI);
    return rads;
  }

  function circle(x, y, radius, color, context) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
  }

  function line(x1, y1, x2, y2, width, context, color) {
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = width;
    context.strokeStyle = color;
    context.stroke();
  }

  function polygon(face, width, height, color, context) {
    context.beginPath(); //document.write("draw2");
    context.moveTo(
      face.imageCoords[0].vector2[0] * width,
      height - face.imageCoords[0].vector2[1] * height
    );
    for (var i = 1; i < face.imageCoords.length; i++) {
      //document.write(face.imageCoords[i].vector2[0]*);
      context.lineTo(
        face.imageCoords[i].vector2[0] * width,
        height - face.imageCoords[i].vector2[1] * height
      );
    }
    //context.lineTo(face.imageCoords[0].vector2[0] * width, height - face.imageCoords[0].vector2[1] * height);
    context.closePath();
    //context.lineWidth=width;
    context.fillStyle = color; //document.write(color)
    context.fill();
  }

  function shade(color, light, angle, distance) {
    var color1 = new Array();
    var newColor = new Vector3();
    var strength = 0;
    if (distance < light.distance) {
      strength = light.magnitude - distance / light.distance; //document.write(strength);
    }

    //document.write(strength);
    if (angle > 90) {
      strength -= strength - ((angle - 90) / 90) * strength;
    }
    if (angle < 90) {
      strength = 0;
    }
    //document.write(strength);
    for (var i = 0; i < 3; i++) {
      color1.push(color.vector3[i] * strength) +
        strength * light.color.vector3[i]; //document.write(color1[i]);
    }
    newColor.initialize(color1[0], color1[1], color1[2]);
    //document.write("color1:");
    //document.write(newColor.vector3);
    var color1 = toRGB(newColor); //document.write(color1);
    return color1;
  }

  function centerPoint(face) {
    var center = new Vector3();
    var x =
      (face.face[0].vector3[0] +
        face.face[1].vector3[0] +
        face.face[2].vector3[0]) /
      3;
    var y =
      (face.face[0].vector3[1] +
        face.face[1].vector3[1] +
        face.face[2].vector3[1]) /
      3;
    var z =
      (face.face[0].vector3[2] +
        face.face[1].vector3[2] +
        face.face[2].vector3[2]) /
      3;
    center.initialize(x, y, z);
    return center;
  }

  function applyCameraView(point, camera) {
    var position = substractVectors(point, camera.transform.position);
    var xAxis = new Vector3();
    xAxis.initialize(1, 0, 0);
    var yAxis = new Vector3();
    yAxis.initialize(0, 1, 0);
    var zAxis = new Vector3();
    zAxis.initialize(0, 0, 1);
    var newPosition = applyRotation(
      position,
      xAxis,
      camera.transform.rotation.vector3[0] / -2
    );
    newPosition = applyRotation(
      newPosition,
      yAxis,
      camera.transform.rotation.vector3[1] / -2
    );
    newPosition = applyRotation(
      newPosition,
      zAxis,
      camera.transform.rotation.vector3[2] / -2
    );
    return newPosition;
  }

  function sortArray(imgCoords) {
    var imgCoords1 = imgCoords.sort(compare);

    function compare(a, b) {
      if (a.depth > b.depth) {
        return -1;
      }
      if (a.depth < b.depth) {
        return 1;
      }
      return 0;
    }
    return imgCoords1;
  }

  function drawVertices(scene1) {
    var konteksti = document.getElementById("view").getContext("2d");
    height = canvas.height;
    width = canvas.width; //document.write("draw2");
    konteksti.clearRect(0, 0, canvas.width, canvas.height);
    /*
        for(var i=0; i<scene1.objects.length;i++){//document.write(scene1.objects[i].edges.length);
        for(var j=0;j<scene1.objects[i].edges.length;j++){//document.write("draw");document.write(scene1.objects[0].edges[2].edge[1].vector3[1]);
        var pointToDraw1=projection(MainCamera,scene1.objects[i].edges[j].edge[0]);
        var pointToDraw2=projection(MainCamera,scene1.objects[i].edges[j].edge[1]);
        if(pointToDraw1!==undefined && pointToDraw2!==undefined){//document.write("draw");
        line(pointToDraw1.vector2[0]*width,height-pointToDraw1.vector2[1]*height,pointToDraw2.vector2[0]*width,height-pointToDraw2.vector2[1]*height,1,konteksti,"lime");
        }}}*/
    for (var i = 0; i < scene1.objects.length; i++) {
      for (var j = 0; j < scene1.objects[i].vertices.length; j++) {
        var pointToDraw = projection(MainCamera, scene1.objects[i].vertices[j]);
        if (pointToDraw !== undefined) {
          //document.write(pointToDraw.vector2[0]);
          circle(
            pointToDraw.vector2[0] * width,
            height - pointToDraw.vector2[1] * height,
            3,
            "gold",
            konteksti
          );
        }
      }
    }
  }
  var next = function (imagearray) {
    if (myvar != null) clearInterval(myvar);
    myvar = setInterval(function () {
      rotatePlaneGrids(scene1, imageArray1, 1.5);
    }, 40);
  };
  var previous = function (imagearray) {
    if (myvar != null) clearInterval(myvar);
    myvar = setInterval(function () {
      rotatePlaneGrids(scene1, imageArray1, -1.5);
    }, 40);
  };
  var loadPlaneImages = function (images, container) {
    //location.reload();
    //if (imageArray1[images.length - 1] == undefined) {
    for (var q = 0; q < images.length; q++) {
      imageArray1[q] = new Image();
      imageArray1[q].src = "Images/reel/".concat(images[images.length - 1 - q]);
      imageArray1[q].id = images[images.length - 1 - q];
    }
    //}
    var readyStateCheckInterval1 = setInterval(function () {
      if (imageArray1[images.length - 1].complete) {
        clearInterval(readyStateCheckInterval1);
        canvases = [];
        console.log(container);
        canvas = document.getElementById(container);
        console.log(canvas.offsetWidth);
        console.log(canvas.offsetHeight);
        console.log(images.length);
        scene1 = new scene();
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        var ratio = height / width;
        initializeMainCamera(0, 0, width * 1.5, "z", "y", 90, ratio);
        var axis1 = new Vector3();
        axis1.initialize(0, 1, 0);
        for (var i = 0; i < images.length; i++) {
          var plane = new mesh();
          imageArray1[i] = size(imageArray1[i], canvas);
          console.log(imageArray1[i].width);
          console.log(imageArray1[i].height);
          var x =
            (width * Math.sin((360 / images.length) * (Math.PI / 180))) /
            (2 * Math.sin(((180 - 360 / images.length) / 2) * (Math.PI / 180)));
          console.log(x);
          var ratio2 = x / width;
          var ratio3 = imageArray1[i].height / imageArray1[i].width;
          var width1 = imageArray1[i].width * ratio2;
          var height1 = width1 * ratio3;
          y3 = Math.round((height1 / width1) * x4);
          if (y3 < 2) y3 = 2;
          var z = Math.sqrt(Math.pow(width / 2, 2) - Math.pow(x / 2, 2));
          console.log(z);
          console.log(width1);
          console.log(height1);
          //console.log(imageArray1[i].width);
          //console.log(imageArray1[i].height);
          plane.CreatePlaneGrid(width1, height1, z, x4);
          plane.edgesAndFacesPlaneGrid(x4);
          plane.calculateFaceNormals();

          for (var j = 0; j < plane.faces.length; j++) {
            for (var k = 0; k < plane.faces[j].face.length; k++) {
              //console.log(plane.faces[j].face[k].vector3[0]);
              plane.faces[j].face[k] = applyRotation(
                plane.faces[j].face[k],
                axis1,
                i * (360 / images.length)
              );
            }
          }
          var mycanvas = document.createElement("canvas");
          mycanvas.id = "myCanvas";
          mycanvas.width = width;
          mycanvas.height = height;
          canvas.appendChild(mycanvas);
          canvases.push(mycanvas.getContext("2d"));
          plane.calculateFaceNormals();
          scene1.add(plane);
        }
        rotDegree = 0;
        rotIndex = 0;
        drawPlaneGrids(scene1, imageArray1);
        document
          .getElementById("next")
          .setAttribute("class", "btn btn-default");
        document
          .getElementById("prev")
          .setAttribute("class", "btn btn-default");
        texts = images[images.length - 1 - 0].toString().split("_");
        text = texts[2].split(".");
        description = document.getElementById("description");
        description.innerHTML =
          "<i>" + texts[1] + "</i>" + "<br>" + text[0] + ", " + texts[0];
        console.log("function end: " + rotDegree);
      }
    }, 10);
  };
  var loadPlaneImages2 = function (images, container) {
    if (imageArray1[images.length - 1] == undefined) {
      for (var q = 0; q < images.length; q++) {
        imageArray1[q] = new Image();
        imageArray1[q].src = "Images/reel/".concat(
          images[images.length - 1 - q]
        );
      }
    }
    var readyStateCheckInterval1 = setInterval(function () {
      if (document.readyState == "complete") {
        clearInterval(readyStateCheckInterval1);
        console.log(container);
        canvas = document.getElementById(container);
        console.log(canvas.offsetWidth);
        console.log(canvas.offsetHeight);
        console.log(images.length);
        scene1 = new scene();
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        var ratio = height / width;
        initializeMainCamera(0, 0, width * 1.5, "z", "y", 90, ratio);
        var axis1 = new Vector3();
        axis1.initialize(0, 1, 0);
        if (!imageArray1[images.length - 1].complete) {
          imageArray1[images.length - 1].onload = function () {
            //var sphere = new mesh();
            //sphere.CreateSphere(12, 12, 2.5);
            //sphere.edgesAndFaces();//document.write(sphere.uvs.length);
            //sphere.calculateFaceNormals();//document.write(sphere.normals.length);
            for (var i = 0; i < images.length; i++) {
              var plane = new mesh();
              imageArray1[i] = size(imageArray1[i], canvas);
              console.log(imageArray1[i].width);
              console.log(imageArray1[i].height);
              var x =
                (width * Math.sin((360 / images.length) * (Math.PI / 180))) /
                (2 *
                  Math.sin(
                    ((180 - 360 / images.length) / 2) * (Math.PI / 180)
                  ));
              console.log(x);
              var ratio2 = x / width;
              var ratio3 = imageArray1[i].height / imageArray1[i].width;
              var width1 = imageArray1[i].width * ratio2;
              var height1 = width1 * ratio3;
              y3 = Math.round((height1 / width1) * x4);
              if (y3 < 2) y3 = 2;
              var z = Math.sqrt(Math.pow(width / 2, 2) - Math.pow(x / 2, 2));
              console.log(z);
              console.log(width1);
              console.log(height1);
              plane.CreatePlaneGrid(width1, height1, z, x4);
              plane.edgesAndFacesPlaneGrid(x4);
              plane.calculateFaceNormals();

              for (var j = 0; j < plane.faces.length; j++) {
                for (var k = 0; k < plane.faces[j].face.length; k++) {
                  console.log(plane.faces[j].face[k].vector3[0]);
                  plane.faces[j].face[k] = applyRotation(
                    plane.faces[j].face[k],
                    axis1,
                    j * (360 / images.length)
                  );
                }
              }
              var mycanvas = document.createElement("canvas");
              mycanvas.id = "mycanvas";
              mycanvas.width = width;
              mycanvas.height = height;
              canvas.appendChild(mycanvas);
              canvases.push(mycanvas);
              plane.calculateFaceNormals();
              scene1.add(plane);
            }
          };
        } else {
          for (var i = 0; i < images.length; i++) {
            var plane = new mesh();
            imageArray1[i] = size(imageArray1[i], canvas);
            console.log(imageArray1[i].width);
            console.log(imageArray1[i].height);
            var x =
              (width * Math.sin((360 / images.length) * (Math.PI / 180))) /
              (2 *
                Math.sin(((180 - 360 / images.length) / 2) * (Math.PI / 180)));
            console.log(x);
            var ratio2 = x / width;
            var ratio3 = imageArray1[i].height / imageArray1[i].width;
            var width1 = imageArray1[i].width * ratio2;
            var height1 = width1 * ratio3;
            y3 = Math.round((height1 / width1) * x4);
            if (y3 < 2) y3 = 2;
            var z = Math.sqrt(Math.pow(width / 2, 2) - Math.pow(x / 2, 2));
            console.log(z);
            console.log(width1);
            console.log(height1);
            //console.log(imageArray1[i].width);
            //console.log(imageArray1[i].height);
            plane.CreatePlaneGrid(width1, height1, z, x4);
            plane.edgesAndFacesPlaneGrid(x4);
            plane.calculateFaceNormals();

            for (var j = 0; j < plane.faces.length; j++) {
              for (var k = 0; k < plane.faces[j].face.length; k++) {
                //console.log(plane.faces[j].face[k].vector3[0]);
                plane.faces[j].face[k] = applyRotation(
                  plane.faces[j].face[k],
                  axis1,
                  i * (360 / images.length)
                );
              }
            }
            var mycanvas = document.createElement("canvas");
            mycanvas.id = "mycanvas";
            mycanvas.width = width;
            mycanvas.height = height;
            canvas.appendChild(mycanvas);
            canvases.push(mycanvas.getContext("2d"));
            plane.calculateFaceNormals();
            scene1.add(plane);
          }
        }
        drawPlaneGrids(scene1, imageArray1);
        document
          .getElementById("next")
          .setAttribute("class", "btn btn-default");
        document
          .getElementById("prev")
          .setAttribute("class", "btn btn-default");
      }
    }, 50);
  };
  function size(image, gallery) {
    ratio = image.naturalHeight / image.naturalWidth;
    if (image.naturalWidth >= gallery.offsetWidth) {
      image.width = gallery.offsetWidth;
      image.height = gallery.offsetWidth * ratio;
    } else {
      image.width = image.naturalWidth;
    }
    if (image.naturalHeight >= gallery.offsetHeight) {
      image.height = gallery.offsetHeight;
      image.width = gallery.offsetHeight / ratio;
    } else {
      image.height = image.naturalHeight;
    }
    if (image.width >= gallery.offsetWidth) {
      image.width = gallery.offsetWidth;
      image.height = gallery.offsetWidth * ratio;
    }

    return image;
  }
  function drawEdges(scene1) {
    //document.write("draw1");
    var konteksti1 = document.getElementById("view").getContext("2d");
    height = canvas.height;
    width = canvas.width; //document.write("draw2");
    //konteksti1.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < scene1.objects.length; i++) {
      //document.write("draw");
      for (var j = 0; j < scene1.objects[i].edges.length; j++) {
        //document.write("draw");document.write(scene1.objects[0].edges[7].edge[1].vector3[2]);
        var pointToDraw1 = projection(
          MainCamera,
          scene1.objects[i].edges[j].edge[0]
        );
        var pointToDraw2 = projection(
          MainCamera,
          scene1.objects[i].edges[j].edge[1]
        );
        if (pointToDraw1 !== undefined && pointToDraw2 !== undefined) {
          //document.write("draw");
          line(
            pointToDraw1.vector2[0] * width,
            height - pointToDraw1.vector2[1] * height,
            pointToDraw2.vector2[0] * width,
            height - pointToDraw2.vector2[1] * height,
            1,
            konteksti1,
            "red"
          );
        }
      }
    }
  }
  function PlaneImage(ctx, tex, face, uvs, index, render) {
    // clip triangle
    if (render) {
      var x0 = face.imageCoords[0].vector2[0];
      var y0 = face.imageCoords[0].vector2[1];
      var x1 = face.imageCoords[1].vector2[0];
      var y1 = face.imageCoords[1].vector2[1];
      var x2 = face.imageCoords[2].vector2[0];
      var y2 = face.imageCoords[2].vector2[1];
      var u0 = uvs[0].vector2[0];
      var v0 = uvs[0].vector2[1];
      var u1 = uvs[1].vector2[0];
      var v1 = uvs[1].vector2[1];
      var u2 = uvs[2].vector2[0];
      var v2 = uvs[2].vector2[1];
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0 * width, height - y0 * height);
      ctx.lineTo(x1 * width, height - y1 * height);
      ctx.lineTo(x2 * width, height - y2 * height);
      ctx.closePath();
      ctx.clip();
      //var delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
      //var delta_a = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
      //var delta_b = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
      //var delta_c = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2
      //              - v0 * u1 * x2 - u0 * x1 * v2;
      //var delta_d = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
      //var delta_e = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
      //var delta_f = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2
      //              - v0 * u1 * y2 - u0 * y1 * v2;

      //// Draw the transformed image
      //ctx.transform(delta_a / delta, delta_d / delta,
      //              delta_b / delta, delta_e / delta,
      //              delta_c / delta, delta_f / delta);
      // calculate transformation matrix
      x1 -= x0;
      y1 -= y0;
      x2 -= x0;
      y2 -= y0;
      u1 -= u0;
      v1 -= v0;
      u2 -= u0;
      v2 -= v0;
      var id = 1.0 / (u1 * v2 - u2 * v1);
      var a = id * (v2 * x1 - v1 * x2);
      var b = id * (v2 * y1 - v1 * y2);
      var c = id * (u1 * x2 - u2 * x1);
      var d = id * (u1 * y2 - u2 * y1);
      var e = x0 - a * u0 - c * v0;
      var f = y0 - b * u0 - d * v0;
      //var a, b, c, d, e, f, g;
      //var h = 0;
      //if (index == 0) {
      //    a = (x2 - x0);
      //    //console.log(a);
      //    if (y0 < y2) {
      //        g = (y2 - y0) / 1.8;
      //        //g = -(y2 - y0);
      //        f = height - (y2 - g / 8) * height;
      //        d = (y0 - y1);
      //    }
      //    else {
      //        g = -(y0 - y2);
      //        //f = height - (y0 + g) * height;
      //        f = height - (y0 + g) * height;
      //        d = (y0 - y1 - g);
      //    }
      //    //b = 0;
      //    b = g;
      //    c = 0;

      //    e = x1 * width;

      //}
      //else {
      //    a = (x1 - x0);
      //    //console.log("a:", a);
      //    if (y0 < y1) {
      //        //g = (y1 - y0) / 2;
      //        g = (y1 - y0) / 1.8;
      //        f = height - (y2) * height;
      //        d = (y2 - y1);
      //    }
      //    else {
      //        g = -(y0 - y1) / 2;
      //        //f = height - (y2-0.5*g) * height;
      //        f = height - (y2) * height;
      //        d = (y2 - y1);
      //    }
      //    //b = 0;
      //    b = g;
      //    c = 0;

      //    e = x0 * width;
      //    //console.log("e:", e);
      //    //f = height - (y2+g) * height;
      //    //console.log("f:", f);
      //}
      //console.log("d:", d);
      //console.log("factor1:", tex.width * 3);
      //console.log("factor2:", tex.height * 3);
      // draw image
      ctx.scale(-1, 1);
      ctx.transform(a, b, 0, d, -(width * a + e), f);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(tex, 0, 0, tex.width, tex.height);
      // restore previous state
      ctx.restore();
    }
  }
  function PlaneGridImage(
    ctx,
    tex,
    face,
    uvs,
    index,
    render,
    first,
    cornerLL,
    cornerUL,
    cornerLR,
    cornerUR,
    last,
    firstUL,
    currentLeft,
    currentRight
  ) {
    // clip triangle
    if (render) {
      var CurrentLeftUpperY = currentLeft.imageCoords[1].vector2[1]; //console.log("CurrentLeftUpperY", CurrentLeftUpperY);
      var CurrentLeftLowerY = currentLeft.imageCoords[0].vector2[1];
      var CurrentRightUpperY = currentRight.imageCoords[1].vector2[1]; //console.log("CurrentRightUpperY", CurrentRightUpperY);
      var CurrentRightLowerY = currentRight.imageCoords[2].vector2[1];
      var CurrentLeftUpperX = currentLeft.imageCoords[1].vector2[0];
      var CurrentLeftLowerX = currentLeft.imageCoords[0].vector2[0];
      var YUR = cornerUR.imageCoords[1].vector2[1]; //console.log("Upper right Y:",YUR);
      var YLL = cornerLL.imageCoords[0].vector2[1];
      var YLR = cornerLR.imageCoords[2].vector2[1];
      var YUL = cornerUL.imageCoords[1].vector2[1]; //console.log("Upper left Y:", YUL);
      var x0 = face.imageCoords[0].vector2[0];
      var Xfirst = first.imageCoords[0].vector2[0];
      var y0 = face.imageCoords[0].vector2[1];
      var Yfirst = first.imageCoords[0].vector2[1];
      var YfirstUL = firstUL.imageCoords[1].vector2[1]; //console.log("YfirstUL-Yfirst:", YfirstUL-Yfirst);
      var Xlast = last.imageCoords[2].vector2[0];
      var Ylast = last.imageCoords[1].vector2[1];
      var x1 = face.imageCoords[1].vector2[0];
      var y1 = face.imageCoords[1].vector2[1];
      var x2 = face.imageCoords[2].vector2[0];
      var y2 = face.imageCoords[2].vector2[1];
      var u0 = uvs[0].vector2[0];
      var v0 = uvs[0].vector2[1];
      var u1 = uvs[1].vector2[0];
      var v1 = uvs[1].vector2[1];
      var u2 = uvs[2].vector2[0];
      var v2 = uvs[2].vector2[1];
      //console.log(x4);
      //console.log(x0); console.log(u0);
      //console.log(y0); console.log(v0);
      //console.log(x1); console.log(u1);
      //console.log(y1); console.log(v1);
      //console.log(x2); console.log(u2);
      //console.log(y2); console.log(v2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0 * width, height - y0 * height);
      ctx.lineTo(x1 * width, height - y1 * height);
      ctx.lineTo(x2 * width, height - y2 * height);
      ctx.closePath();
      ctx.clip();
      if (index == 0) {
        for (var i = 0; i < imageArray1.length; i++) {
          if ((360 / imageArray1.length) * i == rotDegree) {
            YH1 = x2 - x1;
            picSizeY = YUR - YLR;
            //console.log("brejk");
            break;
          }
        }
      }

      //ctx.scale(-1, 1);

      //var delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
      //var delta_a = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
      //var delta_b = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
      //var delta_c = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2
      //              - v0 * u1 * x2 - u0 * x1 * v2;
      //var delta_d = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
      //var delta_e = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
      //var delta_f = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2
      //              - v0 * u1 * y2 - u0 * y1 * v2;

      // Draw the transformed image
      //ctx.transform(delta_a / delta, delta_d / delta,
      //              delta_b / delta, delta_e / delta,
      //              delta_c / delta, delta_f / delta);
      //calculate transformation matrix
      //x1 -= x0; y1 -= y0; x2 -= x0; y2 -= y0;
      //u1 -= u0; v1 -= v0; u2 -= u0; v2 -= v0;
      var id = 1.0 / (u1 * v2 - u2 * v1);
      //var a = id * (v2 * x1 - v1 * x2);
      //var b = id * (v2 * y1 - v1 * y2);
      //var c = id * (u1 * x2 - u2 * x1);
      //var d = id * (u1 * y2 - u2 * y1);
      //var e = x0 - a * u0 - c * v0;
      //var f = y0 - b * u0 - d * v0;
      var a, b, c, d, e, f, g, h;
      var index1 = index;
      index %= 2;
      if (YUL - YLL <= YUR - YLR) {
        //a = (Xlast - Xfirst);

        if (index == 0) {
          var add = 1;
          //if (((x2 - x1) / YH1) >= 1) { a = h = ((x4 - 1) * (x2 - x1)) }
          //else { a =h= ((x4 - 1) * (x2 - x1)) }//+ Math.abs((x2 - x1) * ((YH1 - (x2 - x1)) / YH1)); //console.log("a:", a);
          d = YUL - YLL; //console.log(((x2 - x1) / YH1));
          a = h = (x4 - 1) * (x2 - x1) * (width / tex.width);
          if (y1 < y2) {
            if (u1 < 0.5) add = 0;
            g = -((y2 - y1) * picSizeY * a) / (x2 - x0); // (x2 - x1);
            f =
              height -
              y1 * height -
              (1 - v1) * d * height +
              (y2 - y1) * (y4 - 1) * height;
          } else {
            g = ((y1 - y2) * picSizeY * a) / (x2 - x0); // (x2 - x1);
            f =
              height -
              y1 * height -
              (1 - v1) * d * height -
              (y1 - y2) * (y4 - 1) * height;
          }
          b = g;
          c = 0;
          e = x1 * width - u0 * h * tex.width;
        } else {
          var add = 1;
          //if (((x2 - x0) / YH1) >= 1) { a = h = ((x4 - 1) * (x2 - x0)) }
          //else { a =h= ((x4 - 1) * (x2 - x0)) }
          a = h = (x4 - 1) * (x2 - x0) * (width / tex.width);
          d = YUR - YLR;
          if (y0 < y2) {
            g = -((y2 - y0) * picSizeY * a) / (x2 - x0); // (x2 - x0);
            f =
              height -
              y1 * height -
              (1 - v1) * d * height +
              (y2 - y0) * y4 * height;
          } else {
            //add = ((CurrentLeftLowerY - y2) / (x2 - CurrentLeftLowerX)) * (a * width*d) - ((CurrentLeftLowerY - y2) / (x2 - CurrentLeftLowerX)) * (x4 - y4) * (x2 - x0)*width*d+(y0-y2)*((1-u0)+Math.sin((Math.PI/2)*(1-u0)))*width*d; console.log("add:",add);
            g = ((y0 - y2) * picSizeY * a) / (x2 - x0); // (x2 - x0);//g=tan(alpha)
            f =
              height -
              y1 * height -
              (1 - v1) * d * height -
              (y0 - y2) * y4 * height; //*add;
          }
          b = g;
          c = 0;
          e = x0 * width - u0 * h * tex.width;
        }
      } else {
        //if (index1 == 0) YH2 = YUL - YLL;
        //a = (Xlast - Xfirst);
        if (index == 0) {
          //if (((x2 - x1) / YH1) >= 1) { a = h = ((x4 - 1) * (x2 - x1)) }
          //else { a = h = ((x4 - 1) * (x2 - x1)) }
          a = h = (x4 - 1) * (x2 - x1) * (width / tex.width);
          d = YUL - YLL; //console.log(((x2 - x1) / YH1));

          if (y1 < y2) {
            g = (-(y2 - y1) * picSizeY * a) / (x2 - x1); // console.log("g:",g); // (x2 - x1);
            f =
              height -
              y1 * height -
              (1 - v1) * d * height +
              (y2 - y1) * (y4 - 1) * height;
          } else {
            g = ((y1 - y2) * picSizeY * a) / (x2 - x1); //// (x2 - x1);
            f =
              height -
              y1 * height -
              (1 - v1) * d * height -
              (y1 - y2) * (y4 - 1) * height;
          }
          b = g;
          c = 0;
          e = x1 * width - u0 * h * tex.width;
        } else {
          var add = 1;
          //if (((x2 - x0) / YH1) >= 1) { a = h = ((x4 - 1) * (x2 - x0)) }
          //else { a = h = ((x4 - 1) * (x2 - x0)) }
          a = h = (x4 - 1) * (x2 - x0) * (width / tex.width);
          d = YUR - YLR; // console.log("a-:", ((x4 - 1) - y4) * (x2 - x0) * ((YH1 - (x2 - x0)) / YH1)); console.log("x4-1-y4:", (x4 - 1) - y4); console.log("x2-x0:", x2 - x0); console.log("YH1:", YH1);
          // if (index1 == 1) console.log("a:", a);
          if (y0 < y2) {
            g = (-(y2 - y0) * picSizeY * a) / (x2 - x0); //console.log("g:",g);

            f =
              height -
              y1 * height -
              (1 - v1) * d * height +
              (y2 - y0) * y4 * height;
          } else {
            g = ((y0 - y2) * picSizeY * a) / (x2 - x0); // (x2 - x1);
            f =
              height -
              y1 * height -
              (1 - v1) * d * height -
              (y0 - y2) * y4 * height;
          }
          b = g;
          c = 0;
          e = x0 * width - u0 * h * tex.width;
        }
      }

      //}
      //else {

      //}
      //console.log("g:", g);
      //console.log("factor1:", tex.width * 3);
      //console.log("factor2:", tex.height * 3);
      // draw image
      //ctx.transform(a, b, c, d, e*width, -height+f*height);
      //ctx.transform(a, b, c, d, e * width, f * height);
      //ctx.transform(a, b, 0, d, -(width * (a) + e), f);
      ctx.setTransform(a, b, c, d, e, f);
      //ctx.imageSmoothingEnabled = true;
      ctx.drawImage(tex, 0, 0, width, height);
      // restore previous state
      ctx.restore();
    }
  }
  function drawPlanes(scene1, images) {
    var faceCoords = new Array();
    var uvs = new Array();
    var isRendered = new Array();
    for (var i = 0; i < scene1.objects.length; i++) {
      for (var j = 0; j < scene1.objects[i].faces.length; j++) {
        var alpha = angleBetween(scene1.objects[i].normals[j], MainCamera.view);

        if (alpha > 110) {
          isRendered.push(true);
        } else {
          isRendered.push(false);
        }
        var points = new Array();
        var face = new Face();
        for (var k = 0; k < scene1.objects[i].faces[j].face.length; k++) {
          var point = applyCameraView(
            scene1.objects[i].faces[j].face[k],
            MainCamera
          );
          points.push(point);
        }
        face.initialize(
          points[0].vector3,
          points[1].vector3,
          points[2].vector3
        );
        //face.changeColor(scene1.objects[i].faces[j].color);
        var pointToDraw = reProjection(MainCamera, face);
        faceCoords.push(pointToDraw);
        uvs.push(scene1.objects[i].faces[j].uvs);
        //console.log(scene1.objects[i].faces[j].uvs);
      }
    }
    //faceCoords = sortArray(faceCoords);
    var q = 0;
    var w = 0;
    for (var p = 0; p < scene1.objects.length; p++) {
      console.log(scene1.objects.length);
      q = p * 2;
      w = q + 1;
      color = new Vector3();
      color.initialize(100, 100, 100);
      var konteksti = canvases[p];
      konteksti.clearRect(0, 0, width, height);
      PlaneImage(konteksti, images[p], faceCoords[q], uvs[q], 0, isRendered[q]);
      PlaneImage(konteksti, images[p], faceCoords[w], uvs[w], 1, isRendered[w]);
      //polygon(faceCoords[p], width, height, color, konteksti);
      //polygon(faceCoords[q], width, height, color, konteksti);
    }
  }
  function drawPlaneGrids(scene1, images) {
    var faceCoords = new Array();
    var uvs = new Array();
    var willRender = new Array();
    for (var i = 0; i < scene1.objects.length; i++) {
      var objFaceCoords = new Array();
      var objUvs = new Array();
      var isRendered = new Array();
      for (var j = 0; j < scene1.objects[i].faces.length; j++) {
        var alpha = angleBetween(scene1.objects[i].normals[j], MainCamera.view);

        if (alpha > 106) {
          isRendered.push(true);
        } else {
          isRendered.push(false);
        }
        var points = new Array();
        var face = new Face();
        for (var k = 0; k < scene1.objects[i].faces[j].face.length; k++) {
          var point = applyCameraView(
            scene1.objects[i].faces[j].face[k],
            MainCamera
          );
          points.push(point);
        }
        face.initialize(
          points[0].vector3,
          points[1].vector3,
          points[2].vector3
        );

        var pointToDraw = reProjection(MainCamera, face);
        objFaceCoords.push(pointToDraw);
        objUvs.push(scene1.objects[i].faces[j].uvs);
      }
      faceCoords.push(objFaceCoords);
      uvs.push(objUvs);
      willRender.push(isRendered);
    }

    var q = 0;
    var w = 0;
    for (var p = 0; p < faceCoords.length; p++) {
      //console.log(scene1.objects.length);
      var konteksti = canvases[p];
      konteksti.clearRect(0, 0, width, height);
      y4 = 0;
      x5 = 0;
      for (var q = 0; q < faceCoords[p].length; q++) {
        if (q % 2 == 0 && (q / 2) % (y3 - 1) == 0) {
          y4++;
          x5 = 0;
        }
        if (q % 2 == 0) {
          x5++; //console.log("x5:", x5);
        }
        PlaneGridImage(
          konteksti,
          images[p],
          faceCoords[p][q],
          uvs[p][q],
          q,
          willRender[p][q],
          faceCoords[p][0],
          faceCoords[p][(y4 - 1) * (y3 - 1) * 2],
          faceCoords[p][(y4 - 1) * (y3 - 1) * 2 + (y3 - 1) * 2 - 2],
          faceCoords[p][(y4 - 1) * (y3 - 1) * 2 + 1],
          faceCoords[p][(y4 - 1) * (y3 - 1) * 2 + (y3 - 1) * 2 - 1],
          faceCoords[p][faceCoords[p].length - 1],
          faceCoords[p][(y3 - 1) * 2 - 2],
          faceCoords[p][(x5 - 1) * 2],
          faceCoords[p][(x4 - 2) * (y3 - 1) * 2 + (x5 - 1) * 2 + 1]
        );
      }
    }
  }
  function drawPolygons(scene1) {
    canvas = document.getElementById("view");
    width = canvas.width;
    height = canvas.height;
    var konteksti = document.getElementById("view").getContext("2d");

    konteksti.clearRect(0, 0, canvas.width, canvas.height);

    var faceCoords = new Array();

    for (var i = 0; i < scene1.objects.length; i++) {
      for (var j = 0; j < scene1.objects[i].faces.length; j++) {
        var alpha = angleBetween(scene1.objects[i].normals[j], MainCamera.view);

        //if (alpha > 85) {
        var points = new Array();
        var face = new Face();
        for (var k = 0; k < scene1.objects[i].faces[j].face.length; k++) {
          var point = applyCameraView(
            scene1.objects[i].faces[j].face[k],
            MainCamera
          );
          points.push(point);
        }
        face.initialize(
          points[0].vector3,
          points[1].vector3,
          points[2].vector3
        );
        face.changeColor(scene1.objects[i].faces[j].color);
        var pointToDraw = reProjection(MainCamera, face);
        faceCoords.push(pointToDraw);
        //}
      }
    }
    //document.write(faceCoords[0].depth);
    faceCoords = sortArray(faceCoords);
    //document.write(faceCoords[88].depth);
    for (var p = 0; p < faceCoords.length; p++) {
      //document.write(faceCoords[p].depth);
      var color;
      for (var a = 0; a < scene1.lights.length; a++) {
        //document.write(faceCoords[p].center.vector3[0]);
        var direction = substractVectors(
          faceCoords[p].center,
          scene1.lights[a].transform.position
        ); //document.write(faceCoords[p].center.vector3);
        var distance1 = getLength(direction);
        direction = unitVector(direction);
        var angle = angleBetween(faceCoords[p].normal, direction); //document.write("angle:");document.write(angle);
        var color = new Vector3();
        color.initialize(255, 255, 255); //document.write(color.vector3);document.write("distance:");document.write(distance1);
        color = shade(color, scene1.lights[a], angle, distance1); //document.write(color);
      }

      var col = "rgb(2,240,255)";
      polygon(faceCoords[p], width, height, color, konteksti);
    }
  }
  function loadFile() {}
  return {
    startscene: startscene,
    loadFile: loadFile,
    loadPlaneImages: loadPlaneImages,
    next: next,
    previous: previous,
    myvar: myvar,
  };
})();
