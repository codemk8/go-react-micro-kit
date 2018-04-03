var React = require('react')
var createReactClass = require('create-react-class');
import {Link} from 'react-router-dom';

var About = createReactClass({
    render: function(){
        return (
            <div>
                <Link to={'/'}> Home </Link>
                <h2> All about me</h2>
            </div>
        )
    }
})

module.exports = About;