import React from 'react';

class CodeItem extends React.Component {

    constructor() {
        super();
        this.myRef = React.createRef();
    }

    componentDidMount() {
        // register the ref to the instructionRefs
        const key = this.props.classNameStr + "::" + this.props.methodNameStr + "::" + this.props.data["pc"];
        this.props.instructionRefs[key] = this.myRef;
    }

    render() {
        return <div id={this.props.classNameStr + "::" + this.props.methodNameStr + "::" + this.props.data["pc"]} ref={this.myRef}>
            <div className={"instrName code" + (this.props.executingInstruction ? " bold" : "")}>{this.props.data["name"]}</div>
            <div className="instrData" >{this.props.data["data"].map(d => d > 0XF ? d.toString(16) : "0" + d.toString(16)).join(" ")}</div>
        </div>
    }
}

export default CodeItem;