import React from "react";
import axios from "axios";
import {connect} from "react-redux";
import {Button, Card} from "antd";
import DuelForm from "../components/DuelForm";


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

    fetchDataset = async (datasetId) => {
        return await axios.get(`http://127.0.0.1:8000/api/dataset/${datasetId}`,
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
        console.log(algorithms.data, duel.data, dataset.data)
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
        console.log('stat', this.state)
        return (
            <div>
                <Card title={this.state.duel.id}>
                    Hello
                </Card>

                <DuelForm requestType="post" algorithms={this.state.algorithms} duel={this.state.duel}
                          duelID={this.props.match.params.duelID}
                          btnText="Create"/>

                <form onSubmit={this.handleDelete}>
                    <Button type="danger" htmlType="submit">
                        Delete
                    </Button>
                </form>
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
