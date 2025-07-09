import React from 'react';

import type { MenuProps } from 'antd';
import { Menu, Dropdown, theme } from 'antd';

import { UserOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';
// import calendarManager from "@src/services/calendarManager.service";
import calManager from '@src/services/calendarManager.service';

const itemsTS: MenuProps['items'] = [
  {
    label: 'Edit',
    onClick: (args: any) => {
      // console.log(calManager)
      calManager.renderUpdateTSModal(args);
      // dp.events.update(args.source).notify();
      // dp.editEvent(args.source);
    },
    key: 1,
  },
  {
    label: 'Cancel',
    onClick: (args: any) => {
      //   renderCancelTSModal(args)
      // app.deleteEvent(args.source);
    },
    key: 2,
  },
  {
    label: '-',
    key: 3,
  },
  {
    label: 'Create Appointment',
    onClick: (args: any) => {
      // console.log(args);
      //   renderUpdateModal(args)
      // handleTransferRequest(args)
      // app.duplicateEvent(args.source);
    },
    key: 4,
  },
];
const itemsAP: MenuProps['items'] = [
  {
    label: 'Edit',
    onClick: (args: any) => {
      //   renderUpdateModal(args)
      // dp.events.update(args.source).notify();
      // dp.editEvent(args.source);
    },
    key: 1,
  },
  {
    label: 'Cancel',
    onClick: (args: any) => {
      //   renderCancelModal(args)
      // app.deleteEvent(args.source);
    },
    key: 2,
  },
  {
    label: '-',
    key: 3,
  },
  {
    label: 'Transfer',
    onClick: (args: any) => {
      // console.log(args);
      //   renderTransferModal(args)
      // handleTransferRequest(args)
      // app.duplicateEvent(args.source);
    },
    key: 4,
  },
  {
    label: 'Status',
    children: [
      {
        label: 'No Show',
        icon: 'icon icon-noshow',
        key: 5,
        onClick: (args: any) => {},
      },
      {
        label: 'Arrived',
        icon: 'icon icon-arrived',
        onClick: (args: any) => {},
        key: 6,
      },
      {
        label: 'In Exam',
        icon: 'icon icon-inexam',
        onClick: (args: any) => {},
        key: 7,
      },
      {
        label: 'Checked Out',
        icon: 'icon icon-completed',
        onClick: (args: any) => {},
        key: 8,
      },
    ],
    key: 9,
  },
];
const Item = Menu.Item;
const menu = (value: any) => (
  <Menu>
    <Item>
      <UserOutlined />
      {value}
    </Item>
    <Item>
      <HeartOutlined /> Like it
    </Item>
    <Item>
      <StarOutlined /> Bookmark
    </Item>
  </Menu>
);

const menu1 = (value: any) => (
  <Dropdown overlay={menu(value)} trigger={[`contextMenu`]}>
    <div>{value}</div>
  </Dropdown>
);

const Menu2 = (props?: any) => {
  const {
    token: { colorBgLayout, colorTextTertiary },
  } = theme.useToken();

  const [openMenu, setOpenMenu] = React.useState(false);

  const items = props.event.type == 'timeslot' ? itemsTS : itemsAP;

  return (
    <div
      onContextMenu={(e) => {
        setOpenMenu(!openMenu);
        // alert(`${props.event.title} is clicked.`);
        e.preventDefault();
      }}
    >
      <Dropdown open={openMenu} menu={{ items }} trigger={['contextMenu']}>
        {props.children}
      </Dropdown>
    </div>
  );
};

export default { menu, menu1, Menu2 };
