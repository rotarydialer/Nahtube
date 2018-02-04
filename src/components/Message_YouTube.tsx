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
    fullDetails: string;
    start: number;
}

export interface MessageState {
}

export default class Message_YouTube extends React.Component<MessageProps, MessageState> {
    constructor (props: MessageProps) {
        super(props);
    }

    componentDidMount () {
    }

    watchViaPost (postUrl, payload) {
        console.log('postUrl: ' + postUrl);
        
        Axios.post(postUrl, payload)
        .then(res => {
            console.log(res);
            console.log(res.data);

            return res.data;
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
            fullDetails,
            start
        } = this.props;

        var fromAvatar = '/images/avatars/'+ fromUsername + '-avatar-sm.png';
        var watchUrl = '/youtube/watch?v=' + videoId;
        watchUrl += channelId ? '&c=' + channelId : '';

        if (start) {
            watchUrl += '&t=' + start;
        }

        var jsonFieldName = videoId + '-json';

        return ( 
                <div className="col-md-4">
                    <form id={videoId} method="POST" action={watchUrl}>
                        <input id={jsonFieldName} name="videoDetailsFull" type="hidden" />
                        <div className="card mb-4 box-shadow" onClick={ e => this.watchViaPost(watchUrl, fullDetails) } >
                        {/* <div className="card mb-4 box-shadow"> */}
                            {/* <a href={watchUrl}> */}
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