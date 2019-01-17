import React from "react";
import {Form, Button, Select} from "antd";
import {connect} from "react-redux";
import axios from "axios";

const FormItem = Form.Item;


class AddDuelForm extends React.Component {

    handleFormSubmit = async (event, requestType, duelID) => {
        event.preventDefault();

        const postObj = {
            title: event.target.elements.title.value,
            content: event.target.elements.content.value
        };

        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${this.props.token}`,
        };

        if (requestType === "post") {
            await axios.post("http://127.0.0.1:8000/api/duel/create/", postObj)
                .then(res => {
                    if (res.status === 201) {
                        this.props.history.push(`/`);
                    }
                })
        } else if (requestType === "put") {
            await axios.put(`http://127.0.0.1:8000/api/duel/${duelID}/update/`, postObj)
                .then(res => {
                    if (res.status === 200) {
                        this.props.history.push(`/`);
                    }
                })
        }
    };

    render() {
        return (
            <div>
                <Form
                    onSubmit={event =>
                        this.handleFormSubmit(
                            event,
                            this.props.requestType,
                            this.props.articleID
                        )
                    }
                >
                    <FormItem label="User"><Select name="user1">
                        {this.props.users.map(user => <Select.Option
                            value={user.username}>{user.username}</Select.Option>)}
                    </Select></FormItem>

                    <FormItem label="Dataset"><Select name="dataset">
                        {this.props.datasets.map(dataset => <Select.Option
                            value={dataset.username}>{dataset.name}</Select.Option>)}
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
