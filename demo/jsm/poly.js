const defAttr=()=>({
    gl:null,
    vertices:[],
    geoData:[],
    size:2,
    attrName: 'a_Position',
    count: 0,
    types: ['POINTS'],
    circleDot: false,
    u_IsPOINTS:null
});
export default class Poly{
    constructor(attr) {
        Object.assign(this, defAttr(), attr);
        this.init();
    }
    init() {
        const {attrName, size, gl, circleDot} = this;
        if (!gl) {return}
        const vertextBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertextBuffer);
        this.upDataBuffer();
        const a_Position = gl.getAttribLocation(gl.program, attrName);
        gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0,0);
        gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
        gl.enableVertexAttribArray(a_Position);
        //如果是圆点，就获取一下uniform变量
        if(circleDot) {
            this.u_IsPOINTS = gl.getUniformLocation(gl.program, 'u_IsPOINTS');
        }
    }
    upDataBuffer() {
        const {gl, vertices} = this;
        this.upDateCount();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }
    upDateCount() {
        this.count = this.vertices.length/this.size;
    }
    addVertice(...params) {
        this.vertices.push(...params);
        this.upDataBuffer();
    }
    popVertice() {
        const {vertices, size} = this;
        const len = vertices.length;
        vertices.splice(len-size, len);
        this.upDateCount();
    }

    setVertice(ind, ...params) {
        const {vertices, size} = this;
        const i = ind*size;
        params.forEach((param, paramId)=>{
            vertices[i+paramId] = param;
        });
    }
    updateVertices(params) {
        const {geoData} = this;
        const vertices = [];
        geoData.forEach(data=>{
            params.forEach(key=>{
                vertices.push(data[key]);
            })
        });
        this.vertices = vertices;
    }
    draw(types= this.types) {
        const {gl, count, circleDot,u_IsPOINTS} = this;
        for(let type of types) {
            circleDot&&gl.uniform1f(u_IsPOINTS, type === 'POINTS');
            gl.drawArrays(gl[type],0, count);
        }
    }
}