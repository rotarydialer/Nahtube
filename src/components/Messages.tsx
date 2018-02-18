import * as React from "react";
import Axios from 'axios';
import Message_YouTube from "./Message_YouTube";
import NewMessage from "./NewMessage";

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
    }

    composeNewMessage() {
        this.setState({
            composeNew: true
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
                            // console.log('Inbox messages:');
                            //console.log(inboxMessages.data);
                            let messages = inboxMessages.data.map( (message) => 
                                
                                <Message_YouTube key={message.id} messageId={message.id} subject={message.message_subject} fromUsername={message.from} body={message.message_body.messageBody}
                                videoId={message.details_full.id} thumbnail={checkVideoThumbnail(message)} start={message.details_full.start}
                                channelId={checkChannelId(message)}
                                videoDetailsFull={message.details_full || {}} />
                            
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
                <a className="btn btn-secondary btn-sm" href="#" role="button" onClick={(e) => {this.composeNewMessage()}}>New Message</a>
                <div className="row">
                    {this.state.messages}
                </div>
            </div>
        )
    }
}