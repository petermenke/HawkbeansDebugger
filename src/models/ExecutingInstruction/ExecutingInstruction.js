class ExecutingInstruction {

    constructor(pc, className, methodName, methodDesc, diff) {
        //super();
        this.pc = pc;
        this.className = className;
        this.methodName = methodName;
        this.methodDesc = methodDesc;
        this.diff = diff;
    }
}

export default ExecutingInstruction;