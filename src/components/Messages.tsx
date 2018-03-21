import * as React from "react";
import Axios from 'axios';
import Message_YouTube from "./Message_YouTube";
import NewMessage from "./NewMessage";
import * as Moment from 'moment';

export interface MessagesProps {
}

export interface MessagesState {
    username: string;
    commonName: string;
    messages: string[];
    composeNew: boolean;
    messageQueue: string;
}

function checkVideoThumbnail(video) {
    if (video.details_full) {
        if (video.details_full.snippet) {
            if (video.details_full.snippet.thumbnails) {
                if (video.details_full.snippet.thumbnails.medium.url) {
                    return video.details_full.snippet.thumbnails.medium.url;                        
                }
            }
        }
    }

    return '';
}

function checkChannelId(video) {
    if (video.details_full) {
        if (video.details_full.snippet) {
            if (video.details_full.snippet.channelId) {
                return video.details_full.snippet.channelId;
            }
        }
    }

    return '';
}

export class Messages extends React.Component<MessagesProps, MessagesState> {
    constructor (props: MessagesProps) {
        super(props);

        this.state = {
            username: undefined,
            commonName: undefined,
            messages: [],
            composeNew: false,
            messageQueue: 'inbox'
        }

        this.composeNewMessage.bind(this);
        this.handleCloseMessage = this.handleCloseMessage.bind(this);
        this.showQueue = this.showQueue.bind(this);
    }

    composeNewMessage() {
        this.setState({
            composeNew: true
        });
    }

    showQueue(queueName) {
        this.setState({
            messageQueue: queueName
        });
    }

    clearMessageList() {
        this.setState({
            messages: []
        });
    }

    componentDidMount () {
        if (!this.state.username) {
            Axios.get('/checksession')
            .then(
                (resp) => {
                    this.setState({
                        username: resp.data.username,
                        commonName: resp.data.common_name
                    });

                    //now get the messages and map over them
                    Axios.get('/messages/' + this.state.messageQueue + '.json')
                    .then(
                        (inboxMessages) => {

                            console.log(inboxMessages);
                            // console.log('Inbox messages:');
                            //console.log(inboxMessages.data);
                            let messages = inboxMessages.data.map( (message) => 
                                
                                <Message_YouTube key={message.id} messageId={message.id} subject={message.message_subject} 
                                fromUsername={message.from}  toUsername={message.to} 
                                body={message.message_body.messageBody}
                                videoId={message.details_full.id} thumbnail={checkVideoThumbnail(message)} start={message.details_full.start}
                                channelId={checkChannelId(message)}
                                videoDetailsFull={message.details_full || {}}
                                sentTime={Moment(message.message_time)}
                                showRecipient={false} />
                            
                            )

                            this.setState({messages: messages});
                        }
                    )
                    .catch((err) => {
                        console.log('Inbox error: ' + err);
                    })
                }
            )
            .catch((err) => {
                console.log('Session error: ' + err);
            });

        }

    }

    componentWillUpdate(nextProps, nextState) {
        console.log('componentDidUpdate');

        console.log('Current queue: ' + this.state.messageQueue);
        console.log('Next queue: ' + nextState.messageQueue);

        if (this.state.messageQueue != nextState.messageQueue) {
            this.clearMessageList(); 

            var showTo = nextState.messageQueue == 'sent' ? true : false;
            
            Axios.get('/messages/' + nextState.messageQueue + '.json')
            .then(
                (listMessages) => {

                    console.log(listMessages);
                    let messages = listMessages.data.map( (message) => 
                        
                        <Message_YouTube key={message.id} messageId={message.id} subject={message.message_subject} 
                        fromUsername={message.from} toUsername={message.to} 
                        body={message.message_body.messageBody}
                        videoId={message.details_full.id} thumbnail={checkVideoThumbnail(message)} start={message.details_full.start}
                        channelId={checkChannelId(message)}
                        videoDetailsFull={message.details_full || {}}
                        sentTime={Moment(message.message_time)}
                        showRecipient={showTo} />
                    
                    )

                    this.setState({messages: messages});
                }
            )
            .catch((err) => {
                console.log('Inbox error: ' + err);
            })

        }
        
    }

    handleCloseMessage () {
        this.setState({ composeNew: false });
    }

    render() {
        const {
            username,
            composeNew
        } = this.state;

        if (!username) return <div>Not logged in.</div>;

        if (composeNew) {
            return (
                <NewMessage onCloseMessage={this.handleCloseMessage} />
            )
        }

        return ( 
            // TODO:
            // for each, check its type and render the appropriate component.

            <div>
                <a className="btn btn-secondary btn-sm btn-new-msg" role="button" onClick={(e) => {this.composeNewMessage()}}>New Message</a>

                <div className="row">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className={this.state.messageQueue=='inbox' ? 'active nav-link' : 'nav-link' } onClick={(e) => {this.showQueue('inbox')}}>Inbox</a>
                        </li>
                        <li className="nav-item">
                            <a className={this.state.messageQueue=='sent' ? 'active nav-link' : 'nav-link' } onClick={(e) => {this.showQueue('sent')}}>Sent</a>
                        </li>
                    </ul>
                </div>
                <div className="row">
                    {this.state.messages}
                </div>
            </div>
        )
    }
}