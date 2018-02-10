import * as React from 'react';
import Axios from 'axios';

export interface MessageProps {

}

export interface MessageState {
    isSearching: boolean;
    searchString: string;
}

export default class NewMessage extends React.Component<MessageProps, MessageState> {
        constructor (props: MessageProps) {
        super(props);

        this.state = {
            isSearching: false,
            searchString: undefined
        }

        this.onSearchChange = this.onSearchChange.bind(this);

    }

    onSearchChange(e){
        this.setState({[e.target.name]: e.target.value});
        this.setState({isSearching: true});

        console.log('searchString: "%s"', this.state.searchString);

        // wait 3 seconds or so before submitting the search
     }

    render() {
        const {
            isSearching
        } = this.state;
        return (
            <div className="newmessage col">
                <h2>Send a Message</h2>

                <form>
                    <div className="form-group">

                        <div className="form-group row">
                            <label className="col-1 col-form-label">Link</label>

                            <div className="col-8">
                                <input className="form-control" type="text" id="search" name="searchString" onChange={this.onSearchChange} />
                            </div>

                            {
                                isSearching ? <h2><span className="badge badge-danger"><strong>Searching...</strong></span></h2> : <span>&nbsp;</span>
                            }

                        </div>

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

                        <div className="form-group row">
                            <div className="col-12">
                                <textarea className="form-control" id="messageBody" rows={5}></textarea>
                            </div>
                        </div>
                    
                        <button type="submit" className="btn btn-primary">Send</button> <button className="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        )

    }
}