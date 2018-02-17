import * as React from "react";

export interface Props { 
}

export interface State {
    listOfKidUsers: string[]
}

export default class LoginKids extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            listOfKidUsers: []
        }
    };


    render() {
        return (
            <div>Kids will login here.</div>
        );
    }
}