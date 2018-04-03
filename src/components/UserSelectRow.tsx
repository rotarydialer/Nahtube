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

export default class UserSelectRow extends React.Component<Props, State> {
    constructor (props: Props) {
        super(props);
    }

    render() {
        return (
                <option value={this.props.username}>{this.props.common_name}</option>
        )
    }


}