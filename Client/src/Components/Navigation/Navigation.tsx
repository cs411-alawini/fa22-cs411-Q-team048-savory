import React, { useState } from 'react';
import { Nav, INavLink, INavStyles, INavLinkGroup } from '@fluentui/react/lib/Nav';
import { useNavigate } from 'react-router-dom';

const navStyles: Partial<INavStyles> = {
  root: {
    width: 208,
    boxSizing: 'border-box',
    border: '1px solid #eee',
    overflowY: 'auto',
  },
  group: {
    height: "100vh"
  }
};

const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        name: 'Dashboard',
        url: 'javascript:void(0)',
        expandAriaLabel: 'Expand Home section',
        isExpanded: true,
        key: '0',
      },
      {
        name: 'Query editor',
        url: 'javascript:void(0)',
        key: '1',
        isExpanded: true,
      },
    ],
  },
];
export interface NaviagtionState {
  navState: string;
  setNavState: Function;
  navQuestionId?: number;
  setNavQuestionId?: Function;
}
export default function Navigation(props: NaviagtionState) {
    const handleLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
      if(item)
      {
        if(item.key=='0')
        {
          props.setNavState(item.key);
        }
        else if (item.key=='1')
        {
          props.setNavState(item.key);
        }
      }
    }
    return (
        <Nav
        onLinkClick={handleLinkClick}
        selectedKey={props.navState}
        ariaLabel="Nav basic example"
        styles={navStyles}
        groups={navLinkGroups}
        />
    );
}