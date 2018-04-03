import * as React from 'react';
import Axios from 'axios';
import UserSelectOption from './UserSelectOption';

export interface Props {
    defaultUser: string;
}

export interface State {
    users: string[];
    selectedUser: string;
}

export default class UserSelector extends React.Component<Props, State> {
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
                let usersFound = userData.data.map( (userFound) => 
                    
                    <UserSelectOption 
                        key={userFound.id} 
                        userid={userFound.id} 
                        username={userFound.username} 
                        common_name={userFound.common_name} 
                        roles={userFound.roles} 
                    />
                
                )

                this.setState({users: usersFound});
            }
        )
        .catch((err) => {
            console.log('Error getting users: ' + err);
        })

    }

    onSelectUser(selectedUser) {
        this.setState({
            selectedUser: selectedUser.target.value
        });
    }

    render() {
        const {
            selectedUser
        } = this.state;
        return (

            <div className="col-4">

                <select className="form-control" id="messageTo" onChange={this.onSelectUser} value={this.state.selectedUser}>
                    <option></option>
                    {this.state.users}
                </select>

            </div>

        )

    }
}