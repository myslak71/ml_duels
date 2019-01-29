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

    update = () => {
        const promises = [this.fetchDuels(), this.fetchUsers(), this.fetchDatasets()]
        Promise.all(promises).then(([duelsResponse, usersResponse, datasetsResponse]) => {
            this.setState({duels: duelsResponse.data, users: usersResponse.data, datasets: datasetsResponse.data});
        });
    }

    fetchDuels = () => {
        return axios.get("http://127.0.0.1:8000/api/duel/user/",
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
    };

    fetchUsers = () => {
        return axios.get("http://127.0.0.1:8000/api/user/",
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
    };

    fetchDatasets = () => {
        return axios.get("http://127.0.0.1:8000/api/dataset/",
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
    };

    componentDidMount() {
        const promises = [this.fetchDuels(), this.fetchUsers(), this.fetchDatasets()]
        console.log(promises)
        Promise.all(promises).then(([duelsResponse, usersResponse, datasetsResponse]) => {
            this.setState({duels: duelsResponse.data, users: usersResponse.data, datasets: datasetsResponse.data});
        });
    }


    render() {
        return (
            <div>
                <Duels data={this.state.duels}/> <br/>
                <h2> Add duel </h2>
                <AddDuelForm users={this.state.users} datasets={this.state.datasets} requestType="post" articleID={null}
                             btnText="Challenge" callBack={this.update}/>
            </div>
        );
    }
}

export default DuelList;
