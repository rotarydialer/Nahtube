import * as React from 'react';
import Axios from 'axios';
import UserSelector from './UserSelector';

export interface MessageProps {
    onCloseMessage: (composeNew: boolean) => void;
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
        this.onSearchPaste = this.onSearchPaste.bind(this);
        this.selectVideoToSend = this.selectVideoToSend.bind(this);
        this.onSelectUser = this.onSelectUser.bind(this);
        this.onChangeSubject = this.onChangeSubject.bind(this);
        this.onChangeBody = this.onChangeBody.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onCloseMessage = this.onCloseMessage.bind(this);
    }

    onCloseMessage(e) {
        this.props.onCloseMessage(e.target.value); // this is the weird binding I need to get clear in my head
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
            console.log('Error getting users: ' + err);
        })

    }

    onSearchChange(e) {
        this.setState({[e.target.name]: e.target.value});

        // wait 2 seconds before submitting the search
        setTimeout(() => this.checkSearchTerms(this.state.searchString), 1000);
    }

    onSearchPaste(e) {
        this.setState({searchString: e.target.value});

        //setTimeout(() => this.checkSearchTerms(this.state.searchString), 50);
        setTimeout(() => this.checkSearchTerms(this.state.searchString), 50);
    }

    checkSearchTerms(incoming) {
        if (incoming) {
            if (currentSearchTerm === incoming) {
                //if (!currentSearchExecuted) {
                if (!this.state.isSearching) {
                //console.log('Looks like you stopped typing at "%s". Submit this!', incoming);
                currentSearchExecuted = true;
                this.doSearch(currentSearchTerm);
                }
            } else {
                currentSearchTerm = incoming;
            }
        } else {
            this.setState({searchResults: []});
        }
    }

    doSearch(searchTerm) {
        this.setState({
            searchResults: [],
            videoId: ''
        });
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

            Axios.get('/youtube/videodetails/' + selectedVideoId)
            .then(
                (response) => {
                    console.log(response.data.items[0]);

                    // TODO: check value
                    this.setState({
                        detailsFull: response.data.items[0]
                    });
                }
            )
            .catch((err) => {
                console.log('Error getting users: ' + err);
            });

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

        const {
            sendToUsername,
            subject,
            messageBody,
            videoId,
            detailsFull
        } = this.state;

        let msgPayload = {
            "toUsername": sendToUsername,
            "subject": subject,
            "messageBody": 
                {"messageBody": messageBody},
            "videoId": videoId,
            "detailsFull": detailsFull
        }

        if (sendToUsername && subject) {

            Axios.post('messages/send', msgPayload)
            .then(res => {
                console.log('Message sent. Response:');
                console.log(res);
            })
            .catch(err => {
                console.log('Error sending message: ' + err);
            });

            // sets "composeNew" to false, thereby closing the New Message component
            this.props.onCloseMessage(false);

        } else {
            // TODO: actually handle this
            console.log('Required field missing.');
        }
    }

    componentWillUnmount() {
        console.log('Message sent.');
        // TODO: show a notification that the message was sent. (which means lifting more state yay :/)
    }

    render() {
        const {
            isSearching,
            sendToUsername
        } = this.state;
        return (
            <div className="newmessage col">
                <h2>Send a Message</h2>

                <form>
                    <div className="form-group">

                        <div className="form-group row recipient-row">
                            <label className="col-1 col-form-label">To</label>

                            <div className="col-4">

                                <select className="form-control" id="messageTo" onChange={this.onSelectUser}>
                                    <option></option>
                                    {this.state.users}
                                </select>

                            </div>

                            {
                                sendToUsername ? <div className="col"><img src={'/images/avatars/' + sendToUsername + '-avatar-md.png'} /></div> : <div className="col">&nbsp;</div>
                            }

                            {
                                this.state.videoId &&
                                <div id="player" className="col text-right yt-player-upper-right">
                                    <iframe id="ytplayer" width="350" height="200"
                                    src={"https://www.youtube.com/embed/" + this.state.videoId + "?autoplay=0&rel=0"}
                                    frameBorder="0"></iframe>
                                </div>
                            }
                        </div>

                        <div className="form-group row">
                            <label className="col-1 col-form-label"><strong>Search</strong></label>

                            <div className="col-4">
                                <input className="form-control" type="text" id="search" name="searchString" onChange={this.onSearchChange} onPaste={this.onSearchPaste} />
                            </div>

                            {
                                isSearching ? <h2><span className="badge badge-info"><strong>Searching...</strong></span></h2> : <span>&nbsp;</span>
                            }

                        </div>

                        <div className="row">
                            {this.state.searchResults}
                        </div>

                        {/* <div className="row">
                            {this.state.videoId &&
                                <div id="player" className="col-8">
                                    <iframe id="ytplayer" width="500" height="282"
                                    src={"https://www.youtube.com/embed/" + this.state.videoId + "?autoplay=0&rel=0"}></iframe>
                                </div>
                            }
                        </div> */}

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
                    
                        <div className="btn btn-primary" onClick={this.sendMessage}>Send</div> <div className="btn btn-secondary" onClick={this.onCloseMessage}>Cancel</div>
                    </div>
                </form>
            </div>
        )

    }
}