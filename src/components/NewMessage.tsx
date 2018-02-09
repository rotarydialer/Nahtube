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
            <div>This will be a new message.</div>
        )

    }
}