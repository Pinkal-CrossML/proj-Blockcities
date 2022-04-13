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

export const SalesListView = (props: any) => {
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
          <Col style={{ width: '100%', marginTop: 0 }}>
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
            <div className="col-12 pe-5 ">
                {/* {location.pathname} */}
                <div className="row g-5 top-section">
                  <div className="col-12 col-sm-12 col-md-6">
                    <div
                      className="card mb-4 px-2 card-main "
                      // style={{ maxWidth: '540px' }}
                    >
                      <div className="row  no-gutters card-one">
                        <div className="col-md-6 p-4 ">
                          <img
                            src={'/town.png'}
                            className="card-img"
                            alt="..."
                          />
                        </div>
                        <div className="col-md-6 col-sm-12 col-md-12 col-lg-6 ps-2 pe-0 pt-4">
                          <div className="">
                            <div className="row gx-0">
                              <div className="col-md-2 col-sm-2">
                                <img
                                  src={'/mainavtar.png'}
                                  style={{ width: '100%' }}
                                />
                              </div>
                              <div className="col-md-10">
                                <h5 className="card-title ms-3 fs-6 light-blue d-flex h-100">
                                  <span className="align-self-center ">
                                    Blockcities Virtual Earth
                                  </span>
                                </h5>
                              </div>
                            </div>
                            <div className="row gx-0">
                              <button className=" citybtn w-50 btn py-2 my-3 ">
                                <h5 className="m-0 fw-bold citybtn-text text-center">
                                  Miami
                                </h5>
                              </button>
                            </div>
                            <div className="row gx-0">
                              <p className=" text-light  offset-2  my-2">
                                California
                              </p>
                            </div>

                            <div className="row gx-0">
                              <p className=" text-light  offset-2  my-2">
                                United states
                              </p>
                            </div>

                            <div className="row gx-0  mb-3">
                              <div className="col-md-5">
                                <p className="light-blue fs-5 mb-2">
                                  Available For
                                </p>
                                <h4 className="sol mb-0">66 SOL</h4>
                              </div>
                              <div className="col-md-5  place-bid text-center">
                                <button
                                  type="button"
                                  className="btn btn-rounded p-0"
                                >
                                  <div
                                    className="text-white m-0 p-2 fw-bold"
                                    // key={auctionView.auction.pubkey}
                                    // to={`/auction/${auctionView.auction.pubkey}`}
                                    
                                  >
                                    Place Bid
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-3 col-sm-12 col-lg-3 Connected">
                    <div className="card border">
                      <div className="card-body pb-1">
                        <h5 className="text-white p-2 fs-6 pb-3 mx-4 text-center">
                          NFT Details
                        </h5>
                        <div className="place-bid-two-next text-center mt-2 pb-0">
                          <button
                            type="button"
                            className="text-white  btn btn-rounded pt-2 "
                          >
                            <h5 className="text-white">Details</h5>
                          </button>
                        </div>
                        <p className=" text-white mt-3 ms-4 me-5">
                          Blockcities is a Toolkit to Bring the Brightest Future
                          into Physical Form
                        </p>
                        <div className="place-bid-two-next text-center mt-2 pb-0">
                          <button
                            type="button"
                            className="text-white  btn btn-rounded mt-1 "
                          >
                            <h5 className="text-white">Metadata</h5>
                          </button>
                        </div>
                        <p className="text-white mt-3 fs-6 mb-4 ms-4 me-4">
                          Tile ID: 8444a11ffffffff
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-3 col-sm-12 col-lg-3 Connected ">
                    <div className="card border">
                      <div className="card-body pb-5">
                        <h5 className="text-white fs-6 p-2 pb-3 mx-4 text-center">
                          Get Connected
                        </h5>

                        
                        <div className="place-bid-two text-center mt-3 pb-0">
                          <button
                            type="button"
                            className=" btn btn-rounded  pt-3 pb-1"
                          >
                            <h5 className="text-white">Connect Wallet</h5>
                          </button>
                        </div>

                        <div className="place-bid-two-next text-center mt-4 pb-0">
                          <Link to={``} key={'explore'}>
                            <button
                              type="button"
                              className="text-white  btn btn-rounded pt-3 "
                            >
                              <h5 className="text-white">How it Works</h5>
                            </button>
                          </Link>
                        </div>

                        <div className="place-bid-two-next text-center mt-4 pb-0">
                          <button
                            type="button"
                            className=" btn btn-rounded pt-3 "
                          >
                            <h5 className="text-white">Tiles Available</h5>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                

                
                {/* nft cards  */}

                {/* <div className="col-2 Connected ">
                <div className='card border'>
                <div className="card-body top-cards">
                      <p className="card-text">
                        <img className="glax rounded" src={'/white.jpg'} />
                        
                      </p>
                      <div className='text-white pb-2'>
                      Florida
                      </div>
                      
                      <h5 className=" fs-5 sol-color" >
                        <div className=''></div> 300 SOL</h5>
                        <div className='text-primary h-25'>
                        <hr style={{height: '3px'}}/>
                      </div>
                    
                      
                      <h5 className="fs-5 sol-color">See Details</h5>
                    </div>
                  </div>
                </div> */}

                {/* nft card send */}

                {/* display card  */}

                {/* <div className="col-3 Connected  pt-4">
                <div className='card border'>
                  <div className="card-body pb-5 ">
                    <h5 className="text-white fs-6 p-2 pb-3 mx-4 text-center">Display in Map</h5>
                    <div className="Virtual-Land text-center mt-3 pb-0 w-75 ">
                      <button
                        type="button"
                        className=" btn btn-rounded  pt-2 pb-1"
                      >
                        <h5 className='text-white fw-normal fs-6'>Virtual Land</h5> 
                      </button>
                    </div>
                    <div className=" text-center mt-2 pb-0  ">
                    <Link
                className="white-grad-o me-5 ms-5 mt-4 fw-normal fs-6 w-75"
                
                to={`/auction/`}
              >
                Available Assets
              </Link>
                    </div>
                    <div className=" text-center mt-2 pb-0  ">
                    <Link
                className="white-grad-o me-5 ms-5 fw-normal mt-4 fs-6 w-75"
               
                to={`/auction/`}
              >
                Proposed Upgrades
              </Link>
                    </div>
                    <div className=" text-center mt-2 pb-0  ">
                    <Link
                className="white-grad-o me-5 ms-5 fw-normal mt-4 fs-6 w-75"
             
                to={`/auction/`}
              >
                Architecture
              </Link>
                    </div>
                    <div className=" text-center mt-2 pb-0  ">
                    <Link
                className="white-grad-o me-5 ms-5 mt-4 fw-normal fs-6 w-75"
             
                to={`/auction/`}
              >
                Art
              </Link>
                    </div>
                 
                
                    </div>
                  </div>
                </div>
               */}

                {/* display card end */}

                
                {props.children}
              </div>
            <div className="">
                  <h5 className="fw-bold star fs-5 ps-5">
                    <span>⭐</span> Top Collections
                  </h5>
                </div>
                <div className="row mt-5 ps-5">
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
                <h5 className="fw-bold star fs-5 ps-5 py-4">
                  <span>🔥</span> Featured
                </h5>
            <Row>
              <div className={myArray.length==1  ? "artwork-grid col-4 h-25 ps-5":''
               +(myArray.length==2 ?"artwork-grid col-8 h-25 ps-5":'')
              +(myArray.length>2?'artwork-grid col-12 h-25 ps-5':'')}>
              
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
