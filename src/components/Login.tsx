import * as React from "react";

export interface LoginProps { 
    compiler?: string; 
    framework?: string; 
}

export interface LoginState {

}

export class Login extends React.Component<LoginProps, {}> {
    render() {
        return <div>This will be your login screen.</div>;
    }
}