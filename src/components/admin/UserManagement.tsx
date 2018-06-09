import * as React from "react";
import * as Moment from "moment";
import UserSelectorRich from "../UserSelectorRich";
import IUser from "../IUser";
import BasicSummary from "./BasicSummary";
import Channels from "./Channels";
import Axios from "axios";

export interface Props {
}

export interface State {
    selectedUser: IUser;
    serverNow: Moment.Moment;
}

export class UserManagement extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedUser: undefined,
            serverNow: undefined
        }

        this.handleUserSelection = this.handleUserSelection.bind(this);
    }

    handleUserSelection(chosenUser: IUser) {
        this.setState({
            selectedUser: chosenUser
        })
    }

    componentDidMount() {
        Axios.get('/reports/now')
        .then(
            (reportData) => {
                let serverNow = reportData.data.results[0].now;

                this.setState({
                    serverNow: serverNow
                })
            }
        )
        .catch((err) => {
            console.error('Error: ' + err);
        });
    }

    render() {
        return (
            <div>
                User Management
                <div className="time-info"><b>Server time:</b> {this.state.serverNow ? Moment.parseZone(this.state.serverNow).format("MMMM Do YYYY, h:mm:ssa") : ''}</div>
                <div className="time-info"><b>Local time:</b> {Moment().format("MMMM Do YYYY, h:mm:ssa")}</div>

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