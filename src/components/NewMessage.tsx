import * as React from 'react';
import Axios from 'axios';
import UserSelector from './UserSelector';

export interface MessageProps {

}

export interface MessageState {
    isSearching: boolean;
    searchString: string;
    searchResults: string[];
    users: string[];
    sendToUsername: string;
    subject: string;
    messageBody: string;
    videoId: string;
    detailsFull: {}
}

// TODO: remove these hamfisted crutches in favor of something more elegant
// I mean, you've already got one of these in the state! :P
var currentSearchTerm;
var currentSearchExecuted = false;

function formatVideoThumbnail(video) {
        if (video.snippet) {
            if (video.snippet.thumbnails) {
                if (video.snippet.thumbnails.medium.url) {
                    return video.snippet.thumbnails.medium.url;
                }
            }
        }

    return '';
}

export default class NewMessage extends React.Component<MessageProps, MessageState> {
        constructor (props: MessageProps) {
        super(props);

        this.state = {
            isSearching: false,
            searchString: undefined,
            searchResults: [],
            users: [],
            sendToUsername: undefined,
            subject: undefined,
            messageBody: undefined,
            videoId: undefined,
            detailsFull: {}
        }

        this.onSearchChange = this.onSearchChange.bind(this);
        this.selectVideoToSend = this.selectVideoToSend.bind(this);
        this.onSelectUser = this.onSelectUser.bind(this);
        this.onChangeSubject = this.onChangeSubject.bind(this);
        this.onChangeBody = this.onChangeBody.bind(this);
    }

    componentDidMount () {
        Axios.get('/users')
        .then(
            (userData) => {
                let usersFound = userData.data.map( (userFound) => 
                    
                    <UserSelector 
                        key={userFound.id} 
                        userid={userFound.id} 
                        username={userFound.username} 
                        common_name={userFound.common_name} 
                        roles={userFound.roles} 
                    />
                
                )

                this.setState({users: usersFound});
            }
        )
        .catch((err) => {
            console.log('Inbox error: ' + err);
        })

    }

    onSearchChange(e) {
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
                        // <div key={result.id.videoId} className="col searchResultThumb" onClick={this.selectVideoToSend.bind(this)}><img data-videoid={result.id.videoId} data-fulldetails={result} className="searchResultThumb" src={formatVideoThumbnail(result)} /></div>
                        // ideally, I should probably serialize and store the full details result above, but in the interest of time I'll just grab the videoId and do a separate request on send :/
                        <div key={result.id.videoId} className="col searchResultThumb"><img  onClick={this.selectVideoToSend} data-videoid={result.id.videoId} className="searchResultThumb" src={formatVideoThumbnail(result)} /></div>
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
            });

        //setTimeout(() => currentSearchExecuted = false, 1000); // clear this flag to allow searches to happen again
    }

    selectVideoToSend(e) {
        let selectedVideoId = e.target.dataset.videoid;
        if (selectedVideoId) {
            this.setState({videoId: selectedVideoId});
        } else {
            console.log('ERROR: No video ID found for the selected video.');
        }
    }

    onSelectUser(selectedUser) {
        this.setState({
            sendToUsername: selectedUser.target.value
        });
    }

    onChangeSubject(e) {
        this.setState({[e.target.id]: e.target.value});
    }

    onChangeBody(e) {
        this.setState({[e.target.id]: e.target.value});
    }

    sendMessage(e) {
        console.log('Preparing to send the message:');
        console.log(this.state);
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

                            <div className="col-4">

                                <select className="form-control" id="messageTo" onChange={this.onSelectUser}>
                                    <option></option>
                                    {this.state.users}
                                </select>

                            </div>
                        </div>

                        <div className="form-group row">
                            <label className="col-1 col-form-label">Subject</label>

                            <div className="col-11">
                                <input className="form-control" type="text" id="subject" onChange={this.onChangeSubject} />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-12">
                                <textarea className="form-control" id="messageBody" rows={5} onChange={this.onChangeBody}></textarea>
                            </div>
                        </div>
                    
                        <button type="submit" className="btn btn-primary" onClick={this.sendMessage}>Send</button> <button className="btn btn-secondary">Cancel</button>
                    </div>
                </form>
            </div>
        )

    }
}