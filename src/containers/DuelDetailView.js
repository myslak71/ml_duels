import React from "react";
import axios from "axios";
import {connect} from "react-redux";
import {Button, Tabs, Table, Divider, Tag, Card} from "antd";
import DuelForm from "../components/DuelForm";
import {Histogram, DensitySeries, BarSeries, withParentSize, XAxis, YAxis} from '@data-ui/histogram';
import {XYChart, CrossHair, LinearGradient, BoxPlotSeries, PatternLines} from '@data-ui/xy-chart';
import {genStats} from "@vx/mock-data";
import * as stats from 'statsjs'
import ScatterPlot from "../components/ScatterPlot";
import Matrix from 'react-d3-scatterplot-matrix'
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

    update = async() => {
        let algorithms =  await this.fetchAlgorithms();
        let duel =  await this.fetchDuel();
        let dataset =  await this.fetchDataset(duel.data.dataset);
        this.setState({
            duel: duel.data,
            dataset: dataset.data,
            algorithms: algorithms.data
        });
    }

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


    renderBoxPlotTooltip({datum, color}) {
        const {x, y, min, max, median, firstQuartile, thirdQuartile, outliers} = datum;

        const label = x || y;

        return (
            <div>
                <div>
                    <strong style={{color}}>{label}</strong>
                </div>
                {min && (
                    <div>
                        <strong style={{color}}>Min </strong>
                        {min && min.toFixed ? min.toFixed(2) : min}
                    </div>
                )}
                {max && (
                    <div>
                        <strong style={{color}}>Max </strong>
                        {max && max.toFixed ? max.toFixed(2) : max}
                    </div>
                )}
                {median && (
                    <div>
                        <strong style={{color}}>Median </strong>
                        {median && median.toFixed ? median.toFixed(2) : median}
                    </div>
                )}
                {firstQuartile && (
                    <div>
                        <strong style={{color}}>First quartile </strong>
                        {firstQuartile && firstQuartile.toFixed ? firstQuartile.toFixed(2) : firstQuartile}
                    </div>
                )}
                {thirdQuartile && (
                    <div>
                        <strong style={{color}}>Third quartile </strong>
                        {thirdQuartile && thirdQuartile.toFixed ? thirdQuartile.toFixed(2) : thirdQuartile}
                    </div>
                )}
                {outliers && outliers.length > 0 && (
                    <div>
                        <strong style={{color}}># Outliers </strong>
                        {outliers.length}
                    </div>
                )}
            </div>
        );
    }

    getWhiskerPlot = () => {
        if (this.state.dataset.data === undefined) {
            return null
        }
        let rgbArrays = [[], [], []]

        this.state.dataset.data.forEach(function (el) {
            rgbArrays[0].push(parseInt(el['R']))
            rgbArrays[1].push(parseInt(el['G']))
            rgbArrays[2].push(parseInt(el['B']))
        })

        rgbArrays = rgbArrays.map(array => stats(array))
        let boxPlotObjects = []


        let rgb = ['B', 'G', 'R']
        rgbArrays.forEach(function (colorArray) {
            let fill = null
            if (rgb[rgb.length - 1] === 'R') {
                fill = "#ff0000"
            } else if (rgb[rgb.length - 1] === 'G') {
                fill = "#00ff00"
            } else {
                fill = "#0000ff"
            }
            boxPlotObjects.push(
                {
                    x: rgb.pop(),
                    min: colorArray.min(),
                    max: colorArray.max(),
                    median: colorArray.median(),
                    outliers: [],
                    firstQuartile: colorArray.q1(),
                    thirdQuartile: colorArray.q3(),
                    fill: fill,
                    fillOpacity: 0.3
                }
            )
        })

        let arrayData = genStats(5)
        arrayData = arrayData.map(el => el.boxPlot)
        arrayData.forEach(function (el) {
            el.outliers = []
        })

        return (
            <XYChart
                height={650}
                width={1200}
                ariaLabel="Whisker plot"
                xScale={{type: "band"}}
                yScale={{type: "linear", domain: [0, 300]}}
                showXGrid
                showYGrid
                renderTooltip={this.renderBoxPlotTooltip}
            >
                <BoxPlotSeries data={boxPlotObjects}/ >
                <XAxis label=""/>
                <YAxis label="Value"/>
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
        });
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

        if (this.state.duel.user1) {
            const title = `${this.state.duel.user1.username} vs ${this.state.duel.user2.username}`
        } else {
            const title = null
        }
        const data = [
  {
    "0" : 152.9655172413793,
    "1" : 474.82758620689657,
    "2" : 120.41379310344827,
    "centroid" : 0
  }
]
         const centroid = [
  {
    "centroid" : 0
  }
]
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
                        {this.getWhiskerPlot()}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Scatter matrix (work in progress)" key="4">
                     <Matrix plotId="kMeans" data={data} centroids= {centroid}/>
                    </Tabs.TabPane>
                </Tabs>
                <DuelForm requestType="post" algorithms={this.state.algorithms} duel={this.state.duel}
                          duelID={this.props.match.params.duelID}
                          btnText="Create" callBack={this.update}/>

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
