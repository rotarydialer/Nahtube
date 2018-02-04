import * as React from "react";
import Axios from 'axios';
//import MessageViewer from "./MessageViewer";
import Message_YouTube from "./Message_YouTube";

export interface MessagesProps { 
}

export interface MessagesState {
    username: string;
    commonName: string;
}

export class Messages extends React.Component<MessagesProps, MessagesState> {
    constructor (props: MessagesProps) {
        super(props);

        this.state = {
            username: undefined,
            commonName: undefined
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
                }
            )
            .catch((err) => {
                console.log('ERROR: ' + err);
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

            <Message_YouTube subject='This is a hard-coded subject' fromUsername='daddy' />

        )
    }
}