import React from 'react';
import { List, Avatar } from 'antd';
import IconText from './IconText'; // Import the IconText component
import { MessageOutlined } from '@ant-design/icons';

const ForumPostList = ({ data }) => (
  <List
    itemLayout="vertical"
    size="large"
    pagination={{ pageSize: 3 }}
    dataSource={data}
    renderItem={(item) => (
      <List.Item
        key={item.title}
        actions={[<IconText icon={MessageOutlined} text="2" key="list-vertical-message" />]}
        extra={<img width={272} alt="logo" src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />}
      >
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} />}
          title={<a href={item.href}>{item.title}</a>}
          description={item.description}
        />
        {item.content}
      </List.Item>
    )}
  />
);

export default ForumPostList;
