import React from "react";
import axios from "axios";
import Duels from "../components/Duel";
import AddDuelForm from "../components/AddDuelForm";


class DuelList extends React.Component {
    state = {
        duels: [],
        users: [],
        datasets: []
    };

    fetchDuels = () => {
        axios.get("http://127.0.0.1:8000/api/duel/user/",
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
            .then(res => {
                this.setState({
                    duels: res.data
                });
            });
    };

    fetchUsers = () => {
        axios.get("http://127.0.0.1:8000/api/user/",
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
            .then(res => {
                console.log(res.data)
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
        this.fetchDuels();
        this.fetchUsers();
        this.fetchDatasets();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.token) {
            this.fetchDuels();
            this.fetchUsers();
            this.fetchDatasets();
        }
    }

    render() {
        return (
            <div>
                <Duels data={this.state.duels}/> <br/>
                <h2> Add duel </h2>
                <AddDuelForm users={this.state.users} datasets={this.state.datasets} requestType="post" articleID={null}
                             btnText="Challenge"/>
            </div>
        );
    }
}

export default DuelList;
