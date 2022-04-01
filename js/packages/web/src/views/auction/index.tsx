import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Carousel, Col, List, Row, Skeleton } from 'antd';
import { AuctionCard } from '../../components/AuctionCard';
import { Connection } from '@solana/web3.js';
import { AuctionViewItem } from '@oyster/common/dist/lib/models/metaplex/index';
import { Link } from 'react-router-dom';
import {
  AuctionView as Auction,
  useArt,
  useAuction,
  useBidsForAuction,
  useCreators,
  useExtendedArt,
} from '../../hooks';
import { ArtContent } from '../../components/ArtContent';

import { format } from 'timeago.js';

import {
  AuctionState,
  formatTokenAmount,
  Identicon,
  MetaplexModal,
  shortenAddress,
  StringPublicKey,
  toPublicKey,
  useConnection,
  useConnectionConfig,
  useMint,
  useMeta,
  BidStateType,
} from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { MintInfo, Token } from '@solana/spl-token';
import { getHandleAndRegistryKey } from '@solana/spl-name-service';
import useWindowDimensions from '../../utils/layout';
import { CheckOutlined } from '@ant-design/icons';
import { ArtType } from '../../types';
import { MetaAvatar, MetaAvatarDetailed } from '../../components/MetaAvatar';
import { AmountLabel } from '../../components/AmountLabel';
import { ClickToCopy } from '../../components/ClickToCopy';
import { useTokenList } from '../../contexts/tokenList';
import { capitalize } from 'lodash';

export const AuctionItem = ({
  item,
  index,
  size,
  active,
}: {
  item: AuctionViewItem;
  index: number;
  size: number;
  active?: boolean;
}) => {
  const id = item.metadata.pubkey;
  const style: React.CSSProperties = {
    transform:
      index === 0
        ? ''
        : `translate(${index * 15}px, ${-40 * index}px) scale(${Math.max(
            1 - 0.2 * index,
            0,
          )})`,
    transformOrigin: 'right bottom',
    position: index !== 0 ? 'absolute' : 'static',
    zIndex: -1 * index,
    marginLeft: size > 1 && index === 0 ? '0px' : 'auto',
    // background: 'black',
    // boxShadow: 'rgb(0 0 0 / 10%) 12px 2px 20px 14px',
    aspectRatio: '2/1',
  };
  return (
    <ArtContent
      pubkey={id}
      className="stack-item w-100 pt-4"
      style={style}
      active={active}
      allowMeshRender={true}
    />
  );
};

export const AuctionView = () => {
  const { width } = useWindowDimensions();
  const { id } = useParams<{ id: string }>();
  const { endpoint } = useConnectionConfig();
  const auction = useAuction(id);
  const [currentIndex, setCurrentIndex] = useState(0);
  const art = useArt(auction?.thumbnail.metadata.pubkey);
  const { ref, data } = useExtendedArt(auction?.thumbnail.metadata.pubkey);
  const creators = useCreators(auction);
  const { pullAuctionPage } = useMeta();
  useEffect(() => {
    pullAuctionPage(id);
  }, []);

  let edition = '';
  if (art.type === ArtType.NFT) {
    edition = 'Unique';
  } else if (art.type === ArtType.Master) {
    edition = 'NFT 0';
  } else if (art.type === ArtType.Print) {
    edition = `${art.edition} of ${art.supply}`;
  }
  const nftCount = auction?.items.flat().length;
  const winnerCount = auction?.items.length;
  const isOpen =
    auction?.auction.info.bidState.type === BidStateType.OpenEdition;
  const hasDescription = data === undefined || data.description === undefined;
  const description = data?.description;
  const attributes = data?.attributes;

  const tokenInfo = useTokenList()?.mainnetTokens.filter(
    m => m.address == auction?.auction.info.tokenMint,
  )[0];

  const items = [
    ...(auction?.items
      .flat()
      .reduce((agg, item) => {
        agg.set(item.metadata.pubkey, item);
        return agg;
      }, new Map<string, AuctionViewItem>())
      .values() || []),
    auction?.participationItem,
  ].map((item, index, arr) => {
    if (!item || !item?.metadata || !item.metadata?.pubkey) {
      return null;
    }

    return (
      <AuctionItem
        key={item.metadata.pubkey}
        item={item}
        index={index}
        size={arr.length}
        active={index === currentIndex}
      />
    );
  });

  if (width < 768) {
    return (
      <Row
        justify="center"
        gutter={[48, 0]}
        className="auction-mobile-container"
      >
        <Col span={24} className={'img-cont-500'}>
          <div className="auction-view" style={{ minHeight: 300 }}>
            <Carousel
              autoplay={false}
              afterChange={index => setCurrentIndex(index)}
            >
              {items}
            </Carousel>
          </div>
        </Col>
        <Col className="auction-mobile-section">
          <h2 className="art-title">
            {art.title || <Skeleton paragraph={{ rows: 0 }} />}
          </h2>

          <div className="info-container">
            <div className={'info-component'}>
              <h6 className={'info-title'}>Edition</h6>
              <span>
                {(auction?.items.length || 0) > 1 ? 'Multiple' : edition}
              </span>
            </div>
            <div className={'info-component'}>
              <h6 className={'info-title'}>Winners</h6>
              <span>
                {winnerCount === undefined ? (
                  <Skeleton paragraph={{ rows: 0 }} />
                ) : isOpen ? (
                  'Unlimited'
                ) : (
                  winnerCount
                )}
              </span>
            </div>
            <div className={'info-component'}>
              <h6 className={'info-title'}>NFTS</h6>
              <span>
                {nftCount === undefined ? (
                  <Skeleton paragraph={{ rows: 0 }} />
                ) : isOpen ? (
                  'Open'
                ) : (
                  nftCount
                )}
              </span>
            </div>
          </div>
        </Col>

        <Col className="auction-mobile-section" span={24}>
          {!auction && <Skeleton paragraph={{ rows: 6 }} />}
          {auction && (
            <AuctionCard auctionView={auction} hideDefaultAction={false} />
          )}
        </Col>
        <Col className="auction-mobile-section" span={24}>
          <h6 className={'info-title'}>Details</h6>
          <div className="description">
            <p className={'about-nft-collection a-description'}>
              {hasDescription && <Skeleton paragraph={{ rows: 3 }} />}
              {description ||
                (winnerCount !== undefined && (
                  <div style={{ fontStyle: 'italic' }}>
                    No description provided.
                  </div>
                ))}
            </p>
          </div>
        </Col>
        {attributes && (
          <Col
            className="auction-mobile-section about-nft-collection a-attributes"
            span={24}
          >
            <h6>Attributes</h6>
            <List grid={{ column: 4 }}>
              {attributes.map((attribute, index) => (
                <List.Item key={`${attribute.value}-${index}`}>
                  <Card title={attribute.trait_type}>{attribute.value}</Card>
                </List.Item>
              ))}
            </List>
          </Col>
        )}
        <Col className="auction-mobile-section" span={24}>
          <div className={'info-view'}>
            <h6 className={'info-title'}>Artists</h6>
            <div style={{ display: 'flex' }}>
              <MetaAvatarDetailed creators={creators} />
            </div>
          </div>
        </Col>
        <Col className="auction-mobile-section" span={24}>
          <div className={'info-view'}>
            <h6 className={'info-title'}>View on</h6>
            <div style={{ display: 'flex' }}>
              <Button
                className="tag"
                onClick={() => window.open(art.uri || '', '_blank')}
              >
                Arweave
              </Button>
              <Button
                className="tag"
                onClick={() => {
                  const cluster = endpoint.name;
                  const explorerURL = new URL(
                    `account/${art?.mint || ''}`,
                    'https://explorer.solana.com',
                  );
                  if (!cluster.includes('mainnet')) {
                    explorerURL.searchParams.set('cluster', cluster);
                  }
                  window.open(explorerURL.href, '_blank');
                }}
              >
                Solana
              </Button>
            </div>
          </div>
        </Col>
        <Col className="auction-mobile-section" span={24}>
          <AuctionBids auctionView={auction} />
        </Col>
      </Row>
    );
  } else {
    return (
      <Row ref={ref} gutter={[48, 0]}>
        <Col className={'col-6 img-cont-300 ps-3'}>
          <div
            className="row px-2"
            style={{
              backgroundColor: 'rgba(27, 33, 79, 1',
              borderRadius: '3%',
            }}
          >
            <div className="auction-view col-6 py-1">
              <Carousel
                autoplay={false}
                afterChange={index => setCurrentIndex(index)}
              >
                {items}
              </Carousel>
            </div>

            <div className="auction-view col-6 p-2">
              <div>
                <div className="row gx-0 py-3">
                  <div className="col-md-2 ">
                    <img src={'/mainavtar.png'} style={{ width: '70%' }} />
                  </div>
                  <div className="col-md-10">
                    <h5 className="card-title fs-6 light-blue d-flex h-100">
                      <span className="align-self-center ">
                        Blockcities Virtual Earth
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="auction-view citybtn btn mb-2">
                <h5 className="m-0 citybtn-text">
                  {art.title || <Skeleton paragraph={{ rows: 0 }} />}
                </h5>
              </div>
              <div className="row ">
                <div className="">
                  {/* sol cart */}
                  <div className="auction-view sol">
                    {auction && (
                      <AuctionCard
                        auctionView={auction}
                        hideDefaultAction={false}
                      />
                    )}
                  </div>
                  {/* sol cart */}
                </div>
              </div>
            </div>
          </div>

          {/* <h6 className={'about-nft-collection'}>
            ABOUT THIS {nftCount === 1 ? 'NFT' : 'COLLECTION'}
          </h6>
          <p className={'about-nft-collection a-description'}>
            {hasDescription && <Skeleton paragraph={{ rows: 3 }} />}
            {description ||
              (winnerCount !== undefined && (
                <div style={{ fontStyle: 'italic' }}>
                  No description provided.
                </div>
              ))}
          </p>
          {attributes && (
            <div className={'about-nft-collection a-attributes'}>
              <h6>Attributes</h6>
              <List grid={{ column: 4 }}>
                {attributes.map((attribute, index) => (
                  <List.Item key={`${attribute.value}-${index}`}>
                    <Card title={attribute.trait_type}>{attribute.value}</Card>
                  </List.Item>
                ))}
              </List>
            </div>
          )} */}
          {/* {auctionData[id] && (
            <>
              <h6>About this Auction</h6>
              <p>{auctionData[id].description.split('\n').map((t: string) => <div>{t}</div>)}</p>
            </>
          )} */}
        </Col>

        <div className="col-3 Connected px-4 ">
          <div className="card border">
            <div className="card-body py-4 px-5">
              <h5 className={'text-white'}>
                {nftCount === 1 ? 'NFT' : 'COLLECTION'} Details
              </h5>

              <div className="text-center px-3 mt-4 pb-0">
                {/* <button
                        type="button"
                        className="text-white btn btn-rounded "
                      > */}
                <p
                  className="fs-5 py-2 rounded w-100 text-white"
                  style={{ background: '#232A61' }}
                >
                  Details
                </p>
                {/* </button> */}
              </div>

              <p className={'text-white  text-start mt-3 me-5 '}>
                {hasDescription && <Skeleton paragraph={{ rows: 3 }} />}
                {description ||
                  (winnerCount !== undefined && (
                    <div style={{ fontStyle: 'italic' }}>
                      No description provided.
                    </div>
                  ))}
              </p>

              <div className="text-center px-3 mt-4 pb-0">
                <p
                  className="fs-5 py-2 rounded w-100 text-white"
                  style={{ background: '#232A61' }}
                >
                  Metadata
                </p>
              </div>
              {attributes && (
                <div className={''}>
                  <List grid={{ column: 4 }}>
                    {attributes.map((attribute, index) => (
                      <p className="text-white mt-3 text-start mb-4 me-5">
                        <b>{attribute.trait_type}: </b>
                        {attribute.value}
                      </p>
                    ))}
                  </List>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-3 Connected px-4 pe-5">
          <div className="card border">
            <div className="card-body py-4">
              <h5 className="text-white fs-6 p-2 pb-3 mx-4">Get Connected</h5>
              <div className="place-bid-two text-center mt-3 pb-0">
                <button type="button" className=" btn btn-rounded  pt-3 pb-1">
                  <h5 className="text-white">Connect Wallet</h5>
                </button>
              </div>

              <div className="place-bid-two-next text-center mt-4 pb-0">
                <button
                  type="button"
                  className="text-white costom btn btn-rounded pt-3 "
                >
                  <h5 className="text-white">How it Works</h5>
                </button>
              </div>

              <div className="place-bid-two-next text-center mt-4 mb-1">
                <button type="button" className="costom btn btn-rounded pt-3 ">
                  <h5 className="text-white">Tiles Available</h5>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 Connected pe-5">
          <div className="card border pt-5 mt-5 pb-5 ">
            <div>
              <img className="main-map pe-5 ps-5" src={'/map.png'} />
            </div>

            <img className="map-avrat-logo" src={'/map-logo.png'} />

            <div className='position-absolute w-25 pt-3'style={{marginLeft:'75%'}}>
            <div className="place-bid-two  text-center  mt-3 pb-0">
                <button type="button" className=" btn btn-rounded  pt-2 pb-1">
                  <h5 className="text-white">Go to Virtual Earth</h5>
                </button>
              </div>
            </div>
            

            <div>
              <Link
                className="white-grad me-5 ms-5 mt-4 fs-6"
                style={{ width: '10%' }}
                to={`/auction/`}
              >
                View Details
              </Link>
              <div className="sol text-end fs-4 pt-2 fw-bold">
                <div className="text-white fs-6 fw-normal">
                  <div></div>
                  <p className="m-0 text-white fs-6">
                    {art.title || <Skeleton paragraph={{ rows: 0 }} />}
                  </p>
                  Status
                </div>
                SOLD
              </div>
            </div>
          </div>
        </div>
      </Row>
    );
  }
};

const BidLine = (props: {
  bid: any;
  index: number;
  mint?: MintInfo;
  isCancelled?: boolean;
  isActive?: boolean;
  mintKey: string;
}) => {
  const { bid, index, mint, isCancelled, isActive, mintKey } = props;
  const { publicKey } = useWallet();
  const bidder = bid.info.bidderPubkey;
  const isme = publicKey?.toBase58() === bidder;
  const tokenInfo = useTokenList().mainnetTokens.filter(
    m => m.address == mintKey,
  )[0];

  // Get Twitter Handle from address
  const connection = useConnection();
  const [bidderTwitterHandle, setBidderTwitterHandle] = useState('');
  useEffect(() => {
    const getTwitterHandle = async (
      connection: Connection,
      bidder: StringPublicKey,
    ): Promise<string | undefined> => {
      try {
        const [twitterHandle] = await getHandleAndRegistryKey(
          connection,
          toPublicKey(bidder),
        );
        setBidderTwitterHandle(twitterHandle);
      } catch (err) {
        console.warn(`err`);
        return undefined;
      }
    };
    getTwitterHandle(connection, bidder);
  }, [bidderTwitterHandle]);
  const { width } = useWindowDimensions();
  if (width < 768) {
    return (
      <Row className="mobile-bid-history">
        <div className="bid-info-container">
          <div className="bidder-info-container">
            <Identicon
              style={{
                width: 24,
                height: 24,
                marginRight: 10,
                marginTop: 2,
              }}
              address={bidder}
            />
            {bidderTwitterHandle ? (
              <a
                target="_blank"
                title={shortenAddress(bidder)}
                href={`https://twitter.com/${bidderTwitterHandle}`}
              >{`@${bidderTwitterHandle}`}</a>
            ) : (
              shortenAddress(bidder)
            )}
          </div>
          <div>
            {!isCancelled && (
              <div className={'flex '}>
                {isme && (
                  <>
                    <CheckOutlined />
                    &nbsp;
                  </>
                )}
                <AmountLabel
                  style={{ marginBottom: 0, fontSize: '16px' }}
                  containerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  displaySymbol={tokenInfo?.symbol || 'CUSTOM'}
                  iconSize={24}
                  amount={formatTokenAmount(bid.info.lastBid, mint)}
                />
              </div>
            )}
          </div>
        </div>
        <div className="bid-info-container">
          {format(bid.info.lastBidTimestamp.toNumber() * 1000)}
        </div>
      </Row>
    );
  } else {
    return (
      <Row className={'bid-history'}>
        {isCancelled && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              width: '100%',
              height: 1,
              background: 'grey',
              top: 'calc(50% - 1px)',
              zIndex: 2,
            }}
          />
        )}
        <Col span={8}>
          {!isCancelled && (
            <div className={'flex '}>
              {isme && (
                <>
                  <CheckOutlined />
                  &nbsp;
                </>
              )}
              <AmountLabel
                style={{ marginBottom: 0, fontSize: '16px' }}
                containerStyle={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                displaySymbol={tokenInfo?.symbol || 'CUSTOM'}
                tokenInfo={tokenInfo}
                iconSize={24}
                amount={formatTokenAmount(bid.info.lastBid, mint)}
              />
            </div>
          )}
        </Col>
        <Col span={8} style={{ opacity: 0.7 }}>
          {/* uses milliseconds */}

          {format(bid.info.lastBidTimestamp.toNumber() * 1000)}
        </Col>
        <Col span={8}>
          <div className={'flex-right'}>
            <Identicon
              style={{
                width: 24,
                height: 24,
                marginRight: 10,
                marginTop: 2,
              }}
              address={bidder}
            />{' '}
            <span style={{ opacity: 0.7 }}>
              {bidderTwitterHandle ? (
                <Row className="pubkey-row">
                  <a
                    target="_blank"
                    title={shortenAddress(bidder)}
                    href={`https://twitter.com/${bidderTwitterHandle}`}
                  >{`@${bidderTwitterHandle}`}</a>
                  <ClickToCopy
                    className="copy-pubkey"
                    copyText={bidder as string}
                  />
                </Row>
              ) : (
                <Row className="pubkey-row">
                  {shortenAddress(bidder)}
                  <ClickToCopy
                    className="copy-pubkey"
                    copyText={bidder as string}
                  />
                </Row>
              )}
            </span>
          </div>
        </Col>
      </Row>
    );
  }
};

export const AuctionBids = ({
  auctionView,
}: {
  auctionView?: Auction | null;
}) => {
  const bids = useBidsForAuction(auctionView?.auction.pubkey || '');

  const mint = useMint(auctionView?.auction.info.tokenMint);
  const { width } = useWindowDimensions();

  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const winnersCount = auctionView?.auction.info.bidState.max.toNumber() || 0;
  const activeBids = auctionView?.auction.info.bidState.bids || [];
  const activeBidders = useMemo(() => {
    return new Set(activeBids.map(b => b.key));
  }, [activeBids]);
  const auctionState = auctionView
    ? auctionView.auction.info.state
    : AuctionState.Created;
  const bidLines = useMemo(() => {
    let activeBidIndex = 0;
    return bids.map((bid, index) => {
      const isCancelled =
        (index < winnersCount && !!bid.info.cancelled) ||
        (auctionState !== AuctionState.Ended && !!bid.info.cancelled);

      const line = (
        <BidLine
          bid={bid}
          index={activeBidIndex}
          key={index}
          mint={mint}
          isCancelled={isCancelled}
          isActive={!bid.info.cancelled}
          mintKey={auctionView?.auction.info.tokenMint || ''}
        />
      );

      if (!isCancelled) {
        activeBidIndex++;
      }

      return line;
    });
  }, [auctionState, bids, activeBidders]);

  if (!auctionView || bids.length < 1) return null;

  return (
    <Row>
      <Col className="bids-lists">
        kjbkjbkjbnkn
        <h6 className={'info-title'}>Bid History</h6>
        {bidLines.slice(0, 10)}
        {bids.length > 10 && (
          <div
            className="full-history"
            onClick={() => setShowHistoryModal(true)}
            style={{
              cursor: 'pointer',
            }}
          >
            View full history
          </div>
        )}
        <MetaplexModal
          visible={showHistoryModal}
          onCancel={() => setShowHistoryModal(false)}
          title="Bid history"
          bodyStyle={{
            background: 'unset',
            boxShadow: 'unset',
            borderRadius: 0,
          }}
          centered
          width={width < 768 ? width - 10 : 600}
        >
          <div
            style={{
              maxHeight: 600,
              overflowY: 'scroll',
              width: '100%',
            }}
          >
            {bidLines}
          </div>
        </MetaplexModal>
      </Col>
    </Row>
  );
};
