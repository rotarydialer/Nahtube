import * as React from "react";
import Axios from 'axios';
//import MessageViewer from "./MessageViewer";

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
                    console.log('Gotted a resp[opnsid');
                    console.log(resp);

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
                <div className="col-md-4">
                    <div className="card mb-4 box-shadow">
                        <img className="card-img-top" src="" data-holder-rendered="true" />
                        <div className="card-body">
                            <p className="card-text">This is a REACT video message from another user.</p>
                            <div className="avatar-message"><img src="/images/avatars/<%= username %>-avatar-sm.png" /></div>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="btn-group">
                            <button type="button" className="btn btn-sm btn-outline-secondary">Reply</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary">Delete</button>
                            </div>
                            <small className="text-muted">9 mins</small>
                        </div>
                        </div>
                    </div>
                </div>
        )
    }
}