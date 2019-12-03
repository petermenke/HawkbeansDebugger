import React from 'react';
import MethodItem from '../MethodItem/MethodItem'
import CollapseItem from '../CollapseItem/CollapseItem'

class Methods extends React.Component {


    render() {
        return <CollapseItem 
                    title="Methods"
                    active={!!this.props.executingInstruction}
                    ><div>
                {this.props.data.map((m,i) => <MethodItem 
                                key={i}
                                data={m}
                                // Only pass down if the name and description match
                                executingInstruction={this.props.executingInstruction 
                                                        && m["name"] === this.props.executingInstruction["methodName"] 
                                                        && m["desc"] === this.props.executingInstruction["methodDesc"]
                                                        ? this.props.executingInstruction 
                                                        : null
                                                    }    
                                instructionRefs={this.props.instructionRefs}
                                classNameStr={this.props.classNameStr}
                                methodNameStr={m["name"]}

                            ></MethodItem>)}
            </div></CollapseItem>
    }
}

export default Methods;