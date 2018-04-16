import * as React from "react";
import Axios from "axios";
import IUser from "../IUser";
import * as Moment from 'moment';

let LineChart = require("react-chartjs").Line;


interface ReportRow {
    action_date: Moment.Moment;
    watch_count: number;
}

export interface Props {
    user: IUser;
}

export interface State {
    reportRows: ReportRow[];
    labels: Moment.Moment[];
    dataPoints: number[];
    reportStart: Moment.Moment;
}

export default class BasicSummary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            reportRows: [],
            labels: [],
            dataPoints: [],
            reportStart: Moment().subtract(1, 'months')
        }
    }

    componentDidMount () {
        this.setState( {reportRows: []} );
    }

    componentWillUpdate (nextProps, nextState) {
        
        if (this.state.reportRows.length <= 0 || this.props.user != nextProps.user) {

            const reportUser = nextProps.user ? nextProps.user : this.props.user;

            let actionDates = [];
            let counts = [];

            let reportStart = this.state.reportStart;

            if (reportUser)
                Axios.get('/reports/user/watchcount/' + reportUser.username + '/' + reportStart.utc().format("YYYY-MM-DD"))
                .then(
                    (reportData) => {

                        let rows = reportData.data.results.map( (row) => {

                            actionDates.push(Moment(row.action_date).format("M/D"));
                            counts.push(row.watch_count);

                            return <div className="row" key={row.action_date}>
                                <div className="col-3 col-sm-5">Date: {Moment(row.action_date).format('ddd MMM Do')}</div>
                                <div className="col-4">Watched: {row.watch_count}</div>
                            </div>
                        })

                        this.setState({
                            reportRows: rows,
                            labels: actionDates,
                            dataPoints: counts
                        });
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

        if (this.state.reportRows.length <= 0) {
            return (
                <div></div>
            );
        }

        let exampleChartData = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        let chartData = {
            labels: this.state.labels,
            datasets: [
                {
                    label: "Videos watched",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: this.state.dataPoints
                }
            ]
        };

        let chartOptions = {
            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines : true,
        
            //String - Colour of the grid lines
            scaleGridLineColor : "rgba(0,0,0,.05)",
        
            //Number - Width of the grid lines
            scaleGridLineWidth : 1,
        
            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,
        
            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,
        
            //Boolean - Whether the line is curved between points
            bezierCurve : true,
        
            //Number - Tension of the bezier curve between points
            bezierCurveTension : 0.4,
        
            //Boolean - Whether to show a dot for each point
            pointDot : true,
        
            //Number - Radius of each point dot in pixels
            pointDotRadius : 4,
        
            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth : 1,
        
            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius : 20,
        
            //Boolean - Whether to show a stroke for datasets
            datasetStroke : true,
        
            //Number - Pixel width of dataset stroke
            datasetStrokeWidth : 2,
        
            //Boolean - Whether to fill the dataset with a colour
            datasetFill : true,
        
            //Boolean - Whether to horizontally center the label and point dot inside the grid
            offsetGridLines : false
        };

        return (
            <div>
                <LineChart data={chartData} options={chartOptions} width="800" height="350" />
                {/* <div> {this.state.reportRows} </div> */}
            </div>
        );
    }

}