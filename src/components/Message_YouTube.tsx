import * as React from "react";
import { watch } from "fs";
import Axios from 'axios';
//import { Router } from 'react-router';
import { BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    Switch,
    withRouter } from 'react-router-dom';

export interface MessageProps { 
    subject: string;
    body: string;
    fromUsername: string;
    videoId: string;
    thumbnail: string;
    channelId: string;
    videoDetailsFull: string;
    start: number;
}

export interface MessageState {
    redirectToWatch: boolean;
}

export default class Message_YouTube extends React.Component<MessageProps, MessageState> {
    constructor (props: MessageProps) {
        super(props);
    }

    componentWillMount () {
        this.setState({
            redirectToWatch: false
        });
    }

    watchViaPost (postUrl, payload) { //do this in handleSubmit?
        console.log('postUrl: ' + postUrl);
        console.log('payload:');
        console.log(payload);
        
        Axios.post(postUrl, payload)
        .then(res => {
            //console.log(res);
            console.log(res.data);

            window.location.href= postUrl; // this routes, but as a GET (the payload isn't picked up)
            //this.context.router.replaceWith(postUrl);

            // withRouter(({history}) => (
            //     history.push(postUrl)
            // ))

            // This returns an error:
            // Warning: You tried to redirect to the same route you're currently on: "/youtube/watch?v=..."
            // Refreshing the page takes you there but... ugh.
            // this.setState({
            //     redirectToWatch: true
            // });

        })
        .catch(err => {
            console.log('ERROR:' + err);
        });
    }

    render() {
        const {
            subject,
            body,
            fromUsername,
            videoId,
            thumbnail,
            channelId,
            videoDetailsFull,
            start
        } = this.props;

        var fromAvatar = '/images/avatars/'+ fromUsername + '-avatar-sm.png';
        var watchUrl = '/youtube/watch?v=' + videoId;
        watchUrl += channelId ? '&c=' + channelId : '';

        if (start) {
            watchUrl += '&t=' + start;
        }

        // if (videoDetailsFull) {
        //     watchUrl += '&videoDetailsFull=' + JSON.stringify(videoDetailsFull);
        // }

        //var encodedWatchUrl = encodeURI(watchUrl);

        var jsonFieldName = videoId + '-json';

        if (this.state.redirectToWatch) {
            return (
                <Router>
                    <Switch>
                        <Redirect to={watchUrl}/>
                    </Switch>
                </Router>
            )
        }

        return ( 
                <div className="col-md-4">
                    <form id={videoId} method="POST" action={watchUrl}>
                        <input id={jsonFieldName} name="videoDetailsFull" type="hidden" />
                        <div className="card mb-4 box-shadow" onClick={ e => this.watchViaPost(watchUrl, this.props) } >
                        {/* <div className="card mb-4 box-shadow"> */}
                            {/* <a href={encodedWatchUrl}> */}
                                <img className="card-img-top" src={thumbnail} data-holder-rendered="true" />
                            {/* </a> */}
                            <div className="card-body">
                                <strong>{subject}</strong>
                                <p className="card-text">{body}</p>
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
                    </form>
                </div>
        )
    }
}