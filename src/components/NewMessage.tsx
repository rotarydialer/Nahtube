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
                <h2>Send a Message</h2>

                <form>
                    <div className="form-group">

                        <div className="form-group row">
                            <label className="col-1 col-form-label">To</label>
                            <div className="col-11">
                                <input type="email" className="form-control" id="messageTo" aria-describedby="toHelp" placeholder="Username" />
                                <small id="toHelp" className="form-text text-muted">Who would you like to send this message to?</small>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-1 col-form-label">Subject</label>
                            <div className="col-11">
                                <input className="form-control" type="text" id="subject" />
                            </div>
                        </div>
                    
                        <button type="submit" className="btn btn-primary">Send</button>
                    </div>
                </form>
            </div>
        )

    }
}