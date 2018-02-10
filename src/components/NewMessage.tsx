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

                                <select className="form-control" id="messageTo">
                                    <option></option>
                                    <option>Mommy</option>
                                    <option>Daddy</option>
                                    <option>Son</option>
                                    <option>Daughter</option>
                                </select>

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