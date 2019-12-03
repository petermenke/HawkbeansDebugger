import React from 'react';
import FieldItem from '../FieldItem/FieldItem'
import CollapseItem from '../CollapseItem/CollapseItem'

class Fields extends React.Component {

    render() {
        return <CollapseItem 
        
                    title="Fields"
                    active={!!this.props.event}
                ><div>
            {this.props.data.length === 0 ? "<No Fields>" : this.props.data.map((f,i) => {
                return <FieldItem 
                    key={i}
                    data={f}
                    event={this.props.event && (f["name"] === this.props.event["name"]) ? this.props.event : null}
                    ></FieldItem>
            })}
        </div></CollapseItem>
    }
}

export default Fields;