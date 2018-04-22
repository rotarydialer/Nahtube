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
    messageQueue: string;
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
        this.onRestore = this.onRestore.bind(this);
        this.onReply = this.onReply.bind(this);
    }

    onDelete (messageId, e) {
        console.log('Let\'s delete messageId ' + messageId + '...');

        const delUrl = '/messages/' + messageId;

        // show a confirmation modal.
        // delete if confirmed.

        Axios.delete(delUrl)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log('ERROR:' + err);
        });

    }

    onRestore (messageId, e) {
        console.log('Let\'s restore messageId ' + messageId + '...');

        const restoreUrl = '/messages/restore/' + messageId;

        // show a confirmation modal.
        // restore if confirmed.

        Axios.put(restoreUrl)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log('ERROR:' + err);
        });

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

            window.location.href = postUrl + '&logAct=no'; // this routes, but as a GET, so handle accordingly

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

        var actionButtons;
        
        if (this.props.messageQueue === 'inbox') {
            actionButtons = <div className="btn-group">
                                <div className="btn btn-sm btn-outline-secondary" onClick={(e) => {this.onReply(fromUsername, subject, e)}}>Reply</div>
                                <div className="btn btn-sm btn-outline-secondary" onClick={(e) => {this.onDelete(messageId, e)}}>Delete</div>
                            </div>
        }
        
        if (this.props.messageQueue === 'deleted') {
            actionButtons = <div className="btn-group">
                                <div className="btn btn-sm btn-outline-secondary" onClick={(e) => {this.onRestore(messageId, e)}}>Restore</div>
                            </div>
        }
        
        const displayActions = showRecipient ? '' : actionButtons;

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
                                <div className="small">{sentTime.format('MMMM Do YYYY, h:mma')}</div>
                                <div className="avatar-message"><span className="tolabel small text-muted">{toLabel}</span><img src={showAvatar} /></div>
                            <div className="d-flex justify-content-between align-items-center">

                                {displayActions}

                                <small className="text-muted">{sentTime.fromNow()}</small>
                            </div>
                            </div>
                        </div>
                    </form>
                </div>
        )
    }
}