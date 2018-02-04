import * as React from "react";

export interface MessageProps { 
    subject: string;
    fromUsername: string;
}

export interface MessageState {
}

export default class Message_YouTube extends React.Component<MessageProps, MessageState> {
    constructor (props: MessageProps) {
        super(props);
    }

    componentDidMount () {
    }

    render() {
        const {
            subject,
            fromUsername
        } = this.props;

        var fromAvatar = '/images/avatars/'+ fromUsername + '-avatar-sm.png'

        return ( 
                <div className="col-md-4">
                    <div className="card mb-4 box-shadow">
                        <img className="card-img-top" src="" data-holder-rendered="true" />
                        <div className="card-body">
                            <strong>{subject}</strong>
                            <p className="card-text">This is a React YouTube video message from another user.</p>
                            <div className="avatar-message"><img src={fromAvatar} /></div>
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