import React from 'react';
import ConstantPool from '../ConstantPool/ConstantPool'
import Fields from '../Fields/Fields'
import CollapseItem from '../CollapseItem/CollapseItem'
import Methods from '../Methods/Methods';

class ClassItem extends React.Component {

    render() {
        return <CollapseItem 
                    title={"Class: " + this.props.data["name"]}
                    active={(this.props.executingInstruction && (this.props.executingInstruction["className"] === this.props.data["name"])) }
                ><div>

            <Methods 
                executingInstruction={this.props.executingInstruction}
                data={this.props.data["methods"]}
                instructionRefs={this.props.instructionRefs}
                classNameStr={this.props.data["name"]}
            > </Methods> 

            <Fields 
                data={this.props.data["fields"]}
                event={this.props.event}
                ></Fields>

            <ConstantPool 
                data={this.props.data["constantPool"]}
                event={this.props.event}
                ></ConstantPool>

            </div>
        </CollapseItem>
    }
}

export default ClassItem;