import * as React from 'react';
import Axios from 'axios';

export interface Props {
    userid: number;
    username: string;
    common_name: string;
    roles: string[];
}

export interface State {
}

export default class UserSelectRichRow extends React.Component<Props, State> {
    constructor (props: Props) {
        super(props);
    }

    render() {
        return (
                <div id={this.props.username} data-value={this.props.username} className="user-row-rich-select">
                    <div><img src={'/images/avatars/' + this.props.username + '-avatar-sm-png'} /></div>
                    <div>{this.props.common_name}</div>
                </div>
        )
    }

}