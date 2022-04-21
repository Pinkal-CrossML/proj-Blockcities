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
  console.log(id)

  const tokenInfo = useTokenList().mainnetTokens.filter(m=>m.address == auctionView.auction.info.tokenMint)[0]
  const { status, amount } = useAuctionStatus(auctionView);

  // debugger
  // const artUri: string | string = art.uri
  // const fetchMeta = async () => {
  //   await fetch(artUri).then(res => res.json()).then(data => {
  //     console.log(name);
  //     console.log(data.attributes)
  //     const attr = data.attributes
  //     const newdata = attr.filter(e => e.value.includes("Regenerative"));
  //     console.log(newdata,'Regenerative');
  //   });
  // }
  // fetchMeta()

  
  const card = (
    <Card hoverable={true} className={`auction-render-card col-3 mb-4`} bordered={false}>
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
          
          <div className={'art-name pt-5'}>{name}</div>
          {/* <div className="auction-info-container">
            <div className={'info-message'}>ENDING IN</div>
            <AuctionCountdown auctionView={auctionView} labels={false} />
          </div> */}
          
        </div>
      </div>
      
      <div className="card-bid-info">
        <span className={'text-uppercase info-message'}>{status}</span>
        <Link className="white-grad "
                      to={`/auction/${auctionView.auction.pubkey}`}
                    >Buy Now</Link>
        
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
