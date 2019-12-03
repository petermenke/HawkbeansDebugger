class Stack {

    constructor() {
        this.stack = [];
    }

    push(frame) {
        this.stack.push(frame);
        return this;
    }

    pop() {
        this.stack.pop();
        return this;
    }

    getFrames() {
        return this.stack;
    }

    currentFrame() {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }
}

export default Stack;