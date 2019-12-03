import React from 'react';
//import executionInfo from './data/executionInfo'
import ClassSection from './components/ClassSection/ClassSection';
import ExecutingInstruction from './models/ExecutingInstruction/ExecutingInstruction';
import Stack from './models/Stack/Stack';
import StackFrame from './models/Stack/StackFrame';
import StackComponent from './components/Stack/StackComponent';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {ToastsContainer, ToastsStore} from 'react-toasts';

// Load the programs
import FibonacciRec from './data/FibonacciRec.json';
import FibonacciIter from './data/FibonacciIter.json';
import EmptyDemo from './data/EmptyDemo.json';
import MathDemo from './data/MathDemo.json';
import StringDemo from './data/StringDemo.json';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      executingInstruction: null,
      instructions: null,
      counter: 0,
      eventsToDispatch: [],
      classEvent: null,
      stackEvent: null,
      stack: new Stack(),
      mode: "single",
      stopped: false,
      program: null
    }

    this.programs = [
      {name: "Empty Demo", content: EmptyDemo},
      {name: "Fibonacci (Rec)", content: FibonacciRec},
      {name: "Fibonacci (Iter)", content: FibonacciIter},
      {name: "Math Demo", content: MathDemo},
      {name: "String Demo", content: StringDemo}
    ]

    this.stackCounter = 1;

    this.onExecuteClick = this.onExecuteClick.bind(this);
    this.onDispatchClick = this.onDispatchClick.bind(this);
    this.dispatchOneEvent = this.dispatchOneEvent.bind(this);
    this.advanceInstruction = this.advanceInstruction.bind(this);
    this.dispatchAllEvents = this.dispatchAllEvents.bind(this);
    this.onContinueClick = this.onContinueClick.bind(this);
    this.onFinishMethodClick = this.onFinishMethodClick.bind(this);
    this.onCancelClick = this.onCancelClick.bind(this);
    this.doOneInstruction = this.doOneInstruction.bind(this);
    this.reset = this.reset.bind(this);
    this.doInitialEvents = this.doInitialEvents.bind(this);

    this.instructionRefs = []
  }

  componentDidMount() {
    //this.doInitialEvents();
  }

  loadProgram(data) {
    console.log(data);

    this.setState({
      program: data,
      instructions: data.content["instructions"]
    }, _ => this.reset())
  }

  doInitialEvents() {
    // Set the initial instruction
    this.advanceInstruction(this.state.counter, _ => {
      // if there are initial events, do them
      if (this.state.executingInstruction.diff.length > 0) {
        this.setState({
          eventsToDispatch: this.state.executingInstruction.diff
        }, this.dispatchAllEvents);
      } 
    });
  }

  dispatchOneEvent(callback) {
    // Get the event to execute
    const event = this.state.eventsToDispatch[0];

    // Figure out when to NULL the event states
    // DO the actual event (usually pass it down to the child component)
    switch(event["operation"]) {
      case "PUT_STATIC" : {
        this.setState({
          classEvent: event
        })

        ToastsStore.success("Update static '" + event['type'] + " " + event['name'] + " ' with value '" + event['data'] + "'");

        break;
      }

      // Push a new stack frame onto the stack
      case "PUSH_STACK_FRAME": {

        // POP the numLocal elements from the previous stack frame
        if (this.state.stack.currentFrame()) {
          for (let i = 0; i < event["arguments"].length; i++) {
            this.state.stack.currentFrame().opStack.pop();
          }
        }

        this.setState({
          stack: this.state.stack.push(new StackFrame(
            event["method"],
            event["class"],
            event["locals"],
            event["arguments"]
          ))
        })

        ToastsStore.success("Push stack frame for '" + event["class"] + "::" + event["method"] + "'");

        this.stackCounter++;
        break;
      }

      // Pop the latest stack frame from the stack
      case "POP_STACK_FRAME": {
        this.setState({
          stack: this.state.stack.pop(),
          stackCounter: this.state.stackCounter - 1
        })
        this.stackCounter--;

        ToastsStore.success("Pop stack frame");
        break;
      }

      case "STORE_LOCAL": {
        // Update the value of the stack frame
        const currentFrame = this.state.stack.currentFrame();
        let localToUpdate = currentFrame.locals.find(f => f["index"] === event["index"]);

        // Case 1: found item (either argument or local that has been updated already)
        if (localToUpdate) {
          localToUpdate["value"] = event["value"];
        }

        // Case 2: item not found (local that has not been seen yet)
        else {
          localToUpdate = currentFrame.locals.find(f => f["index"] === -1);
          localToUpdate["type"] = event["type"];
          localToUpdate["value"] = event["value"];
          localToUpdate["index"] = event["index"];
        }

        // Pass the event to the stack and update stack
        this.setState({
          stack: this.state.stack,
          stackEvent: event
        })

        ToastsStore.success("Update local " + event['type'] +  " at index '"  + event["index"] + "' with value '" + event['value'] + "'");


        break;
      }

      case "PUSH_VAL" : {
        this.state.stack.currentFrame().opStack.push({
          type: event["type"],
          value: event["value"]
        });

        this.setState({
          stack: this.state.stack
        })

        ToastsStore.success("Push value '" + event['value'] + "' to the Operand Stack");

        break;
      }

      case "POP_VAL" : {

        this.state.stack.currentFrame().opStack.pop();

        this.setState({
          stack: this.state.stack
        })

        ToastsStore.success("Pop value from Operand Stack");

        break;
      }

      default : {
        console.error("Event unknown: " + event);
      }
    }

    // Remove the element from the events queue
    let eventsCopy = [...this.state.eventsToDispatch];
    eventsCopy.shift();

    // Do a timer here and only setState once it is done
    // Wait 100ms and then advance 
    setTimeout(_ => {
      this.setState({
        eventsToDispatch: eventsCopy,
        classEvent: null,
        stackEvent: null
      }, callback) // do callback once everything is allll done
    }, 1000)
  }

  dispatchAllEvents(resolve) {

    if (this.state.eventsToDispatch.length > 0) {


      this.dispatchOneEvent(_ => {
          // only advance the PC once the events have all been dispatched
          if (this.state.eventsToDispatch.length === 0) {
            
            // Resolve promise
            if (resolve)
              resolve();

            this.advanceInstruction(this.state.counter + 1);
            
          }
          else {

            // dispatch the next event
            this.dispatchAllEvents(resolve);
          }
      });
    } else {
      // Resolve promise
      if (resolve)
      resolve();

    this.advanceInstruction(this.state.counter + 1);
    }
  }

  onDispatchClick() {

    this.dispatchOneEvent(_ => {
      // only advance the PC once the events have all been dispatched
      if (this.state.eventsToDispatch.length === 0)
        this.advanceInstruction(this.state.counter + 1);
      });
    }

  advanceInstruction(c, fun) {
    // Advance if possible, otherwise log that the program has ended
    if (this.state.instructions[c]) {
    
      this.setState(
        {
          executingInstruction: new ExecutingInstruction(
            this.state.instructions[c]["PC"], 
            this.state.instructions[c]["class"], 
            this.state.instructions[c]["methodName"], 
            this.state.instructions[c]["methodDesc"],
            this.state.instructions[c]["diff"]
          ),
          counter: c
        }, () => {

          
          
          // Scroll to new instruction
          const instr = this.state.instructions[c];
          const key = instr["class"] + "::" + instr["methodName"] + "::" + instr["PC"];

          if (this.instructionRefs[key]) {
            // wait a moment before scrolling
            
            setTimeout(_ => {
              this.instructionRefs[key].current.scrollIntoView({block: 'center', behavior: 'smooth'});
            }, 500)
          }


          // then run callback
          if (fun)
            fun();
        });
      } else {
        ToastsStore.error("End of program reached, resetting.");
        this.reset();
      }
  }

  reset() {

    this.setState({
      stopped: true,
      executingInstruction: null,
      instructions: this.state.program.content["instructions"],
      counter: 0,
      eventsToDispatch: [],
      classEvent: null,
      stackEvent: null,
      stack: new Stack(),
      mode: "single",
    }, this.doInitialEvents)
  }

  async onExecuteClick() {
    this.setState({
      mode: "single"
    })
    await this.doOneInstruction();
  }

  doOneInstruction() {
    let self = this;
    let promise = new Promise(function(resolve, reject) {

        // Dispatch all events
        self.setState({
          eventsToDispatch: self.state.executingInstruction.diff
        }, _ => self.dispatchAllEvents(resolve));

    });

    return promise;
    
  }

  async onContinueClick() {
    this.setState({
      mode: "continue",
      stopped: false
    })

    while (true) {
      if (this.state.stopped) {
        this.setState({
          mode: "single",
          stopped: false
        })
        return;
      }

      await this.doOneInstruction();
    }

  }

  async onFinishMethodClick() {
    this.setState({
      mode: "finishMethod",
      stopped: false
    }, async _ => {
      
    this.stackCounter = 1;

    while(this.stackCounter > 0 && this.state.mode === "finishMethod") {
      await this.doOneInstruction();
    }

    this.setState({
      mode: "single",
      stopped: false
    })
    })
  }

  onCancelClick() {
    this.setState({
      stopped: true,
      mode: "single"
    })
  }

  render() {
    return <div className="App">
    
      <Row noGutters={true} style={{height: "5vh", paddingTop: "5px"}}>
      <Col><h2 style={{float: "left", marginLeft: "5px"}} >Hawkbeans Debugger</h2></Col>
          <Col>
            <Dropdown as={ButtonGroup} style={{float: "right", marginRight: "5px"}}>
              {this.state.mode === "single" ? 
                <Button disabled={this.state.eventsToDispatch.length > 0} variant="success" onClick={this.onExecuteClick}>Step</Button>
              : <Button variant="danger" onClick={this.onCancelClick}>Stop</Button>
              }
              <Dropdown.Toggle split variant={this.state.mode === "single" ? "success" : "danger"} id="dropdown-split-basic" disabled={this.state.eventsToDispatch.length > 0} />

              <Dropdown.Menu>
                <Dropdown.Item onClick={this.onContinueClick}>Continue</Dropdown.Item>
                <Dropdown.Item onClick={this.onFinishMethodClick}> Finish Method</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>

          <Col>

          <DropdownButton id="dropdown-basic-button" title="Select Program">
            {this.programs.map((p) => {
              return <Dropdown.Item name={p["name"]} onClick={_ => this.loadProgram(p)}>{p["name"]}</Dropdown.Item>
            })}
          </DropdownButton>

          </Col>

          <Col><Button style={{float: "right", marginRight: "5px"}} href="https://github.com/petermenke/HawkbeansDebugger" variant="info">View Github Page</Button></Col>

    </Row>
    
    <Row noGutters={true}>
      <Col >
          <Row  noGutters={true} style={{height: "5vh"}}>
            <h2 className="text-center" style={{width: "100%"}}>Class Info</h2>   
          </Row>
          <Row noGutters={true}>
            <ClassSection classes={this.state.program ? this.state.program.content["classes"] : []} executingInstruction={this.state.executingInstruction} event={this.state.classEvent} instructionRefs={this.instructionRefs}/>
          </Row>
      </Col>
      <Col>
        <Row  noGutters={true} style={{height: "5vh"}}>
          <h2 className="text-center" style={{width: "100%"}}>Stack</h2>   
        </Row>

        <Row noGutters={true}>
          <StackComponent frames={this.state.stack} event={this.state.stackEvent}></StackComponent>
        </Row>
      </Col>
    
    </Row>
    <ToastsContainer store={ToastsStore}/>
    </div>
  }
}

export default App;
