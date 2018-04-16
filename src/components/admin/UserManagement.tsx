import * as React from "react";
import * as Moment from "moment";
import UserSelectorRich from "../UserSelectorRich";
import IUser from "../IUser";
import BasicSummary from "./BasicSummary";
import Channels from "./Channels";

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

                <div className="row">
                    <div className="col-lg-3 col-md-4 col-sm-5">
                        <UserSelectorRich onSelectUser={this.handleUserSelection} />
                    </div>
                    <div className="col">
                        <div className="row">
                            <BasicSummary user={this.state.selectedUser} />
                        </div>

                        <div className="row">
                            <Channels user={this.state.selectedUser} />
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}