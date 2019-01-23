import React from "react";
import {List, Avatar, Icon} from "antd";

const IconText = ({type, text}) => (
    <span>
    <Icon
        type={type}
        style={{
            marginRight: 8
        }}
    />
        {text}
  </span>
);

const Duels = props => {
    return (
        <List
            itemLayout="vertical"
            size="small"
            pagination={{
                onChange: page => {
                    console.log(page);
                },
                pageSize: 3
            }}
            dataSource={props.data}
            renderItem={item => (
                <List.Item
                    key={item.user1}
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar}/>}
                        title={<a href={`/duel/${item.id}`}>
                            {item.user1.username} vs {item.user2.username}</a>}
                    />
                    {item.content}
                </List.Item>
            )}
        />
    );
};

export default Duels;
