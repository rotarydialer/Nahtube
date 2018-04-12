import * as React from "react";
import Axios from "axios";
import IUser from "../IUser";

export interface Props {
    user: IUser;
}

export interface State {
}

export default class BasicSummary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
        }
    }

    componentDidMount () {
    }

    componentWillUpdate (nextProps, nextState) {
        
        if (this.props.user != nextProps.user) {

            const reportUser = nextProps.user ? nextProps.user : this.props.user;

            let counts = [];


            if (reportUser)
                Axios.get('/reports/user/watchcount/' + reportUser.username )
                .then(
                    (reportData) => {

                        let rows = reportData.data.results.map( (row) => {

                            counts.push(row.watch_count);

                            return <div className="row" key={row.action_date}>
                                <div className="col-4">Watched: {row.watch_count}</div>
                            </div>
                        })

                        this.setState({
                            
                        });
                    }
                )
                .catch((err) => {
                    this.setState({});
                    console.log('Error: ' + err);
                });

        }

    }

    render() {
        const {
        } = this.state;

        if (!this.props.user) {
            return (
                <div>No user selected</div>
            );
        }

        return (
            <div>
                <b>Channels:</b>
                {/* <div> {this.state.reportRows} </div> */}
            </div>
        );
    }

}