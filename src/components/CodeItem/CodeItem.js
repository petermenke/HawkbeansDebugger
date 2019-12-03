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
        return <tr id={this.props.classNameStr + "::" + this.props.methodNameStr + "::" + this.props.data["pc"]} ref={this.myRef}>
            <td className={"instrName code" + (this.props.executingInstruction ? " bold" : "")}>{this.props.data["name"]}</td>
            <td className="instrData" > {"  " + this.props.data["data"].map(d => d > 0XF ? d.toString(16) : "0" + d.toString(16)).join(" ")}</td>
        </tr>
    }
}

export default CodeItem;