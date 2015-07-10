var React = require('react');
var $ = require('jquery');
var MessageList = require('./MessageList.js');
var Firebase = require('firebase');
var ReactFireMixin = require('reactfire');

var main = React.createClass({

    getInitialState: function() {
        return {
            messages: [],
            user: {
                name: '',
                avator: ''
            }
        };
    },

    mixins: [ReactFireMixin],

    componentDidMount: function() {
        //this.bindAsArray(
            //new Firebase("https://react-example.firebaseio.com/messages").orderByKey(),
            //"messages");

        var getMessages = function() {
            $.ajax({
                url: 'http://sslab2.cs.nctu.edu.tw/myproject/api/v1/messages?order=desc&limit=1000',
                dataType: 'json',
                success: function(data) {
                    this.setState({
                        messages: data.data
                    });
                }.bind(this)
            });
        }.bind(this);

        getMessages();

        setInterval(getMessages, 2000);

        $.ajax({
          url: 'http://api.randomuser.me/',
          dataType: 'json',
          success: function(data){
            this.setState({
                user: {
                    name: this.state.user.name,
                    avator: data.results[0].user.picture.thumbnail
                }
            });
          }.bind(this)
        });
    },

    handleSubmit: function(e){
        e.preventDefault();  // 防止瀏覽器原生form action

        var username = this.state.user.name ?
        this.state.user.name : this.refs.username.getDOMNode().value.trim();
        var messageDOM = this.refs.message.getDOMNode();

        if (messageDOM.value.trim() === ''){
            messageDOM.focus();
            return false;
        }

        //this.firebaseRefs["messages"].push({
            //avator: this.state.user.avator,
            //username: username,
            //message: messageDOM.value.trim()
        //});

        $.ajax({
            url: 'http://sslab2.cs.nctu.edu.tw/myproject/api/v1/messages',
            method: 'POST',
            dataType: 'json',
            success: function(data) {
                var messages = this.state.messages;
                messages.unshift(data.data);
                this.setState({
                    messages: messages
                });
            }.bind(this),
            data: {
                avator: this.state.user.avator,
                name: username,
                message: messageDOM.value.trim()
            }
        });

        this.setState({
            user: {
                user: username,
                avator: this.state.user.avator
            }
        });
        messageDOM.value = '';
    },

    render: function() {

        var imageA = <img src={this.state.user.avator} alt="Avator" />;

        return (
            <div>
                <h2>Name: { this.state.user.name ? this.state.user.name : 'None'}</h2>
                    {imageA}
                <form className="form" onSubmit={this.handleSubmit}>
                    <input className="form-control floating-label"
                           type="text"
                           placeholder="User name"
                           ref='username' />

                    <input className="form-control floating-label"
                           type="text"
                           placeholder="Say something..."
                           ref='message' />

                    <input type="submit" className="btn btn-primary" value="Send" />
                </form>

                <MessageList messages={this.state.messages} />
            </div>
        );
    }

});

module.exports = main;
