import React from 'react';
import Collapse from 'react-bootstrap/Collapse';
import Card from 'react-bootstrap/Card';

class CollapseItem extends React.Component {

    constructor() {
        super();
        this.state = {
            open: false
        }

        this.onClickTitle = this.onClickTitle.bind(this);
    }

    onClickTitle() {
        this.setState({open: !this.state.open});
    }

    render() {
        
        return <Card bg="light"  >
                <a href="#" className="noLinkStyle" onClick={e => e.preventDefault()}><Card.Header onClick={this.onClickTitle}>
                    <div 
                        className={(this.props.active ? "active" : "")}
                    >{this.props.title}</div>
                </Card.Header></a>

                <Card.Body className="cardBody">
                    <div className="collapseContainer">
                        <Collapse in={!!this.state.open || !!this.props.active}>
                            <div>{this.props.children}</div>
                        </Collapse>
                    </div>
                </Card.Body>
            </Card>
    }
}

export default CollapseItem;