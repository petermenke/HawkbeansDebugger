View live site [here](https://petermenke.github.io/HawkbeansDebugger/)!

# Overview

HawkbeansDebugger is a debugger and visualizer tool built on top of the Hawkbeans JVM that allows users to run a set of predetermined programs. Its purposes are:
* Demonstrate the ways a stack-based JVM functions differently than compiled code.
* Show the control flow of an executing Java program. 
* Teach the layout and basic functions of a JVM for people learning about it. 

The HawkbeansDebugger back-end is built on top of Hawkbeans. When run with a Java class file, it produces a JSON file which describes the execution of the JVM and the class information that was loaded during the execution. The front-end allows a used to load one of these JSON files and play it back, giving the appearance that the code is being executed in the browser. The user can step through this playback and observe how different instructions affect different areas of the JVM.

## Usage
When the website loads, begin by selecting a program from the "Select Program" dropdown at the top. After the inital setup has finished, the Class Info and Stack sections should be loaded. The Class Info section contains data related to all the loaded classes. It shows the methods of each class with the decoded bytecode, the static fields and their values, and the data in the constant pools. Note that the current class, method, and **instruction being executed are bolded** so that the used can keep track of what code is being run. On the right is the Stack section, which contains all the current stack frames. Each frame has a list of arguments and local variables, along with the operand stack. 

Step through the program using one of the different modes:
* **Step**: Execute a single instruction.
* **Continue**: Execute instructions until stopped or the end of the program is reached.
* **Finish Method**: Execute instructions until the current stack frame has been popped. 

Each instruction can have one or more event associated with it. Updating the value of a static field in a class or pushing a new stack frame are examples of events that are tracked. Once an instruction is executed, its events will be played through one at a time. There is a popup in the bottom right for every event and the DOM is updated to reflect the effect. If a field of a class is updated, the "Field" section will expand and the field will be bolded momentarily. Once the events have played out, the next instruction is ready for execution. 

### Programs
Currently there are X programs available to run:
* [EmptyDemo](https://github.com/petermenke/HawkbeansDebugger/blob/master/src/data/EmptyDemo.java): A barebones class with only the main method. 
* [FibonacciRec](https://github.com/petermenke/HawkbeansDebugger/blob/master/src/data/FibonacciRec.java): Calculate the 5th fibonacci number (recursively).
* [FibonacciIter](https://github.com/petermenke/HawkbeansDebugger/blob/master/src/data/FibonacciIter.java): Calculate the 6thth fibonacci number (iteratively).
* [StringDemo](https://github.com/petermenke/HawkbeansDebugger/blob/master/src/data/StringDemo.java): Demonstrates the use of methods of the String class. (SLOW)
* [MathDemo](https://github.com/petermenke/HawkbeansDebugger/blob/master/src/data/MathDemo.java): Shows the stack-based nature of bytecode with a few simple math operations. 

### Limitations
* Since Hawkbeans is not entirely set up to handle Double or Long values, those are not officially supported. 
* This debugger is intended for educational purposes, so ease of use and discoverability have been prioritized over speed. The animations make it very slow to run a whole program. 
* The sample programs are all relatively small because the JSON becomes very large when more instructions are executed. 
* Sometimes float values are not displayed properly.
* The debugger does not know much about objects other than their reference. Therefore, as the object value it simply displays the reference.

## Methodology
### Back-End
The bulk of the work for the back-end of this project was figuring out where to intercept the JVM and log what it was doing. The library [cJSON](https://github.com/DaveGamble/cJSON) was used to create a global JSON object to class data and execution info. 
* The class information was gathered in the `hb_prep_class` method of `class.c`. 
* The static field updates were tracked in `handle_putstatic` of `bc_interp.c`.
* The stack frame pushes were tracked in `hb_setup_method_parms` of `stack.c` and `hb_init_class` of `class.c`.
* The local variables changes were tracked in `handle_istore`, `handle_istore_X`, and similar methods of `bc_interp.c`
* The operand stack was managed with the `push_val` and `pop_val` methods of `bc_interp.c`, with adjustments made for specific data types. 

### Front-End
The front-end of this application is built on React, which leverages one-way data binding to allow the transitions and animations to happen seamlessly. The most complicated pieces involve making sure the events at the correct time and are visible to the user. The class info section scrolls automatically to keep the executing instruction in view, while also giving the used the ability to pause and investigate other classes and methods. 

## Future Improvements
With more time, there are a number of improvements that could be made to make this tool more useful:
* Add a code upload, compile, and run pipeline for users to run the tool with their own code.
* Visualize memory and garbage collection.
* Show exceptions and how they are handled.
* Add support for Doubles and Longs. 
