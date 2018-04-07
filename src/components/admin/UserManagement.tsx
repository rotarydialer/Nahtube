import * as React from "react";
import * as Moment from "moment";

//import UserSelector from "../UserSelector";
import UserSelectorRich from "../UserSelectorRich";

export interface Props {
}

export interface State {
    selectedUser: string;
}

export class UserManagement extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedUser: undefined
        }
    }

    render() {
        return (
            <div>
                User Management

                {/* <UserSelector defaultUser=''/> */}

                <UserSelectorRich defaultUser=''/>
            </div>
        )
    }
}