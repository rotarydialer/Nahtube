import * as React from "react";
import { watch } from "fs";
import Axios from 'axios';

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

        this.onDelete = this.onDelete.bind(this);
    }

    onDelete (e) {
        console.log('Clicked delete!');
        console.log(e);
    }

    componentWillMount () {
        this.setState({
            redirectToWatch: false
        });
    }

    watchViaPost (postUrl, payload) {
        
        Axios.post(postUrl, payload)
        .then(res => {
            console.log(res);
            //console.log(res.data);

            window.location.href = postUrl; // this routes, but as a GET, so handle accordingly

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

        watchUrl += '&logact=no';

        var jsonFieldName = videoId + '-json';

        return ( 
                <div className="col-md-4">
                    <form id={videoId} method="POST" action={watchUrl}>
                        <input id={jsonFieldName} name="videoDetailsFull" type="hidden" />
                        {/* <div className="card mb-4 box-shadow" onClick={ e => this.watchViaPost(watchUrl, this.props) } > */}
                        <div className="card mb-4 box-shadow">
                            {/* Conditionally render the image only if thumbnail has a value */}
                            { thumbnail &&
                               <img className="card-img-top" src={thumbnail} data-holder-rendered="true" onClick={ e => this.watchViaPost(watchUrl, this.props) } />
                            }
                            <div className="card-body">
                                <strong>{subject}</strong>
                                <p className="card-text">{body}</p>
                                <div className="avatar-message"><img src={fromAvatar} /></div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="btn-group">
                                    <div className="btn btn-sm btn-outline-secondary">Reply</div>
                                    <div className="btn btn-sm btn-outline-secondary" onClick={(e) => {this.onDelete(e)}}>Delete</div>
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