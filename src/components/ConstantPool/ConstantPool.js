import React from 'react';
import CollapseItem from '../CollapseItem/CollapseItem'

const CONSTANT_Class = 7;
const CONSTANT_Fieldref = 9;
const CONSTANT_Methodref = 10;
const CONSTANT_InterfaceMethodref = 11;
const CONSTANT_String = 8;
const CONSTANT_Integer = 3;
const CONSTANT_Float = 4;
const CONSTANT_Long = 5;
const CONSTANT_Double = 6;
const CONSTANT_NameAndType = 12;
const CONSTANT_Utf8 = 1;
const CONSTANT_MethodHandle = 15;
const CONSTANT_MethodType = 16;
const CONSTANT_InvokeDynamic = 18;

const TAGS = {
    7: "Class",
    9: "Fieldref",
    10: "Methodref",
    11: "InterfaceMethodref",
    8: "String",
    3: "Integer",
    4: "Float",
    5: "Long",
    6: "Double",
    12: "NameAndType",
    1: "Utf8",
    15: "MethodHandle",
    16: "MethodType",
    18: "InvokeDynamic"
}

class ConstantPool extends React.Component {

    constructor() {
        super();

        this.resolveUTF8 = this.resolveUTF8.bind(this);
        this.resolveClass = this.resolveClass.bind(this);
        this.resolveNameAndType = this.resolveNameAndType.bind(this);

        // TODO: Since Float and Double take up two constant pool slots, there is no longer a direct 
        // mapping between entry in my array and constant pool number
        // Option 1: Save the constant pool number with the item and search for the number
        // Option 2: Put null items after the double and float entries
        
    }

    resolveUTF8(idx) {

        return this.props.data.find(i => i['idx'] === idx)["bytes"];
    }

    resolveClass(idx) {
        return this.resolveUTF8(this.props.data.find(i => i['idx'] === idx)["name_index"]);
    }

    resolveNameAndType(idx) {
        const item = this.props.data.find(i => i['idx'] === idx);
        return this.resolveUTF8(item["name_index"]) + " : " + this.resolveUTF8(item["descriptor_index"]);
    }

    render() {
        return <CollapseItem title="Constant Pool">

            <table><tbody>
            {this.props.data.map((c,i) => {

                switch(c["tag"]) {
                    case CONSTANT_Class : {
                        return <tr key={i}>
                                    <td>{c["idx"]}</td>
                                    <td>{TAGS[c["tag"]]}</td>
                                    <td>name_index: {c["name_index"]} ({this.resolveUTF8(c["name_index"])})</td>
                                </tr>;
                    }

                    case CONSTANT_Fieldref :
                    case CONSTANT_Methodref :
                    case CONSTANT_InterfaceMethodref : {
                        return <tr key={i}>
                                    <td>{c["idx"]}</td>
                                    <td>{TAGS[c["tag"]]}</td>
                                    <td>class_index: {c["class_index"]} ({this.resolveClass(c["class_index"])})</td>
                                    <td>name_and_type_index: {c["name_and_type_index"]} ({this.resolveNameAndType(c["name_and_type_index"])})</td>
                                </tr>;
                    }

                    case CONSTANT_String : {
                        return <tr key={i}>
                                    <td>{c["idx"]}</td>
                                    <td>{TAGS[c["tag"]]}</td>
                                    <td>string_index: {c["string_index"]} ({this.resolveUTF8(c["string_index"])})</td>
                                </tr>;

                    }

                    // NOT TESTED
                    case CONSTANT_Integer :
                    case CONSTANT_Float : {
                        return <tr key={i}>
                                    <td>{c["idx"]}</td>
                                    <td>{TAGS[c["tag"]]}</td>
                                    <td>{c["bytes"]}</td>
                                </tr>;

                    }

                    // NOT TESTED
                    case CONSTANT_Long :
                    case CONSTANT_Double : {
                        return <tr key={i}>
                                    <td>{c["idx"]}</td>
                                    <td>{TAGS[c["tag"]]}</td>
                                    <td>{(c["high_bytes"] << 32) + c["low_bytes"]}</td>
                                </tr>;

                    }

                    case CONSTANT_NameAndType : {
                        return <tr key={i}>
                                    <td>{c["idx"]}</td>
                                    <td>{TAGS[c["tag"]]}</td>
                                    <td>name_index: {c["name_index"]} ({this.resolveUTF8(c["name_index"])})</td>
                                    <td>descriptor_index: {c["descriptor_index"]} ({this.resolveUTF8(c["descriptor_index"])})</td>
                                </tr>;
                    }

                    case CONSTANT_Utf8 : {
                        return <tr key={i}>
                                    <td>{c["idx"]}</td>
                                    <td>{TAGS[c["tag"]]}</td>
                                    <td>"{c["bytes"]}"</td>
                                </tr>;
                    }

                    // NOT TESTED
                    case CONSTANT_MethodHandle : {
                        return <tr key={i}>
                                    <td>{c["idx"]}</td>
                                    <td>{TAGS[c["tag"]]}</td>
                                    <td>reference_kind: {c["reference_kind"]}</td>
                                    <td>reference_index: {c["reference_index"]}</td>
                                </tr>;
                    }

                    case CONSTANT_MethodType : {
                        return <tr key={i}>
                                    <td>{c["idx"]}</td>
                                    <td>{TAGS[c["tag"]]}</td>
                                    <td>descriptor_index: {c["descriptor_index"]} ({this.resolveUTF8(c["descriptor_index"])})</td>
                                </tr>;
                    }

                    // NOT TESTED
                    case CONSTANT_InvokeDynamic: {
                        return <tr key={i}>
                                    <td>{c["idx"]}</td>
                                    <td>{TAGS[c["tag"]]}</td>
                                    <td>bootstrap_method_attr_index: {c["bootstrap_method_attr_index"]}</td>
                                    <td>name_and_type_index: {c["name_and_type_index"]} ({this.resolveNameAndType(c["name_and_type_index"])})</td>
                                </tr>;                    
                        }
                    default :{
                        return null;
                    }
                }
            })}
            </tbody></table>
        </CollapseItem>
    }
}

export default ConstantPool;