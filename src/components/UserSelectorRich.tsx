import * as React from 'react';
import Axios from 'axios';
import UserSelectRichRow from './UserSelectRichRow';
import IUser from "./IUser";

export interface Props {
    //defaultUser: IUser;
    onSelectUser: (selectedUser: IUser) => void;
}

export interface State {
    users: IUser[];
    selectedUser: IUser;
}

export default class UserSelectorRich extends React.Component<Props, State> {
        constructor (props: Props) {
        super(props);

        this.state = {
            users: [],
            selectedUser: undefined
        }

        this.onSelectUser = this.onSelectUser.bind(this);
    }

    componentWillMount() {
        //if (this.props.defaultUser) {
            //console.log('Default to "%s".', this.props.defaultUser);
            // this.setState({
            //     selectedUser: this.props.defaultUser
            // });
        //}
    }

    componentDidMount () {
        Axios.get('/users')
        .then(
            (userData) => {
                let usersFound = userData.data;

                this.setState({users: usersFound});
            }
        )
        .catch((err) => {
            console.log('Error getting users: ' + err);
        })

    }

    clickOnUser(clickedUser) {
        console.log(clickedUser);
        this.setState({
            selectedUser: clickedUser
        });
    }

    onSelectUser(selectedUser: IUser) {
        this.setState({
            selectedUser: selectedUser
        });
        this.props.onSelectUser(selectedUser);
    }

    render() {
        const {
            users,
            selectedUser
        } = this.state;

        if (users.length <= 0) {
            return (<div>No users</div>)
        }

        return (
            <div>

                <div className="form-control" id="selectedUser">
                    {/* User selector */}
                    { this.state.users.map(user => {

                        const classnames = (selectedUser === user) ? 'active list-group-item list-group-item-action' : 'list-group-item list-group-item-action';

                        return (
                            <div onClick={() => this.onSelectUser(user)} key={user.id} id={user.id.toString()} data-value={user.id} className={classnames}>
                                <span><img src={'/images/avatars/' + user.username + '-avatar-sm.png'} /></span> &nbsp;
                                <span>{user.common_name}</span>
                            </div>
                        )

                    })}                    
                </div>

            </div>
        )

    }
}