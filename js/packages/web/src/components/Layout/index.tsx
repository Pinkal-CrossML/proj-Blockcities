import React from 'react';
import { Layout } from 'antd';

import { AppBar } from '../AppBar';
import { Footer } from '../Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/poppins';
const { Header, Content } = Layout;
import { useHistory, useLocation } from 'react-router-dom';

import { Card, CardProps } from 'antd';
import { ArtContent } from '../ArtContent';
import { AuctionView, useArt, useCreators } from '../../hooks';
import { AmountLabel } from '../AmountLabel';
import { MetaAvatar } from '../MetaAvatar';
import { AuctionCountdown } from '../AuctionNumbers';
import { Link } from 'react-router-dom';

import { useAuctionStatus } from '../AuctionRenderCard/hooks/useAuctionStatus';
import { useTokenList } from '../../contexts/tokenList';

export const AppLayout = React.memo((props: any) => {
  const location = useLocation();

  // const { auctionView } = props;
  // const id = auctionView.thumbnail.metadata.pubkey;

  // const art = useArt(id);
  // const creators = useCreators(auctionView);
  // const name = art?.title || ' ';

  // const tokenInfo = useTokenList().mainnetTokens.filter(m=>m.address == auctionView.auction.info.tokenMint)[0]
  // const { status, amount } = useAuctionStatus(auctionView);
  
  if (location.pathname.includes('auction')) {
    return (
      <Layout id={'main-layout'} className="row gx-0">
        {/* <span id={'main-bg'}></span> */}
        <span id={'bg-gradient'}></span>
        <span id={'static-header-gradient'}></span>
        <span id={'static-end-gradient'}></span>
        <Header className="col-md-2 App-Bar">
          <AppBar />
        </Header>
        <Layout className="col" id={'width-layout'}>
          <Content
            style={{
              overflow: 'scroll',
              padding: '30px 48px ',
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    );
  } else {
    return (
      <>
        <Layout id={'main-layout'} className="row gx-0">
          {/* <span id={'main-bg'}></span> */}
          <span id={'bg-gradient'}></span>
          <span id={'static-header-gradient'}></span>
          <span id={'static-end-gradient'}></span>
          <Header className="col-md-2 App-Bar">
            <AppBar />
          </Header>
          <Layout className="col" id={'width-layout'}>
            <Content
              style={{
                overflow: 'scroll',
                padding: '30px 48px ',
              }}
            >
                {/* {location.pathname} */}
               
                {props.children}
           
            </Content>
          </Layout>
          {/* <Footer /> */}
        </Layout>
      </>
    );
  }
});
