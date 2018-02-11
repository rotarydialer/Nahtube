import * as React from 'react';
import Axios from 'axios';

export interface MessageProps {

}

export interface MessageState {
    isSearching: boolean;
    searchString: string;
    searchResults: string[];
}

// TODO: remove these hamfisted crutches in favor of something more elegant
// I mean, you've already got one of these in the state! :P
var currentSearchTerm;
var currentSearchExecuted = false;

export default class NewMessage extends React.Component<MessageProps, MessageState> {
        constructor (props: MessageProps) {
        super(props);

        this.state = {
            isSearching: false,
            searchString: undefined,
            searchResults: []
        }

        this.onSearchChange = this.onSearchChange.bind(this);

    }

    onSearchChange(e){
        this.setState({[e.target.name]: e.target.value});

        // wait 2 seconds before submitting the search
        setTimeout(() => this.checkSearchTerms(this.state.searchString), 2000);

     }

     checkSearchTerms(incoming) {
         if (currentSearchTerm === incoming) {
             //if (!currentSearchExecuted) {
             if (!this.state.isSearching) {
                console.log('Looks like you stopped typing at "%s". Submit this!', incoming);
                currentSearchExecuted = true;
                this.doSearch(currentSearchTerm);
             }
         } else {
             currentSearchTerm = incoming;
         }
     }

     doSearch(searchTerm) {
         this.setState({searchResults: []});
         console.log('Searching for "%s"...', searchTerm);
         this.setState({isSearching: true});

         Axios.get('/youtube/search/' + searchTerm )
                    .then(
                        (resultsFound) => {
                            console.log(resultsFound.data);
                            let searchResults = resultsFound.data.items.map( (result) => 

                                <div className="col">{result.snippet.title || 'No title'}</div>
                                
                                // <Message_YouTube key={message.id} messageId={message.id} subject={message.message_subject} fromUsername={message.from} body={message.message_body.messageBody}
                                // videoId={message.details_full.id} thumbnail={checkVideoThumbnail(message)} start={message.details_full.start}
                                // channelId={checkChannelId(message)}
                                // videoDetailsFull={message.details_full || {}} />
                            
                            )

                            this.setState({searchResults: searchResults});
                            setTimeout(() => currentSearchExecuted = false, 1000);
                            setTimeout(() => this.setState({isSearching: false}), 1000);
                        }
                    )
                    .catch((err) => {
                        console.log('Send Message error: ' + err);
                        setTimeout(() => currentSearchExecuted = false, 1000);
                        setTimeout(() => this.setState({isSearching: false}), 1000);
                    })

         //setTimeout(() => currentSearchExecuted = false, 1000); // clear this flag to allow searches to happen again
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
                            <label className="col-1 col-form-label">Search</label>

                            <div className="col-8">
                                <input className="form-control" type="text" id="search" name="searchString" onChange={this.onSearchChange} />
                            </div>

                            {
                                isSearching ? <h2><span className="badge badge-info"><strong>Searching...</strong></span></h2> : <span>&nbsp;</span>
                            }

                        </div>

                        <div className="row">
                            {this.state.searchResults}
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