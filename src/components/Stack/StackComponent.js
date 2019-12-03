import StackFrameComponent from "./StackFrameComponent"
import React from 'react';


class StackComponent extends React.Component {

    render() {
        return <div className="stackSection">
            
            {this.props.frames.getFrames().map((f, i) => {
                return <StackFrameComponent 
                            key={i} 
                            data={f} 
                            active={ i === (this.props.frames.getFrames().length - 1)}
                            event={ i === (this.props.frames.getFrames().length - 1) ? this.props.event : null}
                        ></StackFrameComponent>
            }) }
        </div>
    }
}

export default StackComponent;