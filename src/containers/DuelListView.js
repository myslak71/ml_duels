import React from "react";
import axios from "axios";
import Duels from "../components/Duel";
import CustomForm from "../components/Form";


class DuelList extends React.Component {
    state = {
        duels: []
    };

    fetchDuels = () => {
        axios.get("http://127.0.0.1:8000/api/duel/user/",
            {'headers': {'Authorization': `Token ${localStorage.getItem('token')}`}})
            .then(res => {
                this.setState({
                    duels: res.data
                });
            });
    }

    componentDidMount() {
        this.fetchDuels();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.token) {
            this.fetchDuels();
        }
    }

    render() {
        return (
            <div>
                <Duels data={this.state.duels}/> <br/>
                <h2> Add duel </h2>
                <CustomForm requestType="post" articleID={null} btnText="Create"/>
            </div>
        );
    }
}

export default DuelList;
