import React from "react";
import axios from "axios";
import {connect} from "react-redux";
import {Button, Tabs, Table, Divider, Tag} from "antd";
import DuelForm from "../components/DuelForm";
// import ScatterPlot from "../components/ScatterPlot"
// import Matrix from "react-d3-scatterplot-matrix"


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
        let columns = []
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
        ]

        return (
            <Table columns={columns} dataSource={data}/>
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
                    <Tabs.TabPane tab="Scatter plot" key="1">
                        {/*<ScatterPlot plotId="kMeans" data={data} centroids= {centroids} />*/}
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Histogram" key="2">Content2</Tabs.TabPane>
                    <Tabs.TabPane tab="Whisker plot" key="3">Content of Tab Pane 3</Tabs.TabPane>
                    <Tabs.TabPane tab="Data sample" key="4">
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
