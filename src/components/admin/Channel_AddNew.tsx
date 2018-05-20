import * as React from 'react';
import Axios from 'axios';
import IUser from '../IUser';

export interface Props {
    user: IUser;
    onClose: (composeNew: boolean) => void;
}

export interface State {
    isSearching: boolean;
    searchString: string;
    searchResults: string[];
    detailsFull: {}
}

// TODO: consider removing these hamfisted crutches
 var currentSearchTerm;
 var currentSearchExecuted = false;

function formatChannelThumbnail(channel) {
        if (channel.snippet) {
            if (channel.snippet.thumbnails) {
                if (channel.snippet.thumbnails.medium.url) {
                    return channel.snippet.thumbnails.medium.url;
                }
            }
        }

    return '';
}

export default class AddChannel extends React.Component<Props, State> {
        constructor (props: Props) {
        super(props);

        this.state = {
            isSearching: false,
            searchString: undefined,
            searchResults: [],
            detailsFull: {}
        }

        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchPaste = this.onSearchPaste.bind(this);
        this.selectChannelToAdd = this.selectChannelToAdd.bind(this);
        this.saveChannel = this.saveChannel.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onClose(e) {
        this.props.onClose(e.target.value);
    }

    componentWillMount() {
    }

    componentDidMount () {
        console.log('Add new mounted.');
    }

    onSearchChange(e) {
        this.setState({[e.target.name]: e.target.value});

        // wait 1 second before submitting the search
        setTimeout(() => this.checkSearchTerms(this.state.searchString), 1000);
    }

    onSearchPaste(e) {
        this.setState({searchString: e.target.value});

        setTimeout(() => this.checkSearchTerms(this.state.searchString), 50);
    }

    checkSearchTerms(incoming) {
        if (incoming) {
            // TODO: test with this.state.searchString
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
            searchResults: []
        });
        console.log('Searching for "%s"...', searchTerm);
        this.setState({isSearching: true});

        Axios.get('/youtube/channel/search/' + searchTerm )
            .then(
                (resultsFound) => {
                    console.log(resultsFound.data);
                    let searchResults = resultsFound.data.items.map( (result) => 
                        <div key={result.id.channelId} className="col searchResultThumb">
                            <img onClick={this.selectChannelToAdd} 
                                data-channelid={result.id.channelId} 
                                className="channelThumb" 
                                src={formatChannelThumbnail(result)} 
                                alt={result.snippet.description}
                            />
                            <div>{result.snippet.channelTitle}</div>

                            <div>{result}</div>

                            <div onClick={this.saveChannel}>
                                <i className="fas fa-plus"></i>
                            </div>
                        </div>
                    )

                    this.setState({searchResults: searchResults});

                    console.log(searchResults);

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

    selectChannelToAdd(e) {
        let channelData = e.target.dataset;

        console.log(channelData);

        if (channelData) {
            this.setState({detailsFull: channelData});

        } else {
            console.log('ERROR: No video ID found for the selected video.');
        }
    }


    saveChannel(e) {
        console.log('Saving channel.');

        let {
            detailsFull
        } = this.state;

        let {
            user
        } = this.props;

        let payload = {
            "detailsFull": detailsFull
        }

        if (detailsFull) {

            console.log(payload);

            // Axios.post('/youtube/save/channelId/' + user.username, payload)
            // .then(res => {
            //     console.log('Channel saved. Response:');
            //     console.log(res);
            // })
            // .catch(err => {
            //     console.log('Error saving channel: ' + err);
            // });

            // sets "composeNew" to false, thereby closing the New Message component
            this.props.onClose(false);

        } else {
            // TODO: actually handle this
            console.log('Required field missing.');
        }
    }

    componentWillUnmount() {
        // TODO: show a notification that this completed successfully. (which means lifting more state yay :/)
    }

    render() {
        const {
            isSearching
        } = this.state;
        return (
            <div className="col">
                <h2>Add a Channel</h2>

                <form>
                    <div className="form-group">

                        <div className="form-group row">
                            <label className="col-3 col-form-label"><strong>Search</strong></label>

                            <div className="col-9">
                                <input className="form-control" type="text" id="search" name="searchString" onChange={this.onSearchChange} onPaste={this.onSearchPaste} />
                            </div>

                            {
                                isSearching ? <h2><span className="badge badge-info"><strong>Searching...</strong></span></h2> : <span>&nbsp;</span>
                            }

                        </div>

                        <div className="row search-results">
                            {this.state.searchResults}
                        </div>

                    </div>
                </form>
            </div>
        )

    }
}