import * as React from "react";
import Axios from "axios";
import IUser from "../IUser";
import AddChannel from "./Channel_AddNew";

export interface Props {
    user: IUser;
}

export interface State {
    channelData: any[];
    addNew: boolean
}

export default class Channels extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            channelData: [],
            addNew: false
        }

        this.openAddChannel = this.openAddChannel.bind(this);
    }

    componentDidMount () {
    }

    componentWillUpdate (nextProps, nextState) {
        
        if (this.props.user != nextProps.user) {

            const reportUser = nextProps.user ? nextProps.user : this.props.user;

            let counts = [];


            if (reportUser)
                Axios.get('/channels/' + reportUser.username )
                .then(
                    (channels) => {

                        this.setState({
                            channelData: channels.data
                        });
                    }
                )
                .catch((err) => {
                    this.setState({
                        channelData: []
                    });
                    console.log('Error: ' + err);
                });

        }

    }

    openAddChannel () {
        this.setState({ addNew: true });
    }

    handleClose () {
        console.log('Handle close');
        // this.setState({ addNew: false });
    }

    render() {
        const {
        } = this.state;

        if (!this.props.user) {
            return (
                <div>No user selected</div>
            );
        }

        let channels = this.state.channelData.map( (ch) => 

            <div className="ch" key={ch.id}>
                {/* <div className="col-lg-3 col-md-3 col-sm-4 col-xs-6"> */}
                <div className="col">
                    <div className="dummy"><a href={'/youtube/videos/' + ch.channel_id}>
                        <div className="thumbnail">
                            <img src={ch.channel_data.snippet.thumbnails.default.url} width="44" height="44" />
                            {ch.channel_name}
                        </div></a>
                    </div>
                </div>
            </div>
        )

        return (
            <div>
                <b>Channels:</b>
                <div className="row">
                    <div className="col"> {channels} </div>
                    <div className="col">

                        <div className="add-channel">
                            <AddChannel user={this.props.user} onClose={this.handleClose} />
                        </div>
                            
                    </div>
                </div>
            </div>
        );
    }

}