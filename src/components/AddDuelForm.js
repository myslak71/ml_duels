import React from "react";
import {Form, Button, Select} from "antd";
import {connect} from "react-redux";
import axios from "axios";

const FormItem = Form.Item;


class AddDuelForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user1: null,
            dataset: null
        };
        this.handleUserChange = this.handleUserChange.bind(this)
        this.handleUserDataset = this.handleUserDataset.bind(this)
    }


    handleFormSubmit = async (event, requestType, duelID) => {
        event.preventDefault();

        const postObj = {
            user1: this.state.user1,
            dataset: this.state.dataset,
            rounds: [],
        };
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${this.props.token}`,
        };
        
        axios.post("http://127.0.0.1:8000/api/duel/create/", postObj)
            .then(res => {
                if (res.status === 201) {
                    this.props.callBack()
                }
            })

    };

    handleUserChange(value) {
        this.setState({user1: value})
    }

    handleUserDataset(value) {
        this.setState({dataset: value})
    }

    render() {
        return (
            <div>
                <Form
                    onSubmit={event =>
                        this.handleFormSubmit(
                            event,
                        )
                    }
                >
                    <FormItem label="User"><Select name="user1" onChange={this.handleUserChange}>
                        {this.props.users.map(user => <Select.Option
                            value={user.id}>{user.username}</Select.Option>)}
                    </Select></FormItem>

                    <FormItem label="Dataset"><Select name="dataset" onChange={this.handleUserDataset}>
                        {this.props.datasets.map(dataset => <Select.Option
                            value={dataset.id}>{dataset.name}</Select.Option>)}
                    </Select></FormItem>

                    <FormItem>
                        <Button type="primary" htmlType="submit">
                            {this.props.btnText}
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        token: state.token
    };
};

export default connect(mapStateToProps)(AddDuelForm);
