import * as React from "react";
//import MessageViewer from "./MessageViewer";

export interface MessagesProps { 
}

export interface MessagesState {
    username: string;

}

export class Messages extends React.Component<MessagesProps, {}> {
    render() {
        return ( 
            <div>
                <h1>List and send messages.</h1>

            {/* <MessageViewer /> */}
            </div>
        )
    }
}