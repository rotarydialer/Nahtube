import * as React from "react";
import Axios from "axios";
import IUser from "../IUser";
import * as Moment from 'moment';


interface ReportRow {
    action_date: Moment.Moment;
    watch_count: number;
    
}

export interface Props {
    user: IUser;
}

export interface State {
    reportRows: ReportRow[];
}

export default class BasicSummary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            reportRows: []
        }
    }

    componentDidMount () {
        this.setState( {reportRows: []} );
    }

    componentWillUpdate (nextProps, nextState) {
        
        if (this.state.reportRows.length <= 0 || this.props.user != nextProps.user) {

            const reportUser = nextProps.user ? nextProps.user : this.props.user;

            if (reportUser)
            Axios.get('/reports/user/summary/' + reportUser.username)
            .then(
                (reportData) => {

                    let rows = reportData.data.results.map( (row) => 

                        <div className="row" key={row.action_date}>
                            <div className="col-3 col-sm-5">Date: {Moment(row.action_date).format('ddd MMM Do')}</div>
                            <div className="col-4">Watched: {row.watch_count}</div>
                        </div>
                    )

                    this.setState({reportRows: rows});
                }
            )
            .catch((err) => {
                this.setState({reportRows: []});
                console.log('Error: ' + err);
            });

        }

    }

    render() {
        const {
            reportRows
        } = this.state;

        console.log(this.state.reportRows);

        if (this.state.reportRows.length <= 0) {
            return (
                <div>Select a user</div>
            );
        }

        return (
            <div>
                <div> {this.state.reportRows} </div>
            </div>
        );
    }

}