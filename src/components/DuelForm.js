import React from "react";
import {Form, Button, Select, InputNumber} from "antd";
import {connect} from "react-redux";
import axios from "axios";

const FormItem = Form.Item;


class DuelForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            algorithm: [],
            parameters: [],
            dataset: []
        };
        this.handleAlgorithmChange = this.handleAlgorithmChange.bind(this)
        this.handleParameterChange = this.handleParameterChange.bind(this)
    }


    handleFormSubmit = async (event, requestType) => {
        event.preventDefault();
        const duelID = this.props.duelID
        const postObj = {
            user1: this.state.user1,
            dataset: this.state.dataset,
        };

        const algorithm = {
            name: this.state.algorithm,
            parameters: this.state.parameters,
        }

        const duel = {
            dataset: this.props.duel.dataset,
            user1: this.props.duel.user1.id
        }
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${this.props.token}`,
        };

        axios.post("http://127.0.0.1:8000/api/algorithm/create/", algorithm)
            .then(res => {
                duel.algorithm = res.data.id
                return duel
            }).then(duel => {
            axios.put(`http://127.0.0.1:8000/api/duel/${duelID}/update/`, duel)
                .then(res => {
                })
        })
        this.props.callBack()

    };

    handleAlgorithmChange(value) {
        let parameters = [];
        this.props.algorithms.filter((algorithm) => {
            if (algorithm.name === value) {
                parameters = algorithm.parameters
            }
        })
        this.setState({algorithm: value, parameters: parameters})
    }

    handleParameterChange(parameter, value) {
        let stateClone = this.state.parameters
        stateClone[parameter] = value
        this.setState(stateClone)
    }


    renderParameters() {
        if (this.state.parameters) {
            console.log(this.state.parameters)
            return (
                Object.entries(this.state.parameters).map(([parameter, defaultValue]) => {
                    return (
                        <FormItem label={parameter}>
                            <InputNumber
                                value={defaultValue}
                                name={parameter}
                                onChange={(value) => this.handleParameterChange(parameter, value)}
                            />
                        </FormItem>
                    );
                })
            )
        }
    }


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
                    <FormItem label="Algorithm">
                        <Select name="user1" defaultValue="Choose an algorithm"
                                onChange={this.handleAlgorithmChange}>
                            {this.props.algorithms.map(algorithm =>
                                <Select.Option
                                    value={algorithm.name}
                                >{algorithm.name_display}</Select.Option>)}
                        </Select></FormItem>
                    <Form layout="inline">
                        {this.renderParameters()}
                    </Form>
                    <FormItem>
                        <Button type="primary" htmlType="submit">
                            Update duel
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

export default connect(mapStateToProps)(DuelForm);
