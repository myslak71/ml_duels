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

    fetchData = () => {
        const duelID = this.props.match.params.duelID;
        let ret=[]
        axios.get(`http://127.0.0.1:8000/api/duel/${duelID}`,
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
            .then(res => {
                ret= [res.data, this.fetchDataset(res.data.dataset)]
                console.log('qasd', ret)
            });
    }


    fetchDuel = () => {
        const duelID = this.props.match.params.duelID;
        let ret=[]
        axios.get(`http://127.0.0.1:8000/api/duel/${duelID}`,
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
            .then(res => {
                // this.setState({
                //     duel: res.data
                // });
                ret= [res.data, this.fetchDataset(res.data.dataset)]
                console.log('qasd', ret)
            });
    };

    fetchDataset = (datasetId) => {
        let dataset = null
        axios.get(`http://127.0.0.1:8000/api/dataset/${datasetId}`,
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
            .then(res => {
                // this.setState({
                //     dataset: res.data
                // });
                dataset = res.data
                console.log('ta', dataset)
            });
                        console.log('ta2', dataset)

        return dataset
    };

    fetchAlgorithms = () => {
        axios.get(`http://127.0.0.1:8000/api/algorithm/`,
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
            .then(res => {
                this.setState({
                    algorithms: res.data
                });
            });
    };


    componentDidMount() {
        console.log('siemas')
        console.log(this.fetchDuel())
        this.fetchAlgorithms()
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
        console.log(this.state)
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
