import React from 'react';
import { Card, CardProps } from 'antd';
import { ArtContent } from '../ArtContent';
import { AuctionView, useArt, useCreators } from '../../hooks';
import { AmountLabel } from '../AmountLabel';
import { MetaAvatar } from '../MetaAvatar';
import { AuctionCountdown } from '../AuctionNumbers';
import { Link } from 'react-router-dom';

import { useAuctionStatus } from './hooks/useAuctionStatus';
import { useTokenList } from '../../contexts/tokenList';

export interface AuctionCard extends CardProps {
  auctionView: AuctionView;
}

export const AuctionRenderCard = (props: AuctionCard) => {
  const { auctionView } = props;
  const id = auctionView.thumbnail.metadata.pubkey;
  const art = useArt(id);
  const creators = useCreators(auctionView);
  const name = art?.title || ' ';

  const tokenInfo = useTokenList().mainnetTokens.filter(m=>m.address == auctionView.auction.info.tokenMint)[0]
  const { status, amount } = useAuctionStatus(auctionView);

  const card = (
    <Card hoverable={true} className={`auction-render-card mb-4`} bordered={false}>
      <div className={'card-art-info p-2'}>
        <div className="auction-gray-wrapper">
          <div className={'card-artist-info'}>
            {/* <MetaAvatar creators={creators.length ? [creators[0]] : undefined} /> */}
            {/* <span className={'artist-name'}>
              {creators[0]?.name ||
                creators[0]?.address?.substr(0, 6) ||
                'Go to auction'}
              ...
            </span> */}
          </div>
          <div className={'art-content-wrapper'}>
            <ArtContent
              className="auction-image no-events"
              preview={false}
              pubkey={id}
              allowMeshRender={false}
            />
            <div className='avtar'>
          <img className='avta-img'src={'/Avatar.png'} />
          </div>
          </div>
          
          <div className={'art-name pt-3'}>{name}</div>
          {/* <div className="auction-info-container">
            <div className={'info-message'}>ENDING IN</div>
            <AuctionCountdown auctionView={auctionView} labels={false} />
          </div> */}
          
        </div>
      </div>
      <div className="card-bid-info">
        <span className={'text-uppercase info-message'}>{status}</span>
        {/* <a className="white-grad"> Buy Now{auctionView.auction.pubkey}</a> */}
        <Link className="white-grad "
                      // key={auctionView.auction.pubkey}
                      to={`/auction/${auctionView.auction.pubkey}`}
                    >Buy Now</Link>
        {/* <button className="card-button border-image-source" type="button">Buy Now</button> */}
        <AmountLabel
          containerStyle={{ flexDirection: 'row' }}
          title={status}
          amount={amount}
          iconSize={24}
          tokenInfo={tokenInfo}
        />
      </div>
      
    </Card>
  );

  return card;
};
