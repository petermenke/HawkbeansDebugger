import React from 'react';

class FieldItem extends React.Component {

    constructor() {
        super();

        this.state = {
            updatedValue: null
        }
    }

    renderValue(v) {
        return v !== null ? v : "null";
    }

    componentDidUpdate(prevProps) {
        // check if the item's events changed (and is not null)
        if (this.props.event && this.props.event !== prevProps.event) {
            this.setState({
                updatedValue: this.props.event["data"]
            })
        }
    }

    render() {
        return <div className={"fieldItem" + (this.props.event !== null ? " bold" : "")}>
            {this.props.data["desc"]} {this.props.data["name"]} = {
                // if the value has changed, use that. otherwise use original
                this.state.updatedValue == null 
                    ? this.renderValue(this.props.data["value"])
                    : this.renderValue(this.state.updatedValue)
                }
        </div>
    }
}

export default FieldItem;