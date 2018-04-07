import * as React from 'react';
import Axios from 'axios';
import UserSelectRichRow from './UserSelectRichRow';

interface IUser {
    id: number;
    username: string;
    common_name: string;
    roles: string[];
}

export interface Props {
    defaultUser: string;
}

export interface State {
    users: IUser[];
    selectedUser: string;
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
        if (this.props.defaultUser) {
            this.setState({
                selectedUser: this.props.defaultUser
            });
        }
    }

    componentDidMount () {
        Axios.get('/users')
        .then(
            (userData) => {
                // let usersFound = userData.data.map( (userFound) => 
                    
                    // <UserSelectRichRow 
                    //     key={userFound.id} 
                    //     userid={userFound.id} 
                    //     username={userFound.username} 
                    //     common_name={userFound.common_name} 
                    //     roles={userFound.roles} 
                    // />

                //     <div onClick={() => this.clickOnUser(userFound.username)} key={userFound.id} id={userFound.id} data-value={userFound.id} className="user-row-rich-select">
                //         <span><img src={'/images/avatars/' + userFound.username + '-avatar-sm-png'} /></span>
                //         <span>{userFound.common_name}</span>
                //     </div>
                // )

                let usersFound = userData.data;

                this.setState({users: usersFound});
                //this.setState({users: userData.data});
            }
        )
        .catch((err) => {
            console.log('Error getting users: ' + err);
        })

    }

    clickOnUser(clickedUser) {
        console.log(clickedUser);
    }

    onSelectUser(selectedUser) {
        console.log('Clicked on "%s"', selectedUser);
        this.setState({
            selectedUser: selectedUser.target.value
        });
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
            <div className="col-4">

                <div className="form-control" id="selectedUser">
                    
                    {/* {this.state.users} */}
                    { this.state.users.map(user => {

                        return (
                            <div>{user.username}</div>
                        )

                    })}

                    {console.log(this.state.users)}
                    
                </div>

            </div>
        )

    }
}