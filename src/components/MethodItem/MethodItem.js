import React from 'react';
import CodeItem from '../CodeItem/CodeItem';
import CollapseItem from '../CollapseItem/CollapseItem'

class MethodItem extends React.Component {

    render() {
        return <CollapseItem
                    title={this.props.data["returns"] + " " + this.props.data["name"] + "(" + this.props.data["args"].join(", ") + ")"}
                    active={this.props.executingInstruction}
                >
                <div>
            {(this.props.data["code"].length === 0) ? "<empty>" :  (this.props.data["code"].map((c, idx) => <CodeItem 
                classNameStr={this.props.classNameStr}
                methodNameStr={this.props.methodNameStr}
                key={idx}
                data={c}
                executingInstruction={this.props.executingInstruction && c["pc"] === this.props.executingInstruction["pc"] ? this.props.executingInstruction : null}
                instructionRefs={this.props.instructionRefs}
            ></CodeItem>))}

            
        </div></CollapseItem>
    }
}

export default MethodItem;