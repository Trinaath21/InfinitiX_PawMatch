import React from 'react';
import { List, Avatar, Space } from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';

const data = Array.from({ length: 10 }).map((_, i) => ({
    title: `Post ${i + 1}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    description: 'This is a sample description for the forum post.',
    content: 'This is a sample content of the forum post. You can add more detailed information here, including images, links, or other resources.',
}));

const IconText = ({ icon, text }) => ( <
    Space > { React.createElement(icon) } { text } <
    /Space>
);

const ForumList = () => ( <
        div style = {
            { padding: '24px', background: '#fff' } } >
        <
        List itemLayout = "vertical"
        size = "large"
        pagination = {
            {
                onChange: (page) => {
                    console.log(page);
                },
                pageSize: 3,
            }
        }
        dataSource = { data }
        renderItem = {
            (item) => ( <
                List.Item key = { item.title }
                actions = {
                    [
                        //<IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                        //<IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                        <
                        IconText icon = { MessageOutlined }
                        text = "2"
                        key = "list-vertical-message" / > ,
                    ]
                }
                extra = { <
                    img
                    width = { 272 }
                    alt = "logo"
                    src = "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" /
                    >
                } >
                <
                List.Item.Meta avatar = { < Avatar src = { item.avatar }
                    />}
                    title = { < a href = "https://ant.design" > { item.title } < /a>}
                        description = { item.description }
                        /> { item.content } <
                        /List.Item>
                    )
                }
                /> <
                /div>
            );

            export default ForumList;