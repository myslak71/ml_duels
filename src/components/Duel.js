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
            console.log(props.data)

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
                    actions={[
                        <IconText type="star-o" text="156"/>,
                        <IconText type="like-o" text="156"/>,
                        <IconText type="message" text="2"/>
                    ]}
                    extra={
                        <img
                            width={272}
                            alt="logo"
                            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                        />
                    }
                >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar}/>}
                        title={<a href={`/duel/${item.id}`}> {item.user1} vs {item.user2} </a>}
                        description={item.description}
                    />
                    {item.content}
                </List.Item>
            )}
        />
    );
};

export default Duels;
