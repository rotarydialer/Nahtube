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
                <h4>List and send messages.</h4>

                <p>Mock up?</p>

                

            {/* <MessageViewer /> */}
            </div>
        )
    }
}