var React = require('react');
var ReactDOM = require('react-dom')
var createReactClass = require('create-react-class');
// Create component
require("./css/index.css")
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';

// module requir
var TodoItem = require('./todoItem')
var AddItem = require('./addItem')
var About = require('./about')

var App = createReactClass(
    {
        render: function() {
            console.log("inside render")
            return(
                <Router>
                    <div>
                    <Route exact path="/" component={TodoComponent}/> 
                    <Route path="/about" component={About}/>
                    </div>
                </Router>
            )
        }
    }
)

var TodoComponent = createReactClass({
    getInitialState: function(){
        // server-less demo use this
        // return {
        //    todos: ['wash up', 'eat some cheese', 'take a nap'],
        // }
        const xhr = new XMLHttpRequest()
        xhr.open('get', 'http://localhost:1234/api/todo')
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                console.log("received ijnitial todos")
                var todo=JSON.parse(xhr.response);
                this.setState({todos: todo})
            } else { 
              console.log("error getting initial list, check main server?")
            }
        });
        xhr.send();
        return {
            todos: []  // return a temporary empty list
        }
    },
    onDelete: function(item) {

        var updatedTodos = this.state.todos.filter(function(val, index) {
            return item !== val;
        })
        // TODO: sync with server 
        this.setState({ todos: updatedTodos})
    },
    render: function() {
        var todos = this.state.todos
        todos = todos.map(function(item, index) {
            return( 
            <TodoItem item={item} key={index} onDelete={this.onDelete}/>)
        }.bind(this));
        return(     
            <div id="todo-list">
            <Link to={'/about'}> About </Link>
            <p >the busiest pepople have the most.. </p>
                <ul> {todos}
                </ul>
                <AddItem onAdd={this.onAdd}/>
            </div>
        );
    },

    onAdd: function(item) {
        var todos = this.state.todos
        todos.push(item)
        // TODO: sync with server 
        this.setState({todos: todos})
    },

    // lifecycle functions
    componentWillMount: function(){
        console.log('component will mount')
    },
    componentDidMount: function(){
        console.log('compopnent did mount')
    },
      componentWillUpdate: function(){
        console.log('compopnent will update')
    }
});


// put component to html page
ReactDOM.render(<App />, document.getElementById('todo-wrapper'))