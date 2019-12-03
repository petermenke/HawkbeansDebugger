import React from 'react';
import CollapseItem from '../CollapseItem/CollapseItem'

class StackFrameComponent extends React.Component {

    convertToFloat(i) {
        const b = new ArrayBuffer(4);
        const v = new DataView(b);
        v.setInt32(0, i);
        return v.getFloat32(0);
    }

    render() {
        return <CollapseItem title={this.props.data.className + " :: " + this.props.data.methodName} 
                             active={!!this.props.active}>
                        <CollapseItem title={"Arguments"} active={!!this.props.active}>

                        {this.props.data.numArgs > 0 ? 

                        <table><tbody>
                        {this.props.data.locals.map((a, i) => {
                            if (i < this.props.data.numArgs) {
                                if (a.type === "float")
                                    return <tr className={this.props.event && i === this.props.event["index"] ? "bold" : ""}><td>{a.index} | </td><td>{a.type} : </td><td>{this.convertToFloat(a.value)}</td></tr>
                                else
                                    return <tr className={this.props.event && i === this.props.event["index"] ? "bold" : ""}><td>{a.index} | </td><td>{a.type} : </td><td>{a.value}</td></tr>
                            }
                            return null;
                        })}
                        </tbody></table>  : <div>{"<no arguments>"}</div>}
                    </CollapseItem>
                    <CollapseItem title={"Local Variables"} active={!!this.props.active}> 
                    {this.props.data.numLocals > this.props.data.numArgs ?  

                        <table><tbody>
                            {this.props.data.locals.map((a, i) => {
                                if (i >= this.props.data.numArgs) {
                                    if (a.type === "float")
                                        return <tr className={this.props.event && i === this.props.event["index"] ? "bold" : ""}><td>{a.index === -1 ? "?" : a.index} | </td><td>{a.type} : </td><td>{this.convertToFloat(a.value)}</td></tr>
                                    else
                                        return <tr className={this.props.event && i === this.props.event["index"] ? "bold" : ""}><td>{a.index === -1 ? "?" : a.index} | </td><td>{a.type} : </td><td>{a.value}</td></tr>
                                }
                                return null;
                            })}
                            </tbody></table>  : <div>{"<no local variables>"}</div>}
                    </CollapseItem>
                    {this.props.data.opStack &&
                    <CollapseItem title="Operand Stack" active={!!this.props.active}>
                        {this.props.data.opStack.map((s, i) => {
                            if (s["type"] === "float")
                                return <div> {s["type"]} : {this.convertToFloat(s["value"])}</div>
                            else
                                return <div> {s["type"]} : {s["value"]}</div>
                        })}
                    </CollapseItem>}

                </CollapseItem>
    }
}

export default StackFrameComponent;