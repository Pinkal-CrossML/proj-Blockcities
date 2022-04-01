import React from 'react';
import { Layout } from 'antd';
 
import { AppBar } from '../AppBar';
import { Footer } from '../Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fontsource/poppins";
const { Header, Content } = Layout;
import { useHistory ,useLocation } from 'react-router-dom';

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
  const location = useLocation()

  // const { auctionView } = props;
  // const id = auctionView.thumbnail.metadata.pubkey;
  
  // const art = useArt(id);
  // const creators = useCreators(auctionView);
  // const name = art?.title || ' ';

  // const tokenInfo = useTokenList().mainnetTokens.filter(m=>m.address == auctionView.auction.info.tokenMint)[0]
  // const { status, amount } = useAuctionStatus(auctionView);
  if(location.pathname.includes('auction')){
    return(
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

    {props.children}</Content>
    </Layout></Layout>
    )
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
            <div className="col-11">
              {location.pathname}
            <div className="row g-4 top-section">
              <div className="col-12 col-sm-12 col-md-6">
               <div className="card mb-4 px-2 card-main "
                  // style={{ maxWidth: '540px' }}
                >
                  <div className="row  no-gutters card-one">
                    <div className="col-md-6 p-4 ">
                      <img src={'/town.png'} className="card-img" alt="..." />
                    </div>
                    <div className="col-md-6 ps-2 pt-4">
                      <div className="">
                        <div className='row gx-0'>
                          <div className='col-md-2'>
                          <img src={'/mainavtar.png'} style={{width:'100%'}}/>
                          </div>
                          <div className='col-md-10'>
                          <h5 className="card-title ms-3 fs-6 light-blue d-flex h-100">
                            <span className="align-self-center ">Blockcities Virtual Earth</span>
                        </h5>
                          </div>
                        </div>
                       <div className='row gx-0'>
                       <button className=" citybtn w-50 btn py-2 my-3 ">
                          <h5 className="m-0 fw-bold citybtn-text text-center">
                            Miami
                          </h5>
                        </button>
                       </div>
                        <div className='row gx-0'>
                        <p className=" text-light  offset-2  my-2">
                          California
                        </p>
                        </div>

                       <div className='row gx-0'>
                       <p className=" text-light  offset-2  my-2">United states</p>
                       </div>
                      

                        <div className="row gx-0  mb-3">
                          <div className='col-md-5'>
                          <p className="light-blue fs-5 mb-2">Available For</p>
                          <h4 className="sol mb-0">66 SOL</h4>
                          </div>
                          <div className='col-md-5  place-bid text-center p-2'>
                         
                            <button
                              type="button"
                              className="btn btn-rounded p-0"
                            >
                              <Link className="text-white m-0 p-2 fw-bold"
                      // key={auctionView.auction.pubkey}
                      // to={`/auction/${auctionView.auction.pubkey}`}
                      to={`#`}
                    >Place Bid</Link>
                            </button>
                          
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div className="col-3 Connected">
                <div className='card border'>
                  <div className="card-body pb-1">
                  <h5 className="text-white p-2 fs-6 pb-3 mx-4">NFT Details</h5>
                  <div className="place-bid-two-next text-center mt-2 pb-0">
                      <button
                        type="button"
                        className="text-white  btn btn-rounded pt-2 "
                      >
                        <h5 className="text-white">Details</h5>
                      </button>
                      
                    </div>
                    <p className=" text-white mt-3 ms-5 me-5">Blockcities is a Toolkit to Bring the Brightest Future into Physical Form</p>
                    <div className="place-bid-two-next text-center mt-2 pb-0">
                      <button
                        type="button"
                        className="text-white  btn btn-rounded mt-1 "
                      >
                        <h5 className="text-white">Metadata</h5>
                      </button>
                      
                    </div>
                    <p className="text-white mt-3 fs-6 mb-4 ms-5 me-5">Tile ID: 8444a11ffffffff</p>
                      
                    </div>
                    </div>
                 </div>
            

                <div className="col-3 Connected ">
                <div className='card border'>
                  <div className="card-body pb-5">
                    <h5 className="text-white fs-6 p-2 pb-3 mx-4">Get Connected</h5>
                    <div className="place-bid-two text-center mt-3 pb-0">
                      <button
                        type="button"
                        className=" btn btn-rounded  pt-3 pb-1"
                      >
                        <h5 className='text-white'>Connect Wallet</h5>
                      </button>
                    </div>

                    <div className="place-bid-two-next text-center mt-4 pb-0">
                      <button
                        type="button"
                        className="text-white  btn btn-rounded pt-3 "
                      >
                        <h5 className="text-white">How it Works</h5>
                      </button>
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
              <div className='mx-5'>
              <h5 className="fw-bold star fs-5"><span>⭐</span> Top Collections</h5>
              </div>
              
              <div className="row ps-5 mt-5">
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
                      <h5 className=" text-white fs-6 text-center">Featured Cities</h5>
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
                    <h5 className=" text-white fs-6 text-center">Regenerative</h5>
                    <h6 className="text-center">NFT’s for Impact</h6>
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
                    <h5 className=" text-white fs-6 text-center">Architecture</h5>
                    <h6 className="text-center">for Designing the Future</h6>
                  </div>
                </div>
                <div className="col pe-0">
                  <div className="card-body top-cards"> 
                    <p className="card-text">
                      <img className="glax" src={'/art.png'} />
                      <div className="lock-mid text-center">
                        <img src={'/lock.png'} />
                      </div>
                    </p>
                    <h5 className=" text-white fs-6 text-center">Art</h5>
                    <h6 className="text-center">Coming Soon</h6>
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
                        <h5 className='text-white fs-6'>Virtual Land</h5>
                      </button>
                    </div>
                    <div className=" text-center mt-2 pb-0  ">
                    <Link
                className="white-grad-o me-5 ms-5 mt-4 fs-6 w-75"
                style={{height: '120%'}}
                to={`/auction/`}
              >
                Available Assets
              </Link>
                    </div>
                    <div className=" text-center mt-2 pb-0  ">
                    <Link
                className="white-grad-o me-5 ms-5 mt-4 fs-6 w-75"
                style={{height: '120%'}}
                to={`/auction/`}
              >
                Proposed Upgrades
              </Link>
                    </div>
                    <div className=" text-center mt-2 pb-0  ">
                    <Link
                className="white-grad-o me-5 ms-5 mt-4 fs-6 w-75"
                style={{height: '120%'}}
                to={`/auction/`}
              >
                Architecture
              </Link>
                    </div>
                    <div className=" text-center mt-2 pb-0  ">
                    <Link
                className="white-grad-o me-5 ms-5 mt-4 fs-6 w-75"
                style={{height: '120%'}}
                to={`/auction/`}
              >
                Art
              </Link>
                    </div>
                 
                
                    </div>
                  </div>
                </div> */}
              


              {/* display card end */}


              <h5 className="fw-bold star fs-5 mx-5 mt-3"><span>🔥</span> Featured</h5>
              {props.children}
            </div>
          </Content>
        </Layout>
        {/* <Footer /> */}
      </Layout>
    </>
  );

}
});