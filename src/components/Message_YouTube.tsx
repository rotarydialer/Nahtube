import * as React from "react";
import { watch } from "fs";
import Axios from 'axios';
import * as Moment from 'moment';

export interface MessageProps { 
    messageId: number;
    subject: string;
    body: string;
    fromUsername: string;
    toUsername: string;
    videoId: string;
    thumbnail: string;
    channelId: string;
    videoDetailsFull: string;
    start: number;
    sentTime: Moment.Moment;
    showRecipient: boolean;
}

export interface MessageState {
}

export interface MessageProps {
    onReply: (toUsername: string, subject: string) => void;
}

export default class Message_YouTube extends React.Component<MessageProps, MessageState> {
    constructor (props: MessageProps) {
        super(props);

        this.onDelete = this.onDelete.bind(this);
        this.onReply = this.onReply.bind(this);
    }

    onDelete (messageId, e) {
        console.log('Let\'s delete messageId ' + messageId + '...');

        // show a confirmation modal.
        // delete if confirmed.
    }

    onReply (toUsername, subject, e) {
        console.log('Let\'s reply to ' + toUsername + '...');

        console.log(this.props);

        this.props.onReply(toUsername, subject);
        // show a confirmation modal.
        // delete if confirmed.
    }

    componentWillMount () {
        this.setState({
        });
    }

    watchViaPost (postUrl, payload) {
        
        Axios.post(postUrl, payload)
        .then(res => {
            //console.log(res);
            //console.log(res.data);

            window.location.href = postUrl; // this routes, but as a GET, so handle accordingly

        })
        .catch(err => {
            console.log('ERROR:' + err);
        });
    }

    render() {
        const {
            messageId,
            subject,
            body,
            fromUsername,
            toUsername,
            videoId,
            thumbnail,
            channelId,
            videoDetailsFull,
            start,
            sentTime,
            showRecipient,
        } = this.props;

        var fromAvatar = '/images/avatars/'+ fromUsername + '-avatar-sm.png';
        var toAvatar = '/images/avatars/'+ toUsername + '-avatar-sm.png';
        var showAvatar = showRecipient ? toAvatar : fromAvatar;
        var toLabel = showRecipient ? 'Sent to ' + toUsername : '';
        var watchUrl = '/youtube/watch?v=' + videoId;
        watchUrl += channelId ? '&c=' + channelId : '';

        if (start) {
            watchUrl += '&t=' + start;
        }

        console.log('message render');
        console.log(sentTime);

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
                                <div className="small">{sentTime.format('MMMM Do YYYY, h:mma')} ({sentTime.fromNow()})</div>
                                <div className="avatar-message"><span className="tolabel small">{toLabel}</span><img src={showAvatar} /></div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="btn-group">
                                    <div className="btn btn-sm btn-outline-secondary" onClick={(e) => {this.onReply(fromUsername, subject, e)}}>Reply</div>
                                    <div className="btn btn-sm btn-outline-secondary" onClick={(e) => {this.onDelete(messageId, e)}}>Delete</div>
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