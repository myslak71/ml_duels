import React from "react";
import axios from "axios";
import {connect} from "react-redux";
import {Button, Tabs} from "antd";
import DuelForm from "../components/DuelForm";
import ScatterPlot from "../components/ScatterPlot"
import Matrix from "react-d3-scatterplot-matrix"


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

    render() {
        if (this.state.duel.user1) {
            var title = `${this.state.duel.user1.username} vs ${this.state.duel.user2.username}`
        } else {
            var title = null
        }
        var data = [{"R": "74", "G": "85", "B": "123", "result": "skin"},
            {"R": "74", "G": "76", "B": "30", "result": "non-skin"},
            {"R": "30", "G": "27", "B": "23", "result": "non-skin"},
            {"R": "121", "G": "121", "B": "121", "result": "non-skin"},
            {"R": "181", "G": "178", "B": "133", "result": "non-skin"},
            {"R": "121", "G": "151", "B": "102", "result": "non-skin"},
            {"R": "103", "G": "141", "B": "199", "result": "skin"}]
        var centroids = [{"R": "74", "G": "85", "B": "123", "result": "skin"}]
        console.log(data)
        console.log(this.state.dataset.data)
        return (
            <div>
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab="Scatter plot" key="1">
                    <ScatterPlot plotId="kMeans" data={data} centroids= {centroids} />
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Histogram" key="2">Content2</Tabs.TabPane>
                    <Tabs.TabPane tab="Whisker plot" key="3">Content of Tab Pane 3</Tabs.TabPane>
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
                {this.state.dataset.data}
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
