import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu, Modal,Popover, Select } from 'antd';
import { useWallet } from '@solana/wallet-adapter-react';
import { Notifications } from '../Notifications';
import useWindowDimensions from '../../utils/layout';
import { MenuOutlined } from '@ant-design/icons';
import { HowToBuyModal } from '../HowToBuyModal';
import {
  ENDPOINTS,
  useConnectionConfig,
  useQuerySearch,
} from '@oyster/common';

import {
  Cog,
  CurrentUserBadge,
  CurrentUserBadgeMobile,
} from '../CurrentUserBadge';

import { ConnectButton } from '@oyster/common';
import { MobileNavbar } from '../MobileNavbar';
import classNames from 'classnames';
const btnStyle: React.CSSProperties = {
  border: 'none',
  height: 40,
};

const getDefaultLinkActions = (connected: boolean) => {
  const { wallet, publicKey, disconnect } = useWallet();
  const { endpoint } = useConnectionConfig();
  const routerSearchParams = useQuerySearch();
  return [
    
    
    <Link to={`/`} key={'explore'}>
      <Button className="app-btn index-nav-map fs-5 fw-normal ms-4">Map</Button>
    </Link>,
    
    
    <Link to={`/`} key={'explore'}>
      <div className='ms-5'>
      <img style={{width: '12%'}} src={'/market.png'} />
    <Button className="app-btn nave-list fs-5 fw-normal mb-3 ">Marketplace</Button>
      </div>
      
  </Link>,
    <Link to={`/Myactivity`} key={'Myactivity'}>
      <div className='ms-5'>
      <img style={{width: '12%'}} src={'/activity.png'} />
      <Button className="app-btn nave-list fs-5 fw-normal mb-3">My Activity</Button>
      </div> 
      
    </Link>,
    <Link to={""} key={'artists'}>
      <Button className="app-btn index-nav-map fs-5 fw-normal mb-0 ms-3 ">Account</Button>

    
  </Link>,
    <Link to={`/artworks`} key={'artwork'}>
      
      <div className='ms-5'>
      <img style={{width: '12%'}}  src={'/Vector.png'} />
      <Button className="app-btn nave-list fs-5 fw-normal mb-3">{connected ? 'My Wallet' : 'Artwork'}</Button>
      </div>
      
    </Link>,

    
    <Link to={`/`} key={''}>
      <div className='ms-5'>
    
    <div className="">
      <Popover
        trigger="click"
        placement="bottomRight"
        content={
          <div
            style={{
              width: 250,
            }}
          >
            <h5
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.02em',
              }}
            >
              NETWORK
            </h5>
            <Select
              onSelect={network => {
                // Reload the page, forward user selection to the URL querystring.
                // The app will be re-initialized with the correct network
                // (which will also be saved to local storage for future visits)
                // for all its lifecycle.

                // Because we use react-router's HashRouter, we must append
                // the query parameters to the window location's hash & reload
                // explicitly. We cannot update the window location's search
                // property the standard way, see examples below.

                // doesn't work: https://localhost/?network=devnet#/
                // works: https://localhost/#/?network=devnet
                const windowHash = window.location.hash;
                routerSearchParams.set('network', network);
                const nextLocationHash = `${
                  windowHash.split('?')[0]
                }?${routerSearchParams.toString()}`;
                window.location.hash = nextLocationHash;
                window.location.reload();
              }}
              value={endpoint.name}
              bordered={false}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 8,
                width: '100%',
                marginBottom: 10,
              }}
            >
              {ENDPOINTS.map(({ name }) => (
                <Select.Option value={name} key={endpoint.name}>
                  {name}
                </Select.Option>
              ))}
            </Select>

            <Button
              className="metaplex-button-default"
              style={btnStyle}
              // onClick={open}
            >
              Change wallet..
            </Button>
          </div>
        }
      >
        <div className=''>
        <img className=" "style={{width: '12%'}}  src={'/settings.png'} />
        <Button className=" app-btn nave-list fs-5 fw-normal mb-3">Settings</Button>
        </div>
        
      </Popover>

      
    </div>
    
      </div>
    
  </Link>,
  
   <Link to={``} key={''}>
     <div className='ms-5'>
   <img style={{width: '12%'}} src={'/logout.png'} />
   <Button
                    className="metaplex-button-default app-btn nave-list fs-5 fw-normal mb-3"
                    onClick={disconnect}
                    style={btnStyle}
                  >
                    Logout
                  </Button>
   </div>
   
   <div className="img-div mt-4 pt-5 pb-4 position-relative">
            <img className='img1 ms-4 mt-5 pt-1' src={"/Bg (1).png"} />
            <img className='img2'src={"/Ornament.png"}/>
            <img className='img3 pt-1' src={"/VIP.png"} /> 
            <div className="position-absolute text-center text-white" style={{top:"50%",lineHeight:"25px", width:"100%"}}>
            <div>JOIN VIP<br/> For Special Perks</div>
            </div>
            <Link className="white-grad fs-6 buy-now-btn"
                      // key={auctionView.auction.pubkey}
                      to={`/auction/`}
                    >Join Now</Link>
            
        </div>
   
 </Link>,
 
 

  ];
};

const DefaultActions = ({ vertical = true }: { vertical?: boolean }) => {
  const { connected } = useWallet();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
      }}
    >
      {getDefaultLinkActions(connected)}
    </div>
  );
};

export const MetaplexMenu = () => {
  const { width } = useWindowDimensions();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { connected } = useWallet();

  if (width < 1648) 
    return (
      <>
        <Modal
        
          title={<img className='menu-logo' src={'/blockcities-logo.png'} />}
          visible={isModalVisible}
          footer={null}
          className={'modal-box'}
          closeIcon={
            <img
              onClick={() => setIsModalVisible(false)}
              src={'/modals/close.svg'}
            />
          }
        >
          <div className="site-card-wrapper mobile-menu-modal">
            <Menu onClick={() => setIsModalVisible(false)}>
              {getDefaultLinkActions(connected).map((item, idx) => (
                <Menu.Item key={idx}>{item}</Menu.Item>
              ))}
            </Menu>
            <div className="actions">
              {!connected ? (
                <div className="actions-buttons">
                  <ConnectButton
                    onClick={() => setIsModalVisible(false)}
                    className="secondary-btn"
                  />
                  <HowToBuyModal
                    onClick={() => setIsModalVisible(false)}
                    buttonClassName="black-btn"
                  />
                </div>
              ) : (
                <>
                  <CurrentUserBadgeMobile
                    showBalance={false}
                    showAddress={true}
                    iconSize={24}
                    closeModal={() => {
                      setIsModalVisible(false);
                    }}
                  />
                  <Notifications />
                  <Cog />
                </>
              )}
            </div>
          </div>
        </Modal>
        <MenuOutlined
          onClick={() => setIsModalVisible(true)}
          style={{ fontSize: '1.4rem' }}
        />
      </>
    );

  return <DefaultActions />;
};

export const LogoLink = () => {
  return (
    <Link to={`/`}>
      <div className='ms-4'>
      <img className='main-icon' src={'/Bg.png'} />
      <img className='main-logo' src={'/blockcities-logo.png'} />
      </div>
      
    </Link>
  );
};

export const AppBar = () => {
  const img1Style=
    {
      
    }
    
  const { connected } = useWallet();
  return (
    <>
      <MobileNavbar />
      <div className='' id="desktop-navbar">
        <div>
          <LogoLink /> 
          {/* &nbsp;&nbsp;&nbsp; */}
          <MetaplexMenu />

        </div>
      
        {/* <div className="app-right">
          {!connected && (
            <HowToBuyModal buttonClassName="modal-button-default" />
          )}
          {!connected && (
            <ConnectButton style={{ height: 48 }} allowWalletChange />
          )}
          {connected && (
            <>
              <CurrentUserBadge
                showBalance={false}
                showAddress={true}
                iconSize={24}
              />
              <Notifications />
              <Cog />
            </>
          )}
        </div> */}
      </div>

      
    </>
  );
  
};
