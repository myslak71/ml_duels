import React from "react";
import axios from "axios";
import {connect} from "react-redux";
import {Button, Tabs, Table, Divider, Tag, Card} from "antd";
import DuelForm from "../components/DuelForm";
// import ScatterPlot from "../components/ScatterPlot"
// import Matrix from "react-d3-scatterplot-matrix"
import {Histogram, DensitySeries, BarSeries, withParentSize, XAxis, YAxis} from '@data-ui/histogram';
import {XYChart, CrossHair, LinearGradient, BoxPlotSeries} from '@data-ui/xy-chart';

class DuelDetail extends React.Component {
    state = {
        duel: [],
        dataset: [],
        algorithms: []
    };

    fetchDuel = () => {
        const duelID = this.props.match.params.duelID;
        return axios.get(`http://127.0.0.1:8000/api/duel/${duelID}`,
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
    };

    fetchDataset = (datasetId) => {
        return axios.get(`http://127.0.0.1:8000/api/dataset/${datasetId}`,
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})

    };

    fetchAlgorithms = () => {
        return axios.get(`http://127.0.0.1:8000/api/algorithm/`,
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
    };


    async componentDidMount() {
        let algorithms = await this.fetchAlgorithms()
        let duel = await this.fetchDuel()
        let dataset = await this.fetchDataset(duel.data.dataset)
        this.setState({
            duel: duel.data,
            dataset: dataset.data,
            algorithms: algorithms.data
        });
    }

    handleDelete = event => {
        event.preventDefault();
        const duelID = this.props.match.params.duelID;
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${this.props.token}`
        };
        axios.delete(`http://127.0.0.1:8000/api/duel/${duelID}/delete/`)
            .then(res => {
                if (res.status === 204) {
                    this.props.history.push(`/`);
                }
            })
    };

    getDataSample = () => {
        if (this.state.dataset.data === undefined) {
            return null
        }
        const column_names = [];
        Object.entries(this.state.dataset.data[0]).map(([column, value]) => {
            column_names.push(column)
        });
        const columns = [];
        column_names.forEach(function (column_name) {
            columns.push(
                {
                    title: column_name,
                    dataIndex: column_name,
                    key: column_name
                }
            )
        });

        return (
            <Table columns={columns} dataSource={this.state.dataset.data}/>
        )
    }

    getPresentation = () => {
        if (this.state.duel.user1 === undefined) {
            return null
        }

        const column_names = ['User', 'Round 1', 'Round 2', 'Round 3'];
        let columns = [];
        column_names.forEach(function (column_name) {
            columns.push(
                {
                    title: column_name,
                    dataIndex: column_name,
                    key: column_name
                }
            )
        });


        const data = [
            {
                'User': this.state.duel.user1.username,
                'Round 1': this.state.duel.user1_percentage[0],
                'Round 2': this.state.duel.user1_percentage[1],
                'Round 3': this.state.duel.user1_percentage[2],
            },
            {
                'User': this.state.duel.user2.username,
                'Round 1': this.state.duel.user2_percentage[0],
                'Round 2': this.state.duel.user2_percentage[1],
                'Round 3': this.state.duel.user2_percentage[2],
            }
        ];

        return (
            <Card
                style={{width: 400}}
                bordered={false}
            >
                < Table
                    size="small"
                    pagination={false}
                    columns={columns}
                    dataSource={data}
                />
            </Card>

        )
    };


    getWhiskerPlot = () => {
        const timeSeriesData = [12, 54, 564,2,12,34,23]
        return (
            <XYChart
  ariaLabel="Bar chart showing ..."
  width={400}
  height={400}
  xScale={{ type: 'time' }}
  yScale={{ type: 'linear' }}
  renderTooltip={({ event, datum, data, color }) => (
    <div>
      <strong style={{ color }}>{datum.label}</strong>
      <div>
        <strong>x </strong>
        {datum.x}
      </div>
      <div>
        <strong>y </strong>
        {datum.y}
      </div>
    </div>
  )}
  snapTooltipToDataX
>
  <LinearGradient id="my_fancy_gradient" from={'#000000'} to={"#ffffff"} />
  <XAxis label="X-axis Label" />
  <YAxis label="Y-axis Label" />
  <BarSeries data={timeSeriesData} fill="url('#my_fancy_gradient')" />
  <CrossHair showHorizontalLine={false} fullHeight stroke="pink" />
</XYChart>
    )
    }

    getHistogram = (inputColor) => {
        if (this.state.dataset.data === undefined) {
            return null
        }
        const ResponsiveHistogram = withParentSize(({parentWidth, parentHeight, ...rest}) => {
            return (

                <Histogram
                    width={1200}
                    height={650}
                    {...rest}
                />
            )
        })
        let fill = null
        if (inputColor === 'R') {
            fill = "#ff0000"
        } else if (inputColor === 'G') {
            fill = "#00ff00"
        } else {
            fill = '#0000ff'
        }

        const colorData = [];
        this.state.dataset.data.forEach(function (row) {
            colorData.push(row[inputColor] * 1)
        })
        // const colorData = Array(100).fill().map(Math.random);
        return (
            <ResponsiveHistogram
                ariaLabel={inputColor}
                orientation="vertical"
                cumulative={false}
                normalized={false}
                binCount={75}
                binType="numeric"
                renderTooltip={({event, datum, data, color}) => (
                    <div>
                        <strong style={{color}}>{datum.bin0} to {datum.bin1}</strong>
                        <div><strong>count </strong>{datum.count}</div>
                        <div><strong>cumulative </strong>{datum.cumulative}</div>
                        <div><strong>density </strong>{datum.density}</div>
                    </div>
                )}
            >
                <BarSeries
                    animated={true}
                    fill={fill}
                    fillOpacity={0.3}
                    strokeWidth={0}
                    rawData={colorData}
                />
                <DensitySeries
                    stroke={fill}
                    showArea={false}
                    smoothing={0.01}
                    kernel="parabolic"
                    rawData={colorData}
                />
                <XAxis/>
                <YAxis/>
            </ResponsiveHistogram>
        )
    }


    render() {

        console.log(this.state.duel)
        if (this.state.duel.user1) {
            var title = `${this.state.duel.user1.username} vs ${this.state.duel.user2.username}`
        } else {
            var title = null
        }
        return (
            <div>
                {this.getPresentation()}
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Data sample" key="1">
                        {this.getDataSample()}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Histogram" key="2">
                        <Tabs defaultActiveKey="1" tabPosition="left">
                            <Tabs.TabPane tab="R" key="1">
                                {this.getHistogram('R')}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="G" key="2">
                                {this.getHistogram('G')}
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="B" key="3">
                                {this.getHistogram('B')}
                            </Tabs.TabPane>
                        </Tabs>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Whisker plot" key="3">
                        {this.getWhiskerPlot()}                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Scatter matrix" key="4">
                        {this.getDataSample()}
                    </Tabs.TabPane>
                </Tabs>
                <DuelForm requestType="post" algorithms={this.state.algorithms} duel={this.state.duel}
                          duelID={this.props.match.params.duelID}
                          btnText="Create"/>

                <form onSubmit={this.handleDelete}>
                    <Button type="danger" htmlType="submit">
                        Delete
                    </Button>
                </form>
                {this.state.dataset.name}<br/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.token
    };
};

export default connect(mapStateToProps)(DuelDetail);
