class StackFrame {

    constructor(methodName, className, numLocals, args) {
        this.methodName = methodName;
        this.className = className;
        this.numLocals = numLocals;     // # ARGUMENTS + LOCAL VARLABLES
        this.numArgs = args.length;
        this.locals = [];
        this.opStack = [];   
    
        // LOCALS is partitioned into [ARGUMENTS | LOCAL VARIABLES]

        // Fill in the arguments
        for (let a = 0; a < this.numArgs; a++) {
            this.locals.push({
                type: args[a]["type"],
                index: args[a]["index"],
                value: args[a]["value"]
            })
        }

        // Fill in default for the locals (will do nothing if there are none)
        for (let l = this.numArgs; l < numLocals; l++) {
            this.locals.push({
                type: "?",
                index: -1,
                value: "?"
            })
        }
    }
}

export default StackFrame;