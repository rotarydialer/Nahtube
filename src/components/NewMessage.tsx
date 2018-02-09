import * as React from 'react';
import Axios from 'axios';

export interface MessageProps {

}

export interface MessageState {

}

export default class NewMessage extends React.Component<MessageProps, MessageState> {    constructor (props: MessageProps) {
        super(props);

    }

    render() {
        return (
            <div className="newmessage col">
                <h2>New Message</h2>
                <p>And stuff will go here. Have a border.</p>
            </div>
        )

    }
}