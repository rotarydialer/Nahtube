import * as React from "react";
import * as Moment from "moment";
import UserSelectorRich from "../UserSelectorRich";
import IUser from "../IUser";

export interface Props {
}

export interface State {
    selectedUser: IUser;
}

export class UserManagement extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedUser: undefined
        }

        this.handleUserSelection = this.handleUserSelection.bind(this);
    }

    handleUserSelection(chosenUser: IUser) {
        this.setState({
            selectedUser: chosenUser
        })
    }

    render() {
        return (
            <div>
                User Management

                {/* <UserSelector defaultUser=''/> */}

                <UserSelectorRich 
                onSelectUser={this.handleUserSelection} />
            </div>
        )
    }
}