import * as React from "react";
import LoginKids from "./LoginKids";

export interface LoginProps { 
    compiler?: string; 
    framework?: string; 
}

export interface LoginState {

}

export class Login extends React.Component<LoginProps, {}> {
    render() {
        return ( 
            <div>
                <h1>This will be your login screen.</h1>

            <LoginKids />
            </div>
        )
    }
}