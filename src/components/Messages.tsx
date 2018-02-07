import * as React from "react";
import Axios from 'axios';
import Message_YouTube from "./Message_YouTube";

export interface MessagesProps { 
}

export interface MessagesState {
    username: string;
    commonName: string;
    messages: string[];
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
            messages: []
        }
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
                    Axios.get('/messages/inbox.json')
                    .then(
                        (inboxMessages) => {
                            // console.log('Inbox messages:');
                            console.log(inboxMessages.data);
                            let messages = inboxMessages.data.map( (message) => 
                                
                                <Message_YouTube key={message.id} subject={message.message_subject} fromUsername={message.from} body={message.message_body.messageBody}
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

    render() {
        const {
            username
        } = this.state;

        if (!username) return <div>Not logged in.</div>;

        return ( 

            // TODO:
            // fetch messages, loop through
            // for each, check its type and render the appropriate component.

            //<Message_YouTube subject='This is a hard-coded subject' fromUsername='chris' />
            <div className="row">
                {this.state.messages}
            </div>
        )
    }
}