import React from "react";
import axios from "axios";
import {connect} from "react-redux";
import {Button, Card} from "antd";
import AddDuelForm from "../components/AddDuelForm";


class DuelDetail extends React.Component {
    state = {
        duel: [],
        users: [],
        datasets: []
    };

    fetchUsers = () => {
        axios.get("http://127.0.0.1:8000/api/user/",
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
            .then(res => {
                this.setState({
                    users: res.data
                });
            });
    };

    fetchDatasets = () => {
        axios.get("http://127.0.0.1:8000/api/dataset/",
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
            .then(res => {
                this.setState({
                    datasets: res.data
                });
            });
    };

    componentDidMount() {
        const duelID = this.props.match.params.duelID;
        axios.get(`http://127.0.0.1:8000/api/duel/${duelID}`).then(res => {
            this.setState({
                duel: res.data
            });
        });
        this.fetchDatasets()
        this.fetchUsers()
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
        return (
            <div>
                <Card title={this.state.duel.id}>
                    <p> siema </p>
                </Card>
                <AddDuelForm
                    {...this.props}
                    token={this.props.token}
                    requestType="put"
                    articleID={this.props.match.params.duelID}
                    btnText="Update"
                    users={this.state.users}
                    datasets={this.state.datasets}
                />
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
