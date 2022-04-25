import { useWallet } from '@solana/wallet-adapter-react';
import { Col, Layout, Row, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useMeta } from '../../../../contexts';
import { CardLoader } from '../../../../components/MyLoader';
import { Banner } from '../../../../components/Banner';
import { HowToBuyModal } from '../../../../components/HowToBuyModal';
import { ConnectButton } from '@oyster/common';
import { useAuctionsList } from './hooks/useAuctionsList';
import { AuctionRenderCard } from '../../../../components/AuctionRenderCard';
import { Notifications } from '../../../../components/Notifications';
import { h3ToGeo } from 'h3-js';
import {
  Cog,
  CurrentUserBadge,
  CurrentUserBadgeMobile,
} from '../../../../components/CurrentUserBadge';
import { AuctionCard } from '../../../../components/AuctionCard';
import { useArt } from '../../../../hooks';
import { useAuctionStatus } from '../../../../components/AuctionRenderCard/hooks/useAuctionStatus';
import { AmountLabel } from '../../../../components/AmountLabel';
const { TabPane } = Tabs;
import mapboxgl from 'mapbox-gl';
import { geoToH3 } from 'h3-js';
const { Content } = Layout;
var newdata;
export enum LiveAuctionViewState {
  All = '0',
  Participated = '1',
  Ended = '2',
  Resale = '3',
}

export const SalesListView = (props: any) => {
  var focused: any;
  var featured: any;
  const [activeKey, setActiveKey] = useState(LiveAuctionViewState.All);
  const { isLoading } = useMeta();
  const { connected } = useWallet();
  const { auctions, hasResaleAuctions } = useAuctionsList(activeKey);
  const [focus, setFocus] = useState<any>(null);
  const [focusedNFT, setFocusedNFT] = useState<any>(null);
  const [feature, setFeatured] = useState<any>(null);
  const [featuredNft, setFeaturedNFT] = useState<any>([]);
  const [myArray, setMyArray] = useState<any[]>([]);
  const [tileId, setTileid] = useState<any>(null);
  const [desc, setDesc] = useState<any>('');
  const [image, setImage] = useState<any>('');
  const [currentPath, setCurrentPath] = useState(location.pathname);
const [notMatched, setNotmatched]= useState<any>()
  
const ids = featuredNft.map(auction => auction.thumbnail.metadata.info.data.name)
const filtered = featuredNft.filter(({name}, index) => !ids.includes(name, index + 1))
console.log(filtered, 'insideFiltesssssssssssssssssssssssssss')
// debugger



  const id = focusedNFT?.thumbnail?.metadata?.pubkey;
  const art = useArt(id);
  const name = art?.title || ' ';
  // const uri= focusedNFT?.thumbnail?.metadata?.info?.data?.uri
  const url: string | any = art?.uri;
  if(url!=''){
    window.sessionStorage.setItem('url', url);
  }
 
  const price = focusedNFT?.auction.info.priceFloor.minPrice.words[1];
  // const { status, amount } = useAuctionStatus(focusedNFT);
  // console.log('art', art);

  const reverseGeocoding = async latlong => {
    // debugger
    const token =
      'pk.eyJ1IjoiamFnZGlzaDEyMSIsImEiOiJja3VhNmg1eHcwYWx3MnFteGdueXdlNGVmIn0.-TCYcPKARKOYmOJ5wFDETg';

    return await axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${latlong[1]},${latlong[0]}.json?access_token=${token};`,
      )
      .then(response => {
        console.log(response);
      });
  };

  const activateLasers = filter_type => {
    var featured_nfts: any = [];
    feature.forEach(element => {
      featured_nfts.push(element.nft_id);
    });
    setMyArray([]);
    setFeaturedNFT([]);
    console.log('auctionsssss', auctions);
    auctions.forEach(auction => {
      const mintId = auction.thumbnail.metadata.info.mint;
      // if (featured_nfts.includes(mintId)) {
      console.log(mintId);
      // debugger;
      const artUri = auction.thumbnail.metadata.info.data.uri;
      const fetchMeta = async () => {
        await fetch(artUri)
          .then(res => res.json())
          .then(data => {
            const attr = data.attributes;
            console.log('attr', attr);
            newdata = attr.filter(e => e.value.includes(filter_type));
            console.log('newdata.length', newdata.length);

            if (newdata.length > 0) {
              setMyArray(arr => [...arr, auction]);
              console.log('myArray', myArray);
            }
          });
      };
      fetchMeta();
      // }
    });
  };

  useEffect(() => {
    getNFTData();
    setFocused();
    setTimeout(() => {
      // fetchTile();
      // getstate();
    }, 5000);
  }, [auctions]);
  const didMountRef = useRef(true);
  useEffect(() => {
    const { pathname } = location;
    setCurrentPath(pathname);
    if (didMountRef.current) {
      // debugger;

      getNFTData();
    }
    didMountRef.current = false;
  }, [feature, art]);

  const getstate = () => {
    setTimeout(async () => {
      const tileEle = document.getElementsByClassName('TILE')[0].innerHTML;
      const tile = h3ToGeo(tileEle);
      // debugger
      await reverseGeocoding(tile);
    }, 10000);
  };

  const setFocused = async () => {
    console.log('setFocused');
    console.log('auctions', auctions);
    // auctions?.[3]?.thumbnail?.metadata?.info?.data?.name
    auctions.forEach(auction => {
      const mintId = auction.thumbnail.metadata.info.mint;
      console.log('focused.nft_id', focus?.[0].nft_id);
      console.log('mintId', mintId);

      if (focus[0].nft_id == mintId) {
        console.log('auction', auction);
        setFocusedNFT(auction);
      }
      // debugger;
      
      for (let a in feature) {
        if (feature[a].nft_id == mintId) {
          
          setFeaturedNFT(arr => [...arr, auction]);
        }
        // else {
            
        //   setNotmatched(arr=>[...arr,auction])
        // }
      }
    });
  };

  // var desc;
  const fetchTile = async () => {
    const geturl: any = window.sessionStorage.getItem('url');
    if (url == '') {
      await axios.get(geturl).then(res => {
        console.log('tile', res.data);
        // debugger;
        setTileid(res.data.attributes[0].value);
        setDesc(res.data.description);
        setImage(res.data.image);
      });
    } else {
      await axios.get(url).then(res => {
        console.log('tile', res.data);
        // debugger;
        setTileid(res.data.attributes[0].value);
        setDesc(res.data.description);
        setImage(res.data.image);
      });
    }
  };
  // console.log('tileId',tileId);
  // console.log('desc',desc);

  
  const getNFTData = async () => {
    const nfts: any[] = [];
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    };
    await axios
      .get(
        'https://pvxf520leh.execute-api.us-east-1.amazonaws.com/Nfts/getNftData',
        { headers: headers },
      )
      .then(data => {
        nfts.push(data.data.Items);
        // debugger
        focused = nfts[0].filter(e => e.focused_nft.includes('True'));
        setFocus(focused);
        featured = nfts[0].filter(e => e.featured_nft.includes('True'));
        setFeatured(featured);
        fetchTile();
      });
  };

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
            <Row></Row>
            {/* <div>
                          {focusedNFT && (
                            <AuctionRenderCard
                              auctionView={focusedNFT}
                              key={focusedNFT.auction.pubkey}
                              
                            />
                          )}
                        </div> */}

            <div className="col-12 pe-5 ">
              <div className="row g-5 top-section">
                <div className="col-12 col-sm-12 col-md-6">
                  <div className="card mb-4 px-2 card-main ">
                    <div className="row  no-gutters card-one">
                      <div className="col-md-6 p-4 ">
                        <img src={image} className="card-img h-100" alt="..." />
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
                                {name}
                              </h5>
                            </button>
                          </div>
                          <div className="row gx-0">
                            <p className=" text-light  offset-2  my-2">
                              California.
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
                              {focusedNFT && (
                                <h4 className="sol mb-0">{price} SOL</h4>
                              )}
                            </div>
                            <div className="col-md-5  place-bid text-center">
                              <button
                                type="button"
                                className="btn btn-rounded p-0"
                              >
                                <div className="text-white m-0 p-2 fw-bold">
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
                      <h5 className="text-white p-2 fs-5 pb-3 mx-4 text-center">
                        NFT Details
                      </h5>
                      <div className="place-bid-two-next text-center mt-2 pb-0">
                        <button
                          type="button"
                          className="text-white  btn btn-rounded pt-2 "
                        >
                          <h5 className="text-white fs-6">Details</h5>
                        </button>
                      </div>
                      <p className=" text-white mt-3 ms-4 me-5">{desc}</p>
                      <div className="place-bid-two-next text-center mt-2 pb-0">
                        <button
                          type="button"
                          className="text-white  btn btn-rounded mt-1 "
                        >
                          <h5 className="text-white fs-6">Metadata</h5>
                        </button>
                      </div>
                      <p className="text-white mt-3 fs-6 mb-4 ms-4 me-4 TILE">
                        Tile ID: {tileId}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-3 col-sm-12 col-lg-3 Connected ">
                  <div className="card border">
                    <div className="card-body pb-5">
                      <h5 className="text-white fs-5 p-2 pb-3 mx-4 text-center">
                        Get Connected
                      </h5>

                      {!connected && (
                        <ConnectButton
                          className="place-bid-two text-center ms-4 border-0 "
                          style={{ height: 48 }}
                          allowWalletChange
                        />
                      )}
                      {connected && (
                        <>
                          <CurrentUserBadge
                            showBalance={false}
                            showAddress={true}
                            iconSize={24}
                          />
                        </>
                      )}

                      <div className="place-bid-two-next place-bid-two-next-hover text-center mt-4 pb-0">
                        <Link to={``} key={'explore'}>
                          <button
                            type="button"
                            className="text-white  btn btn-rounded pt-3 "
                          >
                            <h5 className="text-white fs-6">How it Works</h5>
                          </button>
                        </Link>
                      </div>

                      <div className="place-bid-two-next  place-bid-two-next-hover text-center mt-4 pb-0">
                        <button
                          type="button"
                          className=" btn btn-rounded pt-3 "
                        >
                          <h5 className="text-white fs-6">Tiles Available</h5>
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
                <div className="min-card mb-3 " style={{ maxWidth: '18rem;' }}>
                  <div className="card-body top-cards">
                    <p className="card-text">
                      <img className="glax" src={'/glax.png'} />
                      <div className="lock-mid text-center">
                        <img src={'/lock.png'} />
                      </div>
                    </p>
                    <div className="text-center">
                      <button
                        className="bg-transparent border-0"
                        onClick={() => activateLasers('FeaturedCities')}
                      >
                        <h5 className="text-white fs-6">Featured Cities</h5>
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
                    <button
                      className="bg-transparent border-0"
                      onClick={() => activateLasers('Regenerative')}
                    >
                      <h5 className="text-white fs-6">Regenerative</h5>
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
                    <button
                      className="bg-transparent border-0"
                      onClick={() => activateLasers('Architecture')}
                    >
                      <h5 className="text-white fs-6">Architecture</h5>
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
                    <button
                      className="bg-transparent border-0"
                      onClick={() => activateLasers('Art')}
                    >
                      <h5 className="text-white fs-6">Art</h5>
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
              <div
                className={
                  myArray.length == 1
                    ? 'artwork-grid col-4 h-25 ps-5'
                    : '' +
                      (myArray.length == 2 
                        ? 'artwork-grid col-8 h-25 ps-5' 
                        : '') +
                      (myArray.length > 2 || featuredNft.length >0
                        ? 'artwork-grid col-12 h-25 ps-5'
                        : '')
                        
                }
              >
                {!isLoading &&
                  filtered.map(auction => (
                    <>
                    {console.log(auction, 'insideAuctionsss')}
                    <AuctionRenderCard
                      auctionView={auction}
                      key={auction.auction.pubkey}
                    />
                    </>
                  ))}
                {isLoading &&
                  [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
                {!isLoading &&
                  myArray.map(auction => (
                    <AuctionRenderCard
                      auctionView={auction}
                      key={auction.auction.pubkey}
                    />
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
