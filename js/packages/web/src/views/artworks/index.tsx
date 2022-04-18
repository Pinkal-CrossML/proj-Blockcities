import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState,useMemo } from 'react';
import { Layout,Button, Row, Col,Popover, Tabs, Dropdown, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { CardLoader } from '../../components/MyLoader';
import { Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { ArtworkViewState } from './types';
import { useItems } from './hooks/useItems';
import ItemCard from './components/ItemCard';
import { useUserAccounts } from '@oyster/common';
import { DownOutlined } from '@ant-design/icons';
import { isMetadata, isPack } from './utils';
import { useMeta, useSolPrice } from '../../contexts';
import { useTokenList } from '../../contexts/tokenList';
import { TokenCircle } from '../../components/Custom';
import { Notifications } from '../../components/Notifications';

import {
  Cog,
  CurrentUserBadge,
  CurrentUserBadgeMobile,
} from '../../components/CurrentUserBadge';

import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import {
  ENDPOINTS,
  formatNumber,
  formatUSD,
  Identicon,
  MetaplexModal,
  Settings,
  shortenAddress,
  useConnectionConfig,
  useNativeAccount,
  useWalletModal,
  useQuerySearch,
  WRAPPED_SOL_MINT,
} from '@oyster/common';
const btnStyle: React.CSSProperties = {
  border: 'none',
  height: 40,
};
const { TabPane } = Tabs;
const { Content } = Layout;

export const ArtworksView = (props: { iconSize: any; showAddress: any; showBalance: any; }) => {
  const { connected } = useWallet();
  const { whitelistedCreatorsByCreator, store } = useMeta();
  
  const {
    isLoading,
    pullAllMetadata,
    storeIndexer,
    pullItemsPage,
    isFetching,
  } = useMeta();
  const { userAccounts } = useUserAccounts();

  const [activeKey, setActiveKey] = useState(ArtworkViewState.Metaplex);

  const userItems = useItems({ activeKey });

  useEffect(() => {
    if (!isFetching) {
      pullItemsPage(userAccounts);
    }
  }, [isFetching]);

  useEffect(() => {
    if (connected) {
      setActiveKey(ArtworkViewState.Owned);
    } else {
      setActiveKey(ArtworkViewState.Metaplex);
    }
  }, [connected, setActiveKey]);

  const isDataLoading = isLoading || isFetching;

  

  const artworkGrid = (
    <div className="artwork-grid">
      {isDataLoading && [...Array(10)].map((_, idx) => <CardLoader key={idx} />)}
      {!isDataLoading &&
        userItems.map(item => {
          const pubkey = isMetadata(item)
            ? item.pubkey
            : isPack(item)
            ? item.provingProcessKey
            : item.edition?.pubkey || item.metadata.pubkey;

          return <ItemCard item={item} key={pubkey} />;
        })}
    </div>
  );

  const refreshButton = connected && storeIndexer.length !== 0 && (
    <Dropdown.Button
      className="refresh-button padding0"
      onClick={() => pullItemsPage(userAccounts)}
      icon={<DownOutlined />}
      overlayClassName="refresh-overlay"
      overlay={
        <Menu className="gray-dropdown">
          <Menu.Item onClick={() => pullAllMetadata()}>
            Load All Metadata
          </Menu.Item>
        </Menu>
      }
    >
      Refresh
    </Dropdown.Button>
  );
  const { wallet, publicKey, disconnect } = useWallet();
  const { account } = useNativeAccount();
  const solPrice = useSolPrice();
  const [showAddFundsModal, setShowAddFundsModal] = useState<Boolean>(false);

  if (!wallet || !publicKey) {
    return null;
  }
  const balance = (account?.lamports || 0) / LAMPORTS_PER_SOL;
  const balanceInUSD = balance * solPrice;
  const solMintInfo = useTokenList().tokenMap.get(WRAPPED_SOL_MINT.toString());
  const iconStyle: React.CSSProperties = {
    display: 'flex',
    width: props.iconSize,
    borderRadius: 50,
  };

  let name = props.showAddress ? shortenAddress(`${publicKey}`) : '';
  const unknownWallet = wallet as any;
  if (unknownWallet.name && !props.showAddress) {
    name = unknownWallet.name;
  }

  let image = <Identicon address={publicKey?.toBase58()} style={iconStyle} />;

  if (unknownWallet.image) {
    image = <img src={unknownWallet.image} style={iconStyle} />;
  }

  const AddFundsModal = (props: {
    showAddFundsModal: any;
    setShowAddFundsModal: any;
    balance: number;
    publicKey: PublicKey;
  }) => {
    return (
      <MetaplexModal
        visible={props.showAddFundsModal}
        onCancel={() => props.setShowAddFundsModal(false)}
        title="Add Funds"
        bodyStyle={{
          alignItems: 'start',
        }}
      >
        <div style={{ maxWidth: '100%' }}>
          <p style={{ color: 'white' }}>
            We partner with <b>FTX</b> to make it simple to start purchasing
            digital collectibles.
          </p>
          <div
            style={{
              width: '100%',
              background: '#232A61',
              borderRadius: 12,
              marginBottom: 10,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              justifyContent: 'space-between',
              fontWeight: 700,
            }}
          >
            <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Balance</span>
            <span>
              {formatNumber.format(props.balance)}&nbsp;&nbsp;
              <span
                style={{
                  borderRadius: '50%',
                  background: 'black',
                  display: 'inline-block',
                  padding: '1px 4px 4px 4px',
                  lineHeight: 1,
                }}
              >
                <img src="/sol.svg" width="10" />
              </span>{' '}
              SOL
            </span>
          </div>
          <p>
            If you have not used FTX Pay before, it may take a few moments to get
            set up.
          </p>
          <Button
            onClick={() => props.setShowAddFundsModal(false)}
            style={{
              background: '#454545',
              borderRadius: 14,
              width: '30%',
              padding: 10,
              height: 'auto',
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              window.open(
                `https://ftx.com/pay/request?coin=SOL&address=${props.publicKey?.toBase58()}&tag=&wallet=sol&memoIsRequired=false`,
                '_blank',
                'resizable,width=680,height=860',
              );
            }}
            style={{
              background: 'black',
              borderRadius: 14,
              width: '68%',
              marginLeft: '2%',
              padding: 10,
              height: 'auto',
              borderColor: 'black',
            }}
          >
            <div
              style={{
                display: 'flex',
                placeContent: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                fontSize: 16,
              }}
            >
              <span style={{ marginRight: 5 }}>Sign with</span>
              <img src="/ftxpay.png" width="80" />
            </div>
          </Button>
        </div>
      </MetaplexModal>
    );
  };


const pubkey = publicKey?.toBase58() || '';
const canCreate = useMemo(() => {

    return (
      
      store?.info?.public ||
      whitelistedCreatorsByCreator[pubkey]?.info?.activated
    );
  }, [pubkey, whitelistedCreatorsByCreator, store]);
  
  return (
    
    <Layout style={{ margin: 0, marginTop: 30 }}>
      <Content style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Col style={{ width: '100%', marginTop: 10 }}>
          
          <Row>
            
          <div className="wallet-wrapper  p-4" style={{width:"31%",  marginRight:"40px"
        }}>
            
      {props.showBalance && (
        <span>
          {formatNumber.format((account?.lamports || 0) / LAMPORTS_PER_SOL)} SOL
        </span>
      )}
      
      {/* <Popover
        trigger="click"
        placement="bottomRight"
        content={
          <Settings
            additionalSettings={ */}
            
              <div
                style={{
                  width: 450,
                }}
              >
                <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '15px 0',
          
        }}
      >

        {publicKey && (
          <>
                  <Identicon
          address={publicKey?.toBase58()}
          className="me-3"
          style={{
            width: 48,
          }}
        />
            <Tooltip title="Address copied">
              <div
                style={{
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                }}
                
                onClick={() =>
                  navigator.clipboard.writeText(publicKey?.toBase58() || '')
                }
              >
                <span className=''>
                <CopyOutlined />
                &nbsp;{shortenAddress(publicKey?.toBase58())}
              
                
          
              </span>
              </div>

            </Tooltip>
            {connected && (
                        <div className='ms-5'>
                          <Notifications />
                        </div>
              )}
          </>
        )}
        <br />
        
      </div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    letterSpacing: '0.02em',
                  }}
                >
                  
                
                <div
                 
                  style={{
                    marginBottom: 10,
                  }}
                >
                  
                  <span className='fs-5 me-2'>BALANCE: </span>

                  <TokenCircle
                    iconFile={solMintInfo ? solMintInfo.logoURI : ''}
                  />
                  
                  &nbsp;
                  <span
                  className='fs-5'
                    style={{
                      fontWeight: 600,
                      color: '#FFFFFF',
                    }}
                  >
                    {formatNumber.format(balance)} SOL
                  </span>
                  &nbsp;
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    {formatUSD.format(balanceInUSD)}
                  </span>
                  &nbsp;
                </div>
                </p>
                <div
                  style={{
                    display: 'flex',
                    marginBottom: 10,
                    marginTop: 20,
                  }}
                >
                 
                </div>
                {/* <UserActions /> */}


                <div
            style={{
              display: 'flex',
            }}
          >
          </div>
              </div>

    </div>
    <div className="wallet-wrapper  py-4" style={{width:"31%"
        }}>
            
 
            
              <div
                style={{
                  width: 450,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection:'column',
                    
                  }}
                >
                  
                  <Button 
                    className="border rounded w-75 my-4"
                    onClick={() => setShowAddFundsModal(true)}
                    style={btnStyle}
                  >
                    Add Funds...
                  </Button>
                  {canCreate && (
              <>
                <Link to={`/art/create`} className="border rounded w-75 mb-4 text-center">
                  <Button className="metaplex-button-default" style={btnStyle}>
                    Create NFTs
                  </Button>
                </Link>
              </>
            )}
            <Link to={`/auction/create/0`} className="border rounded w-75 mb-4 text-center">
              <Button className="metaplex-button-default" style={btnStyle}>
                Sell NFTs
              </Button>
            </Link>
                  {/* <Button
                    className="metaplex-button-default"
                    onClick={disconnect}
                    style={btnStyle}
                  >
                    Disconnect
                  </Button> */}
                </div>
                {/* <UserActions /> */}


                <div
            style={{
              display: 'flex',
            }}
          >
          </div>
              </div>
              {/* <Button className="wallet-key">
          {image}
          {name && (
            <span
              style={{
                marginLeft: '0.5rem',
                fontWeight: 600,
              }}
            >
              {name}
            </span>
          )}
        </Button> */}
      {/* </Popover> */}
      <AddFundsModal
        setShowAddFundsModal={setShowAddFundsModal}
        showAddFundsModal={showAddFundsModal}
        publicKey={publicKey}
        balance={balance}
      />

    </div>



            <Tabs
              activeKey={activeKey}
              onTabClick={key => setActiveKey(key as ArtworkViewState)}
              tabBarExtraContent={refreshButton}
              className="mt-5"
            >
              <TabPane
                tab={<span className="tab-title fs-6">All</span>}
                key={ArtworkViewState.Metaplex}
              >
                {artworkGrid}
              </TabPane>
              {connected && (
                <TabPane
                  tab={<span className="tab-title fs-6">Owned</span>}
                  key={ArtworkViewState.Owned}
                >
                  {artworkGrid}
                </TabPane>
              )}
              {connected && (
                <TabPane
                  tab={<span className="tab-title fs-6">Created</span>}
                  key={ArtworkViewState.Created}
                >
                  {artworkGrid}
                </TabPane>
              )}
            </Tabs>
          </Row>
        </Col>
      </Content>
    </Layout>

  );
  
};
