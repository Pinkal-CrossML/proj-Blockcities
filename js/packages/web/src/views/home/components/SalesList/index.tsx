import { useWallet } from '@solana/wallet-adapter-react';
import { Col, Layout, Row, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

import { useMeta } from '../../../../contexts';
import { CardLoader } from '../../../../components/MyLoader';
import { Banner } from '../../../../components/Banner';
import { HowToBuyModal } from '../../../../components/HowToBuyModal';

import { useAuctionsList } from './hooks/useAuctionsList';
import { AuctionRenderCard } from '../../../../components/AuctionRenderCard';

const { TabPane } = Tabs;
const { Content } = Layout;
var newdata;
export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
}

export const SalesListView = () => {
  const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
  const { isLoading } = useMeta();
  const { connected } = useWallet();
  const { auctions, hasResaleAuctions } = useAuctionsList(activeKey);

  const [myArray, setMyArray] = useState<any[]>([]);

  const activateLasers =(filter_type)=>{
    setMyArray([])
    console.log('auctions', auctions)
      auctions.forEach(auction => {
        
        const artUri = auction.thumbnail.metadata.info.data.uri
        const fetchMeta = async () => {
          await fetch(artUri).then(res => res.json()).then(data => {
          const attr = data.attributes
          console.log('attr', attr)
          newdata = attr.filter(e => e.value.includes(filter_type));
          console.log('newdata.length', newdata.length)
          
          if (newdata.length>0){

            
            setMyArray(arr => [...arr, auction]);
            console.log('myArray', myArray)
          } 
         
          });
      }
      fetchMeta()

    });
  }
    
  return (
    <>
      <Banner
        src="/main-banner.svg"
        headingText="The amazing world of Metaplex."
        subHeadingText="Buy exclusive Metaplex NFTs."
        actionComponent={<HowToBuyModal buttonClassName="secondary-btn" />}
        useBannerBg
      />
      <Layout>
        <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Col style={{ width: '100%', marginTop: 32 }}>
            <Row>
              {/* <Tabs
                activeKey={activeKey}
                onTabClick={key => setActiveKey(key as LiveAuctionViewState)}
              >
                <TabPane
                  tab={
                    <>
                      <span className="live"></span> Live
                    </>
                  }
                  key={LiveAuctionViewState.All}
                ></TabPane>
                {hasResaleAuctions && (
                  <TabPane
                    tab="Secondary Marketplace"
                    key={LiveAuctionViewState.Resale}
                  ></TabPane>
                )}
                <TabPane tab="Ended" key={LiveAuctionViewState.Ended}></TabPane>
                {connected && (
                  <TabPane
                    tab="Participated"
                    key={LiveAuctionViewState.Participated}
                  ></TabPane>
                )}
              </Tabs> */}
            </Row>
            <div className="">
                  <h5 className="fw-bold star fs-5">
                    <span>⭐</span> Top Collections
                  </h5>
                </div>
                <div className="row mt-5">
                  <div className="col me-4">
                    <div
                      className="min-card mb-3 "
                      style={{ maxWidth: '18rem;' }}
                    >
                      <div className="card-body top-cards">
                        <p className="card-text">
                          <img className="glax" src={'/glax.png'} />
                          <div className="lock-mid text-center">
                            <img src={'/lock.png'} />
                          </div>
                        </p>
                        <div className="text-center">
                        <button className='bg-transparent border-0' onClick={()=>activateLasers('FeaturedCities')}>
                          <h5 className='text-white fs-6'>
                            Featured Cities
                          </h5>
                        </button>
                        </div>
                        
                        <h6 className="text-center">Virtual Earth</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col me-4">
                    <div className="card-body top-cards">
                      <p className="card-text">
                        <img className="glax" src={'/rege.png'} />
                        <div className="lock-mid text-center">
                          <img src={'/lock.png'} />
                        </div>
                      </p>
                      <div className="text-center">
                        <button className='bg-transparent border-0' onClick={()=>activateLasers('Regenerative')}>
                          <h5 className='text-white fs-6'>
                            Regenerative
                          </h5>
                        </button>
                        </div>

                      
                      
                      <h6 className="text-center">NFT's for Impact</h6>
                    </div>
                  </div>
                  <div className="col me-4">
                    <div className="card-body top-cards">
                      <p className="card-text">
                        <img className="glax" src={'/archi.png'} />
                        <div className="lock-mid text-center">
                          <img src={'/lock.png'} />
                        </div>
                      </p>

                      <div className="text-center">
                        <button className='bg-transparent border-0' onClick={()=>activateLasers('Architecture')}>
                          <h5 className='text-white fs-6'>
                          Architecture
                          </h5>
                        </button>
                        </div>
                      
                      
                      <h6 className="text-center">For Designing the Future</h6>
                    </div>
                  </div>
                  <div className="col pe-5">
                    <div className="card-body top-cards">
                      <p className="card-text">
                        <img className="glax" src={'/art.png'} />
                        <div className="lock-mid text-center">
                          <img src={'/lock.png'} />
                        </div>
                      </p>
                      <div className="text-center">
                        <button className='bg-transparent border-0' onClick={()=>activateLasers('Art')}>
                          <h5 className='text-white fs-6'>
                          Art
                          </h5>
                        </button>
                        </div>
                      
                      
                      <h6 className="text-center">Coming Soon</h6>
                    </div>
                  </div>
                </div>
                <h5 className="fw-bold star fs-5 py-4">
                  <span>🔥</span> Featured
                </h5>
            <Row>
              <div className={myArray.length==1  ? "artwork-grid col-4 h-25":''
               +(myArray.length==2 ?"artwork-grid col-8 h-25":'')
              +(myArray.length>2?'artwork-grid col-12 h-25':'')}>
              
                {isLoading &&
                  [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
                {!isLoading &&
                  myArray.map(auction => (
                    // <Link
                    //   key={auction.auction.pubkey}
                    //   to={`/auction/${auction.auction.pubkey}`}
                    // >
                      <AuctionRenderCard auctionView={auction} key={auction.auction.pubkey} />
                    // </Link>
                  ))}
              </div>
            </Row>
          </Col>
        </Content>
      </Layout>
    </>
  );
};
