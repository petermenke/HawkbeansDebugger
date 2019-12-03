import React from 'react';
import ClassItem from '../ClassItem/ClassItem'

class ClassSection extends React.Component {

    // has a list of classes
    //(this.props.classes)

    render() {
        return <div className="classSection" >
            {this.props.classes.map((c,i)  => <ClassItem 
                key={i}
                data={c} 
                // Only pass down the info if it is for this class
                executingInstruction={this.props.executingInstruction && c["name"] === this.props.executingInstruction.className ? this.props.executingInstruction : null}
                
                // Only pass events to the executing class
                event={this.props.executingInstruction && c["name"] === this.props.executingInstruction.className ? this.props.event : null}

                instructionRefs={this.props.instructionRefs}
            ></ClassItem>) }

        </div>
    }
}

export default ClassSection;